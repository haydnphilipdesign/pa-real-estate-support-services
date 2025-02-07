import React from 'react';
import { TooltipProvider as RadixTooltipProvider } from '@radix-ui/react-tooltip';

interface TooltipProviderProps {
  children: React.ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  return (
    <RadixTooltipProvider delayDuration={300}>
      {children}
    </RadixTooltipProvider>
  );
}; 