# Form Sections Refactoring Analysis

## Identified Duplications

### 1. Common Form Patterns

Several patterns are duplicated across form sections:

1. **Layout Structure**
   - Section container with padding and spacing
   - Header with title and required indicator
   - Info boxes with similar styling

2. **Field Validation Logic**
   - Common validation patterns for fields like email, phone numbers
   - Error message handling and display
   - Required field checks

3. **State Management**
   - Similar state update patterns
   - Error state management
   - Field touch tracking

## Proposed Solutions

### 1. Base Components Extraction

```typescript
// src/forms/components/base/FormSection.tsx
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  infoItems?: string[];
}

export const FormSection = memo(({ 
  title, 
  description, 
  children, 
  infoItems 
}: FormSectionProps) => (
  <section className="form-section">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      <div className="text-sm text-red-500">* Required</div>
    </div>

    {description && (
      <p className="text-gray-600 mb-6">{description}</p>
    )}

    {children}

    {infoItems && (
      <InfoBox
        className="mt-6"
        title={`${title} Information`}
        items={infoItems}
      />
    )}
  </section>
));
```

### 2. Field Group Component

```typescript
// src/forms/components/base/FieldGroup.tsx
interface FieldGroupProps {
  title?: string;
  children: React.ReactNode;
  layout?: 'single' | 'double';
  className?: string;
}

export const FieldGroup = memo(({ 
  title, 
  children, 
  layout = 'single',
  className 
}: FieldGroupProps) => (
  <div className={cn('field-group', className)}>
    {title && (
      <h3 className="text-lg font-medium mb-4">{title}</h3>
    )}
    
    <div className={cn(
      'grid gap-6',
      layout === 'double' ? 'grid-cols-2' : 'grid-cols-1'
    )}>
      {children}
    </div>
  </div>
));
```

### 3. Validation Hook Extraction

```typescript
// src/forms/hooks/useFieldValidation.ts
interface ValidationRule {
  validate: (value: any) => boolean | string;
  message: string;
}

interface FieldValidationOptions {
  required?: boolean;
  rules?: ValidationRule[];
  customValidate?: (value: any) => Promise<string | undefined>;
}

export const useFieldValidation = (
  fieldName: string, 
  options: FieldValidationOptions
) => {
  const { state, dispatch } = useForm();
  
  const validate = useCallback(async (value: any) => {
    if (options.required && !value) {
      return 'This field is required';
    }

    for (const rule of options.rules || []) {
      const result = rule.validate(value);
      if (result !== true) {
        return rule.message;
      }
    }

    return options.customValidate?.(value);
  }, [options]);

  return {
    validate,
    error: state.errors[fieldName],
    touched: state.touched[fieldName]
  };
};
```

## Refactored Section Example

Here's how the PropertySection would look after refactoring:

```typescript
// src/forms/sections/PropertySection.tsx
export const PropertySection = memo(() => {
  const { formData, updateField } = useFormSection({
    sectionName: 'property',
    sectionIndex: 1
  });

  const mlsValidation = useFieldValidation('mlsNumber', {
    rules: [{
      validate: (value) => /^(?:\d{6}|PM-\d{6})$/.test(value),
      message: 'Invalid MLS number format'
    }]
  });

  const addressValidation = useFieldValidation('propertyAddress', {
    required: true,
    customValidate: validateAddress
  });

  return (
    <FormSection
      title="Property Information"
      description="Enter the property details for this transaction"
      infoItems={[
        'MLS Number: The unique identifier for the property listing',
        'Property Address: Complete address including unit number',
        'Sale Price: Agreed upon price for the transaction'
      ]}
    >
      <FieldGroup layout="double">
        <FormField
          name="mlsNumber"
          label="MLS Number"
          validation={mlsValidation}
          onChange={(value) => updateField('mlsNumber', value)}
          value={formData.mlsNumber}
        />
        
        <FormField
          name="propertyAddress"
          label="Property Address"
          required
          validation={addressValidation}
          onChange={(value) => updateField('propertyAddress', value)}
          value={formData.propertyAddress}
        />
      </FieldGroup>
    </FormSection>
  );
});
```

## Common Validation Rules

Extract commonly used validation rules:

```typescript
// src/forms/validation/commonRules.ts
export const commonValidationRules = {
  email: {
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  
  phone: {
    validate: (value: string) => /^\d{3}-\d{3}-\d{4}$/.test(value),
    message: 'Please enter a valid phone number (XXX-XXX-XXXX)'
  },
  
  currency: {
    validate: (value: string) => /^\d+(\.\d{2})?$/.test(value),
    message: 'Please enter a valid amount'
  }
};
```

## Migration Steps

1. **Create Base Components**
   - Implement FormSection and FieldGroup components
   - Move common styles to shared style files
   - Create reusable validation hooks

2. **Refactor Individual Sections**
   - Update each section to use new base components
   - Migrate validation logic to use common rules
   - Consolidate duplicate state management

3. **Update Form Container**
   - Implement consistent layout structure
   - Add proper context providers
   - Handle section transitions

4. **Test and Verify**
   - Ensure all functionality is preserved
   - Verify form validation behavior
   - Test responsive layouts

This refactoring will significantly reduce code duplication while improving maintainability and consistency across the form sections.