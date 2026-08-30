'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, Users, Settings, FileText, Cpu } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [useGreetly, setUseGreetly] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('brand_mode_greetly');
    if (saved !== null) {
      setUseGreetly(saved === 'true');
    }
  }, []);

  const toggleBrand = () => {
    const newVal = !useGreetly;
    setUseGreetly(newVal);
    localStorage.setItem('brand_mode_greetly', String(newVal));
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Monitor', path: '/attendance', icon: FileText },
    { name: 'Records', path: '/records', icon: History },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Hardware', path: '/hardware', icon: Cpu },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 pb-4 pt-2 md:h-auto md:pb-4 md:pt-4 md:relative md:w-64 glass-panel min-h-0 md:min-h-screen px-2 py-1 md:p-4 flex flex-row md:flex-col z-50 md:z-20 border-t md:border-t-0 md:border-r border-white/10 backdrop-blur-3xl shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      <div className="hidden md:flex mb-10 mt-2 px-2 items-center justify-center">
        {/* Dynamic Logo with Secret Toggle */}
        <div 
          className="relative group cursor-pointer" 
          onDoubleClick={toggleBrand}
          title="Double-click to switch brand"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          {useGreetly ? (
            <Image 
              src="/greetly-logo-transparent.png" 
              alt="Greetly Logo" 
              width={160} 
              height={50} 
              className="relative object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-transform duration-300"
              priority
            />
          ) : (
            <Image 
              src="/logo_transparent.png" 
              alt="TVETMARA Besut Logo" 
              width={160} 
              height={50} 
              className="relative object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-transform duration-300"
              priority
            />
          )}
        </div>
      </div>
      
      <ul className="flex flex-row md:flex-col gap-1 md:gap-2 w-full md:w-auto justify-around md:justify-start">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <li key={item.path} className="flex-1 md:flex-none">
              <Link 
                href={item.path} 
                className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-1 md:px-4 py-1 md:py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-emerald-500/10 md:bg-emerald-500/10 border-b-2 md:border-b-0 md:border-l-2 border-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] text-emerald-400' 
                    : 'hover:bg-white/5 text-slate-400 hover:text-white border-b-2 md:border-b-0 md:border-l-2 border-transparent'
                  }
                `}
              >
                <Icon size={20} className={isActive ? "text-emerald-400" : "group-hover:text-emerald-400 transition-colors"} />
                <span className={`tracking-wide text-[10px] md:text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      
    </nav>
  );
}
