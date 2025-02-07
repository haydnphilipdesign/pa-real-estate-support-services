// Add missing import at the top of the file
import { FormFieldGroup } from "..\\components\\FormFieldGroup";
import { FormFieldWrapper } from "..\\components\\FormFieldWrapper";
import { FormInput } from "..\\components\\FormInput";

// 1. Create shared form groups for duplicated fields
interface ReferralFormGroupProps {
  formData: {
    referralParty: string;
    referralFee: string;
  };
  updateField: (fieldName: string, value: string) => void;
  validation: {
    referralParty?: { error?: string; warning?: string };
    referralFee?: { error?: string; warning?: string };
  };
}

export const ReferralFormGroup: React.FC<ReferralFormGroupProps> = ({
  formData,
  updateField,
  validation
}) => {
  return (
    <FormFieldGroup title="Referral Information" description="Referral party details">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <FormFieldWrapper
          label="Referral Party"
          error={validation.referralParty?.error}
          warning={validation.referralParty?.warning}
        >
          <FormInput
            value={formData.referralParty}
            onChange={(e) => updateField('referralParty', e.target.value)}
            placeholder="Enter referral party name"
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Referral Fee (%)"
          error={validation.referralFee?.error}
          warning={validation.referralFee?.warning}
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            <FormInput
              value={formData.referralFee}
              onChange={(e) => updateField('referralFee', e.target.value.replace(/[^0-9.]/g, ''))}
              className="pl-7"
              placeholder="0.00"
            />
          </div>
        </FormFieldWrapper>
      </div>
    </FormFieldGroup>
  );
};

// 2. Create shared validation configuration 