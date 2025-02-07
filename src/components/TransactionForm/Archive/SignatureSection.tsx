import React from 'react';
import { FormSection } from './FormSection';
import { FormField } from './FormField';
import { Input } from '../ui/input';
import { SignatureSectionProps } from './types';

export const SignatureSection = ({ 
  formData, 
  onUpdate,
  getValidationState,
  getFieldError 
}: SignatureSectionProps) => {
  // Set today's date when component mounts if not already set
  React.useEffect(() => {
    if (!formData.dateSubmitted) {
      onUpdate('dateSubmitted', new Date().toISOString().split('T')[0]);
    }
  }, []);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Sign and Submit</h2>
        <div className="text-sm text-red-500">* Required</div>
      </div>

      <FormField
        label="Agent Name"
        tooltip="Enter your full legal name"
        required
        error={getFieldError('agentName')}
        validationState={getValidationState('agentName')}
        id="agentName"
      >
        <Input
          value={formData.agentName || ''}
          onChange={(e) => onUpdate('agentName', e.target.value)}
          placeholder="Enter your full name"
          className="max-w-xs"
        />
      </FormField>

      <FormField
        label="Submission Date"
        tooltip="Auto-generated submission date"
        error={getFieldError('dateSubmitted')}
        validationState={getValidationState('dateSubmitted')}
        id="dateSubmitted"
      >
        <Input
          type="date"
          value={formData.dateSubmitted || ''}
          readOnly
          className="max-w-xs bg-gray-50"
        />
      </FormField>
    </div>
  );
};
