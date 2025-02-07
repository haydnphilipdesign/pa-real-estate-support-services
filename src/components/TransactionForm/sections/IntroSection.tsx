import React from 'react';
import { Button } from '../../ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { Info } from 'lucide-react';

interface IntroSectionProps {
  onStart: () => void;
  onBookmark: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onStart, onBookmark }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Transaction Intake Form</h2>
      <p className="text-lg mb-6 max-w-md">
        Please review the information below carefully. This form will guide you through entering your transaction details.
        Tap on the info icons for more context on each section. You can also save this form as a bookmark for quick access.
      </p>
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="sm" className="px-2 py-1">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Each form field has an info icon. Tap it for more instructions on what to enter.</p>
            </TooltipContent>
          </Tooltip>
          <span>Tap on the info icons for guidance.</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="sm" className="px-2 py-1">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>You can save this form as a bookmark or add it to your home screen for quick access.</p>
            </TooltipContent>
          </Tooltip>
          <span>Bookmark this form for later use.</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onStart} className="px-8 py-4 bg-[#1e3a8a] text-white rounded-full hover:bg-[#1e3a8a]/90">
          Start Form
        </Button>
        <Button onClick={onBookmark} variant="outline" className="px-8 py-4 rounded-full">
          Save Bookmark
        </Button>
      </div>
    </div>
  );
}; 