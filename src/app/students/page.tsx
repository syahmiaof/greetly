'use client';

import { useState } from 'react';
import { useStudents, Student } from '@/hooks/useStudents';
import { Search, Plus, MoreVertical, Edit2, Trash2, Camera, GraduationCap, Briefcase, X, Save, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentsPage() {
  const { students, loading, error, addStudent, updateStudent, deleteStudent } = useStudents();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  
  // Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStudent, setNewStudent] = useState({
    student_name: '',
    student_id: '',
    grade_class: 'Sem 1A',
    status: 'Active' as const
  });

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This will also delete their attendance records.`)) {
      const { success, error } = await deleteStudent(id);
      if (!success) alert(`Failed to delete: ${error}`);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setIsSubmitting(true);
    const { success, error } = await updateStudent(editingStudent.id, {
      student_name: editingStudent.student_name,
      student_id: editingStudent.student_id,
      grade_class: editingStudent.grade_class,
      status: editingStudent.status
    });
    if (success) {
      setEditingStudent(null);
    } else {
      alert(`Update failed: ${error}`);
    }
    setIsSubmitting(false);
  };

  const classes = ['All Classes', 'Sem 1A', 'Sem 1B', 'Sem 2A', 'Sem 2B', 'Sem 3A', 'Sem 3B', 'Sem 4A', 'Sem 4B', 'Sem 5A', 'Sem 5B'];
  const statuses = ['All Status', 'Active', 'Intern', 'Graduated', 'Suspended'];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Intern': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Graduated': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'Suspended': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Active': return <Camera size={14} />;
      case 'Intern': return <Briefcase size={14} />;
      case 'Graduated': return <GraduationCap size={14} />;
      default: return null;
    }
  };

  const filteredStudents = students
    .filter(s => selectedClass === 'All Classes' || s.grade_class === selectedClass)
    .filter(s => selectedStatus === 'All Status' || s.status === selectedStatus)
    .filter(s => s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.student_id.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.student_name || !newStudent.student_id) {
      alert("Name and Matric ID are required!");
      return;
    }
    
    setIsSubmitting(true);
    const { success, error } = await addStudent(newStudent);
    
    if (success) {
      setIsRegisterModalOpen(false);
      setNewStudent({ student_name: '', student_id: '', grade_class: 'Sem 1A', status: 'Active' });
    } else {
      alert(`Registration failed: ${error}`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            STUDENTS MANAGEMENT
          </h1>
          <p className="text-emerald-400/60 mt-1 font-medium uppercase tracking-widest text-sm">
            Manage Enrollments & Lifecycles
          </p>
        </div>
        <button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="glass-panel hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all duration-300 border border-emerald-500/30 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-1"
        >
          <Plus size={18} className="drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
          Register Student
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col border border-white/10 relative">
        {/* Filters Header */}
        <div className="px-6 py-5 border-b border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 backdrop-blur-md">
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="glass-input h-10 px-4 rounded-lg outline-none cursor-pointer bg-slate-900/50 border border-white/10 text-slate-200 text-sm"
            >
              {classes.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
            </select>
            
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="glass-input h-10 px-4 rounded-lg outline-none cursor-pointer bg-slate-900/50 border border-white/10 text-slate-200 text-sm"
            >
              {statuses.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
            </select>
          </div>

          <div className="relative w-full md:w-72 h-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={16} />
            <input 
              type="text" 
              placeholder="Search (Name/ID)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full glass-input pr-4 text-sm focus:bg-white/10"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-black/20 text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Student Profile</th>
                <th className="px-6 py-4 font-bold tracking-wider">Matric ID</th>
                <th className="px-6 py-4 font-bold tracking-wider">Semester / Class</th>
                <th className="px-6 py-4 font-bold tracking-wider">Lifecycle Status</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading student data...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No students found.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://i.pravatar.cc/150?u=${student.student_id}`} 
                          alt={student.student_name} 
                          className={`w-10 h-10 rounded-full border-2 ${student.status === 'Active' ? 'border-emerald-500/50' : 'border-slate-500/50 grayscale'}`}
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                            {student.student_name}
                          </span>
                          <span className="text-xs text-slate-500">Joined {format(new Date(student.created_at), 'MMM yyyy')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">{student.student_id}</td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{student.grade_class}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center w-fit gap-1.5 ${getStatusColor(student.status)}`}>
                        {getStatusIcon(student.status)}
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingStudent(student)}
                          className="p-2 bg-white/5 hover:bg-indigo-500/20 text-indigo-300 rounded-lg transition-colors border border-white/5 hover:border-indigo-500/30" 
                          title="Edit Student"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id, student.student_name)}
                          className="p-2 bg-white/5 hover:bg-rose-500/20 text-rose-300 rounded-lg transition-colors border border-white/5 hover:border-rose-500/30" 
                          title="Delete Data"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

            {/* Register Student Modal (Remote Kiosk Mode) */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)] relative overflow-hidden">
            
            {/* If we are waiting for Pi, show a loading overlay */}
            {isSubmitting && (
              <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                <h4 className="text-lg font-bold text-white text-center">Waiting for Raspberry Pi...</h4>
                <p className="text-sm text-emerald-400 text-center px-6 mt-2">
                  Please ask {newStudent.student_name} to look at the camera.
                </p>
                <div className="mt-6 px-4 py-2 bg-slate-900 rounded-full border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                  <span className="text-xs text-slate-300 font-mono">Status: PENDING_CAMERA</span>
                </div>
              </div>
            )}

            <button 
              onClick={() => !isSubmitting && setIsRegisterModalOpen(false)}
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors disabled:opacity-0"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">Remote Registration</h3>
            <p className="text-slate-400 text-sm mb-6">
              Enter details below, then click start to wake up the camera on the Pi.
            </p>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newStudent.student_name || !newStudent.student_id) {
                alert("Name and Matric ID are required!");
                return;
              }
              
              setIsSubmitting(true);
              
              // 1. We tell supabase this is a pending registration
              const payload = { ...newStudent, status: 'pending_camera' as any };
              const { success, error, data } = await addStudent(payload);
              
              if (success && data && data.length > 0) {
                const insertedId = data[0].id;
                
                // 2. We wait for the Pi to change it to 'active'
                import('@/lib/supabaseClient').then(({ supabase }) => {
                  let isTimeout = false;
                  
                  const sub = supabase.channel('wait_for_pi_' + insertedId)
                    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'students', filter: 'id=eq.'+insertedId }, (payload) => {
                      if (!isTimeout && (payload.new.status === 'active' || payload.new.status === 'Active')) {
                        supabase.removeChannel(sub);
                        setIsSubmitting(false);
                        setIsRegisterModalOpen(false);
                        setNewStudent({ student_name: '', student_id: '', grade_class: 'Sem 1A', status: 'Active' });
                        // Let user know
                        alert('Registration Successful! Face encodings saved on Pi.');
                      }
                    })
                    .subscribe();
                    
                  // Fallback timeout in case Pi is offline (30s)
                  setTimeout(() => {
                    isTimeout = true;
                    supabase.removeChannel(sub);
                    setIsSubmitting((prev) => {
                       if (prev) {
                         alert('Timeout: The Raspberry Pi did not respond within 30 seconds. Please ensure it is powered on and connected to the internet. The status will remain PENDING_CAMERA.');
                       }
                       return false;
                    });
                  }, 30000);
                });
              } else {
                alert(`Registration failed: ${error}`);
                setIsSubmitting(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newStudent.student_name}
                  onChange={(e) => setNewStudent({...newStudent, student_name: e.target.value})}
                  className="w-full h-11 glass-input px-4 rounded-lg bg-slate-900/50 border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 transition-colors outline-none"
                  placeholder="e.g. Ali Bin Abu"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Matric ID</label>
                <input 
                  type="text" 
                  required
                  value={newStudent.student_id}
                  onChange={(e) => setNewStudent({...newStudent, student_id: e.target.value})}
                  className="w-full h-11 glass-input px-4 rounded-lg bg-slate-900/50 border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 transition-colors outline-none"
                  placeholder="e.g. DFK250719"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Class</label>
                  <div className="relative">
                    <select 
                      value={newStudent.grade_class}
                      onChange={(e) => setNewStudent({...newStudent, grade_class: e.target.value})}
                      className="w-full h-11 glass-input px-4 rounded-lg bg-slate-900/50 border border-white/10 text-white focus:border-emerald-500/50 transition-colors outline-none appearance-none cursor-pointer"
                    >
                      {classes.filter(c => c !== 'All Classes').map(c => (
                        <option key={c} value={c} className="bg-slate-900">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  {/* Status is forced to Pending Camera initially, no select needed */}
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Initial Status</label>
                  <div className="w-full h-11 glass-input px-4 rounded-lg bg-slate-800/50 border border-white/5 text-slate-400 flex items-center text-sm">
                    Pending Camera
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-colors"
                >
                  <Camera size={18} /> Start Camera on Pi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.3)] relative">
            <button 
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">Edit Student</h3>
            <p className="text-slate-400 text-sm mb-6">
              Update {editingStudent.student_name}'s details.
            </p>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={editingStudent.student_name}
                  onChange={(e) => setEditingStudent({...editingStudent, student_name: e.target.value})}
                  className="w-full h-11 glass-input px-4 rounded-lg bg-slate-900/50 border border-white/10 text-white placeholder-white/30 focus:border-indigo-500/50 transition-colors outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Matric ID</label>
                <input 
                  type="text" 
                  required
                  value={editingStudent.student_id}
                  onChange={(e) => setEditingStudent({...editingStudent, student_id: e.target.value})}
                  className="w-full h-11 glass-input px-4 rounded-lg bg-slate-900/50 border border-white/10 text-white placeholder-white/30 focus:border-indigo-500/50 transition-colors outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Class</label>
                  <div className="relative">
                    <select 
                      value={editingStudent.grade_class}
                      onChange={(e) => setEditingStudent({...editingStudent, grade_class: e.target.value})}
                      className="w-full h-11 glass-input px-4 rounded-lg bg-slate-900/50 border border-white/10 text-white focus:border-indigo-500/50 transition-colors outline-none appearance-none cursor-pointer"
                    >
                      {classes.filter(c => c !== 'All Classes').map(c => (
                        <option key={c} value={c} className="bg-slate-900">{c}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Status</label>
                  <div className="relative">
                    <select 
                      value={editingStudent.status}
                      onChange={(e) => setEditingStudent({...editingStudent, status: e.target.value as any})}
                      className="w-full h-11 glass-input px-4 rounded-lg bg-slate-900/50 border border-white/10 text-white focus:border-indigo-500/50 transition-colors outline-none appearance-none cursor-pointer"
                    >
                      {statuses.filter(s => s !== 'All Status').map(s => (
                        <option key={s} value={s} className="bg-slate-900">{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Update Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
