import React from 'react';
import { cn } from '../../../lib/utils';
import { FORM_SECTIONS } from '../types';

interface FormProgressProps {
  sections: typeof FORM_SECTIONS;
  currentSection: number;
  onSectionClick: (index: number) => void;
  canAccessSection: (index: number) => boolean;
  isSectionComplete: (index: number) => boolean;
  hasError: (index: number) => boolean;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  sections,
  currentSection,
  onSectionClick,
  canAccessSection,
  isSectionComplete,
  hasError
}) => {
  return (
    <nav className="flex items-center justify-between">
      {sections.map((section, index) => {
        const isActive = currentSection === index;
        const isComplete = isSectionComplete(index);
        const canAccess = canAccessSection(index);
        const hasErrors = hasError(index);

        return (
          <button
            key={section}
            onClick={() => onSectionClick(index)}
            disabled={!canAccess}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              isActive
                ? "bg-blue-50 text-blue-700"
                : canAccess
                ? "hover:bg-gray-50 text-gray-700"
                : "text-gray-400 cursor-not-allowed",
              hasErrors && "ring-2 ring-red-500"
            )}
          >
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isComplete ? "bg-green-500" : "bg-gray-300",
                  hasErrors && "bg-red-500"
                )}
              />
              <span>{section}</span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}; 