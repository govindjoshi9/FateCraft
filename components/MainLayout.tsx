import React, { Suspense } from 'react';
import { AppMode } from '../types';
import { Loader2 } from 'lucide-react';

// Lazy load layout components for better performance
const IndustryLayout = React.lazy(() => import('./IndustryLayout').then(module => ({ default: module.IndustryLayout })));
const GovernmentLayout = React.lazy(() => import('./GovernmentLayout').then(module => ({ default: module.GovernmentLayout })));
const CitizenLayout = React.lazy(() => import('./CitizenLayout').then(module => ({ default: module.CitizenLayout })));

interface MainLayoutProps {
  mode: AppMode;
}

const LoadingFallback = () => (
  <div className="h-full flex flex-col items-center justify-center text-slate-400">
    <Loader2 className="animate-spin mb-2" size={32} />
    <p>Loading Dashboard...</p>
  </div>
);

export const MainLayout: React.FC<MainLayoutProps> = ({ mode }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {mode === AppMode.INDUSTRY ? (
        <IndustryLayout />
      ) : mode === AppMode.GOVERNMENT ? (
        <GovernmentLayout />
      ) : (
        <CitizenLayout />
      )}
    </Suspense>
  );
};