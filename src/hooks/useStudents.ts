import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type Student = {
  id: string;
  student_id: string;
  student_name: string;
  grade_class: string;
  status: 'Active' | 'Intern' | 'Graduated' | 'Suspended';
  created_at: string;
};

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();

    const channel = supabase
      .channel('students_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, (payload) => {
        fetchStudents(); // Refresh the list whenever any change happens
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('students')
        .select('*')
        .order('student_id', { ascending: true });

      if (err) throw err;
      if (data) setStudents(data as Student[]);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (newStudent: Omit<Student, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([newStudent])
        .select()
        .single();
        
      if (error) throw error;
      if (data) {
        setStudents(prev => [...prev, data as Student].sort((a, b) => a.student_id.localeCompare(b.student_id)));
      }
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const { error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setStudents(prev => prev.filter(s => s.id !== id));
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { students, loading, error, addStudent, updateStudent, deleteStudent, refresh: fetchStudents };
}
