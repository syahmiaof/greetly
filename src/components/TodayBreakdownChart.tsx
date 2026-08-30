'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AttendanceRecord } from './RealtimeAttendanceTable';
import { useMemo } from 'react';

type TodayBreakdownChartProps = {
  records: AttendanceRecord[];
  loading?: boolean;
};

export function TodayBreakdownChart({ records, loading }: TodayBreakdownChartProps) {
  const data = useMemo(() => {
    // Filter for today
    const rawTodayRecords = records.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString());
    
    // Deduplicate by student_id (keep the earliest scan for the day)
    const uniqueStudentsMap = new Map();
    // Since records are ordered desc (newest first), iterating backwards or just taking the last we see is fine.
    // Let's just keep the first one we see (which is the newest) or the oldest? 
    // Actually, usually we care about their first scan of the day.
    [...rawTodayRecords].reverse().forEach(r => {
      if (!uniqueStudentsMap.has(r.student_id)) {
        uniqueStudentsMap.set(r.student_id, r);
      }
    });
    
    const todayRecords = Array.from(uniqueStudentsMap.values());
    
    const present = todayRecords.filter(r => r.status === 'Present').length;
    const absent = todayRecords.filter(r => r.status === 'Absent').length;
    const late = todayRecords.filter(r => r.status === 'Late').length;

    // If all are 0, return an empty array to render an empty circle or "No Data" gracefully
    if (present === 0 && absent === 0 && late === 0) return [];

    return [
      { name: 'Present', value: present, color: '#10b981' },
      { name: 'Late', value: late, color: '#94a3b8' },
      { name: 'Absent', value: absent, color: '#f43f5e' },
    ].filter(item => item.value > 0);
  }, [records]);

  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  return (
    <div className="glass-panel p-6 rounded-2xl h-80 flex flex-col justify-between border border-white/20 relative group">
      <div className="mb-2 flex justify-between items-center relative z-10">
        <h3 className="text-sm font-bold tracking-widest text-slate-200 uppercase drop-shadow-md">
          Today's Distribution <span className="text-slate-400 font-normal ml-2 tracking-normal capitalize">{new Date().toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </h3>
        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-[10px] rounded border border-cyan-500/30 font-bold uppercase tracking-wider transition-all group-hover:bg-cyan-500/30">Ratio</span>
      </div>
      
      <div className="flex-1 w-full h-full min-h-[200px] flex items-center justify-center relative">
        {loading ? (
          <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin opacity-50"></div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center text-slate-500 text-sm">
            <div className="w-32 h-32 rounded-full border-4 border-slate-800 mb-3 opacity-50 flex items-center justify-center">
              0
            </div>
            No Scans Today
          </div>
        ) : (
          <>
            {/* Custom Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
              <span className="text-3xl font-black text-slate-200">{total}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total</span>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={true}
                  animationBegin={500}
                  animationDuration={1200}
                  animationEasing="ease-out"
                  cornerRadius={10}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="drop-shadow-lg hover:opacity-80 transition-opacity outline-none" 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}
