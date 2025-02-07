export const FORM_SECTIONS = [
  'Role',
  'Property',
  'Client',
  'Property Details',
  'Commission',
  'Warranty',
  'Title Company',
  'Documents',
  'Additional Info',
  'Signature'
] as const;

export type AgentRole = "Buyer's Agent" | "Listing Agent" | "Dual Agent" | "";
export type MaritalStatus = "Single" | "Married" | "Divorce" | "Widowed";
export type CommissionType = "Percentage" | "Fixed";
export type CommissionBase = "Sale Price" | "Net Proceeds (After Seller's Assistance)";
export type TCFeePaidBy = "Client" | "Agent";
export type AccessType = "Combo Lockbox" | "Electronic Lockbox" | "Keypad" | "Appointment Only";
export type PropertyStatus = "Vacant" | "Occupied";
export type WarrantyPaidBy = "Seller" | "Buyer" | "Agent";
export type ClientDesignation = "Buyer" | "Seller" | "";
export type WinterizedStatus = "Yes" | "No" | "not_winterized" | "winterized" | "not_applicable";

export type ValidationState = 'valid' | 'invalid' | 'warning' | null | undefined;

export interface ClientInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
  maritalStatus: MaritalStatus;
  designation: ClientDesignation;
}

export interface TransactionFormData {
  // Role Information
  role: AgentRole;
  
  // Property Core Information
  mlsNumber: string;
  propertyAddress: string;
  salePrice: string;
  propertyStatus: PropertyStatus;
  
  // Property Access Information
  accessType: AccessType;
  accessCode?: string;
  agentContact?: string;
  updateMlsStatus?: boolean;
  winterizedStatus: WinterizedStatus;
  
  // Property Location & Governance
  municipalityTownship: string;
  hoa: string;
  resaleCertRequired: boolean;
  coRequired: boolean;
  
  // Client Information
  clients: ClientInfo[];
  
  // Commission & Referral Information
  commissionBase: CommissionBase;
  sellerAssist: string;
  totalCommission: string;
  totalCommissionFixed: string;
  listingAgentCommissionType: CommissionType;
  listingAgentCommission: string;
  listingAgentCommissionFixed: string;
  buyersAgentCommissionType: CommissionType;
  buyersAgentCommission: string;
  buyersAgentCommissionFixed: string;
  buyerPaidCommission: string;
  referralParty: string;
  brokerEIN: string;
  referralFee: string;
  
  // Manual edit tracking
  isManualTotalFixed?: boolean;
  isManualListingFixed?: boolean;
  isManualBuyersFixed?: boolean;
  
  // Legal Requirements
  firstRightOfRefusal: boolean;
  firstRightOfRefusalName: string;
  attorneyRepresentation: boolean;
  attorneyName: string;
  
  // Warranty Information
  homeWarrantyPurchased: boolean;
  homeWarrantyCompany: string;
  warrantyCost: string;
  warrantyPaidBy: WarrantyPaidBy;
  
  // Title & Settlement
  titleCompany: string;
  tcFeePaidBy: TCFeePaidBy;
  
  // MLS & System Updates
  updateMLS: boolean;
  
  // Documents
  requiredDocuments: string[];
  acknowledgeDocuments: boolean;
  
  // Additional Information
  specialInstructions: string;
  urgentIssues: string;
  additionalNotes: string;
  
  // Final Details
  agentName: string;
  dateSubmitted: string;
  confirmSubmission: boolean;
  agentSignature: string;
  confirmationChecked: boolean;
}

export interface FormSectionProps {
  formData: TransactionFormData;
  onUpdate: <K extends keyof TransactionFormData>(field: K, value: TransactionFormData[K]) => void;
  role?: AgentRole;
  getValidationState: (field: keyof TransactionFormData) => ValidationState;
  getFieldError: (field: keyof TransactionFormData) => string | undefined;
}

export type StepToSection = {
  [key: number]: keyof TransactionFormData;
};

export const stepToSection: StepToSection = {
  0: 'role',
  1: 'clients',
  2: 'propertyAddress',
  3: 'propertyStatus',
  4: 'commissionBase',
  5: 'referralParty',
  6: 'homeWarrantyPurchased',
  7: 'attorneyRepresentation',
  8: 'requiredDocuments',
  9: 'titleCompany',
  10: 'updateMLS',
  11: 'additionalNotes'
} as const;
// Document categories from DocumentsSection
export const DOCUMENT_CATEGORIES = {
  "Core Transaction Documents": [
    "Agreement of Sale & Addenda",
    "Attorney Review Clause", 
    "Deposit Money Notice",
    "Commission Agreement",
    "Wire Fraud Advisory",
  ],
  "Agency & Disclosure Documents": [
    "Buyer's Agency Contract",
    "Listing Agreement",
    "Dual Agency Disclosure", 
    "Consumer Notice",
    "KW Affiliate Services Disclosure",
  ],
  "Financial Documents": [
    "Estimated Closing Costs",
    "Estimated Seller Proceeds",
    "Prequalification Letter",
    "Proof of Funds",
  ],
  "Property Documents": [
    "Seller's Property Disclosure",
    "Title Documents",
  ],
  "Additional Documents": [
    "KW Home Warranty Waiver",
  ],
} as const;

export interface SignatureSectionProps extends Omit<FormSectionProps, 'role'> {}

export interface RoleSectionProps {
  role: AgentRole;
  onUpdate: (field: keyof TransactionFormData, value: any) => void;
}

export interface FormProgressProps {
  sections: readonly typeof FORM_SECTIONS[number][];
  currentSection: number;
  onSectionClick: (index: number) => void;
  canAccessSection: (index: number) => boolean;
  isSectionComplete: (index: number) => boolean;
  hasError: (index: number) => boolean;
}

// Required document lists for each role (COMPLIANCE REQUIRED)
export const BUYERS_AGENT_DOCUMENTS = [
  "Agreement of Sale & Addenda",
  "Attorney Review Clause",
  "Deposit Money Notice",
  "Buyer's Agency Contract",
  "Estimated Closing Costs",
  "KW Affiliate Services Disclosure",
  "Consumer Notice",
  "Seller's Property Disclosure",
  "Prequalification Letter",
  "Proof of Funds",
  "Commission Agreement",
  "Wire Fraud Advisory",
  "KW Home Warranty Waiver"
];

export const LISTING_AGENT_DOCUMENTS = [
  "Listing Agreement",
  "Seller's Property Disclosure",
  "Agreement of Sale",
  "Estimated Seller Proceeds",
  "Title Documents",
  "KW Affiliate Services Disclosure",
  "Wire Fraud Advisory",
  "Commission Agreement"
];

export const DUAL_AGENT_DOCUMENTS = [
  "Agreement of Sale & Addenda",
  "Dual Agency Disclosure",
  "Deposit Money Notice",
  "Attorney Review Clause",
  "Buyer's Agency Contract",
  "Buyer's Estimated Costs",
  "Prequalification Letter",
  "Proof of Funds",
  "Listing Agreement",
  "Seller's Property Disclosure",
  "Estimated Seller Proceeds",
  "Title Documents",
  "KW Affiliate Services Disclosure",
  "Consumer Notice",
  "Wire Fraud Advisory",
  "Commission Agreement",
  "KW Home Warranty Waiver"
];
