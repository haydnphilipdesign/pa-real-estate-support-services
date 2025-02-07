import React from 'react';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { FormInput } from '../../ui/form-input';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import { useFormSection } from '../../../hooks/useFormSection';
import { AddressAutocomplete } from '../../ui/AddressAutocomplete';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';
import { FormFieldGroup } from '../components/FormFieldGroup';
import { Switch } from '../../ui/switch';
import { formatCurrencyForDisplay } from '../../../utils/airtable';

export const PropertySection: React.FC = () => {
  const { formData, updateField, getFieldValidationState, getFieldError } = useFormSection({
    sectionName: 'property',
    sectionIndex: 1
  });

  const isListingOrDualAgent = formData.role === "Listing Agent" || formData.role === "Dual Agent";

  const handleAddressDetails = (details: any) => {
    // No longer auto-filling municipality/township
  };

  return (
    <FormSectionContainer>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Property Information</h2>
          <div className="text-sm text-red-500">* Required</div>
        </div>

        <FormFieldGroup title="Core Property Information" description="Enter the basic property details">
          <div className="grid grid-cols-1 gap-y-6">
            <FormFieldWrapper
              label="MLS Number"
              required
              error={getFieldValidationState('mlsNumber') === 'invalid' ? getFieldError('mlsNumber') : undefined}
              warning={getFieldValidationState('mlsNumber') === 'warning' ? getFieldError('mlsNumber') : undefined}
            >
              <FormInput
                value={formData.mlsNumber}
                onChange={(e) => updateField('mlsNumber', e.target.value)}
                placeholder="123456 or PM-123456"
              />
            </FormFieldWrapper>

            {isListingOrDualAgent && (
              <FormFieldWrapper
                label="Update MLS Status"
                helpText="This will update the MLS status to 'Pending' upon form submission"
              >
                <div className="flex items-center space-x-2">
                  <Switch

                    checked={formData.updateMLS || false}
                    onCheckedChange={(checked) => updateField('updateMLS', checked)}
                  />
                  <Label>Update MLS Status to Pending</Label>
                </div>
              </FormFieldWrapper>
            )}

            <FormFieldWrapper
              label="Property Address"
              required
              error={getFieldValidationState('propertyAddress') === 'invalid' ? getFieldError('propertyAddress') : undefined}
              warning={getFieldValidationState('propertyAddress') === 'warning' ? getFieldError('propertyAddress') : undefined}
            >
              <AddressAutocomplete
                value={formData.propertyAddress}
                onChange={(value) => updateField('propertyAddress', value)}
                placeholder="Enter complete address including zip code"
                includeDetails={true}
                onDetailsReceived={handleAddressDetails}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Sale Price"
              required
              error={getFieldValidationState('salePrice') === 'invalid' ? getFieldError('salePrice') : undefined}
              warning={getFieldValidationState('salePrice') === 'warning' ? getFieldError('salePrice') : undefined}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <FormInput
                  value={formData.salePrice}
                  onChange={(e) => updateField('salePrice', e.target.value.replace(/[^0-9.]/g, ''))}
                  onBlur={(e) => {
                    const formatted = formatCurrencyForDisplay(e.target.value);
                    updateField('salePrice', formatted);
                  }}
                  placeholder="Enter amount without commas (e.g., 350000)"
                  className="pl-7"
                  type="text"
                  inputMode="decimal"
                />
              </div>
            </FormFieldWrapper>
          </div>
        </FormFieldGroup>

        <FormFieldGroup title="Property Status" description="Enter the current property status">
          <div className="space-y-6">
            <FormFieldWrapper
              label="Property Status"
              required
              error={getFieldValidationState('propertyStatus') === 'invalid' ? getFieldError('propertyStatus') : undefined}
            >
              <RadioGroup
                value={formData.propertyStatus}
                onValueChange={(value) => {
                  updateField('propertyStatus', value as "Vacant" | "Occupied");
                  if (value !== "Vacant") {
                    updateField('winterizedStatus', 'not_applicable');
                  }
                }}
                className="flex gap-12"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Vacant" id="vacant" />
                  <Label htmlFor="vacant" className="text-base">Vacant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Occupied" id="occupied" />
                  <Label htmlFor="occupied" className="text-base">Occupied</Label>
                </div>
              </RadioGroup>
            </FormFieldWrapper>

            {formData.propertyStatus === "Vacant" && (
              <FormFieldWrapper
                label="Winterized Status"
                required
                error={getFieldValidationState('winterizedStatus') === 'invalid' ? getFieldError('winterizedStatus') : undefined}
              >
                <RadioGroup
                  value={formData.winterizedStatus}
                  onValueChange={(value) => updateField('winterizedStatus', value as 'not_winterized' | 'winterized' |  'not_applicable')}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_winterized" id="not_winterized" />
                    <Label htmlFor="not_winterized" className="text-base">Not Winterized</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="winterized" id="winterized" />
                    <Label htmlFor="winterized" className="text-base">Winterized</Label>
                  </div>
                </RadioGroup>
              </FormFieldWrapper>
            )}
          </div>
        </FormFieldGroup>

        <Alert className="mt-8">
          <AlertTitle>Property Information</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-2">
              <li>MLS Number: <span className="italic">123456 or PM-123456</span></li>
              <li>Property Address: <span className="italic">The complete address of the property, including the zip code.</span></li>
              <li>Sale Price: The agreed-upon sale price of the property. <span className="italic">Do not use commas (e.g., 350000)</span></li>
              <li>Property Status: Current occupancy status of the property</li>
              {formData.propertyStatus === "Vacant" && (
                <li>Winterized Status: Required for vacant properties to indicate the state of utilities and plumbing</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </FormSectionContainer>
  );
};
