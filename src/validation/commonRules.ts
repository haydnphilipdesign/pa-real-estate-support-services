// Centralize validation rules for duplicated fields
export const referralValidation = {
  referralParty: (value: string) => 
    value?.length > 50 ? 'Maximum 50 characters allowed' : undefined,
    
  referralFee: (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'Invalid percentage';
    if (num > 100) return 'Cannot exceed 100%';
    return undefined;
  }
}; 