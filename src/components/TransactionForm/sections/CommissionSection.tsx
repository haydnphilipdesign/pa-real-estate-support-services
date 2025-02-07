import React, { useEffect } from 'react';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { FormFieldGroup } from '../components/FormFieldGroup';
import { useFormSection } from '../../../hooks/useFormSection';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { CommissionBase, CommissionType } from '../types';
import { Alert, AlertDescription } from '../../ui/alert';

export const CommissionSection: React.FC = () => {
  const { formData, updateField, getFieldValidationState, getFieldError } = useFormSection({
    sectionName: 'commission',
    sectionIndex: 4
  });

  const isBuyersAgent = formData.role === "Buyer's Agent";
  const isListingAgent = formData.role === "Listing Agent";
  const isDualAgent = formData.role === "Dual Agent";

  // Get the base amount for calculations
  const getBaseAmount = (): string => {
    if (!formData.salePrice) return '';
    if (formData.commissionBase === 'Net Price' && formData.sellerAssist) {
      const salePrice = parseFloat(formData.salePrice.replace(/[^0-9.]/g, ''));
      const sellerAssist = parseFloat(formData.sellerAssist.replace(/[^0-9.]/g, ''));
      return (salePrice - sellerAssist).toString();
    }
    return formData.salePrice;
  };

  // Calculate fixed amount from percentage
  const calculateFixedAmount = (percentage: string, baseAmount: string): string => {
    if (!percentage || !baseAmount) return '';
    const numPercentage = parseFloat(percentage.replace(/[^0-9.]/g, ''));
    const numBaseAmount = parseFloat(baseAmount.replace(/[^0-9.]/g, ''));
    
    if (isNaN(numPercentage) || isNaN(numBaseAmount)) return '';
    return (numBaseAmount * (numPercentage / 100)).toFixed(2);
  };

  // Calculate percentage from fixed amount
  const calculatePercentage = (fixedAmount: string, baseAmount: string): string => {
    if (!fixedAmount || !baseAmount) return '';
    const numFixed = parseFloat(fixedAmount.replace(/[^0-9.]/g, ''));
    const numBaseAmount = parseFloat(baseAmount.replace(/[^0-9.]/g, ''));
    
    if (isNaN(numFixed) || isNaN(numBaseAmount)) return '';
    return ((numFixed / numBaseAmount) * 100).toFixed(3);
  };

  // Auto-calculate commission values when relevant fields change
  useEffect(() => {
    const baseAmount = getBaseAmount();
    if (!baseAmount) return;

    // Only auto-calculate if no manual edits are in progress
    if (!formData.isManualTotalFixed && !formData.isManualListingFixed && !formData.isManualBuyersFixed) {
      // Calculate total commission fixed amount when percentage changes
      if (formData.totalCommission) {
        const totalFixed = calculateFixedAmount(formData.totalCommission, baseAmount);
        if (totalFixed !== formData.totalCommissionFixed) {
          updateField('totalCommissionFixed', totalFixed);
        }
      }

      // Calculate listing agent fixed amount when percentage changes
      if (formData.listingAgentCommission) {
        const listingFixed = calculateFixedAmount(formData.listingAgentCommission, baseAmount);
        if (listingFixed !== formData.listingAgentCommissionFixed) {
          updateField('listingAgentCommissionFixed', listingFixed);
        }

        // Auto-calculate buyer's agent commission as the difference
        if (formData.totalCommission) {
          const totalPercent = parseFloat(formData.totalCommission);
          const listingPercent = parseFloat(formData.listingAgentCommission);
          if (!isNaN(totalPercent) && !isNaN(listingPercent)) {
            const buyersPercent = (totalPercent - listingPercent).toFixed(3);
            updateField('buyersAgentCommission', buyersPercent);
          }
        }
      }
    }
  }, [formData.salePrice, formData.sellerAssist, formData.commissionBase, formData.totalCommission, formData.listingAgentCommission]);

  // Format currency input
  const formatCurrency = (value: string): string => {
    // Remove all non-numeric characters except decimal point
    let numericValue = value.replace(/[^0-9.]/g, '');
    
    // Handle multiple decimal points by keeping only the first one
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    return numericValue;
  };

  // Handle commission input changes with override capability
  const handleCommissionChange = (
    field: 'totalCommission' | 'listingAgentCommission' | 'buyersAgentCommission',
    value: string,
    type: CommissionType
  ) => {
    const baseAmount = getBaseAmount();
    if (!baseAmount) return;

    if (type === 'Percentage') {
      // For percentage, allow up to 3 decimal places
      const formattedValue = value.replace(/[^0-9.]/g, '');
      const parts = formattedValue.split('.');
      const percentage = parts[0] + (parts[1] ? '.' + parts[1].slice(0, 3) : '');
      updateField(field, percentage);
      
      // Reset manual edit flags when percentage changes
      if (field === 'totalCommission') {
        updateField('isManualTotalFixed', false);
      } else if (field === 'listingAgentCommission') {
        updateField('isManualListingFixed', false);
      } else if (field === 'buyersAgentCommission') {
        updateField('isManualBuyersFixed', false);
      }
    } else {
      // For fixed amount, just clean the input without forcing decimal places
      const formattedValue = formatCurrency(value);
      updateField(`${field}Fixed`, formattedValue);
      
      // Set flag to indicate manual edit of fixed amount
      if (field === 'totalCommission') {
        updateField('isManualTotalFixed', true);
      } else if (field === 'listingAgentCommission') {
        updateField('isManualListingFixed', true);
      } else if (field === 'buyersAgentCommission') {
        updateField('isManualBuyersFixed', true);
      }
    }
  };

  // Handle commission input blur to format the value and update calculations
  const handleCommissionBlur = (
    field: 'totalCommission' | 'listingAgentCommission' | 'buyersAgentCommission',
    type: CommissionType
  ) => {
    const baseAmount = getBaseAmount();
    if (!baseAmount) return;

    if (type === 'Fixed') {
      const value = formData[`${field}Fixed`];
      if (value) {
        // Format to 2 decimal places
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          const formattedValue = numValue.toFixed(2);
          updateField(`${field}Fixed`, formattedValue);

          // Calculate and update the percentage
          const percentage = calculatePercentage(formattedValue, baseAmount);
          updateField(field, percentage);

          // Reset manual edit flag after calculations are done
          if (field === 'totalCommission') {
            updateField('isManualTotalFixed', false);
          } else if (field === 'listingAgentCommission') {
            updateField('isManualListingFixed', false);
          } else if (field === 'buyersAgentCommission') {
            updateField('isManualBuyersFixed', false);
          }

          // Update related fields based on which field was changed
          if (field === 'totalCommission' && formData.listingAgentCommissionFixed) {
            const totalFixed = numValue;
            const listingFixed = parseFloat(formData.listingAgentCommissionFixed);
            if (!isNaN(listingFixed)) {
              const buyersFixed = (totalFixed - listingFixed).toFixed(2);
              updateField('buyersAgentCommissionFixed', buyersFixed);
              const buyersPercentage = calculatePercentage(buyersFixed, baseAmount);
              updateField('buyersAgentCommission', buyersPercentage);
            }
          } else if (field === 'listingAgentCommission' && formData.totalCommissionFixed) {
            const totalFixed = parseFloat(formData.totalCommissionFixed);
            const listingFixed = numValue;
            if (!isNaN(totalFixed)) {
              const buyersFixed = (totalFixed - listingFixed).toFixed(2);
              updateField('buyersAgentCommissionFixed', buyersFixed);
              const buyersPercentage = calculatePercentage(buyersFixed, baseAmount);
              updateField('buyersAgentCommission', buyersPercentage);
            }
          }
        }
      }
    }
  };

  // Handle buyer paid commission input
  const handleBuyerPaidCommissionChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    updateField('buyerPaidCommission', formattedValue);
  };

  // Handle seller assist input
  const handleSellerAssistChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    updateField('sellerAssist', formattedValue);
  };

  return (
    <FormSectionContainer>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Commission Information</h2>
          <div className="text-sm text-red-500">* Required</div>
        </div>

        <FormFieldGroup title="Commission Base" description="Select the base for commission calculation">
          <RadioGroup
            value={formData.commissionBase}
            onValueChange={(value) => updateField('commissionBase', value as CommissionBase)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Sale Price" id="sale_price" />
              <Label htmlFor="sale_price">Sale Price</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Net Proceeds (After Seller's Assistance)" id="net_proceeds" />
              <Label htmlFor="net_proceeds">Net Proceeds (After Seller's Assistance)</Label>
            </div>
          </RadioGroup>

          {formData.commissionBase === 'Net Proceeds (After Seller\'s Assistance)' && (
            <FormFieldWrapper
              label="Seller Assist Amount"
              required
              error={getFieldValidationState('sellerAssist') === 'invalid' ? getFieldError('sellerAssist') : undefined}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="text"
                  value={formData.sellerAssist || ''}
                  onChange={(e) => handleSellerAssistChange(e.target.value)}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </FormFieldWrapper>
          )}
        </FormFieldGroup>

        {!isBuyersAgent && (
          <FormFieldGroup title="Total Commission" description="Enter the total commission for the transaction">
            <div className="grid grid-cols-2 gap-6">
              <FormFieldWrapper
                label="Total Commission (%)"
                required
                error={getFieldValidationState('totalCommission') === 'invalid' ? getFieldError('totalCommission') : undefined}
              >
                <Input
                  type="text"
                  value={formData.totalCommission || ''}
                  onChange={(e) => handleCommissionChange('totalCommission', e.target.value, 'Percentage')}
                  placeholder="0.00"
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Total Commission ($)"
                required
                error={getFieldValidationState('totalCommissionFixed') === 'invalid' ? getFieldError('totalCommissionFixed') : undefined}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="text"
                    value={formData.totalCommissionFixed || ''}
                    onChange={(e) => handleCommissionChange('totalCommission', e.target.value, 'Fixed')}
                    onBlur={() => handleCommissionBlur('totalCommission', 'Fixed')}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </FormFieldWrapper>
            </div>
          </FormFieldGroup>
        )}

        {(isDualAgent || isListingAgent) && (
          <FormFieldGroup title="Commission Split" description="Enter the commission split details">
            <div className="grid grid-cols-2 gap-6">
              <FormFieldWrapper
                label="Listing Agent Commission (%)"
                required
                error={getFieldValidationState('listingAgentCommission') === 'invalid' ? getFieldError('listingAgentCommission') : undefined}
              >
                <Input
                  type="text"
                  value={formData.listingAgentCommission || ''}
                  onChange={(e) => handleCommissionChange('listingAgentCommission', e.target.value, 'Percentage')}
                  placeholder="0.00"
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Listing Agent Commission ($)"
                required
                error={getFieldValidationState('listingAgentCommissionFixed') === 'invalid' ? getFieldError('listingAgentCommissionFixed') : undefined}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="text"
                    value={formData.listingAgentCommissionFixed || ''}
                    onChange={(e) => handleCommissionChange('listingAgentCommission', e.target.value, 'Fixed')}
                    onBlur={() => handleCommissionBlur('listingAgentCommission', 'Fixed')}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Buyer's Agent Commission (%)"
                required
                error={getFieldValidationState('buyersAgentCommission') === 'invalid' ? getFieldError('buyersAgentCommission') : undefined}
              >
                <Input
                  type="text"
                  value={formData.buyersAgentCommission || ''}
                  onChange={(e) => handleCommissionChange('buyersAgentCommission', e.target.value, 'Percentage')}
                  placeholder="0.00"
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Buyer's Agent Commission ($)"
                required
                error={getFieldValidationState('buyersAgentCommissionFixed') === 'invalid' ? getFieldError('buyersAgentCommissionFixed') : undefined}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="text"
                    value={formData.buyersAgentCommissionFixed || ''}
                    onChange={(e) => handleCommissionChange('buyersAgentCommission', e.target.value, 'Fixed')}
                    onBlur={() => handleCommissionBlur('buyersAgentCommission', 'Fixed')}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </FormFieldWrapper>
            </div>
          </FormFieldGroup>
        )}

        {isBuyersAgent && (
          <FormFieldGroup title="Buyer's Agent Commission" description="Enter your commission details">
            <div className="grid grid-cols-2 gap-6">
              <FormFieldWrapper
                label="Your Commission (%)"
                required
                error={getFieldValidationState('buyersAgentCommission') === 'invalid' ? getFieldError('buyersAgentCommission') : undefined}
              >
                <Input
                  type="text"
                  value={formData.buyersAgentCommission || ''}
                  onChange={(e) => handleCommissionChange('buyersAgentCommission', e.target.value, 'Percentage')}
                  placeholder="0.00"
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Your Commission ($)"
                required
                error={getFieldValidationState('buyersAgentCommissionFixed') === 'invalid' ? getFieldError('buyersAgentCommissionFixed') : undefined}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="text"
                    value={formData.buyersAgentCommissionFixed || ''}
                    onChange={(e) => handleCommissionChange('buyersAgentCommission', e.target.value, 'Fixed')}
                    onBlur={() => handleCommissionBlur('buyersAgentCommission', 'Fixed')}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </FormFieldWrapper>
            </div>
          </FormFieldGroup>
        )}

        {isBuyersAgent && (
          <FormFieldGroup title="Buyer Paid Commission" description="Enter any commission paid by the buyer">
            <FormFieldWrapper
              label="Buyer Paid Commission"
              helpText="Enter the amount of commission paid by the buyer (if applicable)"
              error={getFieldValidationState('buyerPaidCommission') === 'invalid' ? getFieldError('buyerPaidCommission') : undefined}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="text"
                  value={formData.buyerPaidCommission || ''}
                  onChange={(e) => handleBuyerPaidCommissionChange(e.target.value)}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </FormFieldWrapper>
          </FormFieldGroup>
        )}

        <Alert>
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-2">
              <li>Commission calculations are based on the {formData.commissionBase || 'selected base'}</li>
              <li>All commission amounts should be entered as either percentages or dollar amounts</li>
              <li>The system will automatically calculate the corresponding percentage or dollar amount</li>
              {!isBuyersAgent && <li>Total commission will be automatically split between listing and buyer's agent</li>}
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </FormSectionContainer>
  );
};