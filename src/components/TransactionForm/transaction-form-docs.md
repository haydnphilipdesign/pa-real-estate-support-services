# Real Estate Transaction Form: Technical Implementation Guide

## Overview
Implementation of a comprehensive real estate transaction form system aligned with the Command intake grid schema. The system handles complex data relationships, validation, and state management across multiple interconnected form sections.

## Data Model

### Core Entity Types

```typescript
// src/forms/types/schema.ts
export interface TransactionData {
  // Property Information
  propertyAddress: string;
  mlsNumber: string;
  salePrice: string;
  propertyStatus: PropertyStatus;
  winteredStatus: WinteredStatus;
  accessInformation: AccessInformation;
  accessCode?: string;

  // Agent Information
  agentName: string;
  agentRole: AgentRole;
  dateSubmitted: string;

  // Client Information
  clients: Client[];
  
  // Commission Structure
  commissionBase: CommissionBase;
  totalCommission: string;
  listingAgentCommission?: number;
  buyersAgentCommission?: number;
  
  // Additional Details
  referralDetails?: ReferralDetails;
  warrantyDetails?: WarrantyDetails;
  titleDetails?: TitleDetails;
  
  // Tracking & Status
  requiredDocuments: string[];
  contractDate?: string;
  closingDate?: string;
  status: TransactionStatus;
}

interface Client {
  id: string;
  type: 'primary' | 'secondary';
  name: string;
  address: string;
  email: string;
  phone: string;
  maritalStatus: MaritalStatus;
}

interface ReferralDetails {
  party: string;
  brokerEIN: string;
  fee: string;
}

interface WarrantyDetails {
  purchased: boolean;
  company?: string;
  cost?: string;
  paidBy?: 'Buyer' | 'Seller' | 'Agent';
}
```

## Form Architecture

### 1. State Management

```typescript
// src/forms/context/TransactionContext.tsx
interface TransactionState {
  data: TransactionData;
  metadata: {
    currentStep: number;
    completedSteps: number[];
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    isSubmitting: boolean;
  };
}

type TransactionAction =
  | { type: 'UPDATE_FIELD'; path: string; value: any }
  | { type: 'SET_STEP'; step: number }
  | { type: 'MARK_COMPLETE'; step: number }
  | { type: 'SET_ERROR'; path: string; error: string }
  | { type: 'START_SUBMIT' }
  | { type: 'COMPLETE_SUBMIT' };

const transactionReducer = (
  state: TransactionState,
  action: TransactionAction
): TransactionState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        data: setIn(state.data, action.path, action.value)
      };
    // Additional cases...
  }
};
```

### 2. Form Sections Implementation

#### Property Section

```typescript
// src/forms/sections/PropertySection.tsx
export const PropertySection: React.FC = () => {
  const { state, dispatch } = useTransactionContext();
  const validation = useValidation('property');

  const handleAddressChange = useCallback((value: string) => {
    dispatch({
      type: 'UPDATE_FIELD',
      path: 'propertyAddress',
      value
    });

    // Auto-populate municipality/township
    if (value) {
      const township = extractTownship(value);
      if (township) {
        dispatch({
          type: 'UPDATE_FIELD',
          path: 'municipalityTownship',
          value: township
        });
      }
    }
  }, [dispatch]);

  return (
    <FormSection title="Property Information">
      <AddressField
        value={state.data.propertyAddress}
        onChange={handleAddressChange}
        error={validation.getError('propertyAddress')}
      />
      
      <PriceField
        value={state.data.salePrice}
        onChange={(value) => dispatch({
          type: 'UPDATE_FIELD',
          path: 'salePrice',
          value
        })}
        error={validation.getError('salePrice')}
      />
      
      {/* Additional fields... */}
    </FormSection>
  );
};
```

### 3. Validation Implementation

