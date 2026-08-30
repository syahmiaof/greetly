'use client';

import { useState, useEffect } from 'react';
import { useAttendance } from '@/hooks/useAttendance';
import { StatsCards } from '@/components/StatsCards';
import { RealtimeAttendanceTable } from '@/components/RealtimeAttendanceTable';
import { AttendanceChart } from '@/components/AttendanceChart';
import { TodayBreakdownChart } from '@/components/TodayBreakdownChart';
import { Bell, Calendar, LogOut, Settings as SettingsIcon, AlertTriangle, Eye, UserX } from 'lucide-react';

function LiveClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentTime) {
    return (
      <div className="flex flex-col text-right opacity-0">
        <span className="text-sm font-bold text-white tracking-wider">Loading Date</span>
        <span className="text-xs text-emerald-400 font-medium font-mono">Loading Time</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-right animate-in fade-in duration-300">
      <span className="text-sm font-bold text-white tracking-wider">
        {currentTime.toLocaleDateString('en-MY', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
      </span>
      <span className="text-xs text-emerald-400 font-medium font-mono">
        {currentTime.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const { records, metrics, loading, error } = useAttendance();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700 relative z-10">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            DASHBOARD OVERVIEW
          </h1>
          <p className="text-emerald-400/60 mt-1 font-medium uppercase tracking-widest text-sm">
            Live Monitoring & Statistical Data
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Live Date Time Text (No Box) */}
          <LiveClock />
          
          {/* Notification */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl shadow-2xl overflow-hidden z-50 border border-white/10 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-white/10 bg-white/5 font-medium text-slate-200 flex justify-between items-center">
                  <span>Notifications</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">3 New</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="flex gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="mt-0.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/30">
                        <AlertTriangle size={14} />
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Hardware Alert</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Raspberry Pi camera feed disconnected at Main Gate.</p>
                      <p className="text-[10px] text-slate-500 mt-2">Just now</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="mt-0.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/30">
                        <Eye size={14} />
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Security Warning</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Unknown face detected 3 times during morning scan.</p>
                      <p className="text-[10px] text-slate-500 mt-2">15 mins ago</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="mt-0.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500/30">
                        <UserX size={14} />
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Attendance Alert</p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Student Ali (Sem 1A) has been absent for 3 consecutive days.</p>
                      <p className="text-[10px] text-slate-500 mt-2">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-white/10 bg-black/20 text-center">
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Mark all as read</button>
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 hover:bg-white/5 p-1 pr-3 rounded-full transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/50">
                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-white">Sir Abu</p>
                <p className="text-xs text-emerald-400">Administrator</p>
              </div>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl shadow-2xl border border-white/20 p-2 z-50 flex flex-col gap-1">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 rounded-lg transition-colors w-full text-left">
                  <SettingsIcon size={14} /> Account Settings
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors w-full text-left">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-200 font-medium shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          {error}
        </div>
      )}

      {/* 4 Stats Cards Across Top */}
      <div className="w-full">
        <StatsCards metrics={metrics} />
      </div>

      {/* 2 Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <AttendanceChart records={records} />
        <TodayBreakdownChart records={records} loading={loading} />
      </div>
      
      {/* Full width table */}
      <div className="w-full h-full mt-6">
        <RealtimeAttendanceTable records={records} />
      </div>
      
    </div>
  );
}
