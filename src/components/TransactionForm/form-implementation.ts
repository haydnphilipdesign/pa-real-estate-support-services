/**
 * Form Implementation with Reduced Duplication
 * 
 * Key Features:
 * - Reusable base components
 * - Centralized validation
 * - Consistent styling
 * - Type-safe implementations
 */

// src/forms/components/base/FormContainer.tsx
import React, { memo } from 'react';
import { FormProvider } from '../../context/FormContext';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit?: (data: any) => Promise<void>;
  className?: string;
}

export const FormContainer = memo(({ 
  children, 
  onSubmit,
  className 
}: FormContainerProps) => (
  <FormProvider>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit?.(e);
      }}
      className={cn(
        'max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8',
        className
      )}
    >
      {children}
    </form>
  </FormProvider>
));

// src/forms/components/base/FormField.tsx
import React, { memo } from 'react';
import { useFieldValidation } from '../../hooks/useFieldValidation';
import { ValidationRule } from '../../types';

interface FormFieldProps {
  name: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  validation?: ReturnType<typeof useFieldValidation>;
  required?: boolean;
  type?: 'text' | 'number' | 'email' | 'tel';
  placeholder?: string;
  className?: string;
}

export const FormField = memo(({
  name,
  label,
  value,
  onChange,
  validation,
  required = false,
  type = 'text',
  placeholder,
  className
}: FormFieldProps) => {
  const id = useId();
  const { error, touched } = validation || {};

  return (
    <div className={cn('form-field', className)}>
      <label 
        htmlFor={id}
        className={cn(
          'block text-sm font-medium text-gray-700',
          required && 'required'
        )}
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'form-input',
          error && touched && 'error'
        )}
        aria-invalid={error && touched}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && touched && (
        <div
          id={`${id}-error`}
          className="text-sm text-red-500 mt-1"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
});

// src/forms/sections/PropertySection.tsx
import React, { memo } from 'react';
import { FormSection, FieldGroup, FormField } from '../components/base';
import { useFormSection } from '../hooks/useFormSection';
import { commonValidationRules } from '../validation/commonRules';

export const PropertySection = memo(() => {
  const { formData, updateField } = useFormSection('property');
  
  const mlsValidation = useFieldValidation('mlsNumber', {
    rules: [commonValidationRules.mlsNumber]
  });

  const priceValidation = useFieldValidation('salePrice', {
    required: true,
    rules: [commonValidationRules.currency]
  });

  return (
    <FormSection
      title="Property Information"
      description="Enter property details for this transaction"
    >
      <FieldGroup layout="double">
        <FormField
          name="mlsNumber"
          label="MLS Number"
          value={formData.mlsNumber}
          onChange={(value) => updateField('mlsNumber', value)}
          validation={mlsValidation}
          placeholder="Enter MLS number"
        />

        <FormField
          name="salePrice"
          label="Sale Price"
          value={formData.salePrice}
          onChange={(value) => updateField('salePrice', value)}
          validation={priceValidation}
          required
          type="number"
          placeholder="Enter sale price"
        />
      </FieldGroup>
    </FormSection>
  );
});

// src/forms/sections/ClientSection.tsx
import React, { memo } from 'react';
import { FormSection, FieldGroup, FormField } from '../components/base';
import { useFormSection } from '../hooks/useFormSection';
import { commonValidationRules } from '../validation/commonRules';

export const ClientSection = memo(() => {
  const { formData, updateField } = useFormSection('client');

  const emailValidation = useFieldValidation('email', {
    required: true,
    rules: [commonValidationRules.email]
  });

  const phoneValidation = useFieldValidation('phone', {
    required: true,
    rules: [commonValidationRules.phone]
  });

  return (
    <FormSection
      title="Client Information"
      description="Enter client contact details"
    >
      <FieldGroup layout="double">
        <FormField
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={(value) => updateField('name', value)}
          required
        />

        <FormField
          name="email"
          label="Email"
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          validation={emailValidation}
          required
          type="email"
        />

        <FormField
          name="phone"
          label="Phone"
          value={formData.phone}
          onChange={(value) => updateField('phone', value)}
          validation={phoneValidation}
          required
          type="tel"
        />
      </FieldGroup>
    </FormSection>
  );
});

// src/forms/sections/DocumentsSection.tsx
import React, { memo } from 'react';
import { FormSection } from '../components/base';
import { useFormSection } from '../hooks/useFormSection';
import { DocumentList } from '../components/DocumentList';

export const DocumentsSection = memo(() => {
  const { formData, updateField } = useFormSection('documents');

  return (
    <FormSection
      title="Required Documents"
      description="Confirm all required documents are uploaded"
    >
      <DocumentList
        documents={getRequiredDocuments(formData.role)}
        selectedDocuments={formData.selectedDocuments}
        onSelect={(documents) => updateField('selectedDocuments', documents)}
      />
    </FormSection>
  );
});

// src/forms/components/DocumentList.tsx
interface DocumentListProps {
  documents: Array<{
    id: string;
    name: string;
    required: boolean;
  }>;
  selectedDocuments: string[];
  onSelect: (documents: string[]) => void;
}

export const DocumentList = memo(({
  documents,
  selectedDocuments,
  onSelect
}: DocumentListProps) => (
  <div className="space-y-4">
    {documents.map((doc) => (
      <div
        key={doc.id}
        className="flex items-center space-x-3"
      >
        <Checkbox
          checked={selectedDocuments.includes(doc.id)}
          onCheckedChange={(checked) => {
            const newSelection = checked
              ? [...selectedDocuments, doc.id]
              : selectedDocuments.filter(id => id !== doc.id);
            onSelect(newSelection);
          }}
          id={doc.id}
        />
        <label
          htmlFor={doc.id}
          className={cn(
            'text-sm',
            doc.required && 'font-medium'
          )}
        >
          {doc.name}
          {doc.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      </div>
    ))}
  </div>
));
