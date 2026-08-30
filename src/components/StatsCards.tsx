import { Users, UserCheck, UserX, Clock } from 'lucide-react';

type StatsCardsProps = {
  metrics?: {
    totalStudents: number;
    presentToday: number;
    absentToday: number;
    lateArrivals: number;
    monthlyPresentPct?: string;
    monthlyAbsentPct?: string;
    monthlyLatePct?: string;
  }
};

export function StatsCards({ metrics = { totalStudents: 0, presentToday: 0, absentToday: 0, lateArrivals: 0, monthlyPresentPct: '0.0', monthlyAbsentPct: '0.0', monthlyLatePct: '0.0' } }: StatsCardsProps) {
  const cards = [
    { 
      label: 'Total Registered', 
      value: metrics.totalStudents, 
      icon: <Users size={20} className="text-emerald-300" />,
      subtext: 'Current Active Students',
      containerClass: 'glass-panel p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-emerald-500/20 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:border-emerald-300'
    },
    { 
      label: "Today's Present", 
      value: metrics.presentToday, 
      icon: <UserCheck size={20} className="text-indigo-300" />,
      subtext: `${metrics.monthlyPresentPct}% monthly avg`,
      containerClass: 'glass-panel p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-indigo-500/20 border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:border-indigo-300'
    },
    { 
      label: "Today's Late", 
      value: metrics.lateArrivals, 
      icon: <Clock size={20} className="text-slate-300" />,
      subtext: `${metrics.monthlyLatePct}% monthly avg`,
      containerClass: 'glass-panel p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-slate-500/20 border-slate-400/50 shadow-[0_0_15px_rgba(148,163,184,0.2)] hover:shadow-[0_0_30px_rgba(148,163,184,0.5)] hover:border-slate-300'
    },
    { 
      label: "Today's Absent", 
      value: metrics.absentToday, 
      icon: <UserX size={20} className="text-rose-300" />,
      subtext: `${metrics.monthlyAbsentPct}% monthly avg`,
      containerClass: 'glass-panel p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-rose-500/20 border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:border-rose-300'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className={card.containerClass}>
          {/* Top row */}
          <div className="flex justify-between items-start w-full z-10">
            <span className="text-sm font-medium text-slate-300">{card.label}</span>
            <div className="p-1.5 rounded-lg bg-slate-900/50 border border-white/5 shadow-inner">
              {card.icon}
            </div>
          </div>
          {/* Bottom row */}
          <div className="flex justify-between items-end w-full z-10 mt-4">
            <span className="text-4xl font-bold text-white tracking-tight">{card.value}</span>
            <span className="text-xs font-medium text-slate-400 mb-1">{card.subtext}</span>
          </div>
          {/* Subtle flare effect inside card */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
}
