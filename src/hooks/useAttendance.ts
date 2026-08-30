import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AttendanceRecord } from '@/components/RealtimeAttendanceTable';

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [attendanceRes, studentsRes] = await Promise.all([
          supabase
            .from('attendance_logs')
            .select('*, students(student_id, student_name, grade_class)')
            .gte('timestamp', thirtyDaysAgo.toISOString())
            .order('timestamp', { ascending: false }),
          supabase
            .from('students')
            .select('id', { count: 'exact', head: true })
        ]);

        if (attendanceRes.error) throw attendanceRes.error;
        if (studentsRes.error) throw studentsRes.error;
        
        if (mounted) {
          if (attendanceRes.data) {
            const mappedData = attendanceRes.data.map((log: any) => ({
              id: log.id,
              student_id: log.students?.student_id || '',
              student_name: log.students?.student_name || 'Unknown',
              grade_class: log.students?.grade_class || '',
              status: log.status,
              created_at: log.timestamp
            }));
            setRecords(mappedData as AttendanceRecord[]);
          }
          if (studentsRes.count !== null) setTotalStudents(studentsRes.count);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchInitialData();

    const subscription = supabase
      .channel('attendance_logs_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_logs' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: studentData } = await supabase
              .from('students')
              .select('student_id, student_name, grade_class')
              .eq('id', payload.new.student_id)
              .single();

            const newRecord: AttendanceRecord = {
              id: payload.new.id,
              student_id: studentData?.student_id || '',
              student_name: studentData?.student_name || 'Unknown',
              grade_class: studentData?.grade_class || '',
              status: payload.new.status,
              created_at: payload.new.timestamp
            };

            setRecords((prev) => [newRecord, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
          } else if (payload.eventType === 'UPDATE') {
            setRecords((prev) =>
              prev.map((record) =>
                record.id === payload.new.id
                  ? { ...record, status: payload.new.status, created_at: payload.new.timestamp }
                  : record
              ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            );
          } else if (payload.eventType === 'DELETE') {
            setRecords((prev) => prev.filter((record) => record.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' && mounted) {
          setError('Failed to connect to real-time updates');
        }
      });

    const studentsSubscription = supabase
      .channel('students_count_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        async () => {
          // Re-fetch exact count when any student is added/removed
          const { count } = await supabase.from('students').select('id', { count: 'exact', head: true });
          if (count !== null && mounted) setTotalStudents(count);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(subscription);
      supabase.removeChannel(studentsSubscription);
    };
  }, []);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRecords = records.filter(r => {
    const d = new Date(r.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Calculate unique students for the month
  const uniqueStudents = totalStudents;

  // Calculate Monthly Averages (Percentages)
  const totalMonthlyScans = monthlyRecords.length || 1;
  const monthlyPresentPct = ((monthlyRecords.filter(r => r.status.toLowerCase() === 'present').length / totalMonthlyScans) * 100).toFixed(1);
  const monthlyAbsentPct = ((monthlyRecords.filter(r => r.status.toLowerCase() === 'absent').length / totalMonthlyScans) * 100).toFixed(1);
  const monthlyLatePct = ((monthlyRecords.filter(r => r.status.toLowerCase() === 'late').length / totalMonthlyScans) * 100).toFixed(1);

  // Today's records (deduplicated by student_id to count unique students)
  const rawTodayRecords = records.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString());
  const uniqueTodayMap = new Map();
  [...rawTodayRecords].reverse().forEach(r => {
    if (!uniqueTodayMap.has(r.student_id)) {
      uniqueTodayMap.set(r.student_id, r);
    }
  });
  const todayRecords = Array.from(uniqueTodayMap.values());

  const metrics = {
    totalStudents: totalStudents,
    presentToday: todayRecords.filter((r) => r.status.toLowerCase() === 'present').length,
    absentToday: todayRecords.filter((r) => r.status.toLowerCase() === 'absent').length,
    lateArrivals: todayRecords.filter((r) => r.status.toLowerCase() === 'late').length,
    monthlyPresentPct,
    monthlyAbsentPct,
    monthlyLatePct
  };

  return { records, metrics, loading, error };
}
