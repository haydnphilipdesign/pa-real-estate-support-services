import React from 'react';
import { cn } from '../../../lib/utils';

interface FormFieldWrapperProps {
  label: string;
  error?: string;
  warning?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  error,
  warning,
  required,
  helpText,
  className,
  children
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helpText && (
          <span className="text-xs text-gray-500">{helpText}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      {warning && !error && (
        <p className="text-sm text-amber-600 mt-1">{warning}</p>
      )}
    </div>
  );
}; 