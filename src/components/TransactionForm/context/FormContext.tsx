import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { TransactionFormData, AgentRole } from '../types';

// State Types
interface FormState {
  formData: TransactionFormData;
  currentSection: number;
  completedSections: number[];
  validationState: {
    [K in keyof TransactionFormData]?: {
      isValid: boolean;
      errors: string[];
      touched: boolean;
    }
  };
  isSubmitting: boolean;
}

// Action Types
type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof TransactionFormData; value: any }
  | { type: 'SET_SECTION'; section: number }
  | { type: 'COMPLETE_SECTION'; section: number }
  | { type: 'SET_VALIDATION'; field: keyof TransactionFormData; isValid: boolean; errors: string[] }
  | { type: 'TOUCH_FIELD'; field: keyof TransactionFormData }
  | { type: 'RESET_FORM' }
  | { type: 'START_SUBMISSION' }
  | { type: 'END_SUBMISSION' };

// Initial State
const initialFormData: TransactionFormData = {
  role: '',
  mlsNumber: '',
  propertyAddress: '',
  salePrice: '',
  propertyStatus: 'Vacant',
  accessType: 'Electronic Lockbox',
  winterizedStatus: 'No',
  updateMlsStatus: false,
  clients: [{
    name: '',
    address: '',
    email: '',
    phone: '',
    maritalStatus: 'Single',
    designation: ''
  }],
  commissionBase: 'Sale Price',
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
  referralParty: '',
  brokerEIN: '',
  referralFee: '',
  resaleCertRequired: false,
  hoa: '',
  coRequired: false,
  municipalityTownship: '',
  firstRightOfRefusal: false,
  firstRightOfRefusalName: '',
  attorneyRepresentation: false,
  attorneyName: '',
  homeWarrantyPurchased: false,
  homeWarrantyCompany: '',
  warrantyCost: '',
  warrantyPaidBy: 'Seller',
  titleCompany: '',
  tcFeePaidBy: 'Client',
  accessCode: '',
  updateMLS: false,
  acknowledgeDocuments: false,
  specialInstructions: '',
  urgentIssues: '',
  additionalNotes: '',
  requiredDocuments: [],
  agentName: '',
  dateSubmitted: '',
  confirmSubmission: false,
  agentSignature: '',
  confirmationChecked: false
};

const initialState: FormState = {
  formData: initialFormData,
  currentSection: -1, // Start at intro section
  completedSections: [],
  validationState: {},
  isSubmitting: false
};

// Reducer
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value
        }
      };

    case 'SET_SECTION':
      return {
        ...state,
        currentSection: action.section
      };

    case 'COMPLETE_SECTION':
      return {
        ...state,
        completedSections: [...new Set([...state.completedSections, action.section])].sort((a, b) => a - b)
      };

    case 'SET_VALIDATION':
      return {
        ...state,
        validationState: {
          ...state.validationState,
          [action.field]: {
            ...state.validationState[action.field],
            isValid: action.isValid,
            errors: action.errors
          }
        }
      };

    case 'TOUCH_FIELD':
      return {
        ...state,
        validationState: {
          ...state.validationState,
          [action.field]: {
            ...state.validationState[action.field],
            touched: true
          }
        }
      };

    case 'RESET_FORM':
      return {
        ...initialState,
        currentSection: -1
      };

    case 'START_SUBMISSION':
      return {
        ...state,
        isSubmitting: true
      };

    case 'END_SUBMISSION':
      return {
        ...state,
        isSubmitting: false
      };

    default:
      return state;
  }
}

// Context
interface FormContextType {
  state: FormState;
  updateField: <K extends keyof TransactionFormData>(field: K, value: TransactionFormData[K]) => void;
  setSection: (section: number) => void;
  completeSection: (section: number) => void;
  setValidation: (field: keyof TransactionFormData, isValid: boolean, errors: string[]) => void;
  touchField: (field: keyof TransactionFormData) => void;
  resetForm: () => void;
  startSubmission: () => void;
  endSubmission: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider
export function FormProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const updateField = useCallback(<K extends keyof TransactionFormData>(
    field: K,
    value: TransactionFormData[K]
  ) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);

  const setSection = useCallback((section: number) => {
    dispatch({ type: 'SET_SECTION', section });
  }, []);

  const completeSection = useCallback((section: number) => {
    dispatch({ type: 'COMPLETE_SECTION', section });
  }, []);

  const setValidation = useCallback((
    field: keyof TransactionFormData,
    isValid: boolean,
    errors: string[]
  ) => {
    dispatch({ type: 'SET_VALIDATION', field, isValid, errors });
  }, []);

  const touchField = useCallback((field: keyof TransactionFormData) => {
    dispatch({ type: 'TOUCH_FIELD', field });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const startSubmission = useCallback(() => {
    dispatch({ type: 'START_SUBMISSION' });
  }, []);

  const endSubmission = useCallback(() => {
    dispatch({ type: 'END_SUBMISSION' });
  }, []);

  const value = {
    state,
    updateField,
    setSection,
    completeSection,
    setValidation,
    touchField,
    resetForm,
    startSubmission,
    endSubmission
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

// Hook
export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}

// Selector Hooks
export function useFormField<K extends keyof TransactionFormData>(field: K) {
  const { state, updateField, touchField, setValidation } = useForm();
  
  return {
    value: state.formData[field],
    validation: state.validationState[field],
    updateValue: (value: TransactionFormData[K]) => updateField(field, value),
    touch: () => touchField(field),
    setValidation: (isValid: boolean, errors: string[]) => setValidation(field, isValid, errors)
  };
}

export function useFormSection(section: number) {
  const { state, setSection, completeSection } = useForm();
  
  return {
    isActive: state.currentSection === section,
    isCompleted: state.completedSections.includes(section),
    activate: () => setSection(section),
    complete: () => completeSection(section)
  };
} 