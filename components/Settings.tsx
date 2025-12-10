import React from 'react';
import { X, Moon, Sun, Type, Eye } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  isOpen, onClose, isDark, toggleTheme, isHighContrast, toggleHighContrast, fontSize, setFontSize
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Appearance & Accessibility</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="text-slate-500" size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Theme</p>
                <p className="text-xs text-slate-500">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-indigo-600' : 'bg-slate-300'}`}
              aria-label="Toggle Theme"
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isDark ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Eye size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">High Contrast</p>
                <p className="text-xs text-slate-500">Increase visibility</p>
              </div>
            </div>
            <button
              onClick={toggleHighContrast}
              className={`w-12 h-6 rounded-full transition-colors relative ${isHighContrast ? 'bg-indigo-600' : 'bg-slate-300'}`}
              aria-label="Toggle High Contrast"
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isHighContrast ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Type size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Font Size</p>
                <p className="text-xs text-slate-500">Adjust text scaling</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-500">A</span>
              <input 
                type="range" 
                min="14" max="20" step="1" 
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-lg font-bold text-slate-500">A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};