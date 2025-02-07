import { FormSection } from "../ui/form";
import { FormField } from "./FormField";
import { Checkbox } from "../ui/checkbox";
import { FormSectionProps, BUYERS_AGENT_DOCUMENTS, LISTING_AGENT_DOCUMENTS, DUAL_AGENT_DOCUMENTS } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

interface DocumentGroup {
  title: string;
  documents: {
    name: string;
    required: boolean;
    description: string;
  }[];
}

const documentGroups: { [key: string]: DocumentGroup[] } = {
  "Buyer's Agent": [
    {
      title: "Transaction Documents",
      documents: [
        { name: "Agreement of Sale & Addenda", required: true, description: "Primary contract and any additional terms" },
        { name: "Attorney Review Clause", required: true, description: "Legal review period terms" },
        { name: "Deposit Money Notice", required: true, description: "Details of earnest money handling" }
      ]
    },
    {
      title: "Disclosures",
      documents: [
        { name: "KW Affiliate Services Disclosure", required: true, description: "Required affiliated business disclosure" },
        { name: "Consumer Notice", required: true, description: "State-mandated consumer notice" },
        { name: "Lead Based Paint Disclosure", required: false, description: "Required for homes built before 1978" }
      ]
    },
    {
      title: "Financial Documents",
      documents: [
        { name: "Prequalification/Proof of Funds", required: true, description: "Verification of buyer's ability to purchase" },
        { name: "Buyer's Estimated Costs", required: true, description: "Detailed breakdown of buyer's expenses" },
        { name: "Cooperating Broker's Compensation", required: true, description: "Commission agreement details" }
      ]
    }
  ],
  "Listing Agent": [
    {
      title: "Listing Documents",
      documents: [
        { name: "Agreement of Sale and Addenda", required: true, description: "Primary contract and additional terms" },
        { name: "Seller's Property Disclosure", required: true, description: "Required property condition disclosure" }
      ]
    },
    {
      title: "Financial Documents",
      documents: [
        { name: "Seller's Estimated Costs", required: true, description: "Detailed breakdown of seller's expenses" },
        { name: "Cooperating Broker's Compensation", required: true, description: "Commission agreement details" }
      ]
    },
    {
      title: "Additional Documents",
      documents: [
        { name: "KW Wire Fraud Advisory", required: true, description: "Wire transfer security information" },
        { name: "KW Home Warranty Waiver", required: false, description: "If warranty is declined" }
      ]
    }
  ],
  "Dual Agent": [
    {
      title: "Core Documents",
      documents: [
        { name: "Agreement of Sale & Addenda", required: true, description: "Primary contract and additional terms" },
        { name: "Dual Agency Disclosure", required: true, description: "Required dual representation disclosure" }
      ]
    },
    {
      title: "Buyer Documents",
      documents: [
        { name: "Buyer's Agency Contract", required: true, description: "Buyer representation agreement" },
        { name: "Buyer's Estimated Costs", required: true, description: "Detailed breakdown of buyer's expenses" }
      ]
    },
    {
      title: "Seller Documents",
      documents: [
        { name: "Seller's Property Disclosure", required: true, description: "Required property condition disclosure" },
        { name: "Seller's Estimated Costs", required: true, description: "Detailed breakdown of seller's expenses" }
      ]
    }
  ]
};

export const DocumentsSection = ({ 
  formData, 
  onUpdate,
  getValidationState,
  getFieldError 
}: FormSectionProps) => {
  const currentGroups = documentGroups[formData.role] || [];
  const validationState = getValidationState('requiredDocuments');
  const error = getFieldError('requiredDocuments');

  const handleDocumentChange = (documentName: string, checked: boolean) => {
    const updatedDocuments = checked
      ? [...formData.requiredDocuments, documentName]
      : formData.requiredDocuments.filter(doc => doc !== documentName);
    onUpdate("requiredDocuments", updatedDocuments);
  };

  const isDocumentComplete = (group: DocumentGroup) => {
    return group.documents
      .filter(doc => doc.required)
      .every(doc => formData.requiredDocuments.includes(doc.name));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Required Documents</h2>
        <div className="text-sm text-red-500">* Required</div>
      </div>

      <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              Please confirm that all required documents have been uploaded to either DocuSign or Dotloop.
              These documents are necessary for transaction compliance.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {currentGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className={cn(
                "border rounded-xl p-6",
                "bg-white shadow-sm",
                isDocumentComplete(group) 
                  ? "border-emerald-200 bg-emerald-50/30" 
                  : "border-gray-200"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{group.title}</h3>
                {isDocumentComplete(group) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-emerald-500"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </motion.div>
                )}
              </div>

              <div className="space-y-4">
                {group.documents.map((document) => (
                  <div key={document.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={document.name}
                        checked={formData.requiredDocuments.includes(document.name)}
                        onCheckedChange={(checked) => handleDocumentChange(document.name, checked as boolean)}
                        className={cn(
                          document.required && "border-2",
                          document.required && !formData.requiredDocuments.includes(document.name) 
                            ? "border-red-500" 
                            : "border-gray-200"
                        )}
                      />
                      <div className="space-y-1">
                        <label
                          htmlFor={document.name}
                          className={cn(
                            "text-sm font-medium cursor-pointer",
                            document.required ? "text-gray-900" : "text-gray-600"
                          )}
                        >
                          {document.name}
                          {document.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      </div>
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="text-sm">{document.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
