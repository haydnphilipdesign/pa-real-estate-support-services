import React from 'react';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { FormFieldGroup } from '../components/FormFieldGroup';
import { useFormSection } from '../../../hooks/useFormSection';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';

export const LegalRequirementsSection: React.FC = () => {
  const { formData, updateField, getFieldValidationState, getFieldError } = useFormSection({
    sectionName: 'legalRequirements',
    sectionIndex: 7
  });

  return (
    <FormSectionContainer>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Legal Requirements</h2>
          <div className="text-sm text-red-500">* Required if applicable</div>
        </div>

        <FormFieldGroup title="Legal Requirements" description="Enter legal requirements and representation details">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="attorneyRepresentation"
                  checked={formData.attorneyRepresentation}
                  onCheckedChange={(checked: boolean | 'indeterminate') => updateField('attorneyRepresentation', checked === true)}
                />
                <Label htmlFor="attorneyRepresentation" className="text-base">Attorney Representation Required</Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="firstRightOfRefusal"
                  checked={formData.firstRightOfRefusal}
                  onCheckedChange={(checked: boolean | 'indeterminate') => updateField('firstRightOfRefusal', checked === true)}
                />
                <Label htmlFor="firstRightOfRefusal" className="text-base">First Right of Refusal Applies</Label>
              </div>
            </div>

            {/* Conditional Fields */}
            {formData.attorneyRepresentation && (
              <FormFieldWrapper
                label="Attorney Name"
                required
                error={getFieldValidationState('attorneyName') === 'invalid' ? getFieldError('attorneyName') : undefined}
              >
                <Input
                  value={formData.attorneyName}
                  onChange={(e) => updateField('attorneyName', e.target.value)}
                  placeholder="Enter attorney name"
                  className="w-full"
                />
              </FormFieldWrapper>
            )}

            {formData.firstRightOfRefusal && (
              <FormFieldWrapper
                label="First Right of Refusal Name"
                required
                error={getFieldValidationState('firstRightOfRefusalName') === 'invalid' ? getFieldError('firstRightOfRefusalName') : undefined}
              >
                <Input
                  value={formData.firstRightOfRefusalName}
                  onChange={(e) => updateField('firstRightOfRefusalName', e.target.value)}
                  placeholder="Enter name"
                  className="w-full"
                />
              </FormFieldWrapper>
            )}
          </div>
        </FormFieldGroup>
      </div>
    </FormSectionContainer>
  );
}; 