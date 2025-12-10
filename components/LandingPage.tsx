import React from 'react';
import { ArrowRight, Leaf, Building2, Landmark, AlertTriangle, Eye, Trophy, Users, Zap, CheckCircle, Github, Play } from 'lucide-react';

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
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700"
          >
            Sign In / Demo
          </button>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-4 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-[5000ms]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Powered by Gemini 3 Pro
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 leading-tight">
            FateCraft: Your Personal <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">Climate Strategist</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 leading-relaxed font-light">
            See your future. Take Action. Save the Planet. <br/>
            An AI-powered command center for citizens, industry, and government.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
            >
              Try Demo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2">
              <Play size={20} className="fill-current" /> Watch Video
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2">
              <Github size={20} /> GitHub
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-slate-900/50 backdrop-blur-md border border-slate-800/50 rounded-2xl max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 delay-300">
             <div>
                <p className="text-3xl font-bold text-white">10,000+</p>
                <p className="text-sm text-slate-500 uppercase tracking-wide">Users Active</p>
             </div>
             <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-slate-500 uppercase tracking-wide">Policies Simulated</p>
             </div>
             <div>
                <p className="text-3xl font-bold text-white">50k Tons</p>
                <p className="text-sm text-slate-500 uppercase tracking-wide">CO2 Reduced</p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="py-24 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why FateCraft?</h2>
             <p className="text-slate-400">Comprehensive tools for a changing world.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
               <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                  <Eye size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">AI-Powered Future</h3>
               <p className="text-slate-400 leading-relaxed">
                  Upload a photo to see a personalized, scientifically-grounded narrative of your life in 2050 based on local climate data.
               </p>
            </div>
            
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all group">
               <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                  <Trophy size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Gamified Action</h3>
               <p className="text-slate-400 leading-relaxed">
                  Turn anxiety into action. Complete daily challenges, earn Carbon Credits, compete on leaderboards, and unlock rewards.
               </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all group">
               <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <Users size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Multi-Role Platform</h3>
               <p className="text-slate-400 leading-relaxed">
                  Whether you're a concerned citizen, a factory manager, or a policy maker, FateCraft has tailored tools for your impact.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-24 bg-slate-900/50">
         <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
               {[
                  { step: "01", title: "Upload Photo", desc: "AI analyzes your demographics & location" },
                  { step: "02", title: "Get Future Story", desc: "Receive a personalized 2050 narrative" },
                  { step: "03", title: "Take Action", desc: "Complete specific challenges & earn credits" },
                  { step: "04", title: "Track Impact", desc: "Visualize your CO2 reduction in real-time" },
               ].map((item, i) => (
                  <div key={i} className="relative">
                     <div className="text-6xl font-bold text-slate-800 mb-4 opacity-50">{item.step}</div>
                     <h3 className="text-xl font-bold text-emerald-400 mb-2">{item.title}</h3>
                     <p className="text-slate-400 text-sm">{item.desc}</p>
                     {i < 3 && <div className="hidden md:block absolute top-10 -right-4 text-slate-700"><ArrowRight /></div>}
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. DEMO PREVIEW SECTION (Static Representation) */}
      <section className="py-24 px-4 bg-slate-950">
         <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Experience the Platform</h2>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-2 shadow-2xl overflow-hidden relative">
               <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900">
                  <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 bg-slate-800 rounded-md text-xs text-slate-500 flex-1 text-left">fatecraft.app/dashboard</div>
               </div>
               {/* Mock UI Content */}
               <div className="grid grid-cols-12 h-[500px] text-left">
                  {/* Mock Sidebar */}
                  <div className="col-span-3 bg-slate-900 border-r border-slate-800 p-4 hidden md:block">
                     <div className="space-y-4">
                        <div className="h-8 bg-slate-800 rounded w-3/4"></div>
                        <div className="space-y-2 pt-4">
                           <div className="h-10 bg-slate-800 rounded flex items-center px-3 border-l-2 border-emerald-500"><span className="text-emerald-400 text-sm font-bold">Citizen Mode</span></div>
                           <div className="h-10 bg-transparent rounded flex items-center px-3"><span className="text-slate-500 text-sm">Industry Mode</span></div>
                           <div className="h-10 bg-transparent rounded flex items-center px-3"><span className="text-slate-500 text-sm">Government Mode</span></div>
                        </div>
                     </div>
                  </div>
                  {/* Mock Main Content */}
                  <div className="col-span-12 md:col-span-9 bg-slate-950 p-6">
                     <div className="grid grid-cols-2 gap-6 h-full">
                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                           <div className="h-6 w-1/2 bg-slate-800 rounded mb-4"></div>
                           <div className="h-32 bg-slate-800/50 rounded flex items-center justify-center">
                              <Eye className="text-slate-700" size={32} />
                           </div>
                        </div>
                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                           <div className="flex justify-between mb-4">
                              <div className="h-6 w-1/3 bg-slate-800 rounded"></div>
                              <div className="h-6 w-1/4 bg-emerald-500/20 rounded"></div>
                           </div>
                           <div className="space-y-2">
                              <div className="h-12 bg-slate-800/50 rounded"></div>
                              <div className="h-12 bg-slate-800/50 rounded"></div>
                              <div className="h-12 bg-slate-800/50 rounded"></div>
                           </div>
                        </div>
                        <div className="col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-4 mt-auto h-40">
                            <div className="h-6 w-1/4 bg-slate-800 rounded mb-4"></div>
                            <div className="h-full w-full flex items-end justify-between px-4 pb-2">
                               {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
                                  <div key={i} className="w-8 bg-emerald-500/20 rounded-t" style={{height: `${h}%`}}></div>
                               ))}
                            </div>
                        </div>
                     </div>
                  </div>
               </div>
               {/* Overlay Button */}
               <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center group cursor-pointer" onClick={onGetStarted}>
                  <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full shadow-2xl transform group-hover:scale-110 transition-all flex items-center gap-2">
                     Launch Full App <ArrowRight />
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* 5. TECH STACK */}
      <section className="py-20 bg-slate-900 border-y border-slate-800">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-10">Powered By Modern Tech</h3>
            <div className="flex flex-wrap justify-center gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
               {["Gemini 3 Pro", "React 18", "Supabase", "Tailwind CSS", "Recharts"].map((tech) => (
                  <span key={tech} className="text-xl font-bold text-slate-300">{tech}</span>
               ))}
            </div>
         </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-24 px-4 bg-slate-950">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-16">Community Impact</h2>
            <div className="grid md:grid-cols-3 gap-8">
               {[
                  { name: "Sarah J.", role: "Citizen", quote: "Seeing my future self in 2050 was a wake-up call. I've reduced my carbon footprint by 20% in just two months!" },
                  { name: "EcoFab Inc.", role: "Industry Partner", quote: "The compliance dashboard saved us weeks of reporting time and helped us identify key areas for emission reduction." },
                  { name: "Mayor's Office", role: "Government", quote: "Simulating policy impacts before implementation has revolutionized our city planning. A game changer." }
               ].map((t, i) => (
                  <div key={i} className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                     <div className="flex items-center gap-1 mb-4">
                        {[1,2,3,4,5].map(s => <Zap key={s} size={16} className="text-yellow-500 fill-current" />)}
                     </div>
                     <p className="text-slate-300 mb-6 italic">"{t.quote}"</p>
                     <div>
                        <p className="font-bold text-white">{t.name}</p>
                        <p className="text-xs text-slate-500 uppercase">{t.role}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-xl font-bold text-slate-200">FateCraft</span>
            <p className="text-slate-500 text-sm mt-1">Built for Google DeepMind Hackathon 2024</p>
          </div>
          
          <div className="flex gap-8">
             <a href="#" className="text-slate-400 hover:text-white transition-colors">About</a>
             <a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a>
             <a href="#" className="text-slate-400 hover:text-white transition-colors">Demo</a>
             <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex gap-4">
             <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer">
                <Github size={16} />
             </div>
             {/* Hackathon Badge Mockup */}
             <div className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-xs font-bold text-white">
                #BuildWithGemini
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};