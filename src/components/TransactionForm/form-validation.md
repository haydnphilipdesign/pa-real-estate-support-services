# Form Validation and Data Transformation

## Overview

This document outlines the validation and data transformation mechanisms implemented for the real estate transaction form system. The implementation ensures data integrity while providing a seamless user experience.

## Core Validation System

### Schema Definition

```typescript
// src/forms/validation/schemas.ts
import { z } from 'zod';
import { validateMLS, validateAddress } from '../utils/validators';

export const propertySchema = z.object({
  propertyAddress: z.string()
    .min(5, 'Property address is required')
    .refine(validateAddress, {
      message: 'Please enter a valid property address'
    }),
    
  mlsNumber: z.string()
    .regex(/^(?:\d{6}|PM-\d{6})$/, 'Invalid MLS format')
    .refine(validateMLS, {
      message: 'MLS number not found in database'
    }),
    
  salePrice: z.string()
    .regex(/^\d+(\.\d{2})?$/, 'Invalid price format')
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, {
      message: 'Sale price must be greater than 0'
    }),
    
  warrantyDetails: z.object({
    purchased: z.boolean(),
    company: z.string().optional(),
    cost: z.string()
      .regex(/^\d+(\.\d{2})?$/, 'Invalid cost format')
      .optional(),
    paidBy: z.enum(['Buyer', 'Seller', 'Agent']).optional()
  }).refine((data) => {
    if (data.purchased) {
      return data.company && data.cost && data.paidBy;
    }
    return true;
  }, {
    message: 'All warranty details are required when warranty is purchased'
  })
});

export const commissionSchema = z.object({
  commissionBase: z.enum(['Full Price', 'Net Price']),
  totalCommission: z.string()
    .regex(/^\d+(\.\d{2})?$/, 'Invalid commission format')
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0 && val <= 100, {
      message: 'Commission must be between 0 and 100'
    })
}).extend((schema) => {
  return {
    listingAgentCommission: schema.totalCommission.optional(),
    buyersAgentCommission: schema.totalCommission,
    referralDetails: z.object({
      party: z.string().optional(),
      brokerEIN: z.string()
        .regex(/^\d{2}-\d{7}$/, 'Invalid EIN format')
        .optional(),
      fee: z.string()
        .regex(/^\d+(\.\d{2})?$/, 'Invalid fee format')
        .optional()
    }).refine((data) => {
      if (data.party || data.brokerEIN || data.fee) {
        return data.party && data.brokerEIN && data.fee;
      }
      return true;
    }, {
      message: 'All referral details are required when any referral information is provided'
    })
  };
});
```

## Validation Hooks

### Field-Level Validation

```typescript
// src/forms/hooks/useFieldValidation.ts
interface ValidationOptions {
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  debounceMs?: number;
}

export function useFieldValidation(
  schema: z.ZodSchema,
  options: ValidationOptions = {}
) {
  const { state, dispatch } = useForm();
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(async (
    value: unknown,
    path: string
  ) => {
    setIsValidating(true);
    try {
      await schema.parseAsync(value);
      dispatch({ type: 'CLEAR_ERROR', path });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const [firstError] = error.errors;
        dispatch({
          type: 'SET_ERROR',
          path,
          error: firstError.message
        });
        return false;
      }
      throw error;
    } finally {
      setIsValidating(false);
    }
  }, [schema, dispatch]);

  const debouncedValidate = useMemo(
    () => debounce(validate, options.debounceMs || 300),
    [validate, options.debounceMs]
  );

  return {
    validate: options.debounceMs ? debouncedValidate : validate,
    isValidating
  };
}
```

### Form-Level Validation

```typescript
// src/forms/hooks/useFormValidation.ts
export function useFormValidation(schema: z.ZodSchema) {
  const { state, dispatch } = useForm();
  
  const validateForm = useCallback(async () => {
    try {
      const result = await schema.parseAsync(state.data);
      return {
        isValid: true,
        data: result
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          dispatch({
            type: 'SET_ERROR',
            path: err.path.join('.'),
            error: err.message
          });
        });
        return {
          isValid: false,
          errors: error.errors
        };
      }
      throw error;
    }
  }, [schema, state.data, dispatch]);

  return { validateForm };
}
```

## Data Transformation

### Command API Integration

```typescript
// src/forms/transforms/commandTransform.ts
interface CommandPayload {
  property: PropertyPayload;
  transaction: TransactionPayload;
  participants: ParticipantPayload[];
}

export function transformForCommand(
  formData: TransactionData
): CommandPayload {
  return {
    property: {
      address: formData.propertyAddress,
      mls_number: formData.mlsNumber,
      sale_price: parseFloat(formData.salePrice),
      status: formData.propertyStatus,
      access: {
        type: formData.accessInformation,
        code: formData.accessCode
      }
    },
    transaction: {
      commission: {
        base: formData.commissionBase,
        total_percentage: parseFloat(formData.totalCommission),
        listing_agent: formData.listingAgentCommission,
        buyers_agent: formData.buyersAgentCommission
      },
      warranty: formData.warrantyDetails?.purchased ? {
        provider: formData.warrantyDetails.company,
        cost: parseFloat(formData.warrantyDetails.cost!),
        paid_by: formData.warrantyDetails.paidBy
      } : undefined
    },
    participants: transformParticipants(formData)
  };
}

function transformParticipants(
  formData: TransactionData
): ParticipantPayload[] {
  return [
    {
      type: 'agent',
      role: formData.agentRole,
      name: formData.agentName
    },
    ...formData.clients.map((client) => ({
      type: 'client',
      role: client.designation,
      name: client.name,
      contact: {
        email: client.email,
        phone: client.phone,
        address: client.address
      },
      metadata: {
        marital_status: client.maritalStatus
      }
    }))
  ];
}
```

## Best Practices

1. **Validation Strategy**
   - Implement immediate field validation for better UX
   - Debounce expensive validations
   - Cache validation results when possible
   - Provide clear error messages

2. **Data Transformation**
   - Keep transformations pure and testable
   - Handle missing or optional data gracefully
   - Maintain type safety throughout
   - Document transformation rules

3. **Error Handling**
   - Group related errors logically
   - Support field and form-level validation
   - Implement retry mechanisms for async validations
   - Provide clear error recovery paths

4. **Performance**
   - Optimize validation timing
   - Cache expensive computations
   - Batch validation updates
   - Monitor validation performance

## Example Usage

```typescript
// src/forms/sections/PropertySection.tsx
export const PropertySection: React.FC = () => {
  const { state, dispatch } = useForm();
  const validation = useFieldValidation(propertySchema);
  
  const handleSubmit = async () => {
    const isValid = await validation.validateForm();
    if (isValid) {
      