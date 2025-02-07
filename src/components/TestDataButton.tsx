// src/components/TestDataButton.tsx

// This component is only used in development
if (import.meta.env.PROD) {
  throw new Error('TestDataButton should not be imported in production');
}

import React from 'react';
import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { listingAgentMockData, buyersAgentMockData, dualAgentMockData } from './TransactionForm/__mocks__/mockData';
import { TransactionFormData } from './TransactionForm/types';

interface TestDataButtonProps {
  onFill: (data: Partial<TransactionFormData>) => void;
}

export const TestDataButton: React.FC<TestDataButtonProps> = ({ onFill }) => {
  const mockDataOptions = [
    { label: 'Listing Agent Data', data: listingAgentMockData },
    { label: 'Buyer\'s Agent Data', data: buyersAgentMockData },
    { label: 'Dual Agent Data', data: dualAgentMockData },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-white shadow-lg"
        >
          Fill Test Data
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="space-y-2">
          {mockDataOptions.map((option) => (
            <Button
              key={option.label}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => onFill(option.data)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};