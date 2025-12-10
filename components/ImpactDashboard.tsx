import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Globe, TrendingUp } from 'lucide-react';

interface ImpactDashboardProps {
  completedActions: number;
  totalActions: number;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ completedActions, totalActions }) => {
  const data = [
    { name: 'Jan', value: 0.8 },
    { name: 'Feb', value: 1.2 },
    { name: 'Mar', value: 1.8 },
    { name: 'Apr', value: 2.4 },
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Stat Cards Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Personal Impact */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Your CO2 Reduction</span>
                {/* Custom circular progress indicator */}
                <div className="relative h-8 w-8 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="16" cy="16" r="13" stroke="#334155" strokeWidth="3" fill="none" />
                      <circle cx="16" cy="16" r="13" stroke="#10b981" strokeWidth="3" fill="none" strokeDasharray="81" strokeDashoffset="28" />
                   </svg>
                   <span className="absolute text-[9px] font-bold text-emerald-400">65%</span>
                </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-100">2.4 tons</h3>
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">Equivalent to planting 40 trees</p>
            </div>
        </div>

        {/* Card 2: Community Rank */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">City Ranking</span>
                <Trophy size={16} className="text-amber-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-slate-100">Top 15%</h3>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-medium">Climate Leader</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">San Francisco climate champions</p>
            </div>
        </div>

        {/* Card 3: Global Impact */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Collective Action</span>
                <Globe size={16} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-100">1.2M tons</h3>
              <div className="flex items-center gap-1 mt-1">
                 <TrendingUp size={12} className="text-emerald-400" />
                 <p className="text-[11px] text-emerald-400 font-medium">Up 12% this month</p>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Total FateCraft community reduction</p>
            </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 bg-slate-800/50 rounded-xl border border-slate-700 p-4 min-h-0 flex flex-col">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">Your Monthly CO2 Reduction</h4>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} unit="t" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#10b981' }}
                cursor={{ stroke: '#334155', strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#0f172a' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-center pt-1">
        <p className="text-xs text-slate-500 italic">"Every action creates ripples. You're part of the solution."</p>
      </div>
    </div>
  );
};