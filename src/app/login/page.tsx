'use client'

import { useState, useTransition } from 'react'
import { login } from './actions'
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const res = await login(formData)
      if (res?.error) {
        setError(res.error)
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-emerald-500/30">
      {/* Background handled globally by layout/theme */}

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/[0.02] border border-white/[0.05] p-8 md:p-10 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.05)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.3)] hover:border-emerald-500/30 hover:bg-[#0a0d0c]">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-emerald-500 font-bold tracking-[0.2em] text-sm mb-2 uppercase">Welcome to</h2>
            <h1 className="text-4xl font-bold text-white tracking-tight" style={{ fontWeight: 800 }}>GREETLY</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200 leading-relaxed">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isPending}
                    className="block w-full pl-12 pr-4 py-3.5 border border-white/[0.05] rounded-xl bg-white/[0.02] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 disabled:opacity-50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    disabled={isPending}
                    className="block w-full pl-12 pr-4 py-3.5 border border-white/[0.05] rounded-xl bg-white/[0.02] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-8 flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-black py-4 px-4 rounded-xl font-bold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
            >
              <span>{isPending ? 'Authenticating...' : 'Secure Login'}</span>
              {!isPending && <ArrowRight className="w-5 h-5 ml-1" />}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-10">
          <p className="text-[#6b7280] text-sm">
            The Future of Smart Attendance Ecosystem.
          </p>
          <p className="text-slate-600 text-xs mt-2">
            &copy; {new Date().getFullYear()} Greetly. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
