import React from 'react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

interface ResetButtonProps {
  onReset: () => void;
  className?: string;
  disabled?: boolean;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onReset, className, disabled }) => {
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? This action cannot be undone.')) {
      onReset();
    }
  };

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleReset}
      disabled={disabled}
      className={cn(
        "px-6 py-3 rounded-xl font-medium",
        "bg-red-600 text-white hover:bg-red-700",
        "transition-all duration-200 ease-in-out",
        "shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none",
        className
      )}
    >
      Reset Form
    </Button>
  );
};