'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Trash2, User, Bell, Palette, Shield, Save, CheckCircle2, Server, Database, Globe, Phone, Building2, LogOut } from 'lucide-react';

import { useAdminProfile } from '@/hooks/useAdminProfile';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form States
  const { profile, saveProfile } = useAdminProfile();
  const [profileData, setProfileData] = useState(profile);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setProfileData(profile);
  }, [profile]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setProfileData({ ...profileData, avatar: compressedBase64 });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileData({ ...profileData, avatar: null });
  };

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app-theme') || 'startup';
    }
    return 'startup';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const [notifications, setNotifications] = useState({
    dailyReport: true,
    absentAlerts: true,
    hardwareAlerts: true,
    smsAlerts: false
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    saveProfile(profileData);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 relative z-10 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            SYSTEM SETTINGS
          </h1>
          <p className="text-emerald-400/60 mt-1 font-medium uppercase tracking-widest text-sm">
            Admin Profile & Application Preferences
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Navigation & System Status */}
        <div className="w-full lg:w-72 flex flex-col gap-6">
          
          {/* Navigation Tabs */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${activeTab === 'profile' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold shadow-[0_0_20px_rgba(16,185,129,0.15)] translate-x-2' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'}`}
            >
              <User size={18} /> Profile Information
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${activeTab === 'appearance' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold shadow-[0_0_20px_rgba(16,185,129,0.15)] translate-x-2' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'}`}
            >
              <Palette size={18} /> Theme & Appearance
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${activeTab === 'notifications' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold shadow-[0_0_20px_rgba(16,185,129,0.15)] translate-x-2' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'}`}
            >
              <Bell size={18} /> Notification Alerts
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${activeTab === 'security' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold shadow-[0_0_20px_rgba(16,185,129,0.15)] translate-x-2' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-transparent'}`}
            >
              <Shield size={18} /> Security & Password
            </button>
          </div>

          {/* System Info Widget (Fills the gap) */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/40">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Server size={14} className="text-emerald-400" /> Version
                </div>
                <span className="text-sm font-mono text-white">v2.4.1 (Stable)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Database size={14} className="text-emerald-400" /> Database
                </div>
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-md">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Globe size={14} className="text-emerald-400" /> Environment
                </div>
                <span className="text-sm font-mono text-white">Production</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-[10px] text-slate-500 text-center">
              Last synced: Today at 08:30 AM
            </div>
          </div>

        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="glass-panel rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
            
            {showSuccess && (
              <div className="absolute top-0 left-0 right-0 bg-emerald-500/90 backdrop-blur-md p-3 flex justify-center items-center gap-2 text-slate-950 text-sm font-bold animate-in slide-in-from-top-full fade-in z-20">
                <CheckCircle2 size={18} /> All settings have been saved successfully!
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Profile Information</h3>
                    <p className="text-slate-400 text-sm mt-1">Update your personal details and public profile.</p>
                  </div>
                  
                  {/* Banner & Avatar Profile Header */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50">
                    <div className="h-32 bg-gradient-to-r from-emerald-600 to-indigo-900 w-full relative">
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <div className="px-8 pb-6 relative">
                      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 sm:-mt-16 mb-4">
                        <div className="relative">
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-900 overflow-hidden relative group cursor-pointer shadow-xl bg-slate-800 flex items-center justify-center text-emerald-400 font-black text-4xl"
                          >
                            {profileData.avatar ? (
                              <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              profileData.name ? profileData.name.substring(0,2).toUpperCase() : 'AD'
                            )}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs font-bold text-white flex flex-col items-center gap-1"><Camera size={16} /> Upload</span>
                            </div>
                          </div>
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden" 
                          />
                          {profileData.avatar && (
                            <button type="button" onClick={removeImage} className="absolute -bottom-2 right-0 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-400 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <div className="text-center sm:text-left pb-2">
                          <h4 className="text-2xl font-black text-white tracking-tight">{profileData.name}</h4>
                          <p className="text-emerald-400 font-medium">{profileData.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Display Name</label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          style={{ paddingLeft: '2.75rem' }}
                          className="w-full h-12 glass-input pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-emerald-500/50 transition-colors outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                        <input 
                          type="email" 
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          style={{ paddingLeft: '2.75rem' }}
                          className="w-full h-12 glass-input pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-emerald-500/50 transition-colors outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          style={{ paddingLeft: '2.75rem' }}
                          className="w-full h-12 glass-input pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-emerald-500/50 transition-colors outline-none placeholder:text-slate-600"
                          placeholder="+60 1x-xxx xxxx"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Department / Faculty</label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          value={profileData.department}
                          onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                          style={{ paddingLeft: '2.75rem' }}
                          className="w-full h-12 glass-input pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-emerald-500/50 transition-colors outline-none"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Role / Title (Read Only)</label>
                      <input 
                        type="text" 
                        value={profileData.role}
                        readOnly
                        className="w-full h-12 glass-input px-4 rounded-xl bg-black/40 border border-white/5 text-slate-500 cursor-not-allowed outline-none font-mono"
                      />
                      <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wide">Note: Contact Super Admin or IT Support to change your system role.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* APPEARANCE TAB */}
              {activeTab === 'appearance' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Theme & Appearance</h3>
                    <p className="text-slate-400 text-sm mt-1">Customize the look and feel of your dashboard.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Theme 0: Startup (Default) */}
                    <button 
                      type="button"
                      onClick={() => setTheme('startup')}
                      className={`p-1 rounded-2xl transition-all ${theme === 'startup' ? 'bg-gradient-to-br from-sky-500 to-sky-900 shadow-[0_0_30px_rgba(14,165,233,0.4)] scale-[1.02]' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      <div className="bg-[#0a0d0c] p-4 rounded-xl h-full flex flex-col gap-4">
                        <div className="w-full h-32 rounded-lg bg-[#050505] flex items-center justify-center border border-white/10 overflow-hidden relative">
                          {/* Grid background representation */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:12px_12px]"></div>
                          <div className="w-32 h-32 rounded-full bg-sky-500/20 blur-xl absolute m-auto inset-0"></div>
                          {theme === 'startup' && <CheckCircle2 className="text-sky-400 relative z-10 drop-shadow-md" size={32} />}
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-lg text-white block">Deep Tech</span>
                          <span className="text-xs text-slate-400">Default professional dark</span>
                        </div>
                      </div>
                    </button>

                    {/* Theme 1: Aurora */}
                    <button 
                      type="button"
                      onClick={() => setTheme('aurora')}
                      className={`p-1 rounded-2xl transition-all ${theme === 'aurora' ? 'bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-[1.02]' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      <div className="bg-slate-950 p-4 rounded-xl h-full flex flex-col gap-4">
                        <div className="w-full h-32 rounded-lg bg-gradient-to-br from-emerald-900 to-cyan-900 flex items-center justify-center border border-white/10 overflow-hidden relative">
                          <div className="w-24 h-24 rounded-full bg-emerald-500/60 blur-2xl absolute top-0 left-0"></div>
                          <div className="w-24 h-24 rounded-full bg-cyan-500/60 blur-2xl absolute bottom-0 right-0"></div>
                          {theme === 'aurora' && <CheckCircle2 className="text-white relative z-10 drop-shadow-md" size={32} />}
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-lg text-white block">Emerald Zamrud</span>
                          <span className="text-xs text-slate-400">Vibrant green & cyan glass</span>
                        </div>
                      </div>
                    </button>

                    {/* Theme 4: Amethyst */}
                    <button 
                      type="button"
                      onClick={() => setTheme('amethyst')}
                      className={`p-1 rounded-2xl transition-all ${theme === 'amethyst' ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] scale-[1.02]' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      <div className="bg-slate-950 p-4 rounded-xl h-full flex flex-col gap-4">
                        <div className="w-full h-32 rounded-lg bg-gradient-to-br from-violet-950 to-fuchsia-950 flex items-center justify-center border border-white/10 overflow-hidden relative">
                          <div className="w-24 h-24 rounded-full bg-violet-600/60 blur-2xl absolute top-0 left-0"></div>
                          <div className="w-24 h-24 rounded-full bg-fuchsia-600/60 blur-2xl absolute bottom-0 right-0"></div>
                          {theme === 'amethyst' && <CheckCircle2 className="text-white relative z-10 drop-shadow-md" size={32} />}
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-lg text-white block">Amethyst Galaxy</span>
                          <span className="text-xs text-slate-400">Deep space violet & magenta</span>
                        </div>
                      </div>
                    </button>

                    {/* Theme 5: Sunset */}
                    <button 
                      type="button"
                      onClick={() => setTheme('sunset')}
                      className={`p-1 rounded-2xl transition-all ${theme === 'sunset' ? 'bg-gradient-to-br from-orange-500 to-rose-600 shadow-[0_0_30px_rgba(249,115,22,0.4)] scale-[1.02]' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      <div className="bg-slate-950 p-4 rounded-xl h-full flex flex-col gap-4">
                        <div className="w-full h-32 rounded-lg bg-gradient-to-br from-orange-950 to-rose-950 flex items-center justify-center border border-white/10 overflow-hidden relative">
                          <div className="w-24 h-24 rounded-full bg-orange-600/60 blur-2xl absolute top-0 left-0"></div>
                          <div className="w-24 h-24 rounded-full bg-rose-600/60 blur-2xl absolute bottom-0 right-0"></div>
                          {theme === 'sunset' && <CheckCircle2 className="text-white relative z-10 drop-shadow-md" size={32} />}
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-lg text-white block">Sunset Flare</span>
                          <span className="text-xs text-slate-400">Fiery orange & crimson red</span>
                        </div>
                      </div>
                    </button>

                    {/* Theme 2: Dark */}
                    <button 
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`p-1 rounded-2xl transition-all ${theme === 'dark' ? 'bg-gradient-to-br from-slate-400 to-slate-600 shadow-[0_0_30px_rgba(148,163,184,0.3)] scale-[1.02]' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      <div className="bg-slate-950 p-4 rounded-xl h-full flex flex-col gap-4">
                        <div className="w-full h-32 rounded-lg bg-[#0f172a] flex items-center justify-center border border-slate-800">
                          {theme === 'dark' && <CheckCircle2 className="text-white" size={32} />}
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-lg text-white block">Solid Dark</span>
                          <span className="text-xs text-slate-400">Minimalist solid colors</span>
                        </div>
                      </div>
                    </button>

                    {/* Theme 3: Light */}
                    <button 
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`p-1 rounded-2xl transition-all ${theme === 'light' ? 'bg-gradient-to-br from-cyan-400 to-blue-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-[1.02]' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      <div className="bg-slate-950 p-4 rounded-xl h-full flex flex-col gap-4">
                        <div className="w-full h-32 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-300">
                          {theme === 'light' && <CheckCircle2 className="text-slate-900" size={32} />}
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-lg text-white block">Light Mode</span>
                          <span className="text-xs text-slate-400">Clean white interface</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Notification Alerts</h3>
                    <p className="text-slate-400 text-sm mt-1">Control how and when you receive system alerts.</p>
                  </div>
                  
                  <div className="space-y-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors">
                      <div>
                        <h4 className="font-bold text-slate-200">Daily Attendance Report</h4>
                        <p className="text-sm text-slate-400">Receive a summary of attendance via email at 5:00 PM.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notifications.dailyReport} onChange={(e) => setNotifications({...notifications, dailyReport: e.target.checked})} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border-t border-white/5">
                      <div>
                        <h4 className="font-bold text-slate-200">Absent Student Alerts</h4>
                        <p className="text-sm text-slate-400">Notify immediately if a student is absent for 3 consecutive days.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notifications.absentAlerts} onChange={(e) => setNotifications({...notifications, absentAlerts: e.target.checked})} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border-t border-white/5">
                      <div>
                        <h4 className="font-bold text-slate-200">Hardware Disconnect Alerts</h4>
                        <p className="text-sm text-slate-400">Get notified if the Raspberry Pi camera goes offline.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notifications.hardwareAlerts} onChange={(e) => setNotifications({...notifications, hardwareAlerts: e.target.checked})} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border-t border-white/5">
                      <div>
                        <h4 className="font-bold text-slate-200 opacity-50">SMS Alerts (Premium)</h4>
                        <p className="text-sm text-slate-400 opacity-50">Receive critical alerts via SMS.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-not-allowed opacity-50">
                        <input type="checkbox" disabled checked={notifications.smsAlerts} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Security & Password</h3>
                    <p className="text-slate-400 text-sm mt-1">Ensure your account stays secure.</p>
                  </div>
                  
                  <div className="space-y-6 max-w-xl bg-white/5 p-6 rounded-2xl border border-white/5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full h-12 glass-input px-4 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-emerald-500/50 transition-colors outline-none"
                      />
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">New Password</label>
                      <input 
                        type="password"
                        placeholder="Leave blank to keep unchanged" 
                        className="w-full h-12 glass-input px-4 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-emerald-500/50 transition-colors outline-none mb-4"
                      />
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full h-12 glass-input px-4 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-emerald-500/50 transition-colors outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions (Sticky Bottom) */}
            <div className="bg-slate-950/80 backdrop-blur-md p-6 border-t border-white/10 flex justify-between items-center">
              <button 
                type="button"
                onClick={() => {
                  import('@/app/login/actions').then((m) => m.logout());
                }}
                className="flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2 px-4 py-3 sm:py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors text-sm font-medium border border-rose-500/20 sm:border-transparent"
              >
                <LogOut size={16} /> Log Out
              </button>
              <div className="flex w-full sm:w-auto items-center gap-4">
                <p className="text-xs text-slate-400 hidden md:block">Changes will be applied across the entire application.</p>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  {isSaving ? 'Saving Changes...' : (
                    <>
                      <Save size={18} /> Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
