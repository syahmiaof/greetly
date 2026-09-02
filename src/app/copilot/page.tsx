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
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bot className="text-blue-500" />
          Greetly Copilot
        </h1>
        <p className="text-slate-400 mt-2">Pembantu Tadbir Maya berkuasa AI untuk menganalisis data kedatangan.</p>
      </div>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <Bot size={48} className="text-slate-600 opacity-50" />
              <p>Mula bersembang dengan Copilot atau pilih soalan cadangan di bawah.</p>
              
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => sendSuggestion('Tunjukkan rumusan kedatangan hari ini.')}
                  className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-xl border border-white/5 transition flex items-center gap-3"
                >
                  <Activity className="text-emerald-400" size={20} />
                  <span className="text-sm">Rumusan Hari Ini</span>
                </button>
                <button 
                  onClick={() => sendSuggestion('Senaraikan pelajar yang kerap ponteng minggu ini.')}
                  className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-xl border border-white/5 transition flex items-center gap-3"
                >
                  <FileText className="text-rose-400" size={20} />
                  <span className="text-sm">Laporan Ponteng</span>
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
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                </div>

                {m.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                    <User size={20} className="text-slate-300" />
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
              <div className="bg-slate-800/80 border border-white/10 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900/50 border-t border-white/5">
          <div className="flex gap-3 relative">
            <input
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 transition"
              value={myInput}
              onChange={(e) => setMyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Tanya Greetly Copilot sesuatu..."
              disabled={isLoading}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSend();
              }}
              disabled={isLoading || myInput.trim() === ''}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl transition flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-xs text-slate-500">
              Copilot boleh melakukan kesilapan. Sila semak maklumat yang penting.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
