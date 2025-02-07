import React from 'react';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { FormFieldGroup } from '../components/FormFieldGroup';
import { useFormSection } from '../../../hooks/useFormSection';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { TCFeePaidBy } from '../types';

export const TitleCompanySection: React.FC = () => {
  const { formData, updateField, getFieldValidationState, getFieldError } = useFormSection({
    sectionName: 'titleCompany',
    sectionIndex: 9
  });

  return (
    <FormSectionContainer>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Title Company & TC Fee</h2>
          <div className="text-sm text-red-500">* Required</div>
        </div>

        <FormFieldGroup title="Title Company Details" description="Enter title company information">
          <FormFieldWrapper
            label="Title Company"
            required
            helpText="Enter the name of the title company"
            error={getFieldValidationState('titleCompany') === 'invalid' ? getFieldError('titleCompany') : undefined}
          >
            <Input
              type="text"
              value={formData.titleCompany || ''}
              onChange={(e) => updateField('titleCompany', e.target.value)}
              placeholder="Enter title company name"
            />
          </FormFieldWrapper>
        </FormFieldGroup>

        <FormFieldGroup title="Transaction Coordinator Fee" description="Specify who will be responsible for the TC fee">
          <div className="space-y-4">
            <Label>TC Fee Paid By</Label>
            <RadioGroup
              value={formData.tcFeePaidBy}
              onValueChange={(value) => updateField('tcFeePaidBy', value as TCFeePaidBy)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Client" id="client" />
                <Label htmlFor="client">Client</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Agent" id="agent" />
                <Label htmlFor="agent">Agent</Label>
              </div>
            </RadioGroup>
          </div>
        </FormFieldGroup>
      </div>
    </FormSectionContainer>
  );
}; 