'use client';
import React, { useState } from 'react';

import { useChat } from '@ai-sdk/react';
import { Bot, Send, User, Activity, FileText } from 'lucide-react';

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
    <div className="p-8 max-w-6xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
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

      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <Bot size={48} className="opacity-20" />
              <p>Start chatting with Copilot or choose a suggested prompt below.</p>
              
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
                <button 
                  onClick={() => sendSuggestion("Is the hardware currently online and running?")}
                  className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 transition flex items-center gap-2"
                >
                  <Cpu size={16} className="text-cyan-400" />
                  <span className="text-sm">Hardware Status</span>
                </button>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role !== 'user' && (
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Bot size={20} className="text-blue-400" />
                  </div>
                )}
                
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-slate-800/80 border border-white/10 text-slate-200 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content || (m.parts && m.parts.map(p => p.text).join("")) || "..."}</p>
                </div>

                {m.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                    <User size={20} className="text-slate-400" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-4 justify-start">
               <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Bot size={20} className="text-blue-400" />
               </div>
               <div className="bg-slate-800/80 border border-white/10 text-slate-200 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-slate-900/50">
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
              placeholder="Ask Greetly Copilot anything..."
              className="w-full bg-slate-800 border border-white/10 rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-200 placeholder:text-slate-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !myInput.trim()}
              className="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white disabled:opacity-50 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-500 mt-3">
            Copilot can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
