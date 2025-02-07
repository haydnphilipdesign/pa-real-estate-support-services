import React from 'react';
import { Button } from '../../ui/button';
import { ResetButton } from './ResetButton';
import { cn } from '../../../lib/utils';
import { Loader2 } from 'lucide-react';

interface FormNavigationProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  completedSections?: number[];
  showSubmitButton?: boolean;
  canProceed?: boolean;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onReset,
  onSubmit,
  isSubmitting = false,
  completedSections = [],
  showSubmitButton = false,
  canProceed = true
}) => {
  const isLastSection = currentSection === totalSections - 1 || showSubmitButton;
  const progress = (completedSections.length / totalSections) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-[#1e3a8a] h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center pt-6 border-t border-gray-200">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={currentSection === 0 || isSubmitting}
            className={cn(
              "px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium",
              "border border-gray-300 bg-white hover:bg-gray-50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200 ease-in-out",
              "shadow-sm hover:shadow-md hover:-translate-y-0.5",
              "focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2",
              "flex-1 md:flex-none"
            )}
          >
            ← Previous
          </Button>
          <ResetButton onReset={onReset} disabled={isSubmitting} />
        </div>

        {/* Section Progress - Hidden on Mobile */}
        <div className="hidden md:block text-sm text-gray-600">
          Section {currentSection + 1} of {totalSections}
        </div>

        <div className="w-full md:w-auto">
          {isLastSection ? (
            <Button 
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                onSubmit(e);
              }}
              disabled={isSubmitting || !canProceed}
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium",
                "bg-[#1e3a8a] text-white hover:bg-[#2d4ba0]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-300 ease-in-out",
                "shadow-sm hover:shadow-lg hover:-translate-y-0.5",
                "focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2",
                "disabled:hover:transform-none",
                "w-full md:w-auto min-w-[150px] flex justify-center items-center gap-2"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Form →'
              )}
            </Button>
          ) : (
            <Button 
              type="button"
              onClick={onNext}
              disabled={isSubmitting || !canProceed}
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium",
                "bg-[#1e3a8a] text-white hover:bg-[#2d4ba0]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-300 ease-in-out",
                "shadow-sm hover:shadow-lg hover:-translate-y-0.5",
                "focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2",
                "disabled:hover:transform-none",
                "w-full md:w-auto min-w-[150px] flex justify-center items-center gap-2"
              )}
            >
              Next →
            </Button>
          )}
        </div>
      </div>

      {/* Section Status */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalSections }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentSection && "w-4",
              completedSections.includes(index)
                ? "bg-[#1e3a8a]"
                : index === currentSection
                ? "bg-blue-300"
                : "bg-gray-200"
            )}
          />
        ))}
      </div>
    </div>
  );
};