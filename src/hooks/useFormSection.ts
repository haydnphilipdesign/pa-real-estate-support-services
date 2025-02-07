import { useCallback, useEffect } from 'react';
import { TransactionFormData } from '../components/TransactionForm/types';
import { useForm } from '../components/TransactionForm/context/FormContext';
import { validateSection } from '../components/TransactionForm/services/validation';
import { analyticsService } from '../services/analytics';

interface UseFormSectionProps {
  sectionName: string;
  sectionIndex: number;
}

export const useFormSection = ({ sectionName, sectionIndex }: UseFormSectionProps) => {
  const { 
    state: { formData, validationState },
    updateField,
    setValidation,
    touchField,
    completeSection
  } = useForm();

  // Start tracking section time when mounted
  useEffect(() => {
    analyticsService.startSection(sectionName);
    return () => {
      analyticsService.endSection(sectionName);
    };
  }, [sectionName]);

  // Ensure clients array is initialized
  useEffect(() => {
    if (sectionName === 'client' && (!formData.clients || formData.clients.length === 0)) {
      updateField('clients', [{
        name: '',
        address: '',
        email: '',
        phone: '',
        maritalStatus: 'Single',
        designation: ''
      }]);
    }
  }, [sectionName, formData.clients, updateField]);

  // Validate section
  const validateSectionData = useCallback(() => {
    const validation = validateSection(sectionIndex, formData);
    
    // Track validation in analytics
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        analyticsService.trackValidation(sectionName, false, [error]);
      });
    }

    return validation;
  }, [sectionIndex, formData, sectionName]);

  // Update field with validation
  const handleFieldUpdate = useCallback(<K extends keyof TransactionFormData>(
    field: K,
    value: TransactionFormData[K]
  ) => {
    // Check if the value has actually changed
    if (formData[field] === value) {
      return;
    }

    updateField(field, value);
    touchField(field);
    
    // Track field interaction in analytics
    analyticsService.trackFieldInteraction(field as string, 'change', String(value));
  }, [formData, updateField, touchField]);

  // Get validation state for a specific field
  const getFieldValidationState = useCallback((field: keyof TransactionFormData) => {
    return validationState[field]?.isValid === false ? 'invalid' : 'valid';
  }, [validationState]);

  // Get error message for a specific field
  const getFieldError = useCallback((field: keyof TransactionFormData) => {
    return validationState[field]?.errors?.[0] || '';
  }, [validationState]);

  // Get help text for a specific field
  const getFieldHelpText = useCallback((field: keyof TransactionFormData) => {
    return validationState[field]?.errors?.[0] || '';
  }, [validationState]);

  return {
    formData,
    updateField: handleFieldUpdate,
    validateSection: validateSectionData,
    getFieldValidationState,
    getFieldError,
    getFieldHelpText,
    completeSection: () => completeSection(sectionIndex)
  };
};