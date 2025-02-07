import React from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  canAccessStep?: (step: number) => boolean;
  progress?: number;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  onStepClick,
  canAccessStep = () => true,
  progress = 0
}) => {
  return (
    <div className="w-full md:w-64 bg-white md:rounded-l-lg shadow-sm border-b md:border-b-0 md:border-r border-gray-200 p-4 md:p-6">
      {/* Mobile Progress Bar */}
      <div className="block md:hidden w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-[#1e3a8a] h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mobile Current Step */}
      <div className="block md:hidden text-sm text-gray-600 mb-4">
        Step {currentStep + 1} of {totalSteps}: {getStepLabel(currentStep)}
      </div>

      {/* Steps List - Scrollable on Mobile */}
      <div className="flex md:flex-col gap-2 md:gap-4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-4 md:mx-0 px-4 md:px-0">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index;
          const canAccess = canAccessStep(index);
          const isClickable = canAccess && onStepClick;

          return (
            <button
              key={index}
              onClick={() => isClickable && onStepClick(index)}
              disabled={!canAccess}
              className={cn(
                "flex items-center gap-2 md:gap-3 shrink-0 md:shrink",
                "w-auto md:w-full text-left p-2 rounded-lg transition-all",
                isClickable ? "cursor-pointer hover:bg-gray-100" : "cursor-not-allowed opacity-50",
                isCurrent && "bg-[#1e3a8a]/5 text-[#1e3a8a]"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-sm",
                isCompleted ? "bg-[#1e3a8a] text-white" : "border-2 border-gray-300"
              )}>
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="text-sm font-medium">
                {getStepLabel(index)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

function getStepLabel(step: number): string {
  switch (step) {
    case 0:
      return 'Role';
    case 1:
      return 'Property';
    case 2:
      return 'Client';
    case 3:
      return 'Commission';
    case 4:
      return 'Property Details';
    case 5:
      return 'Warranty';
    case 6:
      return 'Title Company';
    case 7:
      return 'Documents';
    case 8:
      return 'Additional Info';
    case 9:
      return 'Signature';
    default:
      return `Step ${step + 1}`;
  }
}
