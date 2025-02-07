import { TransactionFormData } from '../types';

// Base mock data that's common across all roles
const baseMockData: Partial<TransactionFormData> = {
  agentContact: "(555) 123-4567",
  propertyStatus: "Vacant",
  
  // Commission Information
  commissionBase: "Sale Price",
  totalCommission: "6",
  
  // Property Details
  resaleCertRequired: true,
  hoa: "Test HOA",
  coRequired: false,
  municipalityTownship: "Test Township",
  firstRightOfRefusal: false,
  attorneyRepresentation: true,
  attorneyName: "Jane Legal",

  // Warranty Information
  homeWarrantyPurchased: true,
  homeWarrantyCompany: "Test Warranty Co",
  warrantyCost: "500",
  warrantyPaidBy: "Seller",

  // Title Company Information
  titleCompany: "Test Title Co",
  tcFeePaidBy: "Client",

  // MLS Status
  updateMLS: true,

  // Documents
  acknowledgeDocuments: true,

  // Additional Information
  specialInstructions: "Test special instructions",
  urgentIssues: "Test urgent issues",
  additionalNotes: "Test additional notes",

  // Final Details
  agentSignature: "John Doe",
  confirmationChecked: true
};

// Listing Agent specific mock data
export const listingAgentMockData: Partial<TransactionFormData> = {
  ...baseMockData,
  role: "Listing Agent",
  agentName: "Sarah Miller",
  mlsNumber: "PM-123456",
  propertyAddress: "123 Seller Street, Listing City, ST 12345",
  salePrice: "550000",
  clients: [
    {
      name: "James Wilson",
      address: "123 Seller Street, Listing City, ST 12345",
      email: "james@example.com",
      phone: "(555) 111-2222",
      maritalStatus: "Married",
      designation: "Seller"
    }
  ],
  totalCommissionFixed: "33000",
  listingAgentCommissionType: "Percentage",
  listingAgentCommission: "3",
  listingAgentCommissionFixed: "16500",
  buyersAgentCommissionType: "Percentage",
  buyersAgentCommission: "3",
  buyersAgentCommissionFixed: "16500",
};

// Buyer's Agent specific mock data
export const buyersAgentMockData: Partial<TransactionFormData> = {
  ...baseMockData,
  role: "Buyer's Agent",
  agentName: "Michael Chen",
  mlsNumber: "PM-789012",
  propertyAddress: "456 Buyer Avenue, Purchase City, ST 12345",
  salePrice: "450000",
  clients: [
    {
      name: "Emily Brown",
      address: "789 Current St, Purchase City, ST 12345",
      email: "emily@example.com",
      phone: "(555) 333-4444",
      maritalStatus: "Single",
      designation: "Buyer"
    }
  ],
  totalCommissionFixed: "27000",
  listingAgentCommissionType: "Percentage",
  listingAgentCommission: "3",
  listingAgentCommissionFixed: "13500",
  buyersAgentCommissionType: "Percentage",
  buyersAgentCommission: "3",
  buyersAgentCommissionFixed: "13500",
  buyerPaidCommission: "0"
};

// Dual Agent specific mock data
export const dualAgentMockData: Partial<TransactionFormData> = {
  ...baseMockData,
  role: "Dual Agent",
  agentName: "Alex Thompson",
  mlsNumber: "PM-345678",
  propertyAddress: "789 Dual Role Road, Both City, ST 12345",
  salePrice: "600000",
  clients: [
    {
      name: "Robert Davis",
      address: "789 Dual Role Road, Both City, ST 12345",
      email: "robert@example.com",
      phone: "(555) 555-6666",
      maritalStatus: "Married",
      designation: "Seller"
    },
    {
      name: "Lisa Martinez",
      address: "321 New Home Lane, Both City, ST 12345",
      email: "lisa@example.com",
      phone: "(555) 777-8888",
      maritalStatus: "Single",
      designation: "Buyer"
    }
  ],
  totalCommissionFixed: "36000",
  listingAgentCommissionType: "Percentage",
  listingAgentCommission: "6",
  listingAgentCommissionFixed: "36000",
  buyersAgentCommissionType: "Percentage",
  buyersAgentCommission: "0",
  buyersAgentCommissionFixed: "0",
};

// Export validation error examples for testing
export const mockValidationErrors = [
  'Property address is required',
  'Sale price must be a valid number',
  'At least one client is required',
  'Commission split must equal 100%'
];

export const mockApiResponse = {
  success: true,
  transactionId: 'TX-20240101-TEST123',
  submissionDate: new Date().toISOString()
};

export const mockApiError = {
  success: false,
  errors: ['API Error: Unable to process request']
};

export const mockNetworkError = new Error('Network request failed');

export const mockSubmissionProgress = {
  validation: {
    stage: 'validation' as const,
    progress: 0,
    message: 'Validating form data...'
  },
  processing: {
    stage: 'processing' as const,
    progress: 25,
    message: 'Processing form data...'
  },
  uploading: {
    stage: 'uploading' as const,
    progress: 50,
    message: 'Submitting form...'
  },
  retrying: {
    stage: 'uploading' as const,
    progress: 75,
    message: 'Attempt 2 of 3...'
  },
  complete: {
    stage: 'complete' as const,
    progress: 100,
    message: 'Submission complete'
  }
}; 