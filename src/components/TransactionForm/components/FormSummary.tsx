import React from 'react';
import { CheckCircle2, AlertCircle, Circle } from 'lucide-react';
import { TransactionFormData } from '../types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../ui/tooltip';

interface FormSummaryProps {
  formData: TransactionFormData;
  currentSection: number;
  completedSections: number[];
  hasError: (index: number) => boolean;
}

export const FormSummary: React.FC<FormSummaryProps> = ({
  formData,
  currentSection,
  completedSections,
  hasError,
}) => {
  const getSectionSummary = (index: number): string => {
    switch (index) {
      case 1:
        return `Role: ${formData.role}`;
      case 2:
        return `Property: ${formData.propertyAddress || 'Not set'}`;
      case 3:
        return `Clients: ${formData.clients?.length || 0} added`;
      case 4:
        return `Commission: ${formData.totalCommission ? '$' + formData.totalCommission : 'Not set'}`;
      case 5:
        return `Property Details: ${formData.propertyStatus || 'Not set'}`;
      case 6:
        return `Warranty: ${formData.homeWarrantyPurchased ? 'Yes' : 'No'}`;
      case 7:
        return `Title Company: ${formData.titleCompany || 'Not set'}`;
      case 8:
        return `Documents: ${formData.requiredDocuments?.length || 0} uploaded`;
      case 9:
        return `Additional Info: ${formData.additionalNotes ? 'Added' : 'None'}`;
      case 10:
        return `Signature: ${formData.agentSignature ? 'Signed' : 'Not signed'}`;
      default:
        return '';
    }
  };

  const getStatusIcon = (index: number) => {
    if (completedSections.includes(index)) {
      return hasError(index) ? (
        <AlertCircle className="h-5 w-5 text-red-500" />
      ) : (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      );
    }
    return <Circle className="h-5 w-5 text-gray-300" />;
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Form Progress</h3>
      <div className="space-y-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center justify-between p-2 rounded ${
                  currentSection === index
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(index)}
                  <span className={currentSection === index ? 'font-medium' : ''}>
                    {getSectionSummary(index)}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {completedSections.includes(index)
                  ? hasError(index)
                    ? 'Section has validation errors'
                    : 'Section completed'
                  : 'Section not started'}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}; 