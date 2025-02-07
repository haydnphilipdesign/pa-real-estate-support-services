import { z } from 'zod';
import { TransactionFormData } from '../components/TransactionForm/types';
import { analyticsService } from './analytics';

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface ValidationRule {
  validate: (value: any) => ValidationResult;
  description: string;
}

const createRule = (
  validator: (value: any) => boolean,
  message: string,
  description: string
): ValidationRule => ({
  validate: (value: any) => ({
    isValid: validator(value),
    message
  }),
  description
});

// Utility validators
const isNotEmpty = (value: any) => value !== undefined && value !== null && value !== '';
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone: string) => /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
const isValidMLS = (mls: string) => /^[A-Z0-9]{6,10}$/.test(mls);
const isNumeric = (value: string) => /^\d+$/.test(value);
const isValidPercentage = (value: string) => /^\d+(\.\d{1,2})?%?$/.test(value);
const isValidAddress = (address: string) => {
  const parts = address.split(',').map(part => part.trim());
  return parts.length >= 3 && parts.every(part => part.length > 0);
};

export const validationRules: Record<string, ValidationRule[]> = {
  // Role Section
  role: [
    createRule(
      isNotEmpty,
      'Role is required',
      'Must select an agent role'
    )
  ],

  // Property Section
  mlsNumber: [
    createRule(
      isNotEmpty,
      'MLS number is required',
      'MLS number must be provided'
    ),
    createRule(
      isValidMLS,
      'Invalid MLS number format',
      'Must be 6-10 alphanumeric characters'
    )
  ],
  propertyAddress: [
    createRule(
      isNotEmpty,
      'Property address is required',
      'Property address must be provided'
    ),
    createRule(
      isValidAddress,
      'Invalid address format',
      'Must include street, city, state, and ZIP'
    )
  ],
  propertyStatus: [
    createRule(
      isNotEmpty,
      'Property status is required',
      'Must select a property status'
    )
  ],

  // Client Section
  'clients.name': [
    createRule(
      isNotEmpty,
      'Client name is required',
      'Full name must be provided'
    ),
    createRule(
      value => value?.includes(' '),
      'Must include first and last name',
      'Name must include both first and last name'
    )
  ],
  'clients.email': [
    createRule(
      isNotEmpty,
      'Email is required',
      'Email address must be provided'
    ),
    createRule(
      isValidEmail,
      'Invalid email format',
      'Must be a valid email address'
    )
  ],
  'clients.phone': [
    createRule(
      isNotEmpty,
      'Phone number is required',
      'Phone number must be provided'
    ),
    createRule(
      isValidPhone,
      'Invalid phone format',
      'Must be in format (XXX) XXX-XXXX'
    )
  ],
  'clients.maritalStatus': [
    createRule(
      isNotEmpty,
      'Marital status is required',
      'Must select a marital status'
    )
  ],

  // Commission Section
  salePrice: [
    createRule(
      isNotEmpty,
      'Sale price is required',
      'Sale price must be provided'
    ),
    createRule(
      isNumeric,
      'Must be a numeric value',
      'Sale price must be a number without special characters'
    )
  ],
  commissionBase: [
    createRule(
      isNotEmpty,
      'Commission base is required',
      'Commission base must be provided'
    ),
    createRule(
      isValidPercentage,
      'Invalid percentage format',
      'Must be a valid percentage (e.g., 2.5% or 2.5)'
    )
  ],
  totalCommission: [
    createRule(
      isNotEmpty,
      'Total commission is required',
      'Total commission must be provided'
    ),
    createRule(
      isNumeric,
      'Must be a numeric value',
      'Total commission must be a number'
    )
  ],

  // Property Details
  winterizedStatus: [
    createRule(
      isNotEmpty,
      'Winterized status is required',
      'Must specify winterized status'
    )
  ],
  accessType: [
    createRule(
      isNotEmpty,
      'Access type is required',
      'Must specify how to access the property'
    )
  ],

  // Warranty Section
  homeWarrantyCompany: [
    createRule(
      (value, formData: TransactionFormData) => 
        !formData.homeWarrantyPurchased || isNotEmpty(value),
      'Warranty company is required when warranty is purchased',
      'Must provide warranty company if warranty is purchased'
    )
  ],
  warrantyCost: [
    createRule(
      (value, formData: TransactionFormData) =>
        !formData.homeWarrantyPurchased || (isNotEmpty(value) && isNumeric(value)),
      'Warranty cost is required and must be numeric',
      'Must provide numeric warranty cost if warranty is purchased'
    )
  ],

  // Title Company
  titleCompany: [
    createRule(
      isNotEmpty,
      'Title company is required',
      'Must select a title company'
    )
  ],
  tcFeePaidBy: [
    createRule(
      isNotEmpty,
      'Fee responsibility is required',
      'Must specify who pays the title company fee'
    )
  ]
};

