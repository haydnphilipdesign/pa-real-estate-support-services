import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface HelpButtonProps {
  content: string | React.ReactNode;
}

export const helpContentBySection = {
  role: (
    <div className="space-y-3">
      <p>Select your role in this transaction:</p>
      <ul className="space-y-2">
        <li>
          <strong>Buyer's Agent:</strong> You represent the buyer in the transaction.
          Required documents include buyer representation agreement and proof of funds.
        </li>
        <li>
          <strong>Listing Agent:</strong> You represent the seller in the transaction.
          Required documents include listing agreement and seller disclosures.
        </li>
        <li>
          <strong>Dual Agent:</strong> You represent both parties with their informed consent.
          Additional documentation and disclosures are required.
        </li>
      </ul>
      <p className="text-sm text-blue-200">
        Your selection determines required documentation and commission structure.
      </p>
    </div>
  ),
  property: (
    <div className="space-y-3">
      <p>Enter accurate property information:</p>
      <ul className="space-y-2">
        <li>
          <strong>MLS Number:</strong> The unique identifier from the Multiple Listing Service.
          Format: 6 digits or PM-followed by 6 digits.
        </li>
        <li>
          <strong>Property Address:</strong> Complete property address including unit number.
          Use the autocomplete to ensure accuracy.
        </li>
        <li>
          <strong>Sale Price:</strong> The agreed-upon price from the Agreement of Sale.
          Must match the contract exactly.
        </li>
      </ul>
      <p className="text-sm text-blue-200">
        All information must match official documentation exactly.
      </p>
    </div>
  ),
  client: (
    <div className="space-y-3">
      <p>Enter client details accurately:</p>
      <ul className="space-y-2">
        <li>
          <strong>Contact Information:</strong> Primary phone and email for all parties.
          Used for transaction updates and document delivery.
        </li>
        <li>
          <strong>Legal Names:</strong> Names must match government ID exactly.
          Required for all legal documents.
        </li>
        <li>
          <strong>Entity Type:</strong> Individual, Trust, LLC, etc.
          Additional documentation may be required for entities.
        </li>
      </ul>
      <p className="text-sm text-blue-200">
        Accurate client information is crucial for legal compliance.
      </p>
    </div>
  ),
  commission: (
    <div className="space-y-3">
      <p>Enter commission details:</p>
      <ul className="space-y-2">
        <li>
          <strong>Commission Rate:</strong> The agreed percentage or flat fee.
          Must match listing or buyer representation agreement.
        </li>
        <li>
          <strong>Split Details:</strong> How the commission is divided between agents.
          Include any referral fees or additional terms.
        </li>
        <li>
          <strong>Special Terms:</strong> Any non-standard commission arrangements.
          Requires broker approval and documentation.
        </li>
      </ul>
      <p className="text-sm text-blue-200">
        Commission terms must be approved by all parties and documented.
      </p>
    </div>
  ),
  documents: (
    <div className="space-y-3">
      <p>Upload required transaction documents:</p>
      <ul className="space-y-2">
        <li>
          <strong>Required Documents:</strong> Based on your role and transaction type.
          All documents must be complete and signed.
        </li>
        <li>
          <strong>File Format:</strong> PDF format preferred, max 10MB per file.
          Ensure all pages are included and legible.
        </li>
        <li>
          <strong>Signatures:</strong> All required signatures must be present.
          Electronic and wet signatures accepted.
        </li>
      </ul>
      <p className="text-sm text-blue-200">
        Missing or incomplete documents will delay processing.
      </p>
    </div>
  ),
  signature: (
    <div className="space-y-3">
      <p>Review and sign the submission:</p>
      <ul className="space-y-2">
        <li>
          <strong>Review:</strong> Verify all information is accurate and complete.
          Changes after submission require reprocessing.
        </li>
        <li>
          <strong>Certification:</strong> You certify all information is true and accurate.
          False information may result in disciplinary action.
        </li>
        <li>
          <strong>Submission:</strong> Once signed, the transaction will be processed.
          You'll receive confirmation and next steps.
        </li>
      </ul>
      <p className="text-sm text-blue-200">
        Electronic signature is legally binding.
      </p>
    </div>
  )
};

export const HelpButton: React.FC<HelpButtonProps> = ({ content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            type="button"
            className="text-gray-400 hover:text-[#1e3a8a] transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 rounded-full"
            aria-label="Help information"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="right"
          className="bg-[#1e3a8a] text-white text-sm py-3 px-4 rounded-xl shadow-xl border border-white/10 backdrop-blur-sm max-w-md"
          sideOffset={5}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
