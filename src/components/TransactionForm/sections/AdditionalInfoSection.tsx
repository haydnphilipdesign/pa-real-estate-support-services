import React from 'react';
import { useFormSection } from '../../../hooks/useFormSection';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { FormInput } from '../../ui/form-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { PropertyStatus, AccessType, TCFeePaidBy } from '../types';
import { FormFieldGroup, GridFieldGroup, ToggleFieldGroup, InfoBox } from '../components/FormFieldGroup';
import { Textarea } from '../../ui/textarea';

const propertyStatusOptions: PropertyStatus[] = ["Vacant", "Occupied"];
const accessTypeOptions: AccessType[] = ["Electronic Lock Box", "Call Occupant"];
const tcFeePaidByOptions: TCFeePaidBy[] = ["Client", "Agent", ""];

export const AdditionalInfoSection: React.FC = () => {
  const {
    formData,
    updateField,
    getFieldValidationState,
    getFieldError,
    getFieldHelpText
  } = useFormSection({
    sectionName: 'additional info',
    sectionIndex: 11
  });

  return (
    <FormSectionContainer>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Additional Information</h2>
        </div>

        <FormFieldGroup title="Special Instructions" description="Enter any special handling instructions or requirements">
          <FormFieldWrapper
            label="Special Instructions"
            error={getFieldValidationState('specialInstructions') === 'invalid' ? getFieldError('specialInstructions') : undefined}
          >
            <Textarea
              value={formData.specialInstructions || ''}
              onChange={(e) => updateField('specialInstructions', e.target.value)}
              placeholder="Enter any special instructions..."
              className="min-h-[100px]"
            />
          </FormFieldWrapper>
        </FormFieldGroup>

        <FormFieldGroup title="Urgent Issues" description="List any urgent issues that need immediate attention">
          <FormFieldWrapper
            label="Urgent Issues"
            error={getFieldValidationState('urgentIssues') === 'invalid' ? getFieldError('urgentIssues') : undefined}
          >
            <Textarea
              value={formData.urgentIssues || ''}
              onChange={(e) => updateField('urgentIssues', e.target.value)}
              placeholder="Enter any urgent issues..."
              className="min-h-[100px]"
            />
          </FormFieldWrapper>
        </FormFieldGroup>

        <FormFieldGroup title="Additional Notes" description="Any other relevant information or notes">
          <FormFieldWrapper
            label="Additional Notes"
            error={getFieldValidationState('additionalNotes') === 'invalid' ? getFieldError('additionalNotes') : undefined}
          >
            <Textarea
              value={formData.additionalNotes || ''}
              onChange={(e) => updateField('additionalNotes', e.target.value)}
              placeholder="Enter any additional notes..."
              className="min-h-[100px]"
            />
          </FormFieldWrapper>
        </FormFieldGroup>
      </div>
    </FormSectionContainer>
  );
};