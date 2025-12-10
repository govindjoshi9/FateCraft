import React, { useState } from 'react';
import { Database, PlayCircle, Info, X } from 'lucide-react';
import { AppMode } from '../types';

interface DemoControlsProps {
  currentMode: AppMode;
  onLoadDemoData: () => void;
  onSetMode: (mode: AppMode) => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({ currentMode, onLoadDemoData, onSetMode }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
    >
      <PlayCircle size={24} />
    </button>
  );

  return (
    <div className="fixed bottom-4 right-4 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-center p-3 border-b border-slate-800 bg-slate-800/50 rounded-t-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <PlayCircle size={16} className="text-emerald-400" /> Demo Controls
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={16}/></button>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <button 
            onClick={onLoadDemoData}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Database size={14} /> Load Realistic Data
          </button>
          <p className="text-[10px] text-slate-500 mt-1 text-center">Populates charts & reports</p>
        </div>

        <div className="border-t border-slate-800 pt-2">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Quick Scenarios</p>
          <div className="space-y-2">
            <button 
               onClick={() => onSetMode(AppMode.CITIZEN)}
               className="w-full text-left text-xs text-slate-300 hover:text-emerald-400 hover:bg-slate-800 p-2 rounded transition-colors flex items-center gap-2"
            >
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Citizen Future
            </button>
            <button 
               onClick={() => onSetMode(AppMode.INDUSTRY)}
               className="w-full text-left text-xs text-slate-300 hover:text-blue-400 hover:bg-slate-800 p-2 rounded transition-colors flex items-center gap-2"
            >
               <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Compliance Check
            </button>
            <button 
               onClick={() => onSetMode(AppMode.GOVERNMENT)}
               className="w-full text-left text-xs text-slate-300 hover:text-purple-400 hover:bg-slate-800 p-2 rounded transition-colors flex items-center gap-2"
            >
               <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Policy Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};