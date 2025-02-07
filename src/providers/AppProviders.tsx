import React from 'react';
import { TooltipProvider } from './TooltipProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <TooltipProvider>
      {children}
    </TooltipProvider>
  );
}; 