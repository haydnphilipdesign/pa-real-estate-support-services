import { TransactionFormData } from '../../components/TransactionForm/types';

export type ValidationLevel = 'invalid' | 'warning';

export interface ValidationRule {
  validate: (value: any, formData: TransactionFormData) => boolean;
  message: string;
  level: ValidationLevel;
  helpText?: string;
}

export interface ValidationError {
  field: keyof TransactionFormData;
  message: string;
  level: ValidationLevel;
  helpText?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class ValidationService {
  private rules: Map<keyof TransactionFormData, ValidationRule[]>;

  constructor() {
    this.rules = new Map();
    this.initializeRules();
  }

  private initializeRules() {
    // Property validation
    this.addRules('propertyAddress', [
      {
        validate: (value) => {
          if (value === null || value === undefined) return false;
          const strValue = String(value);
          return strValue.trim().length > 0;
        },
        message: 'Property address is required',
        level: 'invalid',
        helpText: 'Enter the complete property address'
      }
    ]);

    this.addRules('salePrice', [
      {
        validate: (value) => {
          if (value === null || value === undefined) return false;
          const strValue = String(value);
          return strValue.trim().length > 0;
        },
        message: 'Sale price is required',
        level: 'invalid',
        helpText: 'Enter the sale price of the property'
      }
    ]);

    // Client validation
    this.addRules('clients', [
      {
        validate: (clients) => {
          if (!Array.isArray(clients) || clients.length === 0) return false;
          const primaryClient = clients[0];
          return !!(primaryClient && 
                   typeof primaryClient === 'object' && 
                   String(primaryClient.name || '').trim() && 
                   String(primaryClient.email || '').trim() && 
                   String(primaryClient.phone || '').trim());
        },
        message: 'Primary client information is required',
        level: 'invalid',
        helpText: 'Enter name, email, and phone for the primary client'
      }
    ]);

    // Commission validation
    this.addRules('totalCommission', [
      {
        validate: (value) => {
          if (value === null || value === undefined) return false;
          const strValue = String(value);
          return strValue.trim().length > 0;
        },
        message: 'Total commission is required',
        level: 'invalid',
        helpText: 'Enter the total commission amount'
      }
    ]);

    // Title Company validation
    this.addRules('titleCompany', [
      {
        validate: (value) => {
          if (value === null || value === undefined) return false;
          const strValue = String(value);
          return strValue.trim().length > 0;
        },
        message: 'Title company is required',
        level: 'invalid',
        helpText: 'Select or enter the title company name'
      }
    ]);

    // Agent validation
    this.addRules('agentName', [
      {
        validate: (value) => {
          if (value === null || value === undefined) return false;
          const strValue = String(value);
          return strValue.trim().length > 0;
        },
        message: 'Agent name is required',
        level: 'invalid',
        helpText: 'Enter your full name'
      }
    ]);

    this.addRules('dateSubmitted', [
      {
        validate: (value) => {
          if (value === null || value === undefined) return false;
          const strValue = String(value);
          return strValue.trim().length > 0;
        },
        message: 'Submission date is required',
        level: 'invalid',
        helpText: 'Enter the submission date'
      }
    ]);

    // Additional validations for dependent fields
    this.addRules('homeWarrantyCompany', [
      {
        validate: (value, data) => !data.homeWarrantyPurchased || (!!value && value.trim().length > 0),
        message: 'Warranty company is required when warranty is purchased',
        level: 'invalid',
        helpText: 'Enter the warranty company name'
      }
    ]);

    this.addRules('warrantyCost', [
      {
        validate: (value, data) => !data.homeWarrantyPurchased || (!!value && !isNaN(parseFloat(value))),
        message: 'Warranty cost is required when warranty is purchased',
        level: 'invalid',
        helpText: 'Enter the warranty cost amount'
      }
    ]);

    this.addRules('firstRightOfRefusalName', [
      {
        validate: (value, data) => !data.firstRightOfRefusal || (!!value && value.trim().length > 0),
        message: 'Name is required when first right of refusal is selected',
        level: 'invalid',
        helpText: 'Enter the name for first right of refusal'
      }
    ]);

    this.addRules('attorneyName', [
      {
        validate: (value, data) => !data.attorneyRepresentation || (!!value && value.trim().length > 0),
        message: 'Attorney name is required when attorney representation is selected',
        level: 'invalid',
        helpText: 'Enter the attorney name'
      }
    ]);
  }

  private addRules(field: keyof TransactionFormData, rules: ValidationRule[]) {
    this.rules.set(field, rules);
  }

  validateField(field: keyof TransactionFormData, value: any, formData: TransactionFormData): ValidationResult {
    // Log validation attempt
    console.log(`Validating field: ${field}`, { value, formData });

    const rules = this.rules.get(field) || [];
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    rules.forEach(rule => {
      if (!rule.validate(value, formData)) {
        const error = {
          field,
          message: rule.message,
          level: rule.level,
          helpText: rule.helpText
        };
        
        if (rule.level === 'invalid') {
          errors.push(error);
        } else {
          warnings.push(error);
        }
      }
    });

    // Log validation result
    console.log(`Validation result for ${field}:`, { errors, warnings });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateSection(section: string, data: TransactionFormData): ValidationResult {
    // Log section validation attempt
    console.log(`Validating section: ${section}`, data);

    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Define fields for each section
    const sectionFields: Record<string, (keyof TransactionFormData)[]> = {
      role: ['role'],
      property: ['propertyAddress', 'salePrice'],
      client: ['clients'],
      commission: ['totalCommission'],
      title: ['titleCompany'],
      warranty: ['homeWarrantyCompany', 'warrantyCost'],
      additional: ['firstRightOfRefusalName', 'attorneyName'],
      sign: ['agentName', 'dateSubmitted']
    };

    const fields = sectionFields[section.toLowerCase()] || [];
    
    fields.forEach(field => {
      const result = this.validateField(field, data[field], data);
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    });

    // Special validation for clients array
    if (section.toLowerCase() === 'client' && Array.isArray(data.clients)) {
      const primaryClient = data.clients[0];
      if (!primaryClient || !String(primaryClient.name || '').trim()) {
        errors.push({
          field: 'clients',
          message: 'Primary client name is required',
          level: 'invalid',
          helpText: 'Enter the primary client\'s full name'
        });
      }
      if (!primaryClient || !String(primaryClient.email || '').trim()) {
        errors.push({
          field: 'clients',
          message: 'Primary client email is required',
          level: 'invalid',
          helpText: 'Enter the primary client\'s email address'
        });
      }
      if (!primaryClient || !String(primaryClient.phone || '').trim()) {
        errors.push({
          field: 'clients',
          message: 'Primary client phone is required',
          level: 'invalid',
          helpText: 'Enter the primary client\'s phone number'
        });
      }
    }

    // Log section validation result
    console.log(`Section validation result for ${section}:`, { errors, warnings });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateForm(data: TransactionFormData): ValidationResult {
    // Log form validation attempt
    console.log('Validating entire form:', data);

    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate all required fields
    const requiredFields: (keyof TransactionFormData)[] = [
      'propertyAddress',
      'salePrice',
      'totalCommission',
      'titleCompany',
      'agentName',
      'dateSubmitted'
    ];

    requiredFields.forEach(field => {
      const result = this.validateField(field, data[field], data);
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    });

    // Validate clients
    if (!Array.isArray(data.clients) || data.clients.length === 0 || 
        !data.clients[0] || 
        !String(data.clients[0].name || '').trim() || 
        !String(data.clients[0].email || '').trim() || 
        !String(data.clients[0].phone || '').trim()) {
      errors.push({
        field: 'clients',
        message: 'Primary client information is incomplete',
        level: 'invalid',
        helpText: 'Please provide all required information for the primary client'
      });
    }

    // Log form validation result
    console.log('Form validation result:', { errors, warnings });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

export const validationService = new ValidationService();
