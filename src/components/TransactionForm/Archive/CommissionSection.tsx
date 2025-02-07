import React, { useState } from 'react';
import { FormSection } from "./FormSection";
import { FormField } from "./FormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { FormSectionProps, TransactionFormData } from "./types";
import { formatCurrencyForDisplay } from "../../utils/airtable";

const handleNumericChange = (
  field: keyof Pick<TransactionFormData, "totalCommission" | "listingAgentCommission" | "buyersAgentCommission" | "buyerPaidCommission">, 
  value: string, 
  onUpdate: FormSectionProps["onUpdate"]
) => {
  // Store raw numeric value
  const numericValue = value.replace(/[^0-9.]/g, "");
  onUpdate(field, numericValue);
};

export const CommissionSection = ({ formData, onUpdate, role }: FormSectionProps) => {
  const [listingCommissionType, setListingCommissionType] = useState<"Percentage" | "Fixed">("Percentage");
  const [buyersCommissionType, setBuyersCommissionType] = useState<"Percentage" | "Fixed">("Percentage");

  return (
    <FormSection title="Commission Information">
      <FormField label="Commission Base" required>
        <Select
          value={formData.commissionBase}
          onValueChange={(value) => onUpdate("commissionBase", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select commission base" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Full Price">Full Price</SelectItem>
            <SelectItem value="Net Price">Net Price (after Seller Assist)</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Total Commission Amount ($)">
        <Input
          type="text"
          value={formData.totalCommission}
          onChange={(e) => handleNumericChange("totalCommission", e.target.value, onUpdate)}
          onBlur={(e) => {
            const formatted = formatCurrencyForDisplay(e.target.value);
            e.target.value = formatted;
          }}
          placeholder="e.g. 10000"
        />
      </FormField>

      <div className="space-y-2">
        <FormField label="Listing Agent Commission" required>
          <div className="flex gap-2">
            <Select
              value={listingCommissionType}
              onValueChange={(value: "Percentage" | "Fixed") => setListingCommissionType(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage">Percentage</SelectItem>
                <SelectItem value="Fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={formData.listingAgentCommission}
              onChange={(e) => handleNumericChange("listingAgentCommission", e.target.value, onUpdate)}
              placeholder={listingCommissionType === "Percentage" ? "e.g. 2.5" : "e.g. 5000"}
              required
            />
            {listingCommissionType === "Percentage" && <span className="flex items-center">%</span>}
            {listingCommissionType === "Fixed" && <span className="flex items-center">$</span>}
          </div>
        </FormField>
      </div>

      <div className="space-y-2">
        <FormField label="Buyers Agent Commission" required>
          <div className="flex gap-2">
            <Select
              value={buyersCommissionType}
              onValueChange={(value: "Percentage" | "Fixed") => setBuyersCommissionType(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage">Percentage</SelectItem>
                <SelectItem value="Fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={formData.buyersAgentCommission}
              onChange={(e) => handleNumericChange("buyersAgentCommission", e.target.value, onUpdate)}
              placeholder={buyersCommissionType === "Percentage" ? "e.g. 2.5" : "e.g. 5000"}
              required
            />
            {buyersCommissionType === "Percentage" && <span className="flex items-center">%</span>}
            {buyersCommissionType === "Fixed" && <span className="flex items-center">$</span>}
          </div>
        </FormField>
      </div>

      <FormField label="Buyer Paid Commission ($)">
        <Input
          type="text"
          value={formData.buyerPaidCommission}
          onChange={(e) => handleNumericChange("buyerPaidCommission", e.target.value, onUpdate)}
          onBlur={(e) => {
            const formatted = formatCurrencyForDisplay(e.target.value);
            e.target.value = formatted;
          }}
          placeholder="e.g. 5000"
        />
      </FormField>
    </FormSection>
  );
};