```typescript
// src/forms/validation/schema.ts
import { z } from 'zod';

export const propertySchema = z.object({
  propertyAddress: z.string().min(5, 'Property address is required'),
  mlsNumber: z.string().regex(/^(?:\d{6}|PM-\d{6})$/, 'Invalid MLS format'),
  salePrice: z.string().regex(/^\d+(\.\d{2})?$/, 'Invalid price format'),
  winteredStatus: z.enum(['not_winterized', 'winterized', 'partial']),
  accessInformation: z.enum(['Electronic Lock Box', 'Call Occupant'])
});

export const commissionSchema = z.object({
  commissionBase: z.enum(['Full Price', 'Net Price']),
  totalCommission: z.string().regex(/^\d+(\.\d{2})?$/, 'Invalid commission format'),
  listingAgentCommission: z.number().min(0).optional(),
  buyersAgentCommission: z.number().min(0)
});
```

### 4. Field-Level Components

```typescript
// src/forms/components/fields/MoneyField.tsx
interface MoneyFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
  required?: boolean;
}

export const MoneyField: React.FC<MoneyFieldProps> = ({
  value,
  onChange,
  label,
  error,
  required
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d.]/g, '');
    const formatted = formatMoney(rawValue);
    onChange(formatted);
  };

  return (
    <FormField>
      <label className={required ? 'required' : ''}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          $
        </span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className={cn(
            'pl-7',
            error && 'border-red-500'
          )}
        />
      </div>
      {error && (
        <span className="text-red-500 text-sm">{error}</span>
      )}
    </FormField>
  );
};
```

## Data Synchronization

### 1. Command Integration

```typescript
// src/forms/services/commandSync.ts
interface CommandSyncService {
  submitTransaction(data: TransactionData): Promise<void>;
  updateStatus(id: string, status: TransactionStatus): Promise<void>;
  uploadDocuments(id: string, documents: File[]): Promise<void>;
}

class CommandAPIService implements CommandSyncService {
  async submitTransaction(data: TransactionData): Promise<void> {
    try {
      const payload = this.transformForCommand(data);
      await this.api.post('/transactions', payload);
    } catch (error) {
      await this.handleSubmissionError(error, data);
    }
  }

  private transformForCommand(data: TransactionData): CommandPayload {
    // Transform form data to Command's expected format
    return {
      propertyAddress: data.propertyAddress,
      agent: {
        name: data.agentName,
        role: data.agentRole
      },
      // Additional transformations...
    };
  }
}
```

### 2. Document Management

```typescript
// src/forms/services/documentManager.ts
export class DocumentManager {
  private readonly requiredDocs: Map<AgentRole, string[]>;

  constructor() {
    this.requiredDocs = new Map([
      ["Buyer's Agent", [
        'Agreement of Sale',
        'Buyer Agency Contract',
        'Deposit Money Notice'
      ]],
      ["Listing Agent", [
        'Listing Agreement',
        "Seller's Disclosure",
        'Commission Agreement'
      ]]
    ]);
  }

  getRequiredDocuments(role: AgentRole): string[] {
    return this.requiredDocs.get(role) || [];
  }

  validateDocuments(
    role: AgentRole,
    submitted: string[]
  ): { valid: boolean; missing: string[] } {
    const required = this.getRequiredDocuments(role);
    const missing = required.filter(doc => !submitted.includes(doc));
    
    return {
      valid: missing.length === 0,
      missing
    };
  }
}
```

## Implementation Guidelines

### 1. State Updates
- Use immutable updates via reducer actions
- Implement field-level validation on blur
- Debounce expensive validations
- Cache validation results

### 2. Performance Optimization
- Implement proper React.memo usage
- Use virtualization for document lists
- Lazy load form sections
- Optimize re-renders with useMemo

### 3. Error Handling
- Implement comprehensive field validation
- Handle network errors gracefully
- Provide clear user feedback
- Support partial form saves

### 4. Accessibility
- Implement proper ARIA labels
- Support keyboard navigation
- Provide error announcements
- Maintain focus management

## Deployment Considerations

1. **Data Persistence**
   - Implement auto-save functionality
   - Handle draft states
   - Support offline capabilities

2. **Integration**
   - Command API synchronization
   - Document upload management
   - Status tracking webhooks

3. **Monitoring**
   - Form completion analytics
   - Error tracking
   - Performance metrics
   - User interaction tracking

This implementation provides a robust foundation for handling complex real estate transactions while maintaining data integrity and user experience.