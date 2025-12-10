import React, { useState } from 'react';
import { Map, Loader2, Activity, Users, TrendingUp, FileText, AlertCircle, X } from 'lucide-react';
import { simulatePolicy, generateExecutiveReport } from '../services/geminiService';
import { PolicySimulation } from '../types';

export const GovernmentLayout = () => {
  const [policy, setPolicy] = useState('');
  const [region, setRegion] = useState('California');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PolicySimulation | null>(null);
  
  // Report State
  const [reportOpen, setReportOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportContent, setReportContent] = useState('');

  const handleSimulation = async () => {
    if (!policy.trim()) return;
    
    // Simple confirmation dialog
    if (!window.confirm("Simulation may take 10-15 seconds. Proceed?")) return;

    setLoading(true);
    setResults(null);
    try {
      const data = await simulatePolicy(policy, region);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setReportOpen(true);
    setReportLoading(true);
    setReportContent('');
    
    try {
      const content = await generateExecutiveReport(region, policy);
      setReportContent(content);
    } catch (e) {
      setReportContent('<p>Failed to generate report.</p>');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 p-4 md:p-6 overflow-y-auto animate-in fade-in duration-500 relative">
      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95">
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                 <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <FileText size={18} className="text-purple-400" />
                    Executive Climate Report
                 </h2>
                 <button 
                  onClick={() => setReportOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                    <X size={20} />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                 {reportLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                       <Loader2 size={32} className="animate-spin mb-3 text-purple-500" />
                       <p>Generating executive summary...</p>
                    </div>
                 ) : (
                    <div 
                      className="prose prose-invert prose-sm max-w-none 
                        prose-h3:text-purple-400 prose-h3:text-sm prose-h3:uppercase prose-h3:tracking-wide prose-h3:mt-6 prose-h3:mb-2
                        prose-li:text-slate-300 prose-p:text-slate-300"
                      dangerouslySetInnerHTML={{ __html: reportContent }} 
                    />
                 )}
              </div>
              <div className="p-4 border-t border-slate-800 flex justify-end">
                 <button 
                    onClick={() => setReportOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
                 >
                    Close
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex-none">
        <h1 className="text-2xl font-bold text-slate-100">Regional Climate Command Center</h1>
        <p className="text-slate-400 text-sm md:text-base">Monitor policy impact and industry compliance</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
        
        {/* LEFT COLUMN: Policy Simulator */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-purple-400" size={20} />
            <h2 className="text-lg font-semibold text-slate-100">Policy Impact Calculator</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1.5 block">Select Region</label>
              <select 
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm md:text-base"
              >
                <option>California</option>
                <option>Texas</option>
                <option>New York</option>
                <option>Florida</option>
                <option>Washington</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1.5 block">Policy Description</label>
              <textarea 
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                placeholder="e.g., All public buses electric by 2030..."
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none text-sm md:text-base"
              />
            </div>

            <button
              onClick={handleSimulation}
              disabled={!policy.trim() || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Running Simulation...
                </>
              ) : (
                "Run Simulation"
              )}
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 mt-4 border-t border-slate-800 pt-4 overflow-y-auto">
             {results ? (
               <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-sm text-purple-400 font-semibold uppercase tracking-wide mb-3">Projected Impact (2030)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                       <p className="text-xs text-slate-400 mb-1">CO2 Reduction</p>
                       <p className="text-lg font-bold text-emerald-400">{results.co2Reduction}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                       <p className="text-xs text-slate-400 mb-1">Implementation Cost</p>
                       <p className="text-lg font-bold text-rose-400">{results.cost}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                       <p className="text-xs text-slate-400 mb-1">Economic Impact</p>
                       <p className="text-lg font-bold text-blue-400">{results.economicImpact}</p>
                    </div>
                     <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                       <p className="text-xs text-slate-400 mb-1">Job Creation</p>
                       <p className="text-lg font-bold text-amber-400">{results.jobCreation}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 mt-2">
                     <p className="text-xs text-slate-400 mb-1">Health Benefits</p>
                     <p className="text-sm font-medium text-slate-200">{results.healthBenefits}</p>
                  </div>
               </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                   <Activity size={32} className="mb-2 opacity-20" />
                   <p className="text-sm text-center">Run a simulation to see projected impacts</p>
                </div>
             )}
          </div>
        </div>

        {/* RIGHT COLUMN: Regional Overview */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Map className="text-blue-400" size={20} />
              <h2 className="text-lg font-semibold text-slate-100">Regional Overview</h2>
            </div>
            <button 
              onClick={handleGenerateReport}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
               <FileText size={12} /> Generate Executive Report
            </button>
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-48 md:h-64 bg-slate-800/50 rounded-xl border border-slate-700 relative overflow-hidden group">
             <div className="absolute inset-0 flex items-center justify-center">
                <Map size={48} className="text-slate-700" />
             </div>
             {/* Abstract map dots */}
             <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
             <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_15px_#f59e0b]"></div>
             <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-slate-400 text-xs font-bold uppercase">Regional Emissions</span>
                   <TrendingUp size={16} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 group-hover:scale-105 transition-transform origin-left">245.8 MT</h3>
                <p className="text-xs text-slate-500 mt-1">CO2 Equivalent (2024)</p>
             </div>
             
             <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-slate-400 text-xs font-bold uppercase">Compliance Rate</span>
                   <Activity size={16} className="text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 group-hover:scale-105 transition-transform origin-left">87.4%</h3>
                <p className="text-xs text-slate-500 mt-1">Industry Standard</p>
             </div>
          </div>

          <div className="space-y-3 mt-2">
             <div className="bg-slate-800/20 p-3 rounded-lg border border-slate-700/30 flex items-center justify-between">
                <div>
                   <p className="text-xs text-slate-400 font-medium">Top Performing Sector</p>
                   <p className="text-sm font-bold text-emerald-400">Renewable Energy</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                   <Users size={16} />
                </div>
             </div>

             <div className="bg-slate-800/20 p-3 rounded-lg border border-slate-700/30 flex items-center justify-between">
                <div>
                   <p className="text-xs text-slate-400 font-medium">Most Non-Compliant</p>
                   <p className="text-sm font-bold text-rose-400">Heavy Manufacturing</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                   <AlertCircle size={16} />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};