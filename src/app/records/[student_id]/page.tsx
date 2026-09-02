'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Calendar, Save, Edit2, CheckCircle2, XCircle, Clock, ChevronDown } from 'lucide-react';
import Link from 'next/link';

type AttendanceLog = {
  id: string;
  student_id: string;
  student_name: string;
  status: string;
  created_at: string;
  grade_class: string;
  remark: string | null;
};

type StudentProfile = {
  id: string;
  student_id: string;
  student_name: string;
  grade_class: string;
  status: string;
  created_at: string;
};

export default function StudentRecordPage() {
  const params = useParams();
  const student_id = params?.student_id as string;
  
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [tempRemark, setTempRemark] = useState('');

  const fetchStudentData = async () => {
    if (!student_id) return;
    
    setLoading(true);
    try {
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', decodeURIComponent(student_id))
        .single();
        
      if (studentError) throw studentError;
      setStudent(studentData);

      const { data: logData, error: logError } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('student_id', studentData.id)
        .order('created_at', { ascending: false });

      if (logError) throw logError;
      setLogs(logData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [student_id]);

  const saveRemark = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('attendance_logs')
        .update({ remark: tempRemark })
        .eq('id', logId);
        
      if (error) throw error;
      
      // Update local state
      setLogs(prev => prev.map(log => log.id === logId ? { ...log, remark: tempRemark } : log));
      setEditingRemarkId(null);
    } catch (error) {
      console.error('Error saving remark:', error);
      alert('Failed to save remark');
    }
  };

  const filteredLogs = logs.filter(r => {
    const rDate = new Date(r.created_at);
    const now = new Date();
    
    if (dateFilter === 'today') return rDate.toDateString() === now.toDateString();
    if (dateFilter === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0,0,0,0);
      return rDate >= startOfWeek;
    }
    if (dateFilter === 'month') return rDate.getMonth() === now.getMonth() && rDate.getFullYear() === now.getFullYear();
    return true; // 'all'
  });

  const getStatusIcon = (status: string) => {
    if (status === 'Present') return <CheckCircle2 size={14} />;
    if (status === 'Absent') return <XCircle size={14} />;
    if (status === 'Late') return <Clock size={14} />;
    return null;
  };

  const getStatusColor = (status: string) => {
    if (status === 'Present') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'Absent') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (status === 'Late') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10 w-full">
      
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/records" 
          className="p-2 glass-panel hover:bg-white/10 text-white rounded-lg transition-colors border border-white/20"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-orbitron text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wider drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            STUDENT PROFILE
          </h1>
          <p className="text-emerald-400/60 mt-1 font-medium uppercase tracking-widest text-sm">
            Detailed Attendance Records
          </p>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel p-12 rounded-2xl flex items-center justify-center border border-white/10 text-slate-400">
          Loading student data...
        </div>
      ) : student ? (
        <>
          {/* Profile Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <img 
              src={`https://i.pravatar.cc/150?u=${student.student_id}`} 
              alt={student.student_name} 
              className="w-24 h-24 rounded-2xl border-2 border-emerald-500/30 object-cover shadow-lg"
            />
            
            <div className="flex-1 text-center md:text-left relative z-10">
              <h2 className="text-2xl font-bold text-white mb-1">{student.student_name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-300 font-medium">
                <span className="font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">{student.student_id}</span>
                <span>Class: <span className="text-white">{student.grade_class}</span></span>
                <span>Status: <span className="text-white">{student.status}</span></span>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 text-center min-w-[90px]">
                <div className="text-2xl font-black text-emerald-400">{logs.filter(l => l.status === 'Present').length}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">Present</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 text-center min-w-[90px]">
                <div className="text-2xl font-black text-rose-400">{logs.filter(l => l.status === 'Absent').length}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">Absent</div>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col border border-white/10">
            <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center bg-white/5 backdrop-blur-md">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Calendar size={18} className="text-emerald-400" /> Attendance History
              </h3>
              
              <div className="relative">
                <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="glass-input h-9 px-4 rounded-lg outline-none cursor-pointer bg-slate-900/50 border border-white/10 text-slate-200 text-sm appearance-none pr-10"
                >
                  <option className="bg-slate-900" value="today">Today</option>
                  <option className="bg-slate-900" value="week">This Week</option>
                  <option className="bg-slate-900" value="month">This Month</option>
                  <option className="bg-slate-900" value="all">All Time</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap text-slate-300">
                <thead className="text-xs uppercase bg-black/20 text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Remarks / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-400">No attendance logs found for this period.</td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white">{new Date(log.created_at).toLocaleDateString('en-MY', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            <span className="text-xs text-slate-500 font-mono">{new Date(log.created_at).toLocaleTimeString('en-US', { hour12: true })}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center w-fit gap-1.5 ${getStatusColor(log.status)}`}>
                            {getStatusIcon(log.status)}
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 w-1/2 min-w-[300px]">
                          {editingRemarkId === log.id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="text"
                                autoFocus
                                value={tempRemark}
                                onChange={(e) => setTempRemark(e.target.value)}
                                className="flex-1 h-8 glass-input px-3 rounded bg-slate-900/80 border border-emerald-500/50 text-white text-sm outline-none"
                                placeholder="Add a remark..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveRemark(log.id);
                                  if (e.key === 'Escape') setEditingRemarkId(null);
                                }}
                              />
                              <button 
                                onClick={() => saveRemark(log.id)}
                                className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500 hover:text-black transition-colors"
                              >
                                <Save size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 group/remark">
                              <span className={`flex-1 truncate ${log.remark ? 'text-slate-300' : 'text-slate-500 italic'}`}>
                                {log.remark || 'No remarks added'}
                              </span>
                              <button 
                                onClick={() => {
                                  setEditingRemarkId(log.id);
                                  setTempRemark(log.remark || '');
                                }}
                                className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded transition-colors opacity-0 group-hover/remark:opacity-100"
                                title="Edit Remark"
                              >
                                <Edit2 size={14} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel p-12 rounded-2xl flex items-center justify-center border border-white/10 text-rose-400">
          Student not found.
        </div>
      )}
    </div>
  );
}
