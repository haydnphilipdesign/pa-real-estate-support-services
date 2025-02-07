import React from 'react';
import { RoleSection } from './sections/RoleSection';
import { PropertySection } from './sections/PropertySection';
import { ClientSection } from './sections/ClientSection';
import { CommissionSection } from './sections/CommissionSection';
import { PropertyDetailsSection } from './sections/PropertyDetailsSection';
import { WarrantySection } from './sections/WarrantySection';
import { DocumentsSection } from './sections/DocumentsSection';
import { AdditionalInfoSection } from './sections/AdditionalInfoSection';
import { SignatureSection } from './sections/SignatureSection';
import { TitleCompanySection } from './sections/TitleCompanySection';
import { ConfirmationDialog } from './ConfirmationDialog';
import { Toaster } from '../ui/toaster';
import { useToast } from '../../hooks/use-toast';
import { FormProgress } from './FormProgress';
import { FormNavigation } from './components/FormNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FORM_SECTIONS, TransactionFormData } from './types';
import { Button } from '../ui/button';
import { IntroSection } from './sections/IntroSection';
import { FormSummary } from './components/FormSummary';
import { Info } from 'lucide-react';
import { analyticsService } from '../../services/analytics';
import { FormProvider, useForm } from './context/FormContext';
import { validateSection } from './services/validation';
import { 
  canAccessSection, 
  validateSectionAccess, 
  getNextSection, 
  getPreviousSection,
  getSectionProgress 
} from './services/navigation';

// Only import TestDataButton in development
const TestDataButton = import.meta.env.DEV 
  ? (await import('../TestDataButton')).TestDataButton 
  : null;

interface TransactionFormProps {
  onClose?: () => void;
}

