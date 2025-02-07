import React from 'react';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Checkbox } from '../../../components/ui/checkbox';
import { Info } from 'lucide-react';
import { cn } from "../../../lib/utils";
import { useFormSection } from '../../../hooks/useFormSection';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { FormFieldGroup } from '../components/FormFieldGroup';
import { AccessType } from '../types';
import { Switch } from '../../ui/switch';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';

export const PropertyDetailsSection: React.FC = () => {
  const {
    formData,
    updateField,
    getFieldValidationState: getValidationState,
    getFieldError
  } = useFormSection({
    sectionName: 'propertyDetails',
    sectionIndex: 3
  });

  const isListingOrDualAgent = formData.role === "Listing Agent" || formData.role === "Dual Agent";

  return (
    <FormSectionContainer>
      <div className="p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Property Details</h2>
          <div className="text-sm text-red-500">* Required</div>
        </div>

        {/* Property Access */}
        <FormFieldGroup title="Property Access Information">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <Label>Access Type</Label>
              <RadioGroup
                value={formData.accessType}
                onValueChange={(value) => updateField('accessType', value as AccessType)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Combo Lockbox" id="combo_lockbox" />
                  <Label htmlFor="combo_lockbox">Combo Lockbox</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Electronic Lockbox" id="electronic_lockbox" />
                  <Label htmlFor="electronic_lockbox">Electronic Lockbox</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Appointment Only" id="appointment_only" />
                  <Label htmlFor="appointment_only">Appointment Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Keypad" id="keypad" />
                  <Label htmlFor="keypad">Keypad</Label>
                </div>
              </RadioGroup>
            </div>

            {(formData.accessType === 'Combo Lockbox' || formData.accessType === 'Keypad' || formData.accessType === 'Electronic Lockbox') && (
              <FormFieldWrapper
                label="Access Code"
                helpText="Enter the lockbox combination or keypad code"
              >
                <Input
                  type="text"
                  value={formData.accessCode || ''}
                  onChange={(e) => updateField('accessCode', e.target.value)}
                  placeholder="Enter access code"
                />
              </FormFieldWrapper>
            )}

            {formData.accessType === 'Appointment Only' && (
              <FormFieldWrapper
                label="Agent Contact Information"
                helpText="Enter the contact details for property access"
              >
                <Input
                  type="text"
                  value={formData.agentContact || ''}
                  onChange={(e) => updateField('agentContact', e.target.value)}
                  placeholder="Enter agent name and phone number"
                />
              </FormFieldWrapper>
            )}
          </div>
        </FormFieldGroup>

        {/* Property Governance */}
        <FormFieldGroup title="Property Governance" description="Enter property requirements and certifications">
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-8 sm:gap-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="resaleCertRequired"
                  checked={formData.resaleCertRequired}
                  onCheckedChange={(checked: boolean | 'indeterminate') => updateField('resaleCertRequired', checked === true)}
                />
                <Label htmlFor="resaleCertRequired" className="text-sm sm:text-base">Resale Certificate Required</Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="coRequired"
                  checked={formData.coRequired}
                  onCheckedChange={(checked: boolean | 'indeterminate') => updateField('coRequired', checked === true)}
                />
                <Label htmlFor="coRequired" className="text-sm sm:text-base">Certificate of Occupancy Required</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-6">
              {formData.resaleCertRequired && (
                <FormFieldWrapper label="HOA Name">
                  <Input
                    value={formData.hoa}
                    onChange={(e) => updateField('hoa', e.target.value)}
                    placeholder="Enter HOA name"
                    className="w-full"
                  />
                </FormFieldWrapper>
              )}

              {formData.coRequired && (
                <FormFieldWrapper label="Municipality/Township">
                  <Input
                    value={formData.municipalityTownship}
                    onChange={(e) => updateField('municipalityTownship', e.target.value)}
                    placeholder="Enter municipality or township"
                    className="w-full"
                  />
                </FormFieldWrapper>
              )}
            </div>
          </div>
        </FormFieldGroup>

        {/* Legal Requirements */}
        <FormFieldGroup title="Legal Requirements" description="Enter legal requirements and representation details">
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-8 sm:gap-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="attorneyRepresentation"
                  checked={formData.attorneyRepresentation}
                  onCheckedChange={(checked: boolean | 'indeterminate') => updateField('attorneyRepresentation', checked === true)}
                />
                <Label htmlFor="attorneyRepresentation" className="text-sm sm:text-base">Attorney Representation Required</Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="firstRightOfRefusal"
                  checked={formData.firstRightOfRefusal}
                  onCheckedChange={(checked: boolean | 'indeterminate') => updateField('firstRightOfRefusal', checked === true)}
                />
                <Label htmlFor="firstRightOfRefusal" className="text-sm sm:text-base">First Right of Refusal Applies</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-6">
              {formData.attorneyRepresentation && (
                <FormFieldWrapper
                  label="Attorney Name"
                  required
                  error={getValidationState('attorneyName') === 'invalid' ? getFieldError('attorneyName') : undefined}
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
                  error={getValidationState('firstRightOfRefusalName') === 'invalid' ? getFieldError('firstRightOfRefusalName') : undefined}
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
          </div>
        </FormFieldGroup>
      </div>
    </FormSectionContainer>
  );
};