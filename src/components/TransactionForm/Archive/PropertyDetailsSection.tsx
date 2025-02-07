import React from 'react';
import { FormField } from './FormField';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Info } from 'lucide-react';
import { cn } from "../../lib/utils";
import { useFormSection } from '../../hooks/useFormSection';
import { FormSectionContainer, FormFieldWrapper } from './components/BaseFormSection';
import { FormFieldGroup } from './components/FormFieldGroup';

export const PropertyDetailsSection: React.FC = () => {
  const {
    formData,
    updateField: onUpdate,
    getFieldValidationState: getValidationState,
    getFieldError
  } = useFormSection({
    sectionName: 'details',
    sectionIndex: 4
  });

  // Format percentage input
  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (value === '') {
      onUpdate('referralFee', '');
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onUpdate('referralFee', numValue.toString());
    }
  };

  const handlePercentageBlur = () => {
    if (formData.referralFee) {
      const numValue = parseFloat(formData.referralFee);
      if (!isNaN(numValue)) {
        onUpdate('referralFee', numValue.toFixed(2));
      }
    }
  };

  return (
    <FormSectionContainer>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Property Details</h2>
          <div className="text-sm text-red-500">* Required</div>
        </div>

        {/* Referral Information */}
        <FormFieldGroup title="Referral Information" description="Enter referral details if applicable">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormFieldWrapper
              label="Referral Party"
              error={getValidationState('referralParty') === 'invalid' ? getFieldError('referralParty') : undefined}
              warning={getValidationState('referralParty') === 'warning' ? getFieldError('referralParty') : undefined}
            >
              <Input
                value={formData.referralParty}
                onChange={(e) => onUpdate('referralParty', e.target.value)}
                placeholder="Enter referral party name"
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Broker EIN"
              error={getValidationState('brokerEIN') === 'invalid' ? getFieldError('brokerEIN') : undefined}
              warning={getValidationState('brokerEIN') === 'warning' ? getFieldError('brokerEIN') : undefined}
            >
              <Input
                value={formData.brokerEIN}
                onChange={(e) => onUpdate('brokerEIN', e.target.value.replace(/[^0-9-]/g, ''))}
                placeholder="XX-XXXXXXX"
                maxLength={10}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Referral Fee"
              error={getValidationState('referralFee') === 'invalid' ? getFieldError('referralFee') : undefined}
              warning={getValidationState('referralFee') === 'warning' ? getFieldError('referralFee') : undefined}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  %
                </span>
                <Input
                  value={formData.referralFee}
                  onChange={handlePercentageChange}
                  onBlur={handlePercentageBlur}
                  placeholder="0.00"
                  className="pl-7"
                  type="text"
                  inputMode="decimal"
                />
              </div>
            </FormFieldWrapper>
          </div>
        </FormFieldGroup>

        {/* Property Status and Access */}
        <FormFieldGroup title="Property Status and Access" description="Enter current property status and access details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormFieldWrapper label="Property Status">
              <RadioGroup
                value={formData.propertyStatus || ''}
                onValueChange={(value) => onUpdate('propertyStatus', value as "Vacant" | "Occupied")}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Vacant" id="vacant" />
                    <Label htmlFor="vacant">Vacant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Occupied" id="occupied" />
                    <Label htmlFor="occupied">Occupied</Label>
                  </div>
                </div>
              </RadioGroup>
            </FormFieldWrapper>

            <FormFieldWrapper label="Access Information">
              <RadioGroup
                value={formData.accessInformation || ''}
                onValueChange={(value) => onUpdate('accessInformation', value as "Electronic Lock Box" | "Call Occupant")}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Electronic Lock Box" id="lockbox" />
                    <Label htmlFor="lockbox">Lock Box</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Call Occupant" id="call" />
                    <Label htmlFor="call">Call Occupant</Label>
                  </div>
                </div>
              </RadioGroup>
            </FormFieldWrapper>

            <FormFieldWrapper label="Access Code">
              <Input
                value={formData.accessCode || ''}
                onChange={(e) => onUpdate('accessCode', e.target.value)}
                placeholder="Enter access code"
              />
            </FormFieldWrapper>
          </div>
        </FormFieldGroup>

        {/* Property Requirements */}
        <FormFieldGroup title="Property Requirements" description="Enter property requirements and details">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attorneyRepresentation"
                checked={formData.attorneyRepresentation}
                onCheckedChange={(checked: boolean | 'indeterminate') => onUpdate('attorneyRepresentation', checked === true)}
              />
              <Label htmlFor="attorneyRepresentation">Attorney Representation Required</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="firstRightOfRefusal"
                checked={formData.firstRightOfRefusal}
                onCheckedChange={(checked: boolean | 'indeterminate') => onUpdate('firstRightOfRefusal', checked === true)}
              />
              <Label htmlFor="firstRightOfRefusal">First Right of Refusal Applies</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="homeWarrantyPurchased"
                checked={formData.homeWarrantyPurchased}
                onCheckedChange={(checked: boolean | 'indeterminate') => onUpdate('homeWarrantyPurchased', checked === true)}
              />
              <Label htmlFor="homeWarrantyPurchased">Home Warranty Purchased</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <FormFieldWrapper label="HOA Name">
              <Input
                value={formData.hoa || ''}
                onChange={(e) => onUpdate('hoa', e.target.value)}
                placeholder="Enter HOA name"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Municipality/Township">
              <Input
                value={formData.municipalityTownship || ''}
                onChange={(e) => onUpdate('municipalityTownship', e.target.value)}
                placeholder="Enter municipality or township"
              />
            </FormFieldWrapper>
          </div>

          {/* Conditional Fields */}
          {formData.attorneyRepresentation && (
            <FormFieldWrapper
              label="Attorney Name"
              required
              error={getValidationState('attorneyName') === 'invalid' ? getFieldError('attorneyName') : undefined}
              warning={getValidationState('attorneyName') === 'warning' ? getFieldError('attorneyName') : undefined}
            >
              <Input
                value={formData.attorneyName || ''}
                onChange={(e) => onUpdate('attorneyName', e.target.value)}
                placeholder="Enter attorney name"
              />
            </FormFieldWrapper>
          )}

          {formData.firstRightOfRefusal && (
            <FormFieldWrapper
              label="First Right of Refusal Name"
              required
              error={getValidationState('firstRightOfRefusalName') === 'invalid' ? getFieldError('firstRightOfRefusalName') : undefined}
              warning={getValidationState('firstRightOfRefusalName') === 'warning' ? getFieldError('firstRightOfRefusalName') : undefined}
            >
              <Input
                value={formData.firstRightOfRefusalName || ''}
                onChange={(e) => onUpdate('firstRightOfRefusalName', e.target.value)}
                placeholder="Enter name"
              />
            </FormFieldWrapper>
          )}

          {formData.homeWarrantyPurchased && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FormFieldWrapper
                label="Home Warranty Company"
                required
                error={getValidationState('homeWarrantyCompany') === 'invalid' ? getFieldError('homeWarrantyCompany') : undefined}
                warning={getValidationState('homeWarrantyCompany') === 'warning' ? getFieldError('homeWarrantyCompany') : undefined}
              >
                <Input
                  value={formData.homeWarrantyCompany || ''}
                  onChange={(e) => onUpdate('homeWarrantyCompany', e.target.value)}
                  placeholder="Enter warranty company name"
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Warranty Cost"
                required
                error={getValidationState('warrantyCost') === 'invalid' ? getFieldError('warrantyCost') : undefined}
                warning={getValidationState('warrantyCost') === 'warning' ? getFieldError('warrantyCost') : undefined}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    value={formData.warrantyCost || ''}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                      if (!rawValue || /^\d*\.?\d{0,2}$/.test(rawValue)) {
                        onUpdate('warrantyCost', rawValue);
                      }
                    }}
                    placeholder="0.00"
                    className="pl-7"
                    type="text"
                    inputMode="decimal"
                  />
                </div>
              </FormFieldWrapper>
            </div>
          )}
        </div>
      </FormFieldGroup>
    </div>
  </FormSectionContainer>
  );
};
