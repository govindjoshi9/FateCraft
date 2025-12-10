import React, { useState } from 'react';
import { 
  Map as MapIcon, Activity, Scale, FileText, Loader2, Users, AlertCircle, 
  TrendingUp, Download, ShieldAlert, CheckSquare, Search 
} from 'lucide-react';
import { simulatePolicy, calculateEnforcementAction } from '../services/geminiService';
import { PolicySimulation, Facility, EnforcementCase } from '../types';

export const GovernmentLayout = () => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'simulator' | 'enforcement'>('monitor');

  // Monitor Data
  const [facilities] = useState<Facility[]>([
    { id: '1', name: 'Metro Power', emissions: 12000, target: 10000, status: 'Warning', score: 75, sector: 'Energy', location: {x: 20, y: 30} },
    { id: '2', name: 'City Steel', emissions: 25000, target: 15000, status: 'Non-Compliant', score: 45, sector: 'Industry', location: {x: 60, y: 50} },
    { id: '3', name: 'Green Transit', emissions: 2000, target: 3000, status: 'Compliant', score: 95, sector: 'Transport', location: {x: 40, y: 70} },
    { id: '4', name: 'Port Authority', emissions: 15000, target: 14000, status: 'Warning', score: 78, sector: 'Transport', location: {x: 80, y: 20} },
  ]);

  // Simulator Data
  const [policyText, setPolicyText] = useState('');
  const [region, setRegion] = useState('Metropolis Region');
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<PolicySimulation | null>(null);

  // Enforcement Data
  const [cases, setCases] = useState<EnforcementCase[]>([
    { id: 'C-101', facilityName: 'City Steel', violation: 'Exceeded SO2 limits by 40%', penalty: '$150,000', status: 'Open', date: '2024-05-12' },
    { id: 'C-102', facilityName: 'ChemCo Inc', violation: 'Failure to report Q1 emissions', penalty: '$25,000', status: 'Resolved', date: '2024-04-10' },
  ]);

  const handleSimulate = async () => {
    if (!policyText) return;
    setSimulating(true);
    try {
       const res = await simulatePolicy(policyText, region);
       setSimResult(res);
    } catch(e) { console.error(e); } finally { setSimulating(false); }
  };

  const handleCalculatePenalty = async (caseId: string) => {
     // Mock finding case
     const c = cases.find(x => x.id === caseId);
     if(c) {
        const action = await calculateEnforcementAction(c.violation, c.facilityName);
        alert(`AI Recommendation:\nPenalty: ${action.penalty}\nNote: ${action.recommendation}`);
     }
  };

  return (
    <div className="flex flex-col h-full gap-6 p-4 md:p-6 overflow-y-auto animate-in fade-in">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Regional Climate Command Center</h1>
          <p className="text-slate-400">Monitor, Simulate, Enforce</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          {[
            { id: 'monitor', icon: MapIcon, label: 'Regional Monitor' },
            { id: 'simulator', icon: Activity, label: 'Policy Sim 2.0' },
            { id: 'enforcement', icon: Scale, label: 'Smart Enforcement' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MONITOR TAB */}
      {activeTab === 'monitor' && (
         <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Map Area */}
               <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative h-[500px] overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 to-slate-950 opacity-50"></div>
                  {/* Grid Lines for Map Effect */}
                  <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2}}></div>
                  
                  {/* Facilities on Map */}
                  {facilities.map(f => (
                     <div 
                        key={f.id}
                        className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform group/point"
                        style={{
                           left: `${f.location.x}%`, 
                           top: `${f.location.y}%`,
                           backgroundColor: f.status === 'Compliant' ? '#10b981' : f.status === 'Warning' ? '#f59e0b' : '#f43f5e'
                        }}
                     >
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/point:opacity-100 transition-opacity border border-slate-700 pointer-events-none z-10">
                           {f.name} ({f.emissions}t)
                        </div>
                     </div>
                  ))}
                  <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-lg text-xs">
                     <p className="font-bold mb-2 text-slate-300">Region Status</p>
                     <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Compliant</div>
                     <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Warning</div>
                     <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Non-Compliant</div>
                  </div>
               </div>

               {/* Live Stats Sidebar */}
               <div className="flex flex-col gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex-1">
                     <h3 className="text-lg font-bold text-slate-100 mb-4">Live Alerts</h3>
                     <div className="space-y-4">
                        <div className="flex gap-3 items-start border-l-2 border-rose-500 pl-3">
                           <AlertCircle className="text-rose-500 shrink-0" size={16} />
                           <div>
                              <p className="text-sm text-slate-200 font-medium">Spike detected: City Steel</p>
                              <p className="text-xs text-slate-500">SO2 levels +45% above normal</p>
                           </div>
                        </div>
                        <div className="flex gap-3 items-start border-l-2 border-emerald-500 pl-3">
                           <CheckSquare className="text-emerald-500 shrink-0" size={16} />
                           <div>
                              <p className="text-sm text-slate-200 font-medium">Goal Reached: EV Adoption</p>
                              <p className="text-xs text-slate-500">Q2 Target met ahead of schedule</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                     <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Compliance Leaderboard</h3>
                     {facilities.sort((a,b) => b.score - a.score).slice(0,3).map((f, i) => (
                        <div key={f.id} className="flex justify-between items-center mb-3 last:mb-0">
                           <span className="text-sm text-slate-300">{i+1}. {f.name}</span>
                           <span className="text-xs font-bold text-emerald-400">{f.score}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* SIMULATOR TAB */}
      {activeTab === 'simulator' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
               <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-purple-400"/> Policy Parameters
               </h3>
               <div className="space-y-4">
                  <div>
                     <label className="text-xs text-slate-400 uppercase font-bold">Policy Description</label>
                     <textarea 
                        value={policyText}
                        onChange={e => setPolicyText(e.target.value)}
                        placeholder="e.g. Implement congestion pricing in downtown zone..."
                        className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 mt-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                     />
                  </div>
                  <div>
                     <label className="text-xs text-slate-400 uppercase font-bold">Target Region</label>
                     <input 
                        value={region}
                        onChange={e => setRegion(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 mt-1 text-slate-200"
                     />
                  </div>
                  <button 
                     onClick={handleSimulate} disabled={simulating || !policyText}
                     className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                     {simulating ? <Loader2 className="animate-spin" /> : "Run Simulation Model"}
                  </button>
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col relative overflow-hidden">
               {!simResult ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                     <Activity size={48} className="mb-4 opacity-20" />
                     <p>Ready to simulate.</p>
                  </div>
               ) : (
                  <div className="space-y-6 animate-in fade-in">
                     <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-white">Projected Impact (2030)</h3>
                        <button className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300"><Download size={12}/> Export PDF</button>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-emerald-500">
                           <p className="text-xs text-slate-400 uppercase">CO2 Reduction</p>
                           <p className="text-xl font-bold text-emerald-400">{simResult.co2Reduction}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-blue-500">
                           <p className="text-xs text-slate-400 uppercase">Economic Impact</p>
                           <p className="text-xl font-bold text-blue-400">{simResult.economicImpact}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-amber-500">
                           <p className="text-xs text-slate-400 uppercase">Jobs Created</p>
                           <p className="text-xl font-bold text-amber-400">{simResult.jobCreation}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-purple-500">
                           <p className="text-xs text-slate-400 uppercase">Social Equity</p>
                           <p className="text-sm font-medium text-slate-200">{simResult.socialEquity}</p>
                        </div>
                     </div>
                     <div className="bg-slate-800/30 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase mb-2">Timeline</p>
                        <p className="text-sm text-slate-300 italic">{simResult.timeline}</p>
                     </div>
                  </div>
               )}
            </div>
         </div>
      )}

      {/* ENFORCEMENT TAB */}
      {activeTab === 'enforcement' && (
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-in slide-in-from-bottom-2">
            <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
               <ShieldAlert size={20} className="text-rose-400" /> Active Enforcement Cases
            </h3>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-xs text-slate-500 uppercase border-b border-slate-800">
                        <th className="pb-3 pl-2">Facility</th>
                        <th className="pb-3">Violation</th>
                        <th className="pb-3">Current Penalty</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                     {cases.map(c => (
                        <tr key={c.id} className="text-sm hover:bg-slate-800/30">
                           <td className="py-4 pl-2 font-medium text-slate-200">{c.facilityName}</td>
                           <td className="py-4 text-slate-400 max-w-xs truncate">{c.violation}</td>
                           <td className="py-4 text-slate-300 font-mono">{c.penalty}</td>
                           <td className="py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                 c.status === 'Open' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                              }`}>{c.status}</span>
                           </td>
                           <td className="py-4">
                              <button 
                                 onClick={() => handleCalculatePenalty(c.id)}
                                 className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                              >
                                 <Activity size={12}/> AI Review
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}
    </div>
  );
};