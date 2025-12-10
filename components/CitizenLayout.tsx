import React, { useState, useRef } from 'react';
import { 
  Camera, Share2, Utensils, Bike, Lightbulb, Thermometer, 
  Megaphone, Sprout, Check, Loader2, Sparkles
} from 'lucide-react';
import { generatePersonalizedFuture } from '../services/geminiService';
import { ImpactDashboard } from './ImpactDashboard';
import { Skeleton, SkeletonCard } from './ui/Skeleton';

// Predefined actions for Citizen mode
const CITIZEN_ACTIONS = [
  { id: 'food', title: "Meatless Monday", credits: 15, icon: Utensils, desc: "Go plant-based for one day" },
  { id: 'transport', title: "Bike Commute", credits: 35, icon: Bike, desc: "Replace car with bike (min 5km)" },
  { id: 'energy', title: "LED Switch", credits: 50, icon: Lightbulb, desc: "Replace 5 bulbs with LEDs" },
  { id: 'home', title: "Smart Thermostat", credits: 200, icon: Thermometer, desc: "Install programmable thermostat" },
  { id: 'advocacy', title: "Sign Petition", credits: 25, icon: Megaphone, desc: "Support local green policy" },
  { id: 'community', title: "Tree Planting", credits: 100, icon: Sprout, desc: "Join local planting event" },
];

