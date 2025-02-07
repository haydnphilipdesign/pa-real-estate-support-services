import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, DollarSign, MapPin, MessageSquare, Users, Home, FileCheck, Scale, Building, Globe } from 'lucide-react';
import { TransactionFormProvider, useTransactionForm } from '../../../context/TransactionFormContext';
import { Button } from '../../ui/button';
import { Toaster } from '../../ui/toaster';
import { useToast } from '../../../hooks/use-toast';
import { FormProgress } from '../FormProgress';
import { RoleSection } from '../sections/RoleSection';
import { PropertySection } from '../sections/PropertySection';
import { ClientSection } from '../sections/ClientSection';
import { CommissionSection } from '../sections/CommissionSection';
import { PropertyDetailsSection } from '../sections/PropertyDetailsSection';
import { DocumentsSection } from '../sections/DocumentsSection';
import { AdditionalInfoSection } from '../sections/AdditionalInfoSection';
import { ReferralSection } from '../sections/ReferralSection';
import { WarrantySection } from '../sections/WarrantySection';
import { LegalRequirementsSection } from '../sections/LegalRequirementsSection';
import { TitleCompanySection } from '../sections/TitleCompanySection';
import { MLSStatusSection } from '../sections/MLSStatusSection';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { validationService } from '../../../services/validation/ValidationService';
import { cn } from '../../../lib/utils';
import { FORM_SECTIONS } from '../types';

const sectionIcons = {
  'Role': FileText,
  'Client': Users,
  'Property': Home,
  'Property Details': MapPin,
  'Commission': DollarSign,
  'Referral': Users,
  'Warranty': Building,
  'Legal Requirements': Scale,
  'Documents': FileCheck,
  'Title Company': Building,
  'MLS Status': Globe,
  'Additional Info': MessageSquare
} as const;

const TransactionFormContent: React.FC = () => {
  const { state, actions } = useTransactionForm();
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

  const validateForm = async () => {
    const validation = validationService.validateForm(state.data);
    if (!validation.isValid) {
      const firstErrorSection = FORM_SECTIONS.findIndex(
        section => validation.errors.some(error => error.field.toLowerCase().includes(section.toLowerCase()))
      );
      
      if (firstErrorSection !== -1) {
        actions.setStep(firstErrorSection);
      }

      setValidationErrors(validation.errors.map(error => error.message));
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix all errors before submitting."
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const isValid = await validateForm();
      if (!isValid) return;

      setShowConfirmation(true);
    } catch (error) {
      console.error('Form validation failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while validating the form."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await actions.handleSubmit();
      setShowConfirmation(false);
      setValidationErrors([]);
      toast({
        title: "Success",
        description: "Form submitted successfully!"
      });
    } catch (error) {
      console.error('Form submission failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit the form"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSectionClick = (index: number) => {
    if (canAccessSection(index)) {
      actions.setStep(index);
    }
  };

  const canAccessSection = (index: number): boolean => {
    if (index === 0) return true;
    
    for (let i = 0; i < index; i++) {
      const validation = validationService.validateSection(FORM_SECTIONS[i].toLowerCase(), state.data);
      if (!validation.isValid) return false;
    }
    
    return true;
  };

  const isSectionComplete = (index: number): boolean => {
    const validation = validationService.validateSection(FORM_SECTIONS[index].toLowerCase(), state.data);
    return validation.isValid;
  };

  const hasError = (index: number): boolean => {
    return validationErrors.some(error => 
      error.toLowerCase().includes(FORM_SECTIONS[index].toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e3a8a]/5 to-[#ffd7ba]/10">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-white to-[#ffd7ba]/20 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.1)] backdrop-blur-sm relative overflow-hidden border border-white/50">
        <div className="p-6">
          <div className="space-y-8">
            {/* Form Progress */}
            <FormProgress
              sections={FORM_SECTIONS}
              currentSection={state.metadata.currentStep}
              onSectionClick={handleSectionClick}
              isSectionComplete={isSectionComplete}
              canAccessSection={canAccessSection}
              hasError={hasError}
            />

            {/* Form Content */}
            <div className="flex flex-col">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex-1 min-h-[600px]">
                  <AnimatePresence mode="wait">
                    {state.metadata.currentStep === 0 && <RoleSection key="role" />}
                    {state.metadata.currentStep === 1 && <ClientSection key="client" />}
                    {state.metadata.currentStep === 2 && <PropertySection key="property" />}
                    {state.metadata.currentStep === 3 && <PropertyDetailsSection key="property-details" />}
                    {state.metadata.currentStep === 4 && <CommissionSection key="commission" />}
                    {state.metadata.currentStep === 5 && <ReferralSection key="referral" />}
                    {state.metadata.currentStep === 6 && <WarrantySection key="warranty" />}
                    {state.metadata.currentStep === 7 && <LegalRequirementsSection key="legal" />}
                    {state.metadata.currentStep === 8 && <DocumentsSection key="documents" />}
                    {state.metadata.currentStep === 9 && <TitleCompanySection key="title" />}
                    {state.metadata.currentStep === 10 && <MLSStatusSection key="mls" />}
                    {state.metadata.currentStep === 11 && <AdditionalInfoSection key="additional" />}
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => actions.setStep(state.metadata.currentStep - 1)}
                    disabled={state.metadata.currentStep === 0 || isSubmitting}
                  >
                    Previous
                  </Button>

                  {state.metadata.currentStep === FORM_SECTIONS.length - 1 ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting || validationErrors.length > 0}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => actions.setStep(state.metadata.currentStep + 1)}
                      disabled={!isSectionComplete(state.metadata.currentStep) || isSubmitting}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
      />
      <Toaster />
    </div>
  );
};

// Wrap with provider
export const TransactionFormContainer: React.FC = () => {
  return (
    <TransactionFormProvider>
      <TransactionFormContent />
    </TransactionFormProvider>
  );
};
