import React from 'react';
import { ArrowRight, Leaf, Building2, Landmark, AlertTriangle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
              FateCraft
            </span>
          </div>
          <button 
            onClick={onGetStarted}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 hover:bg-slate-800 rounded-lg"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI-Powered Climate Strategist
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 leading-tight">
            Shape Your Future <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400">Before It Shapes You.</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 leading-relaxed">
            The climate is changing. Are you? FateCraft combines advanced AI projection with personal, industrial, and governmental strategy tools to navigate the crises of tomorrow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
            >
              Start Your Journey <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* The Reality Check (Consequences) */}
      <section className="py-24 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                The Cost of <span className="text-rose-500">Inaction</span>
              </h2>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                By 2050, without strategic intervention, we face a world transformed. Rising sea levels, extreme heatwaves, and resource scarcity aren't just headlines—they are the future reality for billions.
              </p>
              <ul className="space-y-4">
                {[
                  "Global GDP loss projected at 18% by 2050",
                  "1.2 billion climate refugees expected",
                  "Irreversible biodiversity loss and ecosystem collapse"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <div className="mt-1 bg-rose-500/10 p-1 rounded">
                      <AlertTriangle className="text-rose-500 shrink-0" size={16} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden border border-slate-700 group shadow-2xl">
              {/* Abstract ominous visualization */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-rose-600/20 rounded-full blur-[80px] animate-pulse" />
              </div>
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <div className="bg-slate-950/80 backdrop-blur-md p-6 rounded-xl border border-slate-700 border-l-4 border-l-rose-500">
                   <h3 className="text-lg font-bold text-slate-100 mb-2">Scenario: Business as Usual</h3>
                   <p className="text-slate-400 text-sm">Temperature rise > 2.5°C. Critical infrastructure failure likely in coastal regions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="py-24 px-4 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Unified Strategy for a Complex World</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              FateCraft isn't just a tracker. It's a comprehensive command center for every level of society.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                <Leaf size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Citizen Mode</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Personalized AI narratives show your specific future. Track carbon credits, adapt your lifestyle, and protect your family's wellbeing against climate risks.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Building2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Industry Mode</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Analyze emissions reports instantly with GenAI. Ensure regulatory compliance, optimize supply chains, and lead the green transition with data-driven insights.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                <Landmark size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Government Mode</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Simulate policy impacts before implementation. Monitor regional data, predict economic outcomes, and secure public health with predictive modeling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-emerald-400 font-bold tracking-widest uppercase mb-4">Our Motto</p>
          <h2 className="text-3xl md:text-5xl font-serif italic text-slate-200 mb-8">
            "Every action creates ripples. <br/> Design your fate."
          </h2>
          <button 
            onClick={onGetStarted}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-colors border border-slate-700"
          >
            Join the Movement
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-200">FateCraft</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 FateCraft. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
