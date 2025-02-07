import React, { ChangeEvent } from 'react';
import { FormSection } from "./FormSection";
import { FormField } from "./FormField";
import { Input } from "../ui/input";
import { WarrantyPaidBy } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { formatCurrencyForDisplay } from "../../utils/airtable";
import { AddressAutocomplete } from "../ui/AddressAutocomplete";
import { HelpButton, helpContentBySection } from './HelpButton';
import { Info } from 'lucide-react';
import { cn } from "../../lib/utils";
import { useFormSection } from "../../hooks/useFormSection";

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

export const PropertySection: React.FC = () => {
  const {
    formData,
    updateField: onUpdate,
    getFieldValidationState: getValidationState,
    getFieldError
  } = useFormSection({
    sectionName: 'property',
    sectionIndex: 1
  });

  const handleMLSChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    onUpdate("mlsNumber", value);
  };

  const handleAddressSelect = (details: { formattedAddress: string }) => {
    onUpdate('propertyAddress', details.formattedAddress);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    if (!rawValue || /^\d*\.?\d{0,2}$/.test(rawValue)) {
      onUpdate("salePrice", rawValue);
    }
  };

  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    if (rawValue) {
      const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(parseFloat(rawValue));
      onUpdate("salePrice", formattedValue);
    }
  };

  const handleWarrantyCostChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    if (!rawValue || /^\d*\.?\d{0,2}$/.test(rawValue)) {
      onUpdate("warrantyCost", rawValue);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Property Information</h2>
        <div className="text-sm text-red-500">* Required</div>
      </div>

      <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              Ensure all property details match the official documentation. 
              The MLS number and property address will be used for transaction verification.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <FormField
          label="MLS Number"
          tooltip="Enter the MLS number for the property"
          error={getFieldError('mlsNumber')}
          validationState={getValidationState('mlsNumber')}
          id="mlsNumber"
        >
          <Input
            value={formData.mlsNumber || ''}
            onChange={handleMLSChange}
            placeholder="Enter MLS number"
            className="max-w-xs font-mono"
            maxLength={9}
          />
        </FormField>

        <FormField
          label="Property Address"
          tooltip="Start typing to search for the property address"
          required
          error={getFieldError('propertyAddress')}
          validationState={getValidationState('propertyAddress')}
          id="propertyAddress"
          helpText="Enter the complete property address including unit number if applicable"
        >
          <AddressAutocomplete
            value={formData.propertyAddress}
            onChange={(value) => onUpdate('propertyAddress', value)}
            onDetailsReceived={handleAddressSelect}
            placeholder="Search for property address"
            includeDetails={true}
          />
        </FormField>

        <FormField
          label="Sale Price"
          tooltip="Enter the property sale price"
          required
          error={getFieldError('salePrice')}
          validationState={getValidationState('salePrice')}
          id="salePrice"
          type="currency"
          helpText="Enter the agreed-upon sale price from the Agreement of Sale"
        >
          <Input
            value={formData.salePrice || ''}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            placeholder="Enter sale price"
            className={cn(
              "max-w-xs font-mono",
              getValidationState('salePrice') === 'warning' && "border-yellow-500 focus:ring-yellow-500",
              getValidationState('salePrice') === 'invalid' && "border-red-500 focus:ring-red-500"
            )}
          />
        </FormField>
      </div>

    </div>
  );
};
