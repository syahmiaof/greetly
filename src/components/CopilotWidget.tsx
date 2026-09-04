'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { Bot, Send, X } from 'lucide-react';

export function CopilotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [myInput, setMyInput] = useState('');
  const [initialMessages, setInitialMessages] = useState<any[]>([]);

  // Load saved messages
  useEffect(() => {
    const saved = localStorage.getItem('copilot_messages');
    if (saved) {
      try {
        setInitialMessages(JSON.parse(saved));
      } catch (e) {}
    }
    setMounted(true);
  }, []);

  const { messages, sendMessage, status, setMessages } = useChat({
    initialMessages,
    onError: (e: any) => {
      let errorMsg = "Alamak! Synthia sedang mengalami masalah teknikal. Sila cuba lagi sebentar. 🔧";
      try {
        const parsed = JSON.parse(e.message);
        if (parsed.content) errorMsg = parsed.content;
      } catch(err) {
        if (e.message) errorMsg = e.message;
      }
      setMessages((prev: any) => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: errorMsg
      }]);
    },
    onFinish: () => {
      // Play sound
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
    }
  } as any);

  const isLoading = status !== 'ready' && status !== 'error';

  useEffect(() => {
    if (mounted && messages.length > 0) {
      localStorage.setItem('copilot_messages', JSON.stringify(messages));
    }
  }, [messages, mounted]);

  // Don't show on the main copilot page
  if (pathname === '/copilot' || !mounted) return null;

  const handleSend = () => {
    if (!myInput.trim() || isLoading) return;
    (sendMessage as any)({ role: 'user', content: myInput });
    setMyInput('');
  };

  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] glass-panel rounded-2xl border border-cyan-500/20 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="p-3 bg-slate-900/80 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider">
              <Bot size={16} /> SYNTHIA MINI
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 text-sm mt-10">How can I help you today?</div>
            ) : (
              messages.map(m => (
                <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role !== 'user' && <Bot size={14} className="text-cyan-500 mt-1 shrink-0" />}
                  <div className={`p-2 rounded-xl text-sm max-w-[85%] whitespace-pre-wrap ${m.role === 'user' ? 'bg-slate-800 text-slate-200' : 'bg-cyan-950/30 text-slate-300 border border-cyan-500/10'}`}>
                    {(m as any).content || ((m as any).parts && (m as any).parts.map((p:any) => p.text).join("")) || "..."}
                  </div>
                </div>
              ))
            )}
            {isLoading && <div className="text-cyan-500 text-xs animate-pulse">Synthia is typing...</div>}
          </div>

          <div className="p-3 bg-slate-900/80 border-t border-white/5">
            <div className="relative">
              <input
                type="text"
                value={myInput}
                onChange={(e) => setMyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask something..."
                className="w-full bg-slate-950 border border-white/10 rounded-full pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              />
              <button onClick={handleSend} disabled={isLoading || !myInput.trim()} className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-500 hover:bg-cyan-400 rounded-full text-black disabled:opacity-50">
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
      >
        {isOpen ? <X size={24} className="text-white" /> : <Bot size={24} className="text-white" />}
      </button>
    </div>
  );
}