// Schema for form validation using Zod
export const transactionFormSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  mlsNumber: z.string().regex(/^[A-Z0-9]{6,10}$/, 'Invalid MLS number format'),
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyStatus: z.string().min(1, 'Property status is required'),
  clients: z.array(z.object({
    name: z.string().min(1, 'Client name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format'),
    maritalStatus: z.string().min(1, 'Marital status is required')
  })),
  salePrice: z.string().regex(/^\d+$/, 'Must be a numeric value'),
  commissionBase: z.string().regex(/^\d+(\.\d{1,2})?%?$/, 'Invalid percentage format'),
  totalCommission: z.string().regex(/^\d+$/, 'Must be a numeric value'),
  winterizedStatus: z.string().min(1, 'Winterized status is required'),
  accessType: z.string().min(1, 'Access type is required'),
  homeWarrantyPurchased: z.boolean(),
  homeWarrantyCompany: z.string().optional(),
  warrantyCost: z.string().regex(/^\d+$/, 'Must be a numeric value').optional(),
  titleCompany: z.string().min(1, 'Title company is required'),
  tcFeePaidBy: z.string().min(1, 'Fee responsibility is required')
});

export const validateField = (
  fieldName: string,
  value: any,
  formData?: TransactionFormData
): ValidationResult[] => {
  const rules = validationRules[fieldName];
  if (!rules) return [];

  return rules.map(rule => rule.validate(value, formData));
};

export const validateForm = (formData: TransactionFormData): Record<string, ValidationResult[]> => {
  const results: Record<string, ValidationResult[]> = {};

  Object.keys(validationRules).forEach(fieldName => {
    results[fieldName] = validateField(fieldName, 
      fieldName.includes('.') 
        ? fieldName.split('.').reduce((obj, key) => obj?.[key], formData)
        : formData[fieldName as keyof TransactionFormData],
      formData
    );
  });

  return results;
};

