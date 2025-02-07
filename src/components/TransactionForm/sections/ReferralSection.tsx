import React from 'react';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { FormFieldGroup } from '../components/FormFieldGroup';
import { useFormSection } from '../../../hooks/useFormSection';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

export const ReferralSection: React.FC = () => {
  const { formData, updateField, getFieldValidationState, getFieldError } = useFormSection({
    sectionName: 'referral',
    sectionIndex: 5
  });

  return (
    <FormSectionContainer>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Referral Information</h2>
          <div className="text-sm text-red-500">* Required if applicable</div>
        </div>

        <FormFieldGroup title="Referral Details" description="Enter referral party information if applicable">
          <div className="space-y-6">
            <FormFieldWrapper
              label="Referral Party"
              helpText="Enter the name of the referring agent or broker"
              error={getFieldValidationState('referralParty') === 'invalid' ? getFieldError('referralParty') : undefined}
            >
              <Input
                type="text"
                value={formData.referralParty || ''}
                onChange={(e) => updateField('referralParty', e.target.value)}
                placeholder="Enter referral party name"
              />
            </FormFieldWrapper>

            {formData.referralParty && (
              <>
                <FormFieldWrapper
                  label="Broker EIN"
                  required
                  helpText="Enter the broker's EIN (XX-XXXXXXX format)"
                  error={getFieldValidationState('brokerEIN') === 'invalid' ? getFieldError('brokerEIN') : undefined}
                >
                  <Input
                    type="text"
                    value={formData.brokerEIN || ''}
                    onChange={(e) => updateField('brokerEIN', e.target.value)}
                    placeholder="XX-XXXXXXX"
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Referral Fee"
                  required
                  helpText="Enter the referral fee amount or percentage"
                  error={getFieldValidationState('referralFee') === 'invalid' ? getFieldError('referralFee') : undefined}
                >
                  <Input
                    type="text"
                    value={formData.referralFee || ''}
                    onChange={(e) => updateField('referralFee', e.target.value)}
                    placeholder="Enter referral fee"
                  />
                </FormFieldWrapper>
              </>
            )}
          </div>
        </FormFieldGroup>
      </div>
    </FormSectionContainer>
  );
}; 