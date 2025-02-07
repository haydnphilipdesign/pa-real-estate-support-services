import React, { useEffect } from 'react';
import { FormSection } from "./FormSection";
import { FormField } from "./FormField";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FormSectionProps } from "./types";
import { AddressAutocomplete } from "../ui/AddressAutocomplete";
import { PhoneInput } from "../ui/PhoneInput";
import { EmailInput } from "../ui/EmailInput";
import { HelpButton, helpContentBySection } from './HelpButton';
import { Info, HelpCircle } from 'lucide-react';
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { MaritalStatus, ValidationState } from "./types";
import { useClientValidation } from "../../hooks/useClientValidation";

export const ClientSection = ({ 
  formData, 
  onUpdate,
  getValidationState,
  getFieldError 
}: FormSectionProps) => {
  const {
    validateEmail,
    validatePhone,
    validateName,
    validateAddress,
    validateSecondClient
  } = useClientValidation();

  // Handle field validation and update
  const handleFieldValidation = (
    field: keyof typeof formData,
    value: string,
    validationFn: (value: string) => { isValid: boolean; state: ValidationState; error?: string }
  ) => {
    const result = validationFn(value);
    onUpdate(field, value);

    // If validation failed, trigger immediate parent validation
    if (!result.isValid) {
      onUpdate(field, value);
    }
  };

  // Handle marital status changes with validation
  const handleMaritalStatusChange = (value: MaritalStatus, isSecondClient: boolean = false) => {
    const field = isSecondClient ? "secondClientMaritalStatus" : "maritalStatus";
    onUpdate(field, value);

    // Validate marital status consistency if both clients are present
    if (formData.secondClientName && formData.maritalStatus && formData.secondClientMaritalStatus) {
      const result = validateSecondClient(formData);
      if (!result.isValid) {
        onUpdate(field, value);
      }
    }
  };

  // Validate second client information
  useEffect(() => {
    if (formData.secondClientName || 
        formData.secondClientEmail || 
        formData.secondClientPhone || 
        formData.secondClientAddress || 
        formData.secondClientMaritalStatus) {
      const result = validateSecondClient(formData);
      if (!result.isValid) {
        // Trigger parent validation
        onUpdate('secondClientName', formData.secondClientName || '');
      }
    }
  }, [
    formData.secondClientName,
    formData.secondClientEmail,
    formData.secondClientPhone,
    formData.secondClientAddress,
    formData.secondClientMaritalStatus,
    validateSecondClient
  ]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-gray-900">Client Information</h2>
          <HelpButton content={helpContentBySection.client} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                All fields in this section must match legal documentation exactly. For married couples, both parties must be included.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-sm text-red-500">* Required</div>
      </div>

      <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              Enter client information exactly as it appears on legal documents.
              For married couples or multiple owners, include all parties.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Primary Client Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">Primary Client</h3>
            <span className="text-sm text-red-500">* Required</span>
          </div>
          
          <FormField 
            label="Legal Name" 
            required
            tooltip="Enter name exactly as it appears on government ID"
            error={getFieldError('clientName')}
            validationState={getValidationState('clientName')}
            helpText="Full legal name as it will appear on all documents"
          >
            <Input
              value={formData.clientName || ''}
              onChange={(e) => handleFieldValidation("clientName", e.target.value, validateName)}
              placeholder="John Smith"
              className={cn(
                getValidationState('clientName') === 'warning' && "border-yellow-500 focus:ring-yellow-500",
                getValidationState('clientName') === 'invalid' && "border-red-500 focus:ring-red-500"
              )}
            />
          </FormField>

          <FormField 
            label="Address" 
            required
            tooltip="Current residential address"
            error={getFieldError('clientAddress')}
            validationState={getValidationState('clientAddress')}
            helpText="Must be current legal residence"
          >
            <AddressAutocomplete
              value={formData.clientAddress}
              onChange={(value) => handleFieldValidation("clientAddress", value, validateAddress)}
              placeholder="123 Main St, Philadelphia, PA 19103"
            />
          </FormField>

          <FormField 
            label="Email" 
            required
            tooltip="Primary email for transaction communications"
            error={getFieldError('primaryEmail')}
            validationState={getValidationState('primaryEmail')}
            helpText="Will be used for document delivery and updates"
          >
            <EmailInput
              value={formData.primaryEmail}
              onChange={(value) => handleFieldValidation("primaryEmail", value, validateEmail)}
              placeholder="client@example.com"
            />
          </FormField>

          <FormField 
            label="Phone" 
            required
            tooltip="Best contact number"
            error={getFieldError('primaryPhone')}
            validationState={getValidationState('primaryPhone')}
            helpText="Primary contact number for transaction communications"
          >
            <PhoneInput
              value={formData.primaryPhone}
              onChange={(value) => handleFieldValidation("primaryPhone", value, validatePhone)}
              placeholder="(215) 555-0123"
            />
          </FormField>

          <FormField 
            label="Marital Status" 
            required
            tooltip="Current legal marital status"
            error={getFieldError('maritalStatus')}
            validationState={getValidationState('maritalStatus')}
            helpText="Required for title and legal documentation. Single: Never married or marriage annulled. Married: Currently in a legal marriage. Divorced: Marriage legally terminated. Widowed: Spouse is deceased."
          >
            <Select
              value={formData.maritalStatus}
              onValueChange={(value: MaritalStatus) => handleMaritalStatusChange(value)}
            >
              <SelectTrigger className={cn(
                getValidationState('maritalStatus') === 'warning' && "border-yellow-500 focus:ring-yellow-500",
                getValidationState('maritalStatus') === 'invalid' && "border-red-500 focus:ring-red-500"
              )}>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        {/* Second Client Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Second Client</h3>
            <span className="text-sm text-gray-500">If applicable</span>
          </div>
          
          <FormField 
            label="Legal Name"
            tooltip="Enter name exactly as it appears on government ID"
            error={getFieldError('secondClientName')}
            validationState={getValidationState('secondClientName')}
            helpText="Full legal name as it will appear on all documents"
          >
            <Input
              value={formData.secondClientName || ''}
              onChange={(e) => handleFieldValidation("secondClientName", e.target.value, validateName)}
              placeholder="Jane Smith"
              className={cn(
                getValidationState('secondClientName') === 'warning' && "border-yellow-500 focus:ring-yellow-500",
                getValidationState('secondClientName') === 'invalid' && "border-red-500 focus:ring-red-500"
              )}
            />
          </FormField>

          <FormField 
            label="Address"
            tooltip="Current residential address if different from primary client"
            error={getFieldError('secondClientAddress')}
            validationState={getValidationState('secondClientAddress')}
            helpText="Leave blank if same as primary client. Note: Different addresses may require additional documentation."
          >
            <AddressAutocomplete
              value={formData.secondClientAddress}
              onChange={(value) => handleFieldValidation("secondClientAddress", value, validateAddress)}
              placeholder="123 Main St, Philadelphia, PA 19103"
            />
          </FormField>

          <FormField 
            label="Email"
            tooltip="Email for transaction communications"
            error={getFieldError('secondClientEmail')}
            validationState={getValidationState('secondClientEmail')}
            helpText="Will be included in all transaction communications"
          >
            <EmailInput
              value={formData.secondClientEmail}
              onChange={(value) => handleFieldValidation("secondClientEmail", value, validateEmail)}
              placeholder="client@example.com"
            />
          </FormField>

          <FormField 
            label="Phone"
            tooltip="Best contact number"
            error={getFieldError('secondClientPhone')}
            validationState={getValidationState('secondClientPhone')}
            helpText="Alternative contact number for transaction communications"
          >
            <PhoneInput
              value={formData.secondClientPhone}
              onChange={(value) => handleFieldValidation("secondClientPhone", value, validatePhone)}
              placeholder="(215) 555-0123"
            />
          </FormField>

          <FormField 
            label="Marital Status"
            tooltip="Current legal marital status"
            error={getFieldError('secondClientMaritalStatus')}
            validationState={getValidationState('secondClientMaritalStatus')}
            helpText="Required if second client is party to transaction. Must be consistent with primary client's marital status if clients are married to each other."
          >
            <Select
              value={formData.secondClientMaritalStatus}
              onValueChange={(value: MaritalStatus) => handleMaritalStatusChange(value, true)}
            >
              <SelectTrigger className={cn(
                getValidationState('secondClientMaritalStatus') === 'warning' && "border-yellow-500 focus:ring-yellow-500",
                getValidationState('secondClientMaritalStatus') === 'invalid' && "border-red-500 focus:ring-red-500"
              )}>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </div>

      {/* Validation Rules */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Validation Rules:</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
          <li>All names must match government-issued ID exactly</li>
          <li>Email addresses must be valid and accessible</li>
          <li>Phone numbers must be valid North American format</li>
          <li>If second client is present, their information must be complete</li>
          <li>Marital status must be consistent between clients if married to each other</li>
          <li>Different addresses require explanation in notes</li>
        </ul>
      </div>
    </div>
  );
};
