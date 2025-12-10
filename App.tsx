import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainLayout } from './components/MainLayout';
import { Auth } from './components/Auth';
import { LandingPage } from './components/LandingPage';
import { AppMode } from './types';
import { Menu, X, Loader2 } from 'lucide-react';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  
  const [mode, setMode] = useState<AppMode>(AppMode.CITIZEN);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Swipe logic
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const modes = [AppMode.CITIZEN, AppMode.INDUSTRY, AppMode.GOVERNMENT];
    const currentIndex = modes.indexOf(mode);

    if (isLeftSwipe) {
      // Next Mode
      if (currentIndex < modes.length - 1) {
        setMode(modes[currentIndex + 1]);
      }
    } else if (isRightSwipe) {
      // Previous Mode
      if (currentIndex > 0) {
        setMode(modes[currentIndex - 1]);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  // Not authenticated flow
  if (!session) {
    if (showAuth) {
      return <Auth onBack={() => setShowAuth(false)} />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // Main Dashboard (Authenticated)
  return (
    <div 
      className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-emerald-500/30"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
         <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">FateCraft</span>
         <button 
           onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
           className="text-slate-300 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
         >
            {mobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/90 md:hidden pt-16 animate-in fade-in duration-200">
           <div className="h-full" onClick={(e) => e.stopPropagation()}>
             <Sidebar currentMode={mode} setMode={(m) => { setMode(m); setMobileMenuOpen(false); }} user={session.user} />
           </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-none h-full">
        <Sidebar currentMode={mode} setMode={setMode} user={session.user} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full relative pt-16 md:pt-0 overflow-hidden transition-all duration-300">
        {/* Background ambient light */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none -z-10"></div>
        
        <MainLayout mode={mode} />
      </main>
    </div>
  );
};

export default App;
