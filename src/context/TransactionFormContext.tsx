import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { 
  TransactionFormData, 
  AccessType, 
  CommissionBase, 
  TCFeePaidBy 
} from '../components/TransactionForm/types';
import { validationService, ValidationError } from '../services/validation/ValidationService';
import { analyticsService } from '../services/analytics';
import debounce from 'lodash/debounce';

interface FormMetadata {
  currentStep: number;
  completedSteps: number[];
  isDirty: boolean;
  lastSaved: Date | null;
  isSubmitting: boolean;
  isSaving: boolean;
  submissionError: string | null;
  validationErrors: Record<string, string[]>;
  lastAttemptedStep: number | null;
}

interface FormState {
  data: TransactionFormData;
  metadata: FormMetadata;
}

type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof TransactionFormData; value: any }
  | { type: 'SET_STEP'; step: number }
  | { type: 'MARK_STEP_COMPLETE'; step: number }
  | { type: 'SET_SAVING'; isSaving: boolean }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_SUBMISSION_ERROR'; error: string | null }
  | { type: 'SET_VALIDATION_ERRORS'; errors: Record<string, string[]> }
  | { type: 'SET_LAST_ATTEMPTED_STEP'; step: number | null }
  | { type: 'LOAD_SAVED_STATE'; state: Partial<FormState> }
  | { type: 'RESET_FORM' };

interface TransactionFormContextType {
  formData: TransactionFormData;
  updateFormData: (field: keyof TransactionFormData, value: any) => void;
  handleSubmit: () => Promise<void>;
  validateSection: (section: string, data: TransactionFormData) => string[];
}

// Helper function to convert ValidationError[] to Record<string, string[]>
const transformValidationErrors = (errors: ValidationError[]): Record<string, string[]> => {
  const transformed: Record<string, string[]> = {};
  errors.forEach(error => {
    if (!transformed[error.field]) {
      transformed[error.field] = [];
    }
    transformed[error.field].push(error.message);
  });
  return transformed;
};

// Map step numbers to section names
const stepToSection: Record<number, string> = {
  0: 'role',
  1: 'property',
  2: 'client',
  3: 'commission',
  4: 'details',
  5: 'documents',
  6: 'additional',
  7: 'sign'
};

const initialState: FormState = {
  data: {
    // Role Information
    role: '',
    
    // Property Information
    mlsNumber: '',
    propertyAddress: '',
    salePrice: '',
    municipalityTownship: '',
    
    // Property Status
    winterizedStatus: 'not_winterized',
    accessType: 'Electronic Lockbox' as AccessType,
    updateMlsStatus: false,
    
    // Client Information
    clients: [{
      name: '',
      address: '',
      email: '',
      phone: '',
      maritalStatus: 'Single',
      designation: ''
    }],
    
    // Commission Information
    commissionBase: 'Sale Price' as CommissionBase,
    sellerAssist: '',
    totalCommission: '',
    totalCommissionFixed: '',
    listingAgentCommissionType: 'Percentage',
    listingAgentCommission: '',
    listingAgentCommissionFixed: '',
    buyersAgentCommissionType: 'Percentage',
    buyersAgentCommission: '',
    buyersAgentCommissionFixed: '',
    buyerPaidCommission: '',
    
    // Referral Information
    referralParty: '',
    brokerEIN: '',
    referralFee: '',
    
    // Property Details
    resaleCertRequired: false,
    hoa: '',
    coRequired: false,
    firstRightOfRefusal: false,
    firstRightOfRefusalName: '',
    attorneyRepresentation: false,
    attorneyName: '',
    
    // Warranty Information
    homeWarrantyPurchased: false,
    homeWarrantyCompany: '',
    warrantyCost: '',
    warrantyPaidBy: 'Seller',
    
    // Title & Settlement
    titleCompany: '',
    tcFeePaidBy: 'Client' as TCFeePaidBy,
    
    // MLS & System Updates
    updateMLS: false,
    propertyStatus: 'Vacant',
    accessCode: '',
    
    // Documents
    requiredDocuments: [],
    acknowledgeDocuments: false,
    
    // Additional Information
    specialInstructions: '',
    urgentIssues: '',
    additionalNotes: '',
    
    // Final Details
    agentName: '',
    dateSubmitted: '',
    confirmSubmission: false,
    agentSignature: '',
    confirmationChecked: false,
    
    // Manual edit tracking
    isManualTotalFixed: false,
    isManualListingFixed: false,
    isManualBuyersFixed: false
  },
  metadata: {
    currentStep: 0,
    completedSteps: [],
    isDirty: false,
    lastSaved: null,
    isSubmitting: false,
    isSaving: false,
    submissionError: null,
    validationErrors: {},
    lastAttemptedStep: null
  }
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        data: {
          ...state.data,
          [action.field]: action.value
        },
        metadata: {
          ...state.metadata,
          isDirty: true,
          lastSaved: null
        }
      };

    case 'SET_STEP':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          currentStep: action.step
        }
      };

    case 'MARK_STEP_COMPLETE':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          completedSteps: [...new Set([...state.metadata.completedSteps, action.step])]
        }
      };

    case 'SET_SAVING':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          isSaving: action.isSaving,
          lastSaved: action.isSaving ? state.metadata.lastSaved : new Date()
        }
      };

    case 'SET_SUBMITTING':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          isSubmitting: action.isSubmitting
        }
      };

    case 'SET_SUBMISSION_ERROR':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          submissionError: action.error
        }
      };

    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          validationErrors: action.errors
        }
      };

    case 'SET_LAST_ATTEMPTED_STEP':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          lastAttemptedStep: action.step
        }
      };

    case 'LOAD_SAVED_STATE':
      return {
        ...state,
        ...action.state,
        metadata: {
          ...state.metadata,
          ...action.state.metadata,
          isDirty: false,
          lastSaved: new Date()
        }
      };

    case 'RESET_FORM':
      return {
        ...initialState,
        data: {
          ...initialState.data,
          clients: [{
            name: '',
            address: '',
            email: '',
            phone: '',
            maritalStatus: 'Single',
            designation: ''
          }]
        }
      };

    default:
      return state;
  }
};

