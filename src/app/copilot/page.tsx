'use client';
import React, { useState } from 'react';

import { useChat } from '@ai-sdk/react';
import { Bot, Send, User, Activity, FileText, Clock, Cpu, MoreHorizontal, Database, Network } from 'lucide-react';

export default function CopilotPage() {
  const [myInput, setMyInput] = useState('');
  const { messages, sendMessage, status } = useChat({ 
    onError: (e) => alert("Error API: " + e.message) 
  });
  const isLoading = status !== 'ready' && status !== 'error';

  const handleSend = () => {
    if (!myInput.trim() || isLoading) return;
    const text = myInput;
    setMyInput(''); // Kosongkan kotak teks
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

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center md:justify-start gap-3">
            <Bot className="text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" size={32} />
            Greetly Copilot
          </h1>
          <p className="text-emerald-400/60 mt-1 font-medium uppercase tracking-widest text-xs md:text-sm">
            AI-powered Virtual Administrative Assistant for attendance data analysis.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        
        {/* Left Pane: Analysis & Insights */}
        <div className="hidden lg:flex w-[35%] glass-panel flex-col overflow-hidden relative border border-emerald-500/10">
           <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-2">
                <Activity size={14} /> Analysis & Insights
              </h2>
              <MoreHorizontal size={16} className="text-slate-500" />
           </div>
           
           <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              <div className="border border-white/5 rounded-xl bg-slate-800/30 p-4 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2"><span className="text-[10px] font-bold text-emerald-500 tracking-widest">78.4%</span></div>
                 <h3 className="text-xs text-slate-400 uppercase mb-4 tracking-wider">Live Attendance Pulse</h3>
                 <div className="flex items-end h-24 gap-2 justify-between">
                    <div className="w-1/6 bg-emerald-500/80 rounded-t-sm h-[60%] hover:bg-emerald-400 transition-colors cursor-pointer relative group">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Mo</div>
                    </div>
                    <div className="w-1/6 bg-emerald-500/80 rounded-t-sm h-[80%] hover:bg-emerald-400 transition-colors cursor-pointer relative group">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Tu</div>
                    </div>
                    <div className="w-1/6 bg-cyan-500/80 rounded-t-sm h-[40%] hover:bg-cyan-400 transition-colors cursor-pointer relative group shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 font-bold">We</div>
                    </div>
                    <div className="w-1/6 bg-emerald-500/20 rounded-t-sm h-[90%] border border-dashed border-emerald-500/50"></div>
                    <div className="w-1/6 bg-emerald-500/20 rounded-t-sm h-[70%] border border-dashed border-emerald-500/50"></div>
                 </div>
              </div>
              
              <div className="border border-white/5 rounded-xl bg-slate-800/30 p-4">
                 <h3 className="text-xs text-slate-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                   <Network size={14} /> Hardware Telemetry
                 </h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-300">Gate 1 Camera Node</span>
                       <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/30">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-300">Facial Rec Engine</span>
                       <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/30">Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-300">Database Sync</span>
                       <span className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-md border border-cyan-500/30">99.9%</span>
                    </div>
                 </div>
              </div>

              <div className="border border-white/5 rounded-xl bg-slate-800/30 p-4">
                 <h3 className="text-xs text-slate-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                   <Database size={14} /> Active Deployments
                 </h3>
                 <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-slate-500 text-xs">
                        <th className="font-normal pb-2">TARGET</th>
                        <th className="font-normal pb-2 text-right">UPTIME</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="border-t border-white/5">
                        <td className="py-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Supabase DB</td>
                        <td className="py-2 text-right text-emerald-400">100%</td>
                      </tr>
                      <tr className="border-t border-white/5">
                        <td className="py-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"></div> Edge Pi</td>
                        <td className="py-2 text-right text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">99.8%</td>
                      </tr>
                    </tbody>
                 </table>
              </div>

           </div>
        </div>

        {/* Right Pane: Chat Interface */}
        <div className="flex-1 glass-panel flex flex-col overflow-hidden relative border border-cyan-500/10">
          <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
              <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
                <Bot size={14} /> AI Assistant | SYNTHIA
              </h2>
              <MoreHorizontal size={16} className="text-slate-500" />
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
    </div>
  );
}
