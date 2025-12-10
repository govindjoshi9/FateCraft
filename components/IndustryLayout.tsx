import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, Loader2, AlertTriangle, 
  BarChart3, TrendingUp, DollarSign, Bell
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePie, Pie } from 'recharts';
import { analyzeIndustryReport, generateSustainabilityRoadmap } from '../services/geminiService';
import { IndustryAnalysis, RoadmapItem } from '../types';
import { Skeleton, SkeletonCard } from './ui/Skeleton';

export const IndustryLayout = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis' | 'roadmap' | 'alerts'>('dashboard');
  
  const [scopeData] = useState([
    { name: 'Scope 1', value: 12500, color: '#f43f5e' },
    { name: 'Scope 2', value: 8200, color: '#f59e0b' },
    { name: 'Scope 3', value: 24000, color: '#3b82f6' },
  ]);
  const [trendData] = useState([
    { month: 'Jan', emissions: 4200 }, { month: 'Feb', emissions: 4100 },
    { month: 'Mar', emissions: 4350 }, { month: 'Apr', emissions: 3900 },
    { month: 'May', emissions: 3800 }, { month: 'Jun', emissions: 3650 },
  ]);

  const [reportText, setReportText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<IndustryAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  
  const [alerts] = useState([
    { id: 1, type: 'Critical', msg: 'NOx emissions exceeded limit at Facility B', time: '2h ago' },
    { id: 2, type: 'Warning', msg: 'Q3 Compliance Report due in 5 days', time: '1d ago' },
    { id: 3, type: 'Info', msg: 'New carbon tax regulations effective next month', time: '3d ago' },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setReportText(`Simulated content for: ${file.name}. Contains emissions data for Q1-Q2 2024.`);
  };

  const handleAnalyze = async () => {
    if (!reportText.trim()) return;
    setAnalyzing(true);
    try {
      const data = await analyzeIndustryReport(reportText);
      setAnalysisResult(data);
    } catch (e) { console.error(e); } finally { setAnalyzing(false); }
  };

  const handleGenerateRoadmap = async () => {
    setGeneratingRoadmap(true);
    try {
      const items = await generateSustainabilityRoadmap("Manufacturing");
      setRoadmap(items);
    } catch (e) { console.error(e); } finally { setGeneratingRoadmap(false); }
  };

  return (
    <div className="flex flex-col h-full gap-6 p-4 md:p-6 overflow-y-auto animate-in fade-in">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Industry Command Center</h1>
          <p className="text-slate-500 dark:text-slate-400">Carbon Accounting & Compliance</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Overview' },
            { id: 'analysis', icon: FileText, label: 'Report AI' },
            { id: 'roadmap', icon: TrendingUp, label: 'Roadmap' },
            { id: 'alerts', icon: Bell, label: 'Alerts' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2">
          {/* Scope Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Carbon Footprint</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePie>
                  <Pie data={scopeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {scopeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                </RePie>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
              {scopeData.map(d => (
                <div key={d.name} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emission Trends */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Emission Trends (tCO2e)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                  <Bar dataKey="emissions" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Total Emissions YTD</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">44,700 <span className="text-sm font-normal text-slate-500">tCO2e</span></p>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Reduction Target</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-2xl font-bold text-emerald-500">-12%</p>
                  <p className="text-xs text-slate-500 mb-1">vs 2023 baseline</p>
                </div>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Carbon Credits</p>
                <p className="text-2xl font-bold text-blue-500 dark:text-blue-400 mt-1">$124,500 <span className="text-sm font-normal text-slate-500">Est. Value</span></p>
             </div>
          </div>
        </div>
      )}

      {/* ANALYSIS TAB */}
      {activeTab === 'analysis' && (
        <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-2">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Upload size={20} className="text-blue-500" /> Upload & Analyze Report
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                 <div onClick={() => fileInputRef.current?.click()} className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <FileText className="text-slate-400 mb-2" size={32} />
                    <p className="text-sm text-slate-500 dark:text-slate-300">Drop PDF, CSV, Excel here</p>
                 </div>
                 <div className="flex-1 flex flex-col gap-2">
                    <textarea 
                      value={reportText} onChange={(e) => setReportText(e.target.value)}
                      placeholder="Or paste report text..."
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button 
                      onClick={handleAnalyze} disabled={analyzing || !reportText}
                      className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {analyzing ? <Loader2 className="animate-spin" size={16} /> : "Analyze Compliance"}
                    </button>
                 </div>
              </div>
           </div>

           {analyzing ? (
              <div className="grid gap-6">
                 <SkeletonCard />
              </div>
           ) : analysisResult && (
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Compliance Report Card</h3>
                      <p className="text-sm text-slate-500">Generated by Gemini 3 Pro</p>
                   </div>
                   <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-4xl font-bold ${
                      analysisResult.grade === 'A' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      analysisResult.grade === 'B' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                      'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                   }`}>
                      {analysisResult.grade}
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                      <h4 className="text-sm font-semibold text-blue-500 mb-2 uppercase">Key Findings</h4>
                      <ul className="list-disc pl-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                         {analysisResult.findings.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                      <h4 className="text-sm font-semibold text-emerald-500 mb-2 uppercase">Action Plan</h4>
                      <ul className="list-disc pl-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                         {analysisResult.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                   </div>
                </div>
             </div>
           )}
        </div>
      )}

      {/* ROADMAP TAB */}
      {activeTab === 'roadmap' && (
        <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-2">
           <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div>
                 <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sustainability Roadmap Generator</h2>
                 <p className="text-sm text-slate-500">Create a 5-year strategic plan</p>
              </div>
              <button 
                onClick={handleGenerateRoadmap} disabled={generatingRoadmap}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {generatingRoadmap ? <Loader2 className="animate-spin" size={16} /> : "Generate 5-Year Plan"}
              </button>
           </div>
           
           {generatingRoadmap ? (
              <div className="space-y-4">
                 {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
              </div>
           ) : roadmap.length > 0 && (
             <div className="space-y-4">
                {roadmap.map((item, i) => (
                   <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center relative overflow-hidden shadow-sm">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-emerald-500"></div>
                      <div className="min-w-[80px] text-center">
                         <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{item.year}</div>
                         <div className="text-xs text-slate-500">{item.quarter}</div>
                      </div>
                      <div className="flex-1">
                         <h4 className="font-semibold text-slate-800 dark:text-slate-200">{item.action}</h4>
                         <div className="flex gap-4 mt-2 text-xs">
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><DollarSign size={12}/> Inv: {item.investment}</span>
                            <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-1"><TrendingUp size={12}/> ROI: {item.roi}</span>
                         </div>
                      </div>
                      <div className="md:text-right text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                         Impact: {item.impact}
                      </div>
                   </div>
                ))}
             </div>
           )}
        </div>
      )}

      {/* ALERTS TAB */}
      {activeTab === 'alerts' && (
         <div className="space-y-4 animate-in slide-in-from-bottom-2">
            {alerts.map(alert => (
               <div key={alert.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className={`p-2 rounded-full ${
                     alert.type === 'Critical' ? 'bg-rose-100 text-rose-500 dark:bg-rose-500/20' :
                     alert.type === 'Warning' ? 'bg-amber-100 text-amber-500 dark:bg-amber-500/20' :
                     'bg-blue-100 text-blue-500 dark:bg-blue-500/20'
                  }`}>
                     <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between">
                        <h4 className="font-medium text-slate-900 dark:text-slate-200">{alert.msg}</h4>
                        <span className="text-xs text-slate-500">{alert.time}</span>
                     </div>
                     <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">{alert.type}</p>
                  </div>
                  <button className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-white underline">Resolve</button>
               </div>
            ))}
         </div>
      )}
    </div>
  );
};