'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Search, Calendar, ChevronDown, ChevronLeft, ChevronRight, Eye, Edit2, X, Save } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export type AttendanceRecord = {
  id: string;
  student_id: string;
  student_name: string;
  grade_class?: string;
  status: 'Present' | 'Absent' | 'Late';
  created_at: string;
};

type RealtimeAttendanceTableProps = {
  records: AttendanceRecord[];
};

export function RealtimeAttendanceTable({ records = [] }: RealtimeAttendanceTableProps) {
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [newStatus, setNewStatus] = useState<'Present' | 'Absent' | 'Late'>('Present');
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('All Classes');
  
  const handlePrevDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleEditClick = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setNewStatus(record.status);
  };

  const handleSaveStatus = async () => {
    if (!editingRecord) return;
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('attendance')
        .update({ status: newStatus })
        .eq('id', editingRecord.id);
        
      if (error) throw error;
      
      setEditingRecord(null);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const classes = ['All Classes', 'Sem 1A', 'Sem 1B', 'Sem 2A', 'Sem 2B', 'Sem 3A', 'Sem 3B', 'Sem 4A', 'Sem 4B', 'Sem 5A', 'Sem 5B'];

  return (
    <>
      <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col h-full border border-white/10 relative">
        {/* Table Header Section */}
        <div className="px-6 py-5 border-b border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 backdrop-blur-md">
          
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold tracking-widest text-white uppercase drop-shadow-md">
              ATTENDANCE
            </h2>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Class Filter */}
            <div className="relative">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="glass-input h-10 pl-4 pr-10 rounded-lg outline-none cursor-pointer appearance-none bg-slate-900/50 border border-white/10 text-slate-200 text-sm w-32"
              >
                {classes.map(c => (
                  <option key={c} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={16} />
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64 h-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={16} />
              <input 
                type="text" 
                placeholder="Search (Student Name/ID)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full glass-input pr-4 text-sm focus:bg-white/10"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            
            {/* Date Navigation */}
            <div className="flex items-center glass-input h-10 p-0 overflow-hidden">
              <button onClick={handlePrevDate} className="px-3 h-full hover:bg-white/10 transition-colors border-r border-white/10 flex items-center justify-center">
                <ChevronLeft size={16} />
              </button>
              
              <label className="relative flex items-center h-full px-4 text-sm gap-2 font-medium whitespace-nowrap cursor-pointer hover:bg-white/5 transition-colors">
                <Calendar size={14} className="text-emerald-400" />
                {selectedDate.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
                <input 
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={(e) => e.target.value && setSelectedDate(new Date(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </label>

              <button onClick={handleNextDate} className="px-3 h-full hover:bg-white/10 transition-colors border-l border-white/10 flex items-center justify-center">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="text-white/70 tracking-wide text-xs font-semibold">
              <tr>
                <th className="px-6 py-4 border-b border-white/20">Student Name</th>
                <th className="px-6 py-4 border-b border-white/20">Student ID</th>
                <th className="px-6 py-4 border-b border-white/20">Grade/Class</th>
                <th className="px-6 py-4 border-b border-white/20">Check-In</th>
                <th className="px-6 py-4 border-b border-white/20">Status</th>
                <th className="px-6 py-4 border-b border-white/20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {records
                .filter(r => new Date(r.created_at).toDateString() === selectedDate.toDateString())
                .filter(r => selectedClass === 'All Classes' || r.grade_class === selectedClass)
                .filter(r => r.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || r.student_id.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((record, index) => (
                <tr key={record.id} className="hover:bg-white/10 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://i.pravatar.cc/150?u=${record.student_id}`} 
                        alt={record.student_name} 
                        className="w-8 h-8 rounded-full border border-white/10"
                      />
                      <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                        {record.student_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-300">{record.student_id}</td>
                  <td className="px-6 py-3 text-slate-300 font-medium">{record.grade_class || 'Grade 11A'}</td>
                  <td className="px-6 py-3 text-slate-300 tabular-nums">
                    {record.status === 'Absent' ? '--:--' : (record.created_at ? format(new Date(record.created_at), 'hh:mm a') : '-')}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-sm text-[10px] font-bold tracking-wider uppercase border
                      ${record.status === 'Present' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : ''}
                      ${record.status === 'Absent' ? 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]' : ''}
                      ${record.status === 'Late' ? 'bg-slate-500/20 text-slate-300 border-slate-400/50 shadow-[0_0_10px_rgba(148,163,184,0.2)]' : ''}
                    `}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/records/${record.student_id}`}
                          className="p-2 flex items-center justify-center bg-white/5 hover:bg-cyan-500/20 text-cyan-300 rounded-lg transition-colors border border-white/5 hover:border-cyan-500/30"
                          title="View Attendance Details"
                        >
                          <Eye size={14} />
                        </Link>
                        <button 
                          onClick={() => handleEditClick(record)}
                          className="p-2 bg-white/5 hover:bg-amber-500/20 text-amber-300 rounded-lg transition-colors border border-white/5 hover:border-amber-500/30"
                          title="Edit Attendance Status"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                  </td>
                </tr>
              ))}
              {records
                .filter(r => new Date(r.created_at).toDateString() === selectedDate.toDateString())
                .filter(r => selectedClass === 'All Classes' || r.grade_class === selectedClass)
                .filter(r => r.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || r.student_id.toLowerCase().includes(searchQuery.toLowerCase()))
                .length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-4xl opacity-50 mb-2">📷</span>
                      <p>No attendance records found for {selectedDate.toLocaleDateString('en-MY')} {selectedClass !== 'All Classes' ? `in ${selectedClass}` : ''}.</p>
                      <p className="text-sm opacity-50">Waiting for Facial Recognition scans...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/20 shadow-2xl relative">
            <button 
              onClick={() => setEditingRecord(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-2">Edit Status</h3>
            <p className="text-slate-300 text-sm mb-6">
              Update attendance status for <span className="font-semibold text-white">{editingRecord.student_name}</span>.
            </p>
            
            <div className="space-y-3 mb-8">
              {(['Present', 'Late', 'Absent'] as const).map((statusOption) => (
                <label 
                  key={statusOption} 
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                    ${newStatus === statusOption 
                      ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }
                  `}
                >
                  <input 
                    type="radio" 
                    name="status" 
                    value={statusOption} 
                    checked={newStatus === statusOption}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="hidden"
                  />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                    ${newStatus === statusOption ? 'border-emerald-400' : 'border-white/30'}
                  `}>
                    {newStatus === statusOption && <div className="w-2 h-2 bg-emerald-400 rounded-full" />}
                  </div>
                  <span className={`font-semibold tracking-wide uppercase text-sm
                    ${statusOption === 'Present' ? 'text-emerald-300' : ''}
                    ${statusOption === 'Absent' ? 'text-rose-300' : ''}
                    ${statusOption === 'Late' ? 'text-slate-300' : ''}
                  `}>
                    {statusOption}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveStatus}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