export class ValidationService {
  private static rules: ValidationRules = {
    mlsNumber: [
      {
        validate: (value) => !!value && /^[A-Z0-9-]+$/i.test(value),
        message: "MLS number must contain only letters, numbers, and hyphens"
      }
    ],
    propertyAddress: [
      {
        validate: (value) => !!value && value.length >= 10,
        message: "Property address must be complete with street, city, and state"
      }
    ],
    salePrice: [
      {
        validate: (value) => !!value && !isNaN(Number(value.replace(/[$,]/g, ''))),
        message: "Sale price must be a valid number"
      }
    ],
    clients: [
      {
        validate: (clients) => Array.isArray(clients) && clients.length > 0,
        message: "At least one client is required"
      },
      {
        validate: (clients) => clients.every((c: any) => c.name && c.email && c.phone),
        message: "All client information must be complete"
      }
    ],
    commissionBase: [
      {
        validate: (value, formData) => {
          if (value === "Sale Price") {
            return !!formData.salePrice;
          }
          return true;
        },
        message: "Sale price is required when commission is based on sale price",
        dependentFields: ['salePrice']
      }
    ],
    totalCommission: [
      {
        validate: (value, formData) => {
          if (formData.commissionBase === "Sale Price") {
            const commission = Number(value.replace(/[%$,]/g, ''));
            return !isNaN(commission) && commission > 0 && commission <= 100;
          }
          return true;
        },
        message: "Commission must be a valid percentage or amount",
        dependentFields: ['commissionBase']
      }
    ],
    homeWarrantyCompany: [
      {
        validate: (value, formData) => {
          return !formData.homeWarrantyPurchased || !!value;
        },
        message: "Warranty company is required when home warranty is purchased",
        dependentFields: ['homeWarrantyPurchased']
      }
    ],
    warrantyCost: [
      {
        validate: (value, formData) => {
          return !formData.homeWarrantyPurchased || (!!value && !isNaN(Number(value.replace(/[$,]/g, ''))));
        },
        message: "Valid warranty cost is required when home warranty is purchased",
        dependentFields: ['homeWarrantyPurchased']
      }
    ],
    firstRightOfRefusalName: [
      {
        validate: (value, formData) => {
          return !formData.firstRightOfRefusal || !!value;
        },
        message: "Name is required when first right of refusal is selected",
        dependentFields: ['firstRightOfRefusal']
      }
    ],
    attorneyName: [
      {
        validate: (value, formData) => {
          return !formData.attorneyRepresentation || !!value;
        },
        message: "Attorney name is required when attorney representation is selected",
        dependentFields: ['attorneyRepresentation']
      }
    ]
  };

  public static validateField(
    fieldName: string,
    value: any,
    formData: TransactionFormData
  ): string[] {
    const fieldRules = this.rules[fieldName];
    if (!fieldRules) return [];

    const errors = fieldRules
      .filter(rule => !rule.validate(value, formData))
      .map(rule => rule.message);

    // Track validation attempt in analytics
    analyticsService.trackValidationAttempt(fieldName, errors.length);

    return errors;
  }

  public static validateDependentFields(
    changedField: string,
    formData: TransactionFormData
  ): Record<string, string[]> {
    const dependentValidations: Record<string, string[]> = {};

    Object.entries(this.rules).forEach(([fieldName, rules]) => {
      rules.forEach(rule => {
        if (rule.dependentFields?.includes(changedField)) {
          const fieldValue = formData[fieldName as keyof TransactionFormData];
          const errors = this.validateField(fieldName, fieldValue, formData);
          if (errors.length > 0) {
            dependentValidations[fieldName] = errors;
          }
        }
      });
    });

    return dependentValidations;
  }

  public static validateSection(
    sectionName: string,
    formData: TransactionFormData
  ): string[] {
    const sectionFields = this.getSectionFields(sectionName);
    const errors: string[] = [];

    sectionFields.forEach(fieldName => {
      const fieldValue = formData[fieldName as keyof TransactionFormData];
      const fieldErrors = this.validateField(fieldName, fieldValue, formData);
      errors.push(...fieldErrors);
    });

    return errors;
  }

  private static getSectionFields(sectionName: string): string[] {
    // Map section names to their respective fields
    const sectionFieldMap: Record<string, string[]> = {
      role: ['role'],
      property: ['mlsNumber', 'propertyAddress', 'salePrice'],
      client: ['clients'],
      commission: ['commissionBase', 'totalCommission', 'listingAgentCommission', 'buyersAgentCommission'],
      propertyDetails: ['propertyStatus', 'winterizedStatus', 'accessType', 'hoa', 'municipalityTownship'],
      warranty: ['homeWarrantyPurchased', 'homeWarrantyCompany', 'warrantyCost', 'warrantyPaidBy'],
      titleCompany: ['titleCompany', 'tcFeePaidBy'],
      documents: ['requiredDocuments', 'acknowledgeDocuments'],
      additionalInfo: ['specialInstructions', 'urgentIssues'],
      signature: ['agentName', 'agentSignature', 'confirmationChecked']
    };

    return sectionFieldMap[sectionName] || [];
  }
} 