import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Loader2, Mail, Lock, ArrowRight, AlertCircle, ArrowLeft, Building, User, Landmark } from 'lucide-react';
import { UserRole } from '../types';

interface AuthProps {
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (view === 'sign_up') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role }
          }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = (type: UserRole) => {
    if (type === UserRole.CITIZEN) {
      setEmail('demo@citizen.com');
      setPassword('citizen123');
    } else if (type === UserRole.INDUSTRY) {
      setEmail('demo@industry.com');
      setPassword('industry123');
    } else {
      setEmail('demo@gov.com');
      setPassword('gov123');
    }
    setView('sign_in');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 text-slate-500 hover:text-slate-300 transition-colors p-2 rounded-full hover:bg-slate-800 group"
          title="Back to Home"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 mb-2">
            FateCraft
          </h1>
          <p className="text-slate-400">Access Your Dashboard</p>
        </div>

        <div className="flex gap-4 mb-6 p-1 bg-slate-800 rounded-lg">
          <button
            onClick={() => { setView('sign_in'); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              view === 'sign_in' 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setView('sign_up'); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              view === 'sign_up' 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2 text-rose-400 text-sm animate-in slide-in-from-top-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {view === 'sign_up' && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-medium text-slate-400 ml-1">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { r: UserRole.CITIZEN, icon: User, label: "Citizen" },
                  { r: UserRole.INDUSTRY, icon: Building, label: "Industry" },
                  { r: UserRole.GOVERNMENT, icon: Landmark, label: "Gov" }
                ].map((item) => (
                  <button
                    key={item.r}
                    type="button"
                    onClick={() => setRole(item.r)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                      role === item.r 
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'
                    }`}
                  >
                    <item.icon size={16} className="mb-1" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                {view === 'sign_in' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        {view === 'sign_in' && (
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center mb-3 uppercase tracking-wider">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => fillDemoCreds(UserRole.CITIZEN)} className="text-[10px] py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">Citizen</button>
              <button onClick={() => fillDemoCreds(UserRole.INDUSTRY)} className="text-[10px] py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">Industry</button>
              <button onClick={() => fillDemoCreds(UserRole.GOVERNMENT)} className="text-[10px] py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">Gov</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};