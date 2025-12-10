import React, { useState, useRef } from 'react';
import { 
  Camera, Share2, Utensils, Bike, Lightbulb, Thermometer, 
  Megaphone, Sprout, Check, Loader2
} from 'lucide-react';
import { generatePersonalizedFuture } from '../services/geminiService';
import { ImpactDashboard } from './ImpactDashboard';

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
    
    // Confirmation Dialog
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
        // Add feedback for completion
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
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-xl border border-emerald-500/50 z-50 animate-in slide-in-from-top-2 fade-in">
           <span className="text-sm font-medium flex items-center gap-2">
              <Check size={16} className="text-emerald-500" />
              {notification}
           </span>
        </div>
      )}

      {/* SECTION 1: Your Climate Future */}
      <section className={`flex-none min-h-[400px] md:min-h-[350px] md:h-[40%] bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group transition-all`}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 -z-10"></div>
        {/* Subtle decorative glow */}
        <div className={`absolute -top-20 -right-20 w-64 h-64 bg-${accent}-500/10 rounded-full blur-3xl`}></div>

        <div className="flex flex-col h-full z-10 relative">
          
          {/* Default View: Input & Upload */}
          {!personalResult ? (
            <div className="flex flex-col h-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">See Your 2050 Future</h2>
                <p className="text-slate-400 text-sm md:text-base">Upload a photo to see how climate change will affect you personally</p>
              </div>

              <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center overflow-y-auto">
                {/* Upload Area */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-dashed border-slate-600 hover:border-${accent}-500 flex items-center justify-center cursor-pointer transition-all bg-slate-800/50 overflow-hidden group/upload relative shadow-lg`}
                  >
                    {userImage ? (
                      <img src={userImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-500 group-hover/upload:text-slate-300">
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

                {/* Conditional Form */}
                {userImage && (
                  <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-medium ml-1">Current Age</label>
                          <input 
                            type="number" 
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="e.g. 28"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm md:text-base"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-medium ml-1">Location</label>
                          <input 
                            type="text" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, Country"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm md:text-base"
                          />
                        </div>
                     </div>
                     
                     <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium ml-1">Lifestyle</label>
                        <select 
                          value={lifestyle}
                          onChange={(e) => setLifestyle(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm md:text-base"
                        >
                          <option>Urban professional</option>
                          <option>Suburban family</option>
                          <option>Rural community</option>
                          <option>Student</option>
                        </select>
                     </div>

                     <button 
                        onClick={handleGeneratePersonal}
                        disabled={!age || processingPersonal}
                        className={`w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 ${processingPersonal ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
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
            // Results View
            <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
               <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-4">
                    {userImage && (
                      <img src={userImage} alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50" />
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">Your Climate Future in 2050</h3>
                      <p className="text-xs text-slate-500">Based on IPCC projections for {location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                       <Share2 size={18} />
                    </button>
                    <button 
                      onClick={() => setPersonalResult(null)} 
                      className="text-xs text-slate-400 hover:text-white underline px-2"
                    >
                      Start Over
                    </button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div 
                    className="prose prose-invert prose-sm max-w-none 
                      prose-h3:text-emerald-400 prose-h3:text-sm prose-h3:uppercase prose-h3:tracking-wide prose-h3:mt-6 prose-h3:mb-2
                      prose-p:text-slate-300 prose-p:leading-relaxed
                      prose-li:text-slate-300"
                    dangerouslySetInnerHTML={{ __html: personalResult }}
                  />
               </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: Take Action (35% height) */}
      <section className="flex-none min-h-[300px] md:h-[35%] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4">
         {/* Header */}
         <div className="flex-none">
            <div className="flex justify-between items-end mb-2">
               <div>
                  <h2 className="text-xl font-bold text-slate-100">Your Climate Actions</h2>
                  <p className="text-sm text-slate-400">Complete actions, earn Carbon Credits</p>
               </div>
               <div className="text-right">
                  <span className={`text-xl font-bold text-${accent}-400 animate-pulse`}>{currentCredits}</span>
                  <span className="text-sm text-slate-500"> / {NEXT_GOAL} Credits</span>
               </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
               <div 
                  className={`h-full bg-gradient-to-r from-${accent}-600 to-${accent}-400 transition-all duration-1000 ease-out`}
                  style={{ width: `${progressPercentage}%` }}
               />
            </div>
         </div>

         {/* Action Cards Grid */}
         <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
               {CITIZEN_ACTIONS.map((action) => {
                  const isCompleted = completedActionIds.has(action.id);
                  return (
                     <div 
                        key={action.id}
                        className={`
                           relative flex flex-col p-4 rounded-xl border transition-all duration-300 transform
                           ${isCompleted 
                              ? `bg-${accent}-900/10 border-${accent}-500/30` 
                              : 'bg-slate-800/30 border-slate-700 hover:bg-slate-800 hover:border-slate-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20'
                           }
                        `}
                     >
                        <div className="flex items-start justify-between mb-3">
                           <div className={`p-2 rounded-lg transition-colors ${isCompleted ? `bg-${accent}-500/20 text-${accent}-400` : 'bg-slate-700/50 text-slate-400'}`}>
                              <action.icon size={20} />
                           </div>
                           <span className={`text-xs font-bold px-2 py-1 rounded-full transition-colors ${isCompleted ? `bg-${accent}-500 text-white` : 'bg-slate-700 text-slate-300'}`}>
                              +{action.credits}
                           </span>
                        </div>
                        
                        <h3 className={`font-semibold text-sm ${isCompleted ? 'text-slate-300' : 'text-slate-100'}`}>{action.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-4 flex-1">{action.desc}</p>
                        
                        <button
                           onClick={() => toggleAction(action.id, action.credits)}
                           className={`
                              w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all active:scale-95
                              ${isCompleted 
                                 ? `bg-${accent}-500 text-white shadow-md shadow-${accent}-900/20` 
                                 : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                              }
                           `}
                        >
                           {isCompleted ? (
                              <>
                                 <Check size={14} />
                                 Completed
                              </>
                           ) : (
                              "Mark Complete"
                           )}
                        </button>
                     </div>
                  );
               })}
            </div>
         </div>
      </section>

      {/* SECTION 3: Impact Dashboard (25% height) */}
      <section className="flex-none min-h-[300px] md:h-[25%] bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <ImpactDashboard completedActions={completedActionIds.size} totalActions={CITIZEN_ACTIONS.length} />
      </section>

    </div>
  );
};