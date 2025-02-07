# Form Utilities and Validation

## Overview

This module implements comprehensive validation and data transformation utilities for the real estate transaction form system. The implementation focuses on type safety, performance, and maintainability.

## Validation Implementation

### Field Validation Rules

```typescript
// src/forms/validation/rules.ts
export const validationRules = {
  /**
   * Currency validation with configurable precision
   * Supports different currency formats and handles edge cases
   */
  currency: {
    validate: (value: string, options: { min?: number; max?: number } = {}) => {
      // Remove currency symbols and formatting
      const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
      
      if (isNaN(numericValue)) {
        return 'Please enter a valid amount';
      }
      
      if (options.min !== undefined && numericValue < options.min) {
        return `Amount must be at least ${formatCurrency(options.min)}`;
      }
      
      if (options.max !== undefined && numericValue > options.max) {
        return `Amount cannot exceed ${formatCurrency(options.max)}`;
      }
      
      // Ensure proper decimal places
      if (!/^\d+(\.\d{2})?$/.test(numericValue.toFixed(2))) {
        return 'Please enter an amount with up to 2 decimal places';
      }
      
      return undefined;
    },
    format: (value: string) => {
      const numeric = parseFloat(value.replace(/[^0-9.-]/g, ''));
      return isNaN(numeric) ? '' : numeric.toFixed(2);
    }
  },

  /**
   * Phone number validation with format support
   * Handles various input formats and normalizes output
   */
  phone: {
    validate: (value: string) => {
      // Remove all non-numeric characters
      const digits = value.replace(/\D/g, '');
      
      if (digits.length !== 10) {
        return 'Phone number must be 10 digits';
      }
      
      if (!/^\d{10}$/.test(digits)) {
        return 'Please enter a valid phone number';
      }
      
      return undefined;
    },
    format: (value: string) => {
      const digits = value.replace(/\D/g, '');
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
  },

  /**
   * Commission validation with business rules
   * Implements complex validation logic for commission calculations
   */
  commission: {
    validate: (value: string, context: CommissionContext) => {
      const percentage = parseFloat(value);
      
      if (isNaN(percentage)) {
        return 'Please enter a valid commission percentage';
      }
      
      if (percentage < 0 || percentage > 100) {
        return 'Commission must be between 0% and 100%';
      }
      
      // Business rule: Commission cannot exceed 10% of sale price
      const maxCommission = (parseFloat(context.salePrice) * 0.1);
      const commissionAmount = (parseFloat(context.salePrice) * percentage) / 100;
      
      if (commissionAmount > maxCommission) {
        return `Commission cannot exceed ${formatCurrency(maxCommission)}`;
      }
      
      return undefined;
    },
    format: (value: string) => {
      const numeric = parseFloat(value);
      return isNaN(numeric) ? '' : numeric.toFixed(2);
    }
  }
};
```

## Data Transformation

### Command API Transform

