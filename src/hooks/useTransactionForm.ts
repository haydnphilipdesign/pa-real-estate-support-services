import { useState, useEffect, useCallback } from 'react';
import { TransactionFormData } from '../components/TransactionForm/types';
import { validateField, validateForm, transactionFormSchema } from '../services/validation';
import { analyticsService } from '../services/analytics';
import { PDFGenerator } from '../services/pdfGenerator';
import { useToast } from './useToast';

const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export const useTransactionForm = (initialData?: Partial<TransactionFormData>) => {
  const [formData, setFormData] = useState<TransactionFormData>(() => ({
    role: '',
    mlsNumber: '',
    propertyAddress: '',
    propertyStatus: '',
    clients: [],
    salePrice: '',
    commissionBase: '',
    totalCommission: '',
    winterizedStatus: '',
    accessType: '',
    homeWarrantyPurchased: false,
    homeWarrantyCompany: '',
    warrantyCost: '',
    titleCompany: '',
    tcFeePaidBy: '',
    specialInstructions: '',
    urgentIssues: '',
    ...initialData
  }));

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState('role');
  const { toast } = useToast();

  // Initialize analytics session
  useEffect(() => {
    analyticsService.initializeSession(
      formData.agentName || 'unknown',
      formData.mlsNumber || 'new-transaction'
    );
    
    return () => {
      analyticsService.submitAnalytics();
    };
  }, []);

  // Autosave functionality
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      if (Object.keys(touched).length > 0) {
        localStorage.setItem('transactionFormDraft', JSON.stringify(formData));
        analyticsService.trackPerformance('autosaveCount', 1);
        toast({
          title: 'Draft Saved',
          description: 'Your progress has been automatically saved.',
          duration: 2000
        });
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(autosaveInterval);
  }, [formData, touched]);

  // Field change handler
  const handleChange = useCallback((
    fieldName: string,
    value: any,
    shouldValidate: boolean = true
  ) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (fieldName.includes('.')) {
        const [parent, child] = fieldName.split('.');
        if (Array.isArray(newData[parent])) {
          newData[parent] = [...newData[parent]];
        }
      } else {
        newData[fieldName as keyof TransactionFormData] = value;
      }
      return newData;
    });

    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    analyticsService.trackFieldInteraction(fieldName, 'change', String(value));

    if (shouldValidate) {
      const validationResults = validateField(fieldName, value, formData);
      const fieldErrors = validationResults
        .filter(result => !result.isValid)
        .map(result => result.message);
      
      setErrors(prev => ({ ...prev, [fieldName]: fieldErrors }));
      
      analyticsService.trackValidation(
        fieldName,
        fieldErrors.length === 0,
        fieldErrors
      );
    }
  }, [formData]);

  // Section navigation
  const handleSectionChange = useCallback((newSection: string) => {
    analyticsService.trackNavigation(currentSection, newSection);
    setCurrentSection(newSection);
  }, [currentSection]);

  // Form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    analyticsService.trackPerformance('submitAttempts', 1);

    try {
      // Validate entire form
      const validationResults = validateForm(formData);
      const hasErrors = Object.values(validationResults).some(
        results => results.some(result => !result.isValid)
      );

      if (hasErrors) {
        const newErrors: Record<string, string[]> = {};
        Object.entries(validationResults).forEach(([field, results]) => {
          newErrors[field] = results
            .filter(result => !result.isValid)
            .map(result => result.message);
        });
        setErrors(newErrors);
        
        analyticsService.trackPerformance('successfulSubmit', false);
        toast({
          title: 'Validation Error',
          description: 'Please fix the highlighted errors before submitting.',
          variant: 'destructive'
        });
        return;
      }

      // Schema validation
      const parseResult = transactionFormSchema.safeParse(formData);
      if (!parseResult.success) {
        console.error('Schema validation failed:', parseResult.error);
        toast({
          title: 'Validation Error',
          description: 'Form data is invalid. Please check your inputs.',
          variant: 'destructive'
        });
        return;
      }

      // Generate and send PDF
      await PDFGenerator.generateAndEmail(formData);

      analyticsService.trackPerformance('successfulSubmit', true);
      toast({
        title: 'Success',
        description: 'Transaction form submitted successfully.',
      });

      // Clear form and analytics
      setFormData({} as TransactionFormData);
      setTouched({});
      setErrors({});
      analyticsService.submitAnalytics();

    } catch (error) {
      console.error('Form submission error:', error);
      analyticsService.trackPerformance('successfulSubmit', false);
      toast({
        title: 'Error',
        description: 'Failed to submit the form. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Field focus/blur handlers
  const handleFocus = useCallback((fieldName: string) => {
    analyticsService.trackFieldInteraction(fieldName, 'focus', '');
  }, []);

  const handleBlur = useCallback((fieldName: string) => {
    analyticsService.trackFieldInteraction(fieldName, 'blur', '');
  }, []);

  return {
    formData,
    touched,
    errors,
    isSubmitting,
    currentSection,
    handleChange,
    handleFocus,
    handleBlur,
    handleSubmit,
    handleSectionChange,
    setTouched,
    setErrors
  };
}; 