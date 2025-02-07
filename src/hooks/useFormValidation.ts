import { useCallback, useEffect } from 'react';
import React from 'react';
import { useForm } from '../components/TransactionForm/context/FormContext';
import { validateField, validateSection, validateForm } from '../components/TransactionForm/services/validation';
import { useToast } from './use-toast';
import { analyticsService } from '../services/analytics';

export function useFormValidation() {
  const { 
    state: { formData, currentSection, validationState },
    setValidation,
    touchField
  } = useForm();
  const { toast } = useToast();

  // Validate a single field
  const validateFormField = useCallback((field: keyof typeof formData, value: any) => {
    const validation = validateField(field, value, formData);
    
    // Update validation state
    setValidation(field, validation.isValid, validation.errors);
    
    // Track validation in analytics
    if (!validation.isValid) {
      analyticsService.trackValidation(field, false, validation.errors);
    }

    return validation;
  }, [formData, setValidation]);

  // Validate current section
  const validateCurrentSection = useCallback(() => {
    if (currentSection === -1) return { isValid: true, errors: [] };
    
    const validation = validateSection(currentSection, formData);
    
    // Track section validation in analytics
    if (!validation.isValid) {
      analyticsService.trackSectionValidation(currentSection, false, validation.errors);
    }

    return validation;
  }, [currentSection, formData]);

  // Validate entire form
  const validateEntireForm = useCallback(() => {
    const validation = validateForm(formData);
    
    if (!validation.isValid) {
      // Group errors by section for better user feedback
      const errorsBySection = validation.errors.reduce((acc, error) => {
        const sectionMatch = error.match(/^Section (\d+):/);
        const section = sectionMatch ? parseInt(sectionMatch[1]) : 'general';
        acc[section] = acc[section] || [];
        acc[section].push(error.replace(/^Section \d+: /, ''));
        return acc;
      }, {} as Record<string | number, string[]>);

      // Show toast with summary
      toast({
        variant: "destructive",
        title: "Form Validation Failed",
        description: React.createElement('div', { className: 'space-y-2' },
          React.createElement('p', null, 'Please fix the following issues:'),
          Object.entries(errorsBySection).map(([section, errors]) =>
            React.createElement('div', { key: section, className: 'ml-2' },
              React.createElement('p', { className: 'font-semibold' },
                section === 'general' ? 'General Issues:' : `Section ${section}:`
              ),
              React.createElement('ul', { className: 'list-disc ml-4' },
                errors.map((error, index) =>
                  React.createElement('li', { key: index, className: 'text-sm' }, error)
                )
              )
            )
          )
        )
      });

      // Track form validation failure
      analyticsService.trackFormValidation(false, validation.errors);
    }

    return validation;
  }, [formData, toast]);

  // Auto-validate fields when they're touched
  const handleFieldTouch = useCallback((field: keyof typeof formData) => {
    touchField(field);
    validateFormField(field, formData[field]);
  }, [formData, touchField, validateFormField]);

  // Validate section when it becomes active
  useEffect(() => {
    if (currentSection >= 0) {
      const validation = validateCurrentSection();
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: "Section Validation",
          description: "Please complete all required fields in this section."
        });
      }
    }
  }, [currentSection, validateCurrentSection, toast]);

  return {
    validateField: validateFormField,
    validateSection: validateCurrentSection,
    validateForm: validateEntireForm,
    touchField: handleFieldTouch,
    validationState,
    hasErrors: Object.values(validationState).some(state => !state?.isValid)
  };
}
