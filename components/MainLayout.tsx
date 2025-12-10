import React from 'react';
import { AppMode } from '../types';
import { IndustryLayout } from './IndustryLayout';
import { GovernmentLayout } from './GovernmentLayout';
import { CitizenLayout } from './CitizenLayout';

interface MainLayoutProps {
  mode: AppMode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ mode }) => {
  if (mode === AppMode.INDUSTRY) {
    return <IndustryLayout />;
  }

  if (mode === AppMode.GOVERNMENT) {
    return <GovernmentLayout />;
  }

  return <CitizenLayout />;
};