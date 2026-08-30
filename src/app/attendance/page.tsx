'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Scan, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { format } from 'date-fns';

export default function AttendanceKiosk() {
  const { records, metrics, loading } = useAttendance();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [latestScan, setLatestScan] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get only today's physical scans (Present or Late), sort by newest first (descending)
  const rawTodaysRecords = records
    .filter(r => new Date(r.created_at).toDateString() === new Date().toDateString() && r.status !== 'Absent')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Deduplicate by student_id to only show the most recent scan per student in the list
  const uniqueTodaysMap = new Map();
  rawTodaysRecords.forEach(r => {
    if (!uniqueTodaysMap.has(r.student_id)) {
      uniqueTodaysMap.set(r.student_id, r);
    }
  });
  
  const todaysRecords = Array.from(uniqueTodaysMap.values()).slice(0, 5);

  // Check for new scans robustly (ignores server-client clock differences)
  const prevRecordId = React.useRef(todaysRecords[0]?.id);

  const mostRecentId = todaysRecords[0]?.id;

  useEffect(() => {
    if (mostRecentId) {
      const mostRecent = todaysRecords[0];
      
      // If the ID of the top record changed, it means a NEW scan just came in!
      if (prevRecordId.current !== undefined && mostRecentId !== prevRecordId.current) {
        setLatestScan(mostRecent);
        
        // Hide the success avatar after 4 seconds to go back to scanning mode
        const timeout = setTimeout(() => setLatestScan(null), 4000);
        
        // Update the ref so we don't re-trigger
        prevRecordId.current = mostRecentId;
        return () => clearTimeout(timeout);
      }
      
      // Initialize the ref on first load without triggering animation
      prevRecordId.current = mostRecentId;
    }
  }, [mostRecentId]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10 w-full">
      
      {/* Title Header matching the Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            LIVE KIOSK MONITOR
          </h1>
          <p className="text-emerald-400/60 mt-1 font-medium uppercase tracking-widest text-xs md:text-sm">
            Facial Recognition Terminal View
          </p>
        </div>
        
        <div className="flex items-center justify-center md:justify-end gap-3 md:gap-6 bg-white/5 md:bg-transparent p-3 md:p-0 rounded-2xl border border-white/10 md:border-none">
          <div className="flex flex-col text-center md:text-right animate-in fade-in duration-300">
            <span className="text-xs md:text-sm font-bold text-white tracking-wider">
              {currentTime.toLocaleDateString('en-MY', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-[10px] md:text-xs text-emerald-400 font-medium font-mono">
              {currentTime.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Camera / Last Scanned Area */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center min-h-[550px] relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-emerald-500/20">
            {/* Corner brackets for scanning UI effect */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl opacity-70 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-colors duration-300"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl opacity-70 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-colors duration-300"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl opacity-70 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-colors duration-300"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-emerald-500 rounded-br-xl opacity-70 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-colors duration-300"></div>
            
            {/* Scanning Animation / Success UI */}
            <div className="flex flex-col items-center z-10 w-full">
              {latestScan ? (
                // SUCCESS STATE
                <div className="animate-in zoom-in-90 fade-in duration-300 flex flex-col items-center">
                  <div className="w-64 h-64 rounded-full flex items-center justify-center mb-8 relative shadow-[0_0_40px_rgba(16,185,129,0.6)] border-4 border-emerald-400 p-2 bg-emerald-950/50">
                    <img 
                      src={`https://i.pravatar.cc/300?u=${latestScan.student_id}`} 
                      alt={latestScan.student_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                    <div className="absolute -bottom-4 bg-emerald-500 text-slate-900 font-bold px-4 py-1 rounded-full text-sm flex items-center gap-2 shadow-lg">
                      <CheckCircle size={16} /> SUCCESS
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white tracking-wide text-center">
                    {latestScan.student_name}
                  </h2>
                  <p className="text-emerald-400 mt-2 font-mono text-lg tracking-widest">{latestScan.student_id}</p>
                  <p className="text-slate-400 mt-2">{latestScan.grade_class}</p>
                </div>
              ) : (
                // IDLE / SCANNING STATE
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-64 h-64 bg-slate-900/80 rounded-full flex items-center justify-center mb-8 relative shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] border border-white/5">
                    <Camera size={64} className="text-slate-600" />
                    
                    {/* Radar sweep effect overlay */}
                    <div className="absolute inset-0 border-4 border-emerald-500/40 rounded-full overflow-hidden">
                      <div className="w-full h-1/2 bg-gradient-to-b from-transparent to-emerald-500/20 animate-[spin_3s_linear_infinite] origin-bottom"></div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3 tracking-wide">
                    <Scan className="text-emerald-400 animate-spin-slow" size={28} />
                    WAITING FOR FACE SCAN...
                  </h2>
                  <p className="text-emerald-400/60 mt-3 font-medium uppercase tracking-widest text-sm">System Ready & Active</p>
                </div>
              )}
            </div>
            
            {/* Stats Footer inside Kiosk */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full flex items-center gap-3 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-slate-300 font-medium text-sm tracking-wide">
                  <strong className="text-white">{(metrics?.presentToday || 0) + (metrics?.lateArrivals || 0)}</strong> / {metrics?.totalStudents || 0} Students Arrived Today
                </span>
              </div>
            </div>

            {/* Background grid effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>
          </div>
        </div>

        {/* Recent Scans Side Panel */}
        <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] bg-slate-900/40">
          <h2 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2 tracking-wide uppercase">
            <Clock size={18} className="text-emerald-400" />
            Recent Scans Today
          </h2>
            
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="text-center py-10 text-slate-400 text-sm animate-pulse">Loading live feed...</div>
              ) : todaysRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm gap-2">
                  <AlertTriangle size={24} className="opacity-50" />
                  <p>No scans recorded today.</p>
                </div>
              ) : (
                todaysRecords.map((record) => (
                  <div key={record.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:border-emerald-500/30 group animate-in slide-in-from-right-4">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${record.student_id}`} 
                      alt={record.student_name}
                      className="w-12 h-12 rounded-full border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-slate-200 truncate">{record.student_name}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{record.student_id}</p>
                      <p className="text-[10px] text-emerald-400 mt-1 font-medium bg-emerald-500/10 w-fit px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {format(new Date(record.created_at), 'hh:mm:ss a')}
                      </p>
                    </div>
                    {record.status === 'Late' ? (
                      <Clock className="text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" size={24} />
                    ) : (
                      <CheckCircle className="text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" size={24} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        
      </div>
    </div>
  );
}
