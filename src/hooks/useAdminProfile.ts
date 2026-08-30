import { useState, useEffect } from 'react';

export interface AdminProfile {
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string | null;
  department: string;
}

const defaultProfile: AdminProfile = {
  name: 'Syahmi Aof',
  role: 'System Administrator',
  email: 'admin@tvetmara.edu.my',
  phone: '+60 12-345 6789',
  avatar: null,
  department: 'Fakulti Teknologi Maklumat'
};

export function useAdminProfile() {
  const [profile, setProfile] = useState<AdminProfile>(defaultProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('admin_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {}
    }
    
    // Listen for cross-tab or same-window changes
    const handleStorage = (e: Event) => {
      const p = localStorage.getItem('admin_profile');
      if (p) setProfile(JSON.parse(p));
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('profile-updated', handleStorage as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('profile-updated', handleStorage as EventListener);
    };
  }, []);

  const saveProfile = (newProfile: AdminProfile) => {
    localStorage.setItem('admin_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    window.dispatchEvent(new CustomEvent('profile-updated'));
  };

  return { profile, saveProfile, mounted };
}
