import React from 'react';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Checkbox } from '../../../components/ui/checkbox';
import { useFormSection } from '../../../hooks/useFormSection';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { FormFieldGroup } from '../components/FormFieldGroup';

export const WarrantySection: React.FC = () => {
  const {
    formData,
    updateField: onUpdate,
    getFieldValidationState: getValidationState,
    getFieldError
  } = useFormSection({
    sectionName: 'Warranty',
    sectionIndex: 5
  });

  return (
    <FormSectionContainer>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Warranty Information</h2>
          <div className="text-sm text-red-500">* Required</div>
        </div>

        <FormFieldGroup title="Home Warranty" description="Enter home warranty details if applicable">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="homeWarrantyPurchased"
                checked={formData.homeWarrantyPurchased || false}
                onCheckedChange={(checked: boolean | 'indeterminate') => {
                  onUpdate('homeWarrantyPurchased', checked === true);
                  if (checked !== true) {
                    // Reset warranty fields when unchecked
                    onUpdate('homeWarrantyCompany', '');
                    onUpdate('warrantyCost', '');
                    onUpdate('warrantyPaidBy', '');
                  }
                }}
              />
              <Label htmlFor="homeWarrantyPurchased" className="text-base">Home Warranty Purchased</Label>
            </div>

            {formData.homeWarrantyPurchased === true && (
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <FormFieldWrapper
                  label="Home Warranty Company"
                  required
                  error={getValidationState('homeWarrantyCompany') === 'invalid' ? getFieldError('homeWarrantyCompany') : undefined}
                >
                  <Input
                    value={formData.homeWarrantyCompany || ''}
                    onChange={(e) => onUpdate('homeWarrantyCompany', e.target.value)}
                    placeholder="Enter warranty company name"
                    className="w-full"
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Warranty Cost"
                  required
                  error={getValidationState('warrantyCost') === 'invalid' ? getFieldError('warrantyCost') : undefined}
                >
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      value={formData.warrantyCost}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                        if (!rawValue || /^\d*\.?\d{0,2}$/.test(rawValue)) {
                          onUpdate('warrantyCost', rawValue);
                        }
                      }}
                      placeholder="0.00"
                      className="w-full pl-7"
                      type="text"
                      inputMode="decimal"
                    />
                  </div>
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Warranty Paid By"
                  required
                  error={getValidationState('warrantyPaidBy') === 'invalid' ? getFieldError('warrantyPaidBy') : undefined}
                >
                  <RadioGroup
                    value={formData.warrantyPaidBy}
                    onValueChange={(value) => onUpdate('warrantyPaidBy', value as "Seller" | "Buyer" | "Agent")}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Seller" id="seller" />
                      <Label htmlFor="seller" className="text-base">Seller</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Buyer" id="buyer" />
                      <Label htmlFor="buyer" className="text-base">Buyer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Agent" id="agent" />
                      <Label htmlFor="agent" className="text-base">Agent</Label>
                    </div>
                  </RadioGroup>
                </FormFieldWrapper>
              </div>
            )}
          </div>
        </FormFieldGroup>
      </div>
    </FormSectionContainer>
  );
}; 