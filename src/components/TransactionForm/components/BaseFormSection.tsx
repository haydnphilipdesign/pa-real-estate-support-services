import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Alert, AlertDescription } from '../../ui/alert';
import { useForm } from '../context/FormContext';
import { ValidationState } from '../types';

interface BaseFormSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  sectionIndex: number;
  validationErrors?: string[];
  className?: string;
  children: React.ReactNode;
}

export const BaseFormSection: React.FC<BaseFormSectionProps> = ({
  title,
  description,
  icon: Icon,
  isActive,
  sectionIndex,
  validationErrors = [],
  className,
  children
}) => {
  const { 
    state: { currentSection, completedSections },
    completeSection
  } = useForm();

  // Check if this section is complete whenever it becomes inactive
  useEffect(() => {
    if (!isActive && validationErrors.length === 0 && !completedSections.includes(sectionIndex)) {
      completeSection(sectionIndex);
    }
  }, [isActive, validationErrors.length, completedSections, sectionIndex, completeSection]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full bg-white",
        className
      )}
    >
      {/* Section Header */}
      <div className="flex items-start space-x-4">
        <div className="p-2 rounded-lg bg-blue-50">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {children}
      </div>

      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </motion.div>
  );
};

// Form Field Wrapper Component
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
      <div className="flex justify-between">
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
        <p className="text-sm text-red-600">{error}</p>
      )}
      {warning && !error && (
        <p className="text-sm text-amber-600">{warning}</p>
      )}
    </div>
  );
};

// Form Section Container Component
interface FormSectionContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const FormSectionContainer: React.FC<FormSectionContainerProps> = ({
  className,
  children
}) => {
  return (
    <div className={cn(
      "w-full h-full",
      className
    )}>
      {children}
    </div>
  );
};

// Form Row Component for horizontal layouts
interface FormRowProps {
  className?: string;
  children: React.ReactNode;
}

export const FormRow: React.FC<FormRowProps> = ({
  className,
  children
}) => {
  return (
    <div className={cn(
      "flex flex-wrap gap-4",
      className
    )}>
      {children}
    </div>
  );
};

// Export all components
export const FormComponents = {
  BaseFormSection,
  FormFieldWrapper,
  FormSectionContainer,
  FormRow
};