export const CitizenLayout = () => {
  const [location, setLocation] = useState('New York, NY');
  const [completedActionIds, setCompletedActionIds] = useState<Set<string>>(new Set());
  
  // Personal Future State
  const [userImage, setUserImage] = useState<string | null>(null);
  const [age, setAge] = useState<string>('');
  const [lifestyle, setLifestyle] = useState<string>('Urban professional');
  const [personalResult, setPersonalResult] = useState<string | null>(null);
  const [processingPersonal, setProcessingPersonal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const NEXT_GOAL = 1000;
  const accent = 'emerald';

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePersonal = async () => {
    if (!userImage) {
        showNotification("Please upload a photo first");
        return;
    }
    if (!age || !location) {
        showNotification("Please fill in all fields");
        return;
    }
    
    if (!window.confirm("This will use AI to create your personalized climate story. Proceed?")) return;

    setProcessingPersonal(true);
    try {
      const result = await generatePersonalizedFuture(userImage, age, location, lifestyle);
      setPersonalResult(result);
    } catch (error) {
      console.error(error);
      showNotification("Error generating future. Please try again.");
    } finally {
      setProcessingPersonal(false);
    }
  };

  const toggleAction = (id: string, credits: number) => {
    setCompletedActionIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        showNotification(`Action completed! +${credits} credits earned`);
      }
      return newSet;
    });
  };

  const currentCredits = CITIZEN_ACTIONS.reduce((total, action) => {
    return total + (completedActionIds.has(action.id) ? action.credits : 0);
  }, 0);

  const progressPercentage = Math.min((currentCredits / NEXT_GOAL) * 100, 100);

  return (
    <div className="h-full flex flex-col p-4 md:p-6 gap-4 md:gap-6 overflow-y-auto animate-in fade-in duration-500 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-xl border border-emerald-500/50 z-50 animate-in slide-in-from-top-2 fade-in flex items-center gap-2">
           <Sparkles size={16} className="text-yellow-400 animate-pulse" />
           <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* SECTION 1: Your Climate Future */}
      <section className={`flex-none min-h-[400px] md:min-h-[350px] md:h-[40%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group transition-colors shadow-sm`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 -z-10 transition-colors"></div>
        <div className={`absolute -top-20 -right-20 w-64 h-64 bg-${accent}-500/10 rounded-full blur-3xl`}></div>

        <div className="flex flex-col h-full z-10 relative">
          
          {!personalResult ? (
            <div className="flex flex-col h-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">See Your 2050 Future</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Upload a photo to see how climate change will affect you personally</p>
              </div>

              <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center overflow-y-auto">
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-${accent}-500 flex items-center justify-center cursor-pointer transition-all bg-slate-50 dark:bg-slate-800/50 overflow-hidden group/upload relative shadow-md`}
                  >
                    {userImage ? (
                      <img src={userImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 dark:text-slate-500 group-hover/upload:text-slate-600 dark:group-hover/upload:text-slate-300">
                        <Camera size={32} />
                        <span className="text-xs mt-2">Upload Photo</span>
                      </div>
                    )}
                    {userImage && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                        <span className="text-xs text-white">Change</span>
                      </div>
                    )}
                  </div>
                </div>

                {userImage && (
                  <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">Current Age</label>
                          <input 
                            type="number" value={age} onChange={(e) => setAge(e.target.value)}
                            placeholder="e.g. 28"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">Location</label>
                          <input 
                            type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, Country"
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                          />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">Lifestyle</label>
                        <select 
                          value={lifestyle} onChange={(e) => setLifestyle(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                        >
                          <option>Urban professional</option>
                          <option>Suburban family</option>
                          <option>Rural community</option>
                          <option>Student</option>
                        </select>
                     </div>
                     <button 
                        onClick={handleGeneratePersonal} disabled={!age || processingPersonal}
                        className={`w-full mt-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium py-3 rounded-lg shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 ${processingPersonal ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                     >
                        {processingPersonal ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Analyzing Future...
                          </>
                        ) : (
                          "Generate My Climate Future"
                        )}
                     </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
               {processingPersonal ? (
                  <div className="h-full flex flex-col gap-4 p-4">
                     <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-6 w-48" />
                           <Skeleton className="h-4 w-32" />
                        </div>
                     </div>
                     <Skeleton className="h-4 w-full mt-4" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-5/6" />
                     <Skeleton className="h-32 w-full mt-4" />
                  </div>
               ) : (
                 <>
                  <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                      <div className="flex items-center gap-4">
                        {userImage && <img src={userImage} alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50" />}
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Your Climate Future in 2050</h3>
                          <p className="text-xs text-slate-500">Based on IPCC projections for {location}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"><Share2 size={18} /></button>
                        <button onClick={() => setPersonalResult(null)} className="text-xs text-slate-500 hover:text-emerald-500 underline px-2">Start Over</button>
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      <div className="prose prose-sm max-w-none dark:prose-invert prose-h3:text-emerald-600 dark:prose-h3:text-emerald-400 prose-p:text-slate-600 dark:prose-p:text-slate-300" dangerouslySetInnerHTML={{ __html: personalResult }} />
                  </div>
                 </>
               )}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: Take Action */}
      <section className="flex-none min-h-[300px] md:h-[35%] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 gap-4 shadow-sm transition-colors">
         <div className="flex-none">
            <div className="flex justify-between items-end mb-2">
               <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your Climate Actions</h2>
                  <p className="text-sm text-slate-500">Complete actions, earn Carbon Credits</p>
               </div>
               <div className="text-right">
                  <span className={`text-xl font-bold text-${accent}-500 animate-pulse`}>{currentCredits}</span>
                  <span className="text-sm text-slate-500"> / {NEXT_GOAL} Credits</span>
               </div>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div className={`h-full bg-gradient-to-r from-${accent}-600 to-${accent}-400 transition-all duration-1000 ease-out`} style={{ width: `${progressPercentage}%` }} />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
               {CITIZEN_ACTIONS.map((action) => {
                  const isCompleted = completedActionIds.has(action.id);
                  return (
                     <div key={action.id} className={`relative flex flex-col p-4 rounded-xl border transition-all duration-300 transform ${isCompleted ? `bg-${accent}-50 dark:bg-${accent}-900/10 border-${accent}-200 dark:border-${accent}-500/30` : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 hover:shadow-md'}`}>
                        <div className="flex items-start justify-between mb-3">
                           <div className={`p-2 rounded-lg transition-colors ${isCompleted ? `bg-${accent}-100 dark:bg-${accent}-500/20 text-${accent}-600 dark:text-${accent}-400` : 'bg-slate-200 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400'}`}>
                              <action.icon size={20} />
                           </div>
                           <span className={`text-xs font-bold px-2 py-1 rounded-full transition-colors ${isCompleted ? `bg-${accent}-500 text-white` : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                              +{action.credits}
                           </span>
                        </div>
                        <h3 className={`font-semibold text-sm ${isCompleted ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>{action.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-4 flex-1">{action.desc}</p>
                        <button onClick={() => toggleAction(action.id, action.credits)} className={`w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-95 ${isCompleted ? `bg-${accent}-500 text-white shadow-md shadow-${accent}-500/20` : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'}`}>
                           {isCompleted ? <><Check size={14} /> Completed {isCompleted && <span className="absolute inset-0 animate-pop opacity-0 pointer-events-none" />}</> : "Mark Complete"}
                        </button>
                     </div>
                  );
               })}
            </div>
         </div>
      </section>

      {/* SECTION 3: Impact Dashboard */}
      <section className="flex-none min-h-[300px] md:h-[25%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <ImpactDashboard completedActions={completedActionIds.size} totalActions={CITIZEN_ACTIONS.length} />
      </section>
    </div>
  );
};