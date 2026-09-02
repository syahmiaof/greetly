'use client';
import React, { useState, useEffect } from 'react';

import { useChat } from '@ai-sdk/react';
import { Bot, Send, User, Activity, FileText, Clock, Cpu, MoreHorizontal, Database, Network, AlertTriangle, Search, Trash2 } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';

export default function CopilotPage() {
  const [myInput, setMyInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);

  const { metrics, totalStudents, records } = useAttendance();
  const [absentList, setAbsentList] = useState<any[]>([]);

  useEffect(() => {
    const fetchAbsentees = async () => {
      const { supabase } = await import('@/lib/supabaseClient');
      const { data: allStudents } = await supabase.from('students').select('*');
      if (allStudents && records) {
        // Filter out anyone who has a record for today (since records from useAttendance includes everyone who scanned)
        const scannedStudentIds = new Set(
          records
            .filter(r => new Date(r.created_at).toDateString() === new Date().toDateString())
            .map(r => r.student_id)
        );
        const absent = allStudents.filter(s => !scannedStudentIds.has(s.student_id));
        setAbsentList(absent);
      }
    };
    if (records) fetchAbsentees();
  }, [records]);

  useEffect(() => {
    const saved = localStorage.getItem('copilot_messages');
    if (saved) {
      try {
        setInitialMessages(JSON.parse(saved));
      } catch(e) {}
    }
    setMounted(true);
  }, []);

  const { messages, sendMessage, status, setMessages } = useChat({ 
    initialMessages,
    onFinish: () => {
      // Play high-tech notification sound
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } catch(e) {}
    },
    onError: (e) => alert("Error API: " + e.message) 
  });
  const isLoading = status !== 'ready' && status !== 'error';

  useEffect(() => {
    if (mounted && messages.length > 0) {
      localStorage.setItem('copilot_messages', JSON.stringify(messages));
    }
  }, [messages, mounted]);

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('copilot_messages');
  };

  const handleSend = () => {
    if (!myInput.trim() || isLoading) return;
    const text = myInput;
    setMyInput('');
    try {
      sendMessage({ role: 'user', content: text });
    } catch (err: any) {
      alert("Gagal menghantar: " + err.message);
    }
  };

  const sendSuggestion = (text: string) => {
    if (isLoading) return;
    try {
      sendMessage({ role: 'user', content: text });
    } catch (err: any) {
      alert("Gagal menghantar cadangan: " + err.message);
    }
  };

  // Determine active topic based on the last message in the chat to change infographics
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const lastMessageContent = lastMsg 
    ? (lastMsg.content || (lastMsg.parts ? lastMsg.parts.map((p:any) => p.text).join("") : "")).toLowerCase() 
    : '';
  let activeTopic = 'summary';
  
  if (lastMessageContent.includes('absent') || lastMessageContent.includes('ponteng') || lastMessageContent.includes('tidak hadir') || lastMessageContent.includes('missing')) {
    activeTopic = 'absent';
  } else if (lastMessageContent.includes('hardware') || lastMessageContent.includes('status') || lastMessageContent.includes('kamera') || lastMessageContent.includes('online')) {
    activeTopic = 'hardware';
  } else if (lastMessageContent.includes('late') || lastMessageContent.includes('lewat') || lastMessageContent.includes('lambat')) {
    activeTopic = 'late';
  }

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            Greetly Copilot
          </h1>
          <p className="text-emerald-400/60 mt-1 font-medium uppercase tracking-widest text-xs md:text-sm">
            AI-powered Virtual Administrative Assistant for attendance data analysis.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        
        {/* Left Pane: Analysis & Insights */}
        <div className="hidden lg:flex w-[35%] glass-panel rounded-2xl flex-col overflow-hidden relative border border-emerald-500/10">
           <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-2">
                <Activity size={14} className="animate-pulse" /> Analysis & Insights
              </h2>
              <MoreHorizontal size={16} className="text-slate-500" />
           </div>
           
           <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {activeTopic === 'summary' && (
                <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                  <div className="border border-white/5 rounded-xl bg-slate-800/30 p-4 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-2"><span className="text-[10px] font-bold text-emerald-500 tracking-widest animate-pulse">LIVE</span></div>
                     <h3 className="text-xs text-slate-400 uppercase mb-4 tracking-wider">Attendance Pulse</h3>
                     <div className="flex items-end h-24 gap-2 justify-between">
                        <div className="w-1/6 bg-emerald-500/80 rounded-t-sm h-[60%] hover:bg-emerald-400 transition-colors relative group"></div>
                        <div className="w-1/6 bg-emerald-500/80 rounded-t-sm h-[80%] hover:bg-emerald-400 transition-colors relative group"></div>
                        <div className="w-1/6 bg-cyan-500/80 rounded-t-sm h-[40%] hover:bg-cyan-400 transition-colors relative group shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-cyan-400 font-bold">TODAY</div>
                        </div>
                        <div className="w-1/6 bg-emerald-500/20 rounded-t-sm h-[90%] border border-dashed border-emerald-500/50 animate-pulse"></div>
                        <div className="w-1/6 bg-emerald-500/20 rounded-t-sm h-[70%] border border-dashed border-emerald-500/50 animate-pulse"></div>
                     </div>
                  </div>
                  
                  <div className="border border-white/5 rounded-xl bg-slate-800/30 p-4">
                     <h3 className="text-xs text-slate-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                       <Network size={14} /> System Health
                     </h3>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-slate-300">Camera Nodes</span>
                           <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/30 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div> Online
                           </span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-slate-300">Database Sync</span>
                           <span className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-md border border-cyan-500/30">99.9%</span>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {activeTopic === 'absent' && (
                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                  <div className="border border-white/5 rounded-xl bg-rose-900/10 p-4 relative overflow-hidden h-48 flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.1)_0%,transparent_70%)]"></div>
                    <Search className="text-rose-400 w-12 h-12 mb-4 animate-bounce" />
                    <h3 className="text-sm text-rose-400 uppercase font-bold tracking-widest text-center">Scanning Absentees</h3>
                    <p className="text-xs text-slate-400 mt-2">Found {metrics?.absentToday || 0} missing students</p>
                    <div className="absolute left-0 right-0 h-1 bg-rose-500/50 top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                  
                  <div className="border border-white/5 rounded-xl bg-slate-800/30 p-4">
                    <h3 className="text-xs text-slate-400 uppercase mb-4 tracking-wider">Watchlist (Absent Today)</h3>
                    <div className="space-y-3">
                      {absentList.length > 0 ? (
                        absentList.slice(0, 4).map((student, i) => (
                          <div key={student.id} className="flex justify-between items-center p-2 rounded bg-slate-900/50 border border-rose-500/10">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-xs text-rose-400 font-bold">
                                {student.student_name.charAt(0)}
                              </div>
                              <div className="text-sm text-slate-300 font-medium">{student.student_name}</div>
                            </div>
                            <div className="text-[10px] text-slate-500">{student.grade_class}</div>
                          </div>
                        ))
                      ) : (metrics?.absentToday || 0) > 0 ? (
                        Array.from({length: Math.min(metrics?.absentToday || 0, 4)}).map((_, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded bg-slate-900/50 border border-rose-500/10">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-xs text-rose-400">?</div>
                              <div className="w-24 h-2 bg-slate-600 rounded"></div>
                            </div>
                            <div className="w-12 h-2 bg-slate-700 rounded"></div>
                          </div>
                        ))
                      ) : null}
                      {(metrics?.absentToday || 0) === 0 && (
                        <p className="text-xs text-slate-500 text-center py-2">No absentees detected yet.</p>
                      )}
                      {absentList.length > 4 && (
                        <p className="text-[10px] text-slate-500 text-center pt-2 border-t border-white/5">+ {absentList.length - 4} more students</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTopic === 'hardware' && (
                <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                  <div className="border border-white/5 rounded-xl bg-cyan-900/10 p-6">
                    <h3 className="text-xs text-cyan-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                      <Cpu size={14} /> Edge Computing Nodes
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-slate-900 border border-cyan-500/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-slate-200 font-medium">Main Gate Raspberry Pi 4</p>
                            <p className="text-xs text-slate-500 mt-1">IP: 192.168.1.101</p>
                          </div>
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                           <div>
                             <p className="text-[10px] text-slate-500 uppercase">CPU Temp</p>
                             <p className="text-sm text-emerald-400">42.5°C</p>
                           </div>
                           <div>
                             <p className="text-[10px] text-slate-500 uppercase">Latency</p>
                             <p className="text-sm text-cyan-400">12ms</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTopic === 'late' && (
                <div className="space-y-6 animate-in slide-in-from-left duration-500">
                  <div className="border border-amber-500/20 rounded-xl bg-amber-900/10 p-4">
                    <h3 className="text-xs text-amber-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                      <AlertTriangle size={14} /> Tardy Heatmap
                    </h3>
                    <div className="grid grid-cols-5 gap-2 h-32">
                       {Array.from({length: 25}).map((_, i) => (
                         <div key={i} className={`rounded-sm ${Math.random() > 0.7 ? 'bg-amber-500/80 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-800/50'}`}></div>
                       ))}
                    </div>
                    <p className="text-[10px] text-amber-500/60 mt-4 text-center">Peak late times detected between 7:30 AM - 7:45 AM</p>
                  </div>
                </div>
              )}

           </div>
        </div>

        {/* Right Pane: Chat Interface */}
        <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden relative border border-cyan-500/10">
          <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
                <Bot size={14} /> AI Assistant | SYNTHIA
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={clearChat} className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-rose-400 transition-colors" title="Clear Chat">
                  <Trash2 size={16} />
                </button>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-950/20">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                <Bot size={48} className="opacity-20" />
                <p>Start chatting with Synthia or choose a suggested prompt below.</p>
                
                <div className="flex flex-wrap gap-3 mt-8 justify-center">
                  <button 
                    onClick={() => sendSuggestion("Generate a summary of today's attendance.")}
                    className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 transition flex items-center gap-2"
                  >
                    <Activity size={16} className="text-emerald-400" />
                    <span className="text-sm">Today's Summary</span>
                  </button>
                  <button 
                    onClick={() => sendSuggestion("List all students who are absent today.")}
                    className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 transition flex items-center gap-2"
                  >
                    <FileText size={16} className="text-rose-400" />
                    <span className="text-sm">Absentee Report</span>
                  </button>
                  <button 
                    onClick={() => sendSuggestion("Which students have been frequently late this month?")}
                    className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 transition flex items-center gap-2"
                  >
                    <Clock size={16} className="text-amber-400" />
                    <span className="text-sm">Late Analysis</span>
                  </button>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={16} className="text-cyan-400" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    m.role === 'user' 
                      ? 'bg-slate-800 text-slate-200 border border-white/5 rounded-tr-sm' 
                      : 'bg-transparent text-slate-300'
                  }`}>
                    {m.role !== 'user' && <div className="text-xs text-cyan-500 font-bold mb-1 tracking-wider uppercase drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">Synthia</div>}
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content || (m.parts && m.parts.map(p => p.text).join("")) || "..."}</p>
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                      <User size={16} className="text-slate-400" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                 <div className="w-8 h-8 rounded-full bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-cyan-400" />
                 </div>
                 <div className="p-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-slate-900/80">
            <div className="relative">
              <input
                type="text"
                value={myInput}
                onChange={(e) => setMyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message Synthia..."
                className="w-full bg-slate-950 border border-white/10 rounded-full pl-6 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 text-slate-200 placeholder:text-slate-600 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !myInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 hover:bg-cyan-400 rounded-full text-slate-950 disabled:opacity-50 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.5)] disabled:shadow-none"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-600 mt-2">
              Synthia can make mistakes. Please verify important data.
            </p>
          </div>
        </div>
      </div>
      
      {/* Required CSS animation for the scanner */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}} />
    </div>
  );
}