const TransactionFormContext = createContext<TransactionFormContextType | undefined>(undefined);

export const TransactionFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Initialize analytics session
  useEffect(() => {
    analyticsService.initializeSession('agent', 'transaction-form');
  }, []);

  const updateFormData = useCallback((field: keyof TransactionFormData, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);

  const validateSection = useCallback((section: string, data: TransactionFormData): string[] => {
    const errors: string[] = [];
    const normalizedSection = section.toLowerCase().replace(/\s+/g, '');

    console.log('Validating section:', section, 'normalized:', normalizedSection);

    switch (normalizedSection) {
      case 'role':
      case 'roleselection':
        if (!data.role) errors.push('Please select your role');
        break;
      case 'property':
      case 'propertyinfo':
        if (!data.propertyAddress) errors.push('Property address is required');
        if (!data.salePrice) errors.push('Sale price is required');
        break;
      case 'client':
      case 'clientdetails':
        if (!data.clients?.[0]?.name) errors.push('Primary client name is required');
        if (!data.clients?.[0]?.email) errors.push('Primary client email is required');
        if (!data.clients?.[0]?.phone) errors.push('Primary client phone is required');
        break;
      case 'commission':
        if (!data.commissionBase) errors.push('Commission base is required');
        if (!data.totalCommission) errors.push('Total commission is required');
        break;
      case 'propertydetails':
        if (!data.propertyStatus) errors.push('Property status is required');
        break;
      case 'warranty':
      case 'warrantyinfo':
      case 'homewarranty':
        if (data.homeWarrantyPurchased === true) {
          if (!data.homeWarrantyCompany) {
            errors.push('Home warranty company is required when warranty is purchased');
          }
          if (!data.warrantyCost) {
            errors.push('Warranty cost is required when warranty is purchased');
          }
          if (!data.warrantyPaidBy) {
            errors.push('Warranty paid by is required when warranty is purchased');
          }
        }
        break;
      case 'titlecompany':
        if (!data.titleCompany) errors.push('Title company is required');
        if (!data.tcFeePaidBy) errors.push('TC fee paid by is required');
        break;
      case 'documents':
      case 'requireddocuments':
        // Document validation if needed
        break;
      case 'additionalinfo':
        // Additional info validation if needed
        break;
      case 'sign':
      case 'signature':
        // Signature validation if needed
        break;
    }

    console.log('Validation errors:', errors);
    return errors;
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      // Validate all sections
      const errors: string[] = [];
      Object.values(stepToSection).forEach(section => {
        const sectionErrors = validateSection(section, state.data);
        errors.push(...sectionErrors);
      });

      if (errors.length > 0) {
        throw new Error(`Please fix the following errors:\n${errors.join('\n')}`);
      }

      // Submit analytics
      await analyticsService.submitAnalytics();

      // Reset form after successful submission
      dispatch({ type: 'RESET_FORM' });
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }, [state.data, validateSection]);

  const value = {
    formData: state.data,
    updateFormData,
    handleSubmit,
    validateSection
  };

  return (
    <TransactionFormContext.Provider value={value}>
      {children}
    </TransactionFormContext.Provider>
  );
};

export const useTransactionForm = () => {
  const context = useContext(TransactionFormContext);
  if (!context) {
    throw new Error('useTransactionForm must be used within a TransactionFormProvider');
  }
  return context;
};