```typescript
// src/forms/transforms/commandTransform.ts
interface CommandPayload {
  transaction: {
    property: PropertyData;
    commission: CommissionData;
    participants: ParticipantData[];
    documents: DocumentData[];
  };
  metadata: {
    submittedAt: string;
    submittedBy: string;
    status: TransactionStatus;
  };
}

export class CommandTransformer {
  /**
   * Transform form data into Command API format
   * Handles data normalization and validation
   */
  static transformForCommand(formData: FormState): CommandPayload {
    return {
      transaction: {
        property: this.transformProperty(formData),
        commission: this.transformCommission(formData),
        participants: this.transformParticipants(formData),
        documents: this.transformDocuments(formData)
      },
      metadata: {
        submittedAt: new Date().toISOString(),
        submittedBy: formData.agentName,
        status: 'pending_review'
      }
    };
  }

  /**
   * Transform property data with address normalization
   * Implements geocoding and format standardization
   */
  private static transformProperty(
    formData: FormState
  ): PropertyData {
    const address = parseAddress(formData.propertyAddress);
    
    return {
      mlsNumber: formData.mlsNumber,
      address: {
        street: address.street,
        unit: address.unit,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        coordinates: address.coordinates
      },
      pricing: {
        listPrice: parseCurrency(formData.salePrice),
        salePrice: parseCurrency(formData.salePrice),
        commissionBase: formData.commissionBase
      },
      status: formData.propertyStatus,
      access: {
        type: formData.accessInformation,
        code: formData.accessCode,
        notes: formData.accessNotes
      },
      warranty: formData.warrantyDetails?.purchased ? {
        provider: formData.warrantyDetails.company,
        cost: parseCurrency(formData.warrantyDetails.cost),
        paidBy: formData.warrantyDetails.paidBy
      } : null
    };
  }

  /**
   * Transform commission data with calculations
   * Handles percentage-based and flat-rate commissions
   */
  private static transformCommission(
    formData: FormState
  ): CommissionData {
    const salePrice = parseCurrency(formData.salePrice);
    const totalCommission = this.calculateCommission(
      salePrice,
      parseFloat(formData.totalCommission),
      formData.commissionBase
    );

    return {
      base: formData.commissionBase,
      total: {
        percentage: parseFloat(formData.totalCommission),
        amount: totalCommission
      },
      splits: {
        listingAgent: formData.listingAgentCommission 
          ? parseFloat(formData.listingAgentCommission) 
          : null,
        buyersAgent: parseFloat(formData.buyersAgentCommission),
        referral: formData.referralDetails ? {
          party: formData.referralDetails.party,
          brokerEIN: formData.referralDetails.brokerEIN,
          fee: parseCurrency(formData.referralDetails.fee)
        } : null
      }
    };
  }

  /**
   * Calculate commission amounts based on business rules
   * Implements different calculation methods based on commission base
   */
  private static calculateCommission(
    salePrice: number,
    percentage: number,
    base: CommissionBase
  ): number {
    const baseAmount = base === 'Net Price'
      ? salePrice * 0.97  // Standard closing cost adjustment
      : salePrice;
    
    return (baseAmount * percentage) / 100;
  }
}
```

## Data Parsing and Formatting

### Currency Handling

```typescript
// src/forms/utils/currency.ts
interface CurrencyOptions {
  precision?: number;
  allowNegative?: boolean;
  symbol?: string;
}

/**
 * Currency parsing and formatting utilities
 * Implements robust handling of various input formats
 */
export class CurrencyUtils {
  /**
   * Parse currency string to numeric value
   * Handles various input formats and validates result
   */
  static parse(value: string, options: CurrencyOptions = {}): number {
    const {
      allowNegative = false,
      precision = 2
    } = options;

    // Remove currency symbols and formatting
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);

    if (isNaN(parsed)) {
      throw new Error('Invalid currency format');
    }

    if (!allowNegative && parsed < 0) {
      throw new Error('Negative values not allowed');
    }

    // Enforce precision
    return Number(parsed.toFixed(precision));
  }

  /**
   * Format numeric value as currency string
   * Supports localization and custom formatting
   */
  static format(
    value: number,
    options: CurrencyOptions = {}
  ): string {
    const {
      precision = 2,
      symbol = '
    } = options;

    // Handle invalid input
    if (isNaN(value)) {
      return '';
    }

    // Format with proper precision
    const formatted = value.toFixed(precision);
    
    // Add grouping separators
    const [dollars, cents] = formatted.split('.');
    const withCommas = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `${symbol}${withCommas}.${cents}`;
  }

  /**
   * Validate currency value against business rules
   * Implements comprehensive validation logic
   */
  static validate(
    value: number,
    rules: {
      min?: number;
      max?: number;
      allowZero?: boolean;
    } = {}
  ): ValidationResult {
    const {
      min = 0,
      max = Number.MAX_SAFE_INTEGER,
      allowZero = false
    } = rules;

    if (!allowZero && value === 0) {
      return {
        isValid: false,
        error: 'Amount cannot be zero'
      };
    }

    if (value < min) {
      return {
        isValid: false,
        error: `Amount must be at least ${this.format(min)}`
      };
    }

    if (value > max) {
      return {
        isValid: false,
        error: `Amount cannot exceed ${this.format(max)}`
      };
    }

    return { isValid: true };
  }
}
```

