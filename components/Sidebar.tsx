import React, { useState } from 'react';
import { Leaf, Building2, Landmark, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { AppMode, UserRole } from '../types';
import { supabase } from '../services/supabase';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  user?: any;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, user, onOpenSettings }) => {
  const userRole = user?.user_metadata?.role || UserRole.CITIZEN;

  const allNavItems = [
    { mode: AppMode.CITIZEN, label: 'Citizen Mode', icon: Leaf, color: 'text-emerald-500', allowedRoles: [UserRole.CITIZEN, UserRole.INDUSTRY, UserRole.GOVERNMENT] },
    { mode: AppMode.INDUSTRY, label: 'Industry Mode', icon: Building2, color: 'text-blue-500', allowedRoles: [UserRole.INDUSTRY, UserRole.GOVERNMENT] },
    { mode: AppMode.GOVERNMENT, label: 'Government Mode', icon: Landmark, color: 'text-purple-500', allowedRoles: [UserRole.GOVERNMENT] },
  ];

  const visibleNavItems = allNavItems.filter(item => item.allowedRoles.includes(userRole));

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="w-full md:w-[250px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 transition-colors duration-300">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-600 dark:from-emerald-400 dark:to-cyan-500">
          FateCraft
        </h1>
        <p className="text-xs text-slate-500 mt-1">Personal Climate Strategist</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {visibleNavItems.map((item) => {
          const isActive = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none
                ${isActive 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon 
                size={20} 
                className={`transition-colors ${isActive ? item.color : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} 
              />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className={`ml-auto w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
        >
          <SettingsIcon size={16} />
          <span>Settings</span>
        </button>

        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 group relative">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-[10px] text-slate-500 truncate capitalize">
              {userRole}
            </p>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1" 
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};