'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AttendanceRecord } from './RealtimeAttendanceTable';
import { useMemo } from 'react';

type AttendanceChartProps = {
  records: AttendanceRecord[];
};

export function AttendanceChart({ records }: AttendanceChartProps) {
  // Process real-time records into chart data
  const data = useMemo(() => {
    // Filter to last 7 days only
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRecords = records.filter(r => new Date(r.created_at) >= sevenDaysAgo);

    // Group records by day
    const grouped = recentRecords.reduce((acc, record) => {
      // Format as "Mon", "Tue", or "DD MMM"
      const date = new Date(record.created_at);
      const dayName = date.toLocaleDateString('en-MY', { weekday: 'short' });
      
      if (!acc[dayName]) {
        acc[dayName] = { 
          name: dayName, 
          Present: 0, 
          Late: 0, 
          Absent: 0, 
          sortKey: date.getTime(),
          _seenIds: new Set<string>()
        };
      }
      
      if (!acc[dayName]._seenIds.has(record.student_id)) {
        acc[dayName]._seenIds.add(record.student_id);
        acc[dayName][record.status]++;
      }
      
      return acc;
    }, {} as Record<string, { name: string, Present: number, Late: number, Absent: number, sortKey: number, _seenIds: Set<string> }>);

    // Convert object to sorted array (oldest first)
    return Object.values(grouped).sort((a, b) => a.sortKey - b.sortKey);
  }, [records]);

  const dateRangeStr = useMemo(() => {
    if (data.length === 0) return '';
    const firstDate = new Date(data[0].sortKey).toLocaleDateString('en-MY', { day: '2-digit', month: 'short' });
    const lastDate = new Date(data[data.length - 1].sortKey).toLocaleDateString('en-MY', { day: '2-digit', month: 'short' });
    return `${firstDate} - ${lastDate}`;
  }, [data]);

  return (
    <div className="glass-panel p-6 rounded-2xl h-80 flex flex-col justify-between border border-white/20">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-sm font-bold tracking-widest text-slate-200 uppercase drop-shadow-md">
          Weekly Analytics <span className="text-slate-400 font-normal ml-2 tracking-normal capitalize">{dateRangeStr}</span>
        </h3>
        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] rounded border border-emerald-500/30 font-bold uppercase tracking-wider animate-pulse">Live</span>
      </div>
      
      <div className="flex-1 w-full h-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            />
            <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} barSize={8} />
            <Bar dataKey="Late" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={8} />
            <Bar dataKey="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