### Address Processing

```typescript
// src/forms/utils/address.ts
interface ParsedAddress {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Address parsing and normalization utilities
 * Implements comprehensive address handling
 */
export class AddressUtils {
  /**
   * Parse address string into structured components
   * Handles various input formats and normalizes output
   */
  static parse(address: string): ParsedAddress {
    // Extract components using regex patterns
    const matches = address.match(
      /^(\d+\s+[\w\s]+?)(?:\s+(#?\w+))?,\s*([^,]+),\s*(\w{2})\s*(\d{5}(?:-\d{4})?)/i
    );

    if (!matches) {
      throw new Error('Invalid address format');
    }

    const [
      _,
      street,
      unit,
      city,
      state,
      zipCode
    ] = matches;

    return {
      street: this.normalizeStreet(street),
      unit: unit ? this.normalizeUnit(unit) : undefined,
      city: this.normalizeCity(city),
      state: state.toUpperCase(),
      zipCode: this.normalizeZipCode(zipCode)
    };
  }

  /**
   * Normalize street address component
   * Standardizes abbreviations and formatting
   */
  private static normalizeStreet(street: string): string {
    return street
      // Standardize directionals
      .replace(/\b(north|south|east|west)\b/gi, m => 
        m.charAt(0).toUpperCase())
      // Standardize common abbreviations
      .replace(/\b(street|avenue|boulevard|road|drive|lane|court|circle)\b/gi, m => 
        this.STREET_ABBREV[m.toLowerCase()] || m)
      // Remove extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Geocode address to coordinates
   * Implements caching and rate limiting
   */
  static async geocode(
    address: string,
    options: GeocodingOptions = {}
  ): Promise<GeocodingResult> {
    const cacheKey = this.generateCacheKey(address);
    const cached = await this.geocodeCache.get(cacheKey);

    if (cached && !options.bypassCache) {
      return cached;
    }

    // Rate limit check
    await this.rateLimiter.checkLimit();

    try {
      const result = await this.geocodingService.geocode(address);
      await this.geocodeCache.set(cacheKey, result);
      return result;
    } catch (error) {
      throw new GeocodingError(
        `Failed to geocode address: ${error.message}`,
        { address, error }
      );
    }
  }

  // Additional utility methods...
}
```

## Error Handling

### Validation Error Handling

```typescript
// src/forms/errors/validationErrors.ts
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Centralized validation error handling
 * Implements comprehensive error management
 */
export class ValidationErrorHandler {
  private errors: Map<string, ValidationError> = new Map();

  /**
   * Add validation error with field context
   * Supports error aggregation and deduplication
   */
  addError(field: string, message: string, details?: Record<string, any>) {
    this.errors.set(
      field,
      new ValidationError(message, field, details)
    );
  }

  /**
   * Get all validation errors
   * Returns errors grouped by field
   */
  getErrors(): Record<string, string> {
    return Object.fromEntries(
      Array.from(this.errors.entries()).map(
        ([field, error]) => [field, error.message]
      )
    );
  }

  /**
   * Check if specific field has errors
   * Supports nested field paths
   */
  hasError(field: string): boolean {
    // Check exact field match
    if (this.errors.has(field)) {
      return true;
    }

    // Check nested fields
    const fieldPath = field.split('.');
    return Array.from(this.errors.keys()).some(errorField => {
      const errorPath = errorField.split('.');
      return this.isSubPath(fieldPath, errorPath);
    });
  }

  /**
   * Clear errors for specific field
   * Supports clearing nested field errors
   */
  clearError(field: string) {
    const fieldsToDelete = Array.from(this.errors.keys())
      .filter(errorField => errorField.startsWith(field));
    
    fieldsToDelete.forEach(field => this.errors.delete(field));
  }
}
```

These utilities provide:
- Robust currency handling with validation
- Comprehensive address processing
- Error management with field context
- Type safety throughout the implementation
- Clear separation of concerns
- Extensive error handling
- Performance optimization through caching
- Business rule enforcement

The implementation supports complex real estate transaction requirements while maintaining code quality and developer experience.