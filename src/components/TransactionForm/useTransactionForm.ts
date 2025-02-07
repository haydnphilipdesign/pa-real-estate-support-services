import { useState } from "react";
import { AgentRole, TransactionFormData, ClientInfo } from "./types";
import { useToast } from "../../hooks/use-toast";
import { submitToAirtable } from "../../utils/airtable";
import { format } from 'date-fns';

const initialFormData: TransactionFormData = {
  // Role Information
  role: "Buyer's Agent",
  
  // Property Information
  mlsNumber: "",
  propertyAddress: "",
  salePrice: "",
  
  // Property Status
  winterizedStatus: "No",
  accessType: "Electronic Lockbox",
  updateMlsStatus: false,
  
  // Client Information
  clients: [{
    name: '',
    address: '',
    email: '',
    phone: '',
    maritalStatus: 'Single',
    designation: ''
  }],
  
  // Commission Information
  commissionBase: "Sale Price",
  sellerAssist: "",
  totalCommission: "",
  totalCommissionFixed: "",
  listingAgentCommissionType: "Percentage",
  listingAgentCommission: "",
  listingAgentCommissionFixed: "",
  buyersAgentCommissionType: "Percentage",
  buyersAgentCommission: "",
  buyersAgentCommissionFixed: "",
  buyerPaidCommission: "",
  
  // Referral Information
  referralParty: "",
  brokerEIN: "",
  referralFee: "",
  
  // Property Details
  resaleCertRequired: false,
  hoa: "",
  coRequired: false,
  municipalityTownship: "",
  firstRightOfRefusal: false,
  firstRightOfRefusalName: "",
  attorneyRepresentation: false,
  attorneyName: "",
  homeWarrantyPurchased: false,
  homeWarrantyCompany: "",
  warrantyCost: "",
  warrantyPaidBy: "Seller",
  
  // Additional Information
  titleCompany: "",
  tcFeePaidBy: "Client",
  propertyStatus: "Vacant",
  accessCode: "",
  updateMLS: false,
  acknowledgeDocuments: false,
  
  // Additional Information Fields
  specialInstructions: "",
  urgentIssues: "",
  additionalNotes: "",
  
  // Documents
  requiredDocuments: [],
  
  // Final Details
  agentName: "",
  dateSubmitted: "",
  confirmSubmission: false,
  agentSignature: "",
  confirmationChecked: false
};

export function useTransactionForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TransactionFormData>(initialFormData);

  const updateFormData = (field: keyof TransactionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateSection = (section: string, data: TransactionFormData): string[] => {
    const errors: string[] = [];
    const normalizedSection = section.toLowerCase().replace(/\s+/g, '');

    console.log('Validating section:', section, 'normalized:', normalizedSection);

    switch (normalizedSection) {
      case 'role':
      case 'roleselection':
        if (!data.role) errors.push('Please select your role');
        break;
      case 'property':
      case 'propertyinfo':
        if (!data.propertyAddress) errors.push('Property address is required');
        if (!data.salePrice) errors.push('Sale price is required');
        break;
      case 'client':
      case 'clientdetails':
        if (!data.clients?.[0]?.name) errors.push('Primary client name is required');
        if (!data.clients?.[0]?.email) errors.push('Primary client email is required');
        if (!data.clients?.[0]?.phone) errors.push('Primary client phone is required');
        break;
      case 'commission':
        if (!data.commissionBase) errors.push('Commission base is required');
        if (!data.totalCommission) errors.push('Total commission is required');
        break;
      case 'propertydetails':
        if (!data.propertyStatus) errors.push('Property status is required');
        break;
      case 'warranty':
      case 'warrantyinfo':
      case 'homewarranty':
        // Only validate warranty fields if a warranty is purchased
        if (data.homeWarrantyPurchased === true) {
          if (!data.homeWarrantyCompany) {
            errors.push('Home warranty company is required when warranty is purchased');
          }
          if (!data.warrantyCost) {
            errors.push('Warranty cost is required when warranty is purchased');
          }
          if (!data.warrantyPaidBy) {
            errors.push('Warranty paid by is required when warranty is purchased');
          }
        }
        break;
      case 'titlecompany':
        if (!data.titleCompany) errors.push('Title company is required');
        if (!data.tcFeePaidBy) errors.push('TC fee paid by is required');
        break;
      case 'documents':
      case 'requireddocuments':
        // Document validation if needed
        break;
      case 'additionalinfo':
        // Additional info validation if needed
        break;
      case 'sign':
      case 'signature':
        // Signature validation if needed
        break;
    }

    console.log('Validation errors:', errors); // Add debug logging
    return errors;
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    // Core required fields
    if (!formData.role) errors.push('Agent role is required');
    if (!formData.propertyAddress) errors.push('Property address is required');
    if (!formData.salePrice) errors.push('Sale price is required');
    if (!formData.clients?.[0]?.name) errors.push('Primary client name is required');
    if (!formData.clients?.[0]?.email) errors.push('Primary client email is required');
    if (!formData.clients?.[0]?.phone) errors.push('Primary client phone is required');
    if (!formData.totalCommission) errors.push('Total commission is required');
    if (!formData.titleCompany) errors.push('Title company is required');

    return errors;
  };

  const handleSubmit = async () => {
    try {
      // Get API key from environment variables
      const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
      if (!apiKey) {
        throw new Error('Airtable API key not found in environment variables');
      }
      
      // Ensure the API key starts with 'pat'
      if (!apiKey.startsWith('pat')) {
        throw new Error('Invalid Airtable API key format');
      }

      // Validate form before submission
      const errors = validateForm();
      if (errors.length > 0) {
        throw new Error(`Please fix the following errors:\n${errors.join('\n')}`);
      }

      // Create a copy of the form data to prevent any race conditions
      const submissionData = { ...formData };

      // Submit to Airtable
      const response = await submitToAirtable(submissionData, apiKey);
      
      // Only reset after successful submission
      if (response) {
        setFormData({ ...initialFormData });
      }

      return response;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  };

  return {
    formData,
    updateFormData,
    handleSubmit,
    validateSection
  };
} 