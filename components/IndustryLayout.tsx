import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertTriangle, CheckCircle, XCircle, Plus, Download, Factory } from 'lucide-react';
import { analyzeIndustryReport } from '../services/geminiService';
import { IndustryAnalysis, Facility } from '../types';

const INITIAL_FACILITIES: Facility[] = [
  { id: '1', name: 'North America Plant A', emissions: 12450, target: 12000, status: 'Warning', score: 72 },
  { id: '2', name: 'European Operations Hub', emissions: 5200, target: 6000, status: 'Compliant', score: 94 },
  { id: '3', name: 'Asia-Pacific Logistics', emissions: 18100, target: 15000, status: 'Non-Compliant', score: 45 },
];

export const IndustryLayout = () => {
  const [reportText, setReportText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<IndustryAnalysis | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setReportText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!reportText.trim()) return;
    setAnalyzing(true);
    try {
      const data = await analyzeIndustryReport(reportText);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddFacility = () => {
    const id = Date.now().toString();
    const newFacility: Facility = {
      id,
      name: `New Facility #${facilities.length + 1}`,
      emissions: Math.floor(Math.random() * 10000) + 5000,
      target: 10000,
      status: Math.random() > 0.6 ? 'Compliant' : Math.random() > 0.3 ? 'Warning' : 'Non-Compliant',
      score: Math.floor(Math.random() * 40) + 60
    };
    setFacilities([...facilities, newFacility]);
  };

  const handleExport = () => {
    const headers = ["Facility Name", "Emissions", "Target", "Status", "Score"];
    const rows = facilities.map(f => [f.name, f.emissions, f.target, f.status, f.score]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "compliance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'text-emerald-400';
      case 'Warning': return 'text-amber-400';
      case 'Non-Compliant': return 'text-rose-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Compliant': return <CheckCircle size={24} className="text-emerald-400" />;
      case 'Warning': return <AlertTriangle size={24} className="text-amber-400" />;
      case 'Non-Compliant': return <XCircle size={24} className="text-rose-400" />;
      default: return <AlertTriangle size={24} className="text-slate-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/50';
    if (score >= 50) return 'text-amber-400 border-amber-500/50';
    return 'text-rose-400 border-rose-500/50';
  };

  return (
    <div className="flex flex-col h-full gap-6 p-4 md:p-6 overflow-y-auto">
      {/* HEADER */}
      <div className="flex-none">
        <h1 className="text-2xl font-bold text-slate-100">Industry Compliance Dashboard</h1>
        <p className="text-slate-400">Monitor emissions and ensure regulatory compliance</p>
      </div>

      {/* SECTION 1: Upload & Analyze */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Upload size={20} className="text-blue-400" />
          Upload Emission Report
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* File Drop Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors flex flex-col items-center justify-center p-8 cursor-pointer group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept=".txt,.csv,.json"
              className="hidden" 
            />
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="text-slate-400 group-hover:text-blue-400" />
            </div>
            <p className="text-sm font-medium text-slate-300">Click to upload report</p>
            <p className="text-xs text-slate-500 mt-1">PDF, TXT, CSV up to 10MB</p>
          </div>

          {/* Text Input Area */}
          <div className="flex-1 flex flex-col gap-3">
             <textarea 
               value={reportText}
               onChange={(e) => setReportText(e.target.value)}
               placeholder="Or paste report text here for instant analysis..."
               className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
             />
             <button
               onClick={handleAnalyze}
               disabled={!reportText.trim() || analyzing}
               className="self-end bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {analyzing ? (
                 <>
                   <Loader2 size={18} className="animate-spin" />
                   AI Analyzing...
                 </>
               ) : (
                 "Analyze with AI"
               )}
             </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Compliance Results (Conditional) */}
      {results && (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-100">Compliance Analysis</h2>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm font-medium ${getStatusColor(results.status)}`}>
              {getStatusIcon(results.status)}
              {results.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
             {/* Score */}
             <div className="flex flex-col items-center justify-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-2 ${getScoreColor(results.score)}`}>
                   <span className="text-2xl font-bold text-slate-100">{results.score}</span>
                </div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Overall Score</span>
             </div>

             {/* Stats */}
             <div className="md:col-span-3 grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                   <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Total Emissions</p>
                   <p className="text-2xl font-bold text-slate-100">{results.totalEmissions}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                   <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Year-over-Year</p>
                   <p className={`text-2xl font-bold ${results.yoyChange.includes('-') ? 'text-emerald-400' : 'text-rose-400'}`}>
                     {results.yoyChange}
                   </p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
               <h3 className="text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wide">Key Findings</h3>
               <ul className="space-y-2">
                 {results.findings.map((finding, i) => (
                   <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                     <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                     {finding}
                   </li>
                 ))}
               </ul>
             </div>
             <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
               <h3 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wide">Recommended Actions</h3>
               <ul className="space-y-2">
                 {results.recommendations.map((rec, i) => (
                   <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                     <CheckCircle size={14} className="mt-1 text-emerald-500 shrink-0" />
                     {rec}
                   </li>
                 ))}
               </ul>
             </div>
          </div>
        </section>
      )}

      {/* SECTION 3: Facility Comparison */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex-1 min-h-0 flex flex-col">
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Facility Comparison</h2>
            <div className="flex gap-2">
               <button 
                onClick={handleExport}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1">
                  <Download size={14} /> Export
               </button>
               <button 
                onClick={handleAddFacility}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors flex items-center gap-1">
                  <Plus size={14} /> Add Facility
               </button>
            </div>
         </div>

         <div className="flex-1 overflow-x-auto rounded-xl border border-slate-700/50">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                     <th className="p-4 font-semibold">Facility Name</th>
                     <th className="p-4 font-semibold">Emissions (tCO2e)</th>
                     <th className="p-4 font-semibold">Target</th>
                     <th className="p-4 font-semibold">Status</th>
                     <th className="p-4 font-semibold text-right">Score</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800">
                  {facilities.map((facility) => (
                    <tr key={facility.id} className="bg-slate-900 hover:bg-slate-800/30 transition-colors">
                       <td className="p-4 text-sm font-medium text-slate-200 flex items-center gap-2">
                          <Factory size={16} className="text-slate-500" />
                          {facility.name}
                       </td>
                       <td className="p-4 text-sm text-slate-300">{facility.emissions.toLocaleString()}</td>
                       <td className="p-4 text-sm text-slate-400">{facility.target.toLocaleString()}</td>
                       <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            facility.status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            facility.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {facility.status.toUpperCase()}
                          </span>
                       </td>
                       <td className="p-4 text-sm text-right font-medium text-slate-200">{facility.score}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
};