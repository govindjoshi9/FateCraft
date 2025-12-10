import React from 'react';
import { Leaf, Building2, Landmark, User, Settings, LogOut } from 'lucide-react';
import { AppMode } from '../types';
import { supabase } from '../services/supabase';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  user?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, user }) => {
  const navItems = [
    { mode: AppMode.CITIZEN, label: 'Citizen Mode', icon: Leaf, color: 'text-emerald-500' },
    { mode: AppMode.INDUSTRY, label: 'Industry Mode', icon: Building2, color: 'text-blue-500' },
    { mode: AppMode.GOVERNMENT, label: 'Government Mode', icon: Landmark, color: 'text-purple-500' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="w-full md:w-[250px] bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
          FateCraft
        </h1>
        <p className="text-xs text-slate-500 mt-1">Personal Climate Strategist</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-slate-800 text-slate-100 shadow-lg shadow-slate-900/50 ring-1 ring-slate-700' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              <item.icon 
                size={20} 
                className={`transition-colors ${isActive ? item.color : 'text-slate-500 group-hover:text-slate-300'}`} 
              />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className={`ml-auto w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-800/30 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-[10px] text-slate-500 truncate" title={user?.email}>
              {user?.email || 'Guest'}
            </p>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-slate-500 hover:text-rose-400 transition-colors p-1" 
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};