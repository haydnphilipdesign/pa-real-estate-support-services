import { TransactionFormData, AgentRole, ClientInfo } from '../types';
import { getRequiredFieldsForSection } from './navigation';

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

type ValidationRule<T = any> = {
  validate: (value: T, formData?: TransactionFormData) => boolean;
  message: string | ((value: T) => string);
};

type ValidationRules<T = any> = {
  [K in keyof T]?: ValidationRule[];
};

// Validation Rules
const required = (message = 'This field is required'): ValidationRule => ({
  validate: (value: any) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return true;
    return value !== undefined && value !== null && value !== '';
  },
  message
});

const email = (message = 'Please enter a valid email address'): ValidationRule<string> => ({
  validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message
});

const phone = (message = 'Please enter a valid phone number'): ValidationRule<string> => ({
  validate: (value) => /^\d{10}$/.test(value.replace(/\D/g, '')),
  message
});

const currency = (message = 'Please enter a valid amount'): ValidationRule<string> => ({
  validate: (value) => {
    const amount = parseFloat(value.replace(/[^0-9.-]/g, ''));
    return !isNaN(amount) && amount >= 0;
  },
  message
});

const minLength = (length: number, message = `Must be at least ${length} characters`): ValidationRule<string> => ({
  validate: (value) => value.length >= length,
  message
});

// Role-specific validation rules
const roleRules: ValidationRules<{ role: AgentRole }> = {
  role: [
    required('Please select your role'),
    {
      validate: (value) => ['Buyer\'s Agent', 'Listing Agent', 'Dual Agent'].includes(value),
      message: 'Please select a valid role'
    }
  ]
};

// Client validation rules
const clientRules: ValidationRules<ClientInfo> = {
  name: [required('Client name is required'), minLength(2, 'Name must be at least 2 characters')],
  email: [required('Client email is required'), email()],
  phone: [required('Client phone is required'), phone()],
  address: [required('Client address is required')],
  maritalStatus: [required('Marital status is required')]
};

// Property validation rules
const propertyRules: ValidationRules = {
  propertyAddress: [required('Property address is required')],
  salePrice: [
    required('Sale price is required'),
    currency('Please enter a valid sale price')
  ],
  propertyStatus: [required('Property status is required')]
};

// Commission validation rules
const commissionRules: ValidationRules = {
  commissionBase: [required('Commission base is required')],
  totalCommission: [
    required('Total commission is required'),
    currency('Please enter a valid commission amount')
  ]
};

// Document validation rules
const documentRules: ValidationRules = {
  acknowledgeDocuments: [
    {
      validate: (value: boolean) => value === true,
      message: 'You must acknowledge the required documents'
    }
  ]
};

// Signature validation rules
const signatureRules: ValidationRules = {
  agentName: [required('Agent name is required')],
  dateSubmitted: [required('Date is required')],
  confirmationChecked: [
    {
      validate: (value: boolean) => value === true,
      message: 'You must confirm the submission'
    }
  ]
};

// Section-specific validation rules
const sectionValidationRules: Record<number, ValidationRules> = {
  0: roleRules,
  1: propertyRules,
  2: { clients: [required('At least one client is required')] },
  3: commissionRules,
  4: { accessType: [required('Access type is required')] },
  5: { homeWarrantyPurchased: [required('Home warranty selection is required')] },
  6: {
    titleCompany: [required('Title company is required')],
    tcFeePaidBy: [required('Fee payment responsibility must be specified')]
  },
  7: documentRules,
  8: {}, // Additional info section - no required fields
  9: signatureRules
};

// Validate a single field
export function validateField(
  field: keyof TransactionFormData,
  value: any,
  formData?: TransactionFormData
): ValidationResult {
  const errors: string[] = [];
  
  // Find the section that contains this field
  const section = Object.entries(sectionValidationRules).find(([_, rules]) => 
    Object.keys(rules).includes(field)
  );

  if (section) {
    const rules = sectionValidationRules[Number(section[0])][field];
    if (rules) {
      rules.forEach(rule => {
        if (!rule.validate(value, formData)) {
          errors.push(typeof rule.message === 'function' ? rule.message(value) : rule.message);
        }
      });
    }
  }

  // Special handling for clients array
  if (field === 'clients' && Array.isArray(value)) {
    value.forEach((client, index) => {
      Object.entries(clientRules).forEach(([clientField, rules]) => {
        rules.forEach(rule => {
          if (!rule.validate(client[clientField as keyof ClientInfo])) {
            errors.push(`Client ${index + 1}: ${typeof rule.message === 'function' ? 
              rule.message(client[clientField as keyof ClientInfo]) : 
              rule.message}`);
          }
        });
      });
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate an entire section
export function validateSection(
  sectionIndex: number,
  formData: TransactionFormData
): ValidationResult {
  const errors: string[] = [];
  const requiredFields = getRequiredFieldsForSection(sectionIndex);
  
  // Validate required fields
  requiredFields.forEach(field => {
    const validation = validateField(field, formData[field], formData);
    if (!validation.isValid) {
      errors.push(...validation.errors);
    }
  });

  // Additional section-specific validation
  const sectionRules = sectionValidationRules[sectionIndex];
  if (sectionRules) {
    Object.entries(sectionRules).forEach(([field, rules]) => {
      if (!requiredFields.includes(field as keyof TransactionFormData)) {
        const validation = validateField(
          field as keyof TransactionFormData,
          formData[field as keyof TransactionFormData],
          formData
        );
        if (!validation.isValid) {
          errors.push(...validation.errors);
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate the entire form
export function validateForm(formData: TransactionFormData): ValidationResult {
  const errors: string[] = [];
  
  // Validate each section
  Object.keys(sectionValidationRules).forEach(sectionIndex => {
    const validation = validateSection(Number(sectionIndex), formData);
    if (!validation.isValid) {
      errors.push(...validation.errors);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
} 