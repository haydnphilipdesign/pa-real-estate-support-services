import React from 'react';
import { useFormSection } from '../../../hooks/useFormSection';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { FormInput } from '../../ui/form-input';
import { InfoBox } from '../components/FormFieldGroup';

export const SignatureSection: React.FC = () => {
  const {
    formData,
    updateField,
    getFieldValidationState,
    getFieldError,
    getFieldHelpText
  } = useFormSection({
    sectionName: 'sign',
    sectionIndex: 7
  });

  // Set current date when component mounts
  React.useEffect(() => {
    if (!formData.dateSubmitted) {
      const today = new Date().toISOString().split('T')[0];
      updateField('dateSubmitted', today);
    }
  }, []);

  return (
    <FormSectionContainer>
      <div className="col-span-2 space-y-6">
        <FormFieldWrapper
          label="Agent Name"
          required
          error={getFieldValidationState('agentName') === 'error' ? getFieldError('agentName') : undefined}
          warning={getFieldValidationState('agentName') === 'warning' ? getFieldError('agentName') : undefined}
          helpText={getFieldHelpText('agentName')}
        >
          <FormInput
            value={formData.agentName}
            onChange={(e) => updateField('agentName', e.target.value)}
            placeholder="Enter your full legal name"
            state={getFieldValidationState('agentName')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Date"
          required
          error={getFieldValidationState('dateSubmitted') === 'error' ? getFieldError('dateSubmitted') : undefined}
          warning={getFieldValidationState('dateSubmitted') === 'warning' ? getFieldError('dateSubmitted') : undefined}
          helpText={getFieldHelpText('dateSubmitted')}
        >
          <FormInput
            type="date"
            value={formData.dateSubmitted}
            onChange={(e) => updateField('dateSubmitted', e.target.value)}
            state={getFieldValidationState('dateSubmitted')}
          />
        </FormFieldWrapper>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800 leading-relaxed">
            By submitting this form, you acknowledge that:
            <br />
            • All transaction details are accurate and complete
            <br />
            • Required documents have been uploaded to DocuSign/Dotloop
            <br />
            • Commission information and calculations are correct
            <br />
            • Property and client information has been verified
          </p>
        </div>

        <InfoBox
          className="mt-6"
          title="Signature Requirements"
          items={[
            'Enter your full legal name as it appears on your license',
            'Verify the submission date is correct',
            'Review all information before signing',
            'Your signature confirms all provided information is accurate'
          ]}
        />
      </div>
    </FormSectionContainer>
  );
};