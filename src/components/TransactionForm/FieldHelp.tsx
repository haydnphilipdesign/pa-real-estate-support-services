import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';

export interface FieldHelpContent {
  title: string;
  description: string;
  examples?: string[];
  requirements?: string[];
}

export const fieldHelpContent: Record<string, FieldHelpContent> = {
  // Role Section
  role: {
    title: 'Agent Role',
    description: 'Select your role in this transaction',
    requirements: ['Must select one role'],
  },

  // Property Section
  mlsNumber: {
    title: 'MLS Number',
    description: 'The Multiple Listing Service number for the property',
    examples: ['A123456', 'MLS789012'],
    requirements: ['Must be a valid MLS number format'],
  },
  propertyAddress: {
    title: 'Property Address',
    description: 'Complete property address including street, city, state, and ZIP',
    examples: ['123 Main St, Philadelphia, PA 19019'],
    requirements: ['Must include street address', 'Must include city, state, and ZIP'],
  },
  propertyStatus: {
    title: 'Property Status',
    description: 'Current status of the property in the transaction process',
    requirements: ['Must select a valid status'],
  },

  // Client Section
  'clients.name': {
    title: 'Client Name',
    description: 'Full legal name of the client',
    examples: ['John A. Smith'],
    requirements: ['Must include first and last name'],
  },
  'clients.email': {
    title: 'Client Email',
    description: 'Primary email address for client communications',
    examples: ['john.smith@email.com'],
    requirements: ['Must be a valid email address'],
  },
  'clients.phone': {
    title: 'Client Phone',
    description: 'Primary contact number for the client',
    examples: ['(215) 555-0123'],
    requirements: ['Must be a valid US phone number'],
  },
  'clients.maritalStatus': {
    title: 'Marital Status',
    description: 'Current marital status of the client',
    requirements: ['Required for title company documentation'],
  },

  // Commission Section
  salePrice: {
    title: 'Sale Price',
    description: 'Agreed upon sale price for the property',
    examples: ['250000', '1250000'],
    requirements: ['Must be a numeric value', 'No commas or special characters'],
  },
  commissionBase: {
    title: 'Commission Base',
    description: 'Base amount used to calculate commission',
    examples: ['6%', '2.5%'],
    requirements: ['Must be a valid percentage'],
  },
  totalCommission: {
    title: 'Total Commission',
    description: 'Total commission amount for the transaction',
    requirements: ['Must be calculated based on sale price and commission base'],
  },

  // Property Details
  winterizedStatus: {
    title: 'Winterized Status',
    description: 'Current winterization status of the property',
    requirements: ['Required for properties in cold weather regions'],
  },
  accessType: {
    title: 'Access Type',
    description: 'How to access the property for showings or inspections',
    examples: ['Lockbox', 'Call Agent', 'Schedule Online'],
    requirements: ['Must specify access method'],
  },
  hoa: {
    title: 'HOA Information',
    description: 'Homeowners Association details if applicable',
    examples: ['Monthly fee: $250, Contact: HOA Manager at (215) 555-0199'],
  },

  // Warranty Section
  homeWarrantyCompany: {
    title: 'Warranty Company',
    description: 'Company providing the home warranty',
    requirements: ['Required if home warranty is purchased'],
  },
  warrantyCost: {
    title: 'Warranty Cost',
    description: 'Total cost of the home warranty',
    examples: ['500', '750'],
    requirements: ['Must be a numeric value'],
  },

  // Title Company
  titleCompany: {
    title: 'Title Company',
    description: 'Company handling title insurance and closing',
    requirements: ['Must be a valid title company from approved list'],
  },
  tcFeePaidBy: {
    title: 'Title Fee Responsibility',
    description: 'Party responsible for paying title company fees',
    requirements: ['Must specify responsible party'],
  },

  // Additional Information
  specialInstructions: {
    title: 'Special Instructions',
    description: 'Any special instructions or notes for processing',
    examples: ['Expedited processing needed', 'Requires management approval'],
  },
  urgentIssues: {
    title: 'Urgent Issues',
    description: 'Any time-sensitive or critical issues requiring immediate attention',
    examples: ['Closing date must be before end of month', 'Inspection contingency expires tomorrow'],
  }
};

interface FieldHelpProps {
  fieldName: string;
  className?: string;
}

export const FieldHelp: React.FC<FieldHelpProps> = ({ fieldName, className }) => {
  const content = fieldHelpContent[fieldName];
  if (!content) return null;

  return (
    <Tooltip>
      <TooltipTrigger className={className}>
        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[300px] p-4 space-y-2">
        <div className="font-semibold text-sm">{content.title}</div>
        <p className="text-sm text-muted-foreground">{content.description}</p>
        
        {content.examples && content.examples.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium">Examples:</div>
            <ul className="text-xs text-muted-foreground list-disc list-inside">
              {content.examples.map((example, i) => (
                <li key={i}>{example}</li>
              ))}
            </ul>
          </div>
        )}
        
        {content.requirements && content.requirements.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium">Requirements:</div>
            <ul className="text-xs text-muted-foreground list-disc list-inside">
              {content.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}; 