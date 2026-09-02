'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, UserCircle } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';
import Link from 'next/link';

export default function RecordsPage() {
  const { students, loading: studentsLoading } = useStudents();
  const { records, loading: recordsLoading } = useAttendance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  
  const classes = ['All Classes', 'Sem 1A', 'Sem 1B', 'Sem 2A', 'Sem 2B', 'Sem 3A', 'Sem 3B', 'Sem 4A', 'Sem 4B', 'Sem 5A', 'Sem 5B'];

  const loading = studentsLoading || recordsLoading;

  // Filter students
  const filteredStudents = students.filter(s => {
    const classMatch = selectedClass === 'All Classes' || s.grade_class === selectedClass;
    const searchMatch = s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       s.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    return classMatch && searchMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10 w-full">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-orbitron text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wider drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            ATTENDANCE RECORDS
          </h1>
          <p className="text-emerald-400/60 mt-1 font-medium uppercase tracking-widest text-sm">
            Student Attendance History & Remarks
          </p>
        </div>
      </div>

      {/* Filters Top Bar */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col border border-white/10 relative">
        <div className="px-6 py-5 border-b border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 backdrop-blur-md">
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="glass-input h-10 px-4 rounded-lg outline-none cursor-pointer bg-slate-900/50 border border-white/10 text-slate-200 text-sm appearance-none pr-10"
              >
                {classes.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="relative w-full md:w-72 h-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={16} />
            <input 
              type="text" 
              placeholder="Search Student..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full glass-input pr-4 text-sm focus:bg-white/10"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>

        {/* Student List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap text-slate-300">
            <thead className="text-xs uppercase bg-black/20 text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Student Profile</th>
                <th className="px-6 py-4 font-bold tracking-wider">Class</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400">Loading student records...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400">No students found.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  return (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://i.pravatar.cc/150?u=${student.student_id}`} 
                            alt={student.student_name} 
                            className="w-10 h-10 rounded-full border-2 border-emerald-500/30"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                              {student.student_name}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">{student.student_id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{student.grade_class}</td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/records/${student.student_id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 rounded-lg transition-colors border border-white/5 hover:border-emerald-500/30 text-xs font-bold"
                        >
                          View Records <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
