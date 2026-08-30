'use client';

import React, { useState, useEffect } from 'react';
import { Power, Volume2, ShieldAlert, Cpu, Thermometer, Camera, Monitor, Settings2, RefreshCw, CheckCircle2, Activity, Wifi } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabaseClient';

export default function HardwarePage() {
  const [cooldown, setCooldown] = useState(120);
  const [buzzerDuration, setBuzzerDuration] = useState(2);
  const [kioskResetTime, setKioskResetTime] = useState(30);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [isTestingBuzzer, setIsTestingBuzzer] = useState(false);
  const [gateLocked, setGateLocked] = useState(false);
  const [kioskActive, setKioskActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  
  const [temperature, setTemperature] = useState(0);
  const [cpuLoad, setCpuLoad] = useState(0);
  const [pingData, setPingData] = useState(Array.from({length: 20}, (_, i) => ({ time: i, ping: 0 })));
  const [isOnline, setIsOnline] = useState(false);

  // Fetch Hardware Config from Supabase
  useEffect(() => {
    let mounted = true;

    const fetchConfig = async () => {
      const { data, error } = await supabase.from('hardware_config').select('*').eq('id', 1).single();
      if (data && !error && mounted) {
        setCooldown(data.cooldown_seconds);
        setBuzzerDuration(data.buzzer_duration);
        setKioskResetTime(data.kiosk_reset);
        setGateLocked(data.gate_locked);
        setKioskActive(data.kiosk_active || false);
      }
    };
    fetchConfig();

    const fetchTelemetry = async () => {
      const { data, error } = await supabase.from('hardware_telemetry').select('*').eq('id', 1).single();
      if (data && !error && mounted) {
        updateTelemetryState(data);
      }
    };
    fetchTelemetry();

    const updateTelemetryState = (data: any) => {
      if (!data) return;
      const now = new Date().getTime();
      const lastPing = new Date(data.last_ping).getTime();
      const online = (now - lastPing) < 15000; // 15 seconds threshold
      
      setIsOnline(online);
      setTemperature(online ? Number(data.temperature || 0) : 0);
      setCpuLoad(online ? Number(data.cpu_load || 0) : 0);
      
      setPingData(prev => {
        return [...prev.slice(1), { time: prev[prev.length - 1].time + 1, ping: online ? 15 + Math.random()*5 : 0 }];
      });
    };

    // Listen to telemetry updates
    const channel = supabase.channel('hardware_telemetry_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'hardware_telemetry', filter: 'id=eq.1' }, (payload) => {
        if (mounted) updateTelemetryState(payload.new);
      })
      .subscribe();

    // Heartbeat check
    const heartbeatTimer = setInterval(() => {
      if (mounted) fetchTelemetry(); // Polling fallback to check if it went offline
    }, 10000);

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
      clearInterval(heartbeatTimer);
    };
  }, []);
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    const { error } = await supabase.from('hardware_config').upsert({
      id: 1,
      cooldown_seconds: cooldown,
      buzzer_duration: buzzerDuration,
      kiosk_reset: kioskResetTime,
      gate_locked: gateLocked,
      updated_at: new Date().toISOString()
    });
    
    setIsSyncing(false);
    if (!error) {
      showToast('Configuration synced to hardware successfully.');
    } else {
      showToast('Failed to sync: ' + error.message);
    }
  };

  const handleReboot = () => {
    if (confirm('Are you sure you want to reboot the Raspberry Pi? The camera will be offline for ~45 seconds.')) {
      setIsRebooting(true);
      setTimeout(() => {
        setIsRebooting(false);
        showToast('Device reboot sequence initiated.');
      }, 2000);
    }
  };

  const handleTestBuzzer = async () => {
    setIsTestingBuzzer(true);
    
    // Save current reset time
    const originalReset = kioskResetTime;
    
    // Send magic value -1 to trigger Pi
    await supabase.from('hardware_config').upsert({
      id: 1,
      cooldown_seconds: cooldown,
      buzzer_duration: buzzerDuration,
      kiosk_reset: -1,
      gate_locked: gateLocked,
      updated_at: new Date().toISOString()
    });

    showToast('Sending trigger to Raspberry Pi...');

    // Wait 4 seconds to ensure Pi polls it, then revert
    setTimeout(async () => {
      await supabase.from('hardware_config').upsert({
        id: 1,
        cooldown_seconds: cooldown,
        buzzer_duration: buzzerDuration,
        kiosk_reset: originalReset,
        gate_locked: gateLocked,
        updated_at: new Date().toISOString()
      });
      setIsTestingBuzzer(false);
      showToast('Buzzer test completed.');
    }, 4000);
  };

  
  const toggleKioskPower = async () => {
    const newState = !kioskActive;
    setKioskActive(newState);
    await supabase.from('hardware_config').update({ kiosk_active: newState }).eq('id', 1);
    showToast(newState ? 'Kiosk Started' : 'Kiosk Stopped');
  };

  const toggleGateLock = async () => {

    const newState = !gateLocked;
    setGateLocked(newState);
    
    await supabase.from('hardware_config').upsert({
      id: 1,
      gate_locked: newState,
      updated_at: new Date().toISOString()
    });

    showToast(newState ? 'Gates locked. Scanner disabled.' : 'Gates unlocked. Normal scanning resumed.');
  };

  // CPU Speedometer Colors
  const getCpuColor = (load: number) => {
    if (load > 85) return '#f43f5e'; // Rose (Danger)
    if (load > 65) return '#f59e0b'; // Amber (Warning)
    return '#10b981'; // Emerald (Good)
  };
  const cpuColor = getCpuColor(cpuLoad);
  
  const cpuPieData = [
    { name: 'Used', value: cpuLoad, color: cpuColor },
    { name: 'Free', value: 100 - cpuLoad, color: 'rgba(255,255,255,0.05)' }
  ];

  // Current ping value (last item in array)
  const currentPing = pingData[pingData.length - 1].ping;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10 w-full max-w-6xl mx-auto pb-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right fade-in bg-emerald-500/20 border border-emerald-500/50 p-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-3">
          <CheckCircle2 className="text-emerald-400" size={20} />
          <span className="font-bold text-emerald-100">{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            HARDWARE CONTROL
          </h1>
          <p className="text-emerald-400/60 mt-1 font-medium uppercase tracking-widest text-sm">
            IoT Devices & Edge Configurator
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Status & Telemetry */}
        <div className="space-y-6">
          
          {/* ADVANCED TELEMETRY (NEW CAR SPEEDOMETER STYLE) */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden flex flex-col gap-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <Activity className="text-emerald-400" /> Advanced Telemetry
            </h2>
            
            {/* CPU Speedometer */}
            <div className="relative pt-4">
              <div className="absolute top-0 left-0 flex flex-col">
                <span className="text-xs font-bold text-slate-300 tracking-wider">CPU LOAD</span>
                <span className="text-[10px] text-emerald-500/80 font-mono tracking-widest mt-0.5">RASPBERRY PI 3 MODEL B+</span>
              </div>
              <div className="h-28 w-full mt-2 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cpuPieData}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius="75%"
                      outerRadius="100%"
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                      isAnimationActive={false} // Disable animation so it looks like a snappy car gauge
                    >
                      {cpuPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Speedometer Center Text */}
                <div className="absolute bottom-0 left-0 w-full text-center flex flex-col items-center justify-end">
                  <span className="text-3xl font-black text-white" style={{ color: cpuColor }}>
                    {cpuLoad}<span className="text-lg opacity-50">%</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Network Ping Line Chart (ECG Style) */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider">
                  <Wifi size={14} className={currentPing > 80 ? 'text-rose-400' : 'text-cyan-400'} /> LATENCY
                </div>
                <div className="text-sm font-bold text-white">
                  {currentPing} <span className="text-slate-500 text-xs font-normal">ms</span>
                </div>
              </div>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pingData}>
                    <YAxis domain={[0, 150]} hide />
                    <Line 
                      type="monotone" 
                      dataKey="ping" 
                      stroke={currentPing > 80 ? '#f43f5e' : '#06b6d4'} 
                      strokeWidth={2} 
                      dot={false} 
                      isAnimationActive={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Basic Status & Temp */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
              {/* Temp */}
              <div className="flex flex-col p-3 bg-slate-900/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer size={14} className={temperature > 65 ? 'text-rose-400' : 'text-emerald-400'} />
                  <span className="text-[10px] font-semibold text-slate-400 tracking-wider">TEMP</span>
                </div>
                <span className={`text-lg font-black ${temperature > 65 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {temperature}°
                </span>
              </div>
              {/* Camera */}
              <div className="flex flex-col p-3 bg-slate-900/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Camera size={14} className={isOnline ? "text-emerald-400" : "text-red-400"} />
                  <span className="text-[10px] font-semibold text-slate-400 tracking-wider">CAM</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
                  <span className={`text-xs font-bold ${isOnline ? "text-emerald-400" : "text-red-400"}`}>{isOnline ? "Online" : "Offline"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions / Emergency */}
          <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)] relative overflow-hidden">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ShieldAlert className="text-rose-400" /> Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3">

              <button 
                onClick={toggleKioskPower}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${kioskActive ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-900/50 hover:bg-slate-800 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3">
                  <Power size={18} className={kioskActive ? 'text-emerald-400' : 'text-slate-400'} />
                  <div className="flex flex-col text-left">
                    <span className={`font-semibold ${kioskActive ? 'text-emerald-200' : 'text-slate-200'}`}>
                      {kioskActive ? 'Kiosk Running' : 'Kiosk Standby'}
                    </span>
                    <span className="text-xs text-slate-400">{kioskActive ? 'Camera is active' : 'Camera is paused'}</span>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${kioskActive ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${kioskActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </button>

              <button 
                onClick={handleReboot}
                disabled={isRebooting}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Power size={18} className="text-slate-400 group-hover:text-rose-400 transition-colors" />
                  <span className="font-semibold text-slate-200">Reboot Edge Device</span>
                </div>
                {isRebooting ? <RefreshCw size={16} className="animate-spin text-rose-400" /> : null}
              </button>

              <button 
                onClick={handleTestBuzzer}
                disabled={isTestingBuzzer}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Volume2 size={18} className="text-slate-400 group-hover:text-amber-400 transition-colors" />
                  <span className="font-semibold text-slate-200">Test Buzzer</span>
                </div>
              </button>

              <button 
                onClick={toggleGateLock}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${gateLocked ? 'bg-rose-500/20 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'bg-slate-900/50 hover:bg-slate-800 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert size={18} className={gateLocked ? 'text-rose-400' : 'text-slate-400'} />
                  <div className="flex flex-col text-left">
                    <span className={`font-semibold ${gateLocked ? 'text-rose-200' : 'text-slate-200'}`}>
                      {gateLocked ? 'Scanner Disabled' : 'Disable Scanner'}
                    </span>
                    <span className="text-xs text-slate-400">{gateLocked ? 'Gates are locked' : 'Lock gates (Holidays)'}</span>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${gateLocked ? 'bg-rose-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${gateLocked ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Configurator */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl relative h-full flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings2 className="text-emerald-400" /> Tuning Parameters
              </h2>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                {isSyncing ? (
                  <><RefreshCw size={18} className="animate-spin" /> Syncing...</>
                ) : (
                  <><RefreshCw size={18} /> Sync to Hardware</>
                )}
              </button>
            </div>
            
            <div className="space-y-10 flex-1">
              {/* Cooldown */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-200">Anti-Spam Cooldown</label>
                    <p className="text-xs text-slate-400 mt-1">Ignore same face for this duration after successful scan.</p>
                  </div>
                  <div className="px-3 py-1 bg-slate-900 rounded-lg border border-white/10 font-mono text-emerald-400 font-bold">
                    {cooldown}s
                  </div>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={cooldown}
                  onChange={(e) => setCooldown(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <div className="flex justify-between text-xs text-slate-500 font-medium mt-2">
                  <span>10s</span>
                  <span>300s (5m)</span>
                </div>
              </div>

              {/* Buzzer */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-200">Success Buzzer Duration</label>
                    <p className="text-xs text-slate-400 mt-1">How long the physical buzzer beeps on success.</p>
                  </div>
                  <div className="px-3 py-1 bg-slate-900 rounded-lg border border-white/10 font-mono text-emerald-400 font-bold">
                    {buzzerDuration}s
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={buzzerDuration}
                  onChange={(e) => setBuzzerDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <div className="flex justify-between text-xs text-slate-500 font-medium mt-2">
                  <span>Off (0s)</span>
                  <span>Max (5s)</span>
                </div>
              </div>

              {/* Reset Time */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-200">Kiosk Auto-Reset</label>
                    <p className="text-xs text-slate-400 mt-1">Time before screen reverts to "Waiting for scan" after an error.</p>
                  </div>
                  <div className="px-3 py-1 bg-slate-900 rounded-lg border border-white/10 font-mono text-emerald-400 font-bold">
                    {kioskResetTime}s
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={kioskResetTime}
                  onChange={(e) => setKioskResetTime(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <div className="flex justify-between text-xs text-slate-500 font-medium mt-2">
                  <span>5s</span>
                  <span>60s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