// Create a separate content component
const TransactionFormContent: React.FC<TransactionFormProps> = ({ onClose }): JSX.Element => {
  const { 
    state: { 
      formData, 
      currentSection, 
      completedSections,
      isSubmitting
    },
    updateField,
    setSection,
    completeSection,
    resetForm,
    startSubmission,
    endSubmission
  } = useForm();

  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

  // Initialize analytics on mount
  React.useEffect(() => {
    analyticsService.initializeSession('agent', 'transaction-form');
  }, []);

  // Store deferred beforeinstallprompt event
  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleStartForm = () => {
    setSection(0);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateSection(currentSection, formData);
    
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validation.errors[0]
      });
      return;
    }

    if (currentSection === FORM_SECTIONS.length - 1) {
      // Show confirmation dialog immediately for the final section
      setShowConfirmation(true);
    } else {
      completeSection(currentSection);
      const nextSection = getNextSection(currentSection, formData, completedSections);
      if (nextSection === currentSection) {
        toast({
          variant: "destructive",
          title: "Cannot Proceed",
          description: "Please complete all required fields in this section."
        });
      } else {
        setSection(nextSection);
      }
    }
  };

  const handleConfirm = async () => {
    startSubmission();
    try {
      // Add your submission logic here
      setShowConfirmation(false);
      
      toast({
        title: "Success",
        description: "Form submitted successfully!"
      });
      
      resetForm();
    } catch (error) {
      console.error('Form submission failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit the form"
      });
    } finally {
      endSubmission();
    }
  };

  const handleAddBookmark = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      toast({
        variant: "default",
        title: "Bookmark",
        description: "The app is already installed or bookmarked on your device."
      });
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          toast({
            variant: "default",
            title: "Bookmark",
            description: "Thank you for installing the app!"
          });
        } else {
          toast({
            variant: "destructive",
            title: "Bookmark",
            description: "Bookmark installation was dismissed."
          });
        }
        setDeferredPrompt(null);
      });
    } else {
      toast({
        variant: "default",
        title: "Bookmark",
        description: "Please use your browser's 'Add to Home Screen' or 'Bookmark page' option to save this app."
      });
    }
  };

  const handleTestDataFill = (data: Partial<TransactionFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      updateField(
        key as keyof TransactionFormData,
        value as TransactionFormData[keyof TransactionFormData]
      );
    });
    toast({
      title: "Test Data",
      description: "Form filled with test data."
    });
  };

  const formSections = [
    <RoleSection key="role" />,
    <PropertySection key="property" />,
    <ClientSection key="client" />,
    <CommissionSection key="commission" />,
    <PropertyDetailsSection key="propertyDetails" />,
    <WarrantySection key="warranty" />,
    <TitleCompanySection key="titleCompany" />,
    <DocumentsSection key="documents" />,
    <AdditionalInfoSection key="additionalInfo" />,
    <SignatureSection key="signature" />
  ];

  const progressStep = currentSection === -1 ? -1 : currentSection;
  const hasError = (section: number) => {
    const sectionValidation = validateSection(section, formData);
    return !sectionValidation.isValid;
  };

  const handleSectionClick = (sectionIndex: number) => {
    const accessValidation = validateSectionAccess(sectionIndex, formData, completedSections);
    if (!accessValidation.isValid) {
      toast({
        variant: "destructive",
        title: "Cannot Access Section",
        description: accessValidation.error
      });
      return;
    }
    setSection(sectionIndex);
  };

  const { totalSections, currentProgress } = getSectionProgress(
    formData,
    completedSections
  );

  return (
    <>
      <div className="h-screen overflow-hidden bg-gradient-to-b from-[#1e3a8a]/5 to-[#ffd7ba]/10">
        <div className="h-full bg-gradient-to-br from-white to-[#ffd7ba]/20 relative">
          <div className="h-full flex flex-col lg:flex-row">
            <div className="w-full lg:w-auto sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-md lg:shadow-none lg:static">
              <FormProgress
                currentStep={currentSection}
                totalSteps={totalSections}
                completedSteps={completedSections}
                onStepClick={handleSectionClick}
                canAccessStep={(step) => canAccessSection(step, formData, completedSections)}
                progress={currentProgress}
              />
              
              <div className="hidden lg:block p-4">
                <FormSummary
                  formData={formData}
                  currentSection={currentSection}
                  completedSections={completedSections}
                  hasError={hasError}
                />
              </div>
            </div>

            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg bg-white"
                onClick={() => {
                  toast({
                    title: "Form Progress",
                    description: (
                      <FormSummary
                        formData={formData}
                        currentSection={currentSection}
                        completedSections={completedSections}
                        hasError={hasError}
                      />
                    )
                  });
                }}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 relative overflow-y-auto">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/5 via-transparent to-[#ffd7ba]/5" />
              </div>
              <div className="p-3 sm:p-4 md:p-6 lg:p-8 relative min-h-full">
                <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6 md:space-y-8 relative pb-24 sm:pb-0">
                  {isSubmitting && (
                    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a]"></div>
                        <p className="text-[#1e3a8a] font-medium">Processing...</p>
                      </div>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {currentSection === -1 ? (
                      <motion.div
                        key={'intro'}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        <IntroSection
                          onStart={() => handleStartForm()}
                          onBookmark={handleAddBookmark}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={currentSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        {formSections[currentSection]}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Fixed mobile navigation */}
                  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-between items-center sm:hidden">
                    <Button
                      onClick={() => setSection(getPreviousSection(currentSection))}
                      disabled={currentSection === -1}
                      variant="outline"
                      className="w-[45%] py-6"
                    >
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      className="w-[45%] py-6 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90"
                    >
                      {currentSection === formSections.length - 1 ? 'Submit' : 'Next'}
                    </Button>
                  </div>

                  {/* Desktop navigation */}
                  <div className="hidden sm:flex justify-between mt-8">
                    <Button
                      onClick={() => setSection(getPreviousSection(currentSection))}
                      disabled={currentSection === -1}
                      variant="outline"
                      className="px-8"
                    >
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      className="px-8 bg-[#1e3a8a] hover:bg-[#1e3a8a]/90"
                    >
                      {currentSection === formSections.length - 1 ? 'Submit' : 'Next'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={(data) => {
          updateField('agentName', data.agentName);
          updateField('dateSubmitted', data.dateSubmitted);
          handleConfirm();
        }}
        initialAgentName={formData.agentName}
      />
      
      <Toaster />

      {TestDataButton && <TestDataButton onFill={handleTestDataFill} />}
    </>
  );
};

// Wrap the content with FormProvider
export const TransactionForm: React.FC<TransactionFormProps> = (props): JSX.Element => {
  return (
    <FormProvider>
      <TransactionFormContent {...props} />
    </FormProvider>
  );
};
