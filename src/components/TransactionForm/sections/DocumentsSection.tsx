import React from 'react';
import { FormSectionContainer, FormFieldWrapper } from '../components/BaseFormSection';
import { FormFieldGroup } from '../components/FormFieldGroup';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import { useFormSection } from '../../../hooks/useFormSection';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { BUYERS_AGENT_DOCUMENTS, LISTING_AGENT_DOCUMENTS, DUAL_AGENT_DOCUMENTS } from '../types';

// Document categories with their respective documents
const DOCUMENT_CATEGORIES = {
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

// Helper function to get role-specific documents
const getRoleDocuments = (role: string): string[] => {
  switch (role) {
    case "Buyer's Agent":
      return [
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
    case "Listing Agent":
      return [
        "Listing Agreement",
        "Seller's Property Disclosure",
        "Agreement of Sale",
        "Estimated Seller Proceeds",
        "Title Documents",
        "KW Affiliate Services Disclosure",
        "Wire Fraud Advisory",
        "Commission Agreement"
      ];
    case "Dual Agent":
      return [
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
    default:
      return [];
  }
};

export const DocumentsSection: React.FC = () => {
  const { formData, updateField, getFieldValidationState, getFieldError } = useFormSection({
    sectionName: 'documents',
    sectionIndex: 8
  });

  const roleDocuments = getRoleDocuments(formData.role);

  const handleDocumentToggle = (document: string) => {
    const currentDocs = formData.requiredDocuments || [];
    const newDocs = currentDocs.includes(document)
      ? currentDocs.filter(doc => doc !== document)
      : [...currentDocs, document];
    updateField('requiredDocuments', newDocs);
  };

  // Group documents by category for the current role
  const getDocumentsByCategory = () => {
    const categorizedDocs: Record<string, string[]> = {};
    
    Object.entries(DOCUMENT_CATEGORIES).forEach(([category, docs]) => {
      const roleDocs = docs.filter(doc => roleDocuments.includes(doc));
      if (roleDocs.length > 0) {
        categorizedDocs[category] = roleDocs;
      }
    });
    
    return categorizedDocs;
  };

  // Check if all documents in a category are selected
  const isCategoryFullySelected = (documents: string[]) => {
    return documents.every(doc => formData.requiredDocuments?.includes(doc));
  };

  // Check if some documents in a category are selected
  const isCategoryPartiallySelected = (documents: string[]) => {
    return documents.some(doc => formData.requiredDocuments?.includes(doc)) && 
           !isCategoryFullySelected(documents);
  };

  // Toggle all documents in a category
  const handleCategoryToggle = (documents: string[]) => {
    const currentDocs = formData.requiredDocuments || [];
    const isFullySelected = isCategoryFullySelected(documents);
    
    const newDocs = isFullySelected
      ? currentDocs.filter(doc => !documents.includes(doc))
      : [...new Set([...currentDocs, ...documents])];
    
    updateField('requiredDocuments', newDocs);
  };

  // Check if all documents are selected
  const areAllDocumentsSelected = () => {
    const allDocuments = Object.values(getDocumentsByCategory()).flat();
    return allDocuments.every(doc => formData.requiredDocuments?.includes(doc));
  };

  // Toggle all documents
  const handleToggleAll = () => {
    const allDocuments = Object.values(getDocumentsByCategory()).flat();
    const shouldCheckAll = !areAllDocumentsSelected();
    
    updateField('requiredDocuments', shouldCheckAll ? allDocuments : []);
  };

  // Balance categories between columns based on document count
  const getBalancedColumns = () => {
    const documentsByCategory = getDocumentsByCategory();
    const categories = Object.entries(documentsByCategory);
    let leftColumnCount = 0;
    let rightColumnCount = 0;
    const leftColumn: string[] = [];
    const rightColumn: string[] = [];

    categories.sort((a, b) => b[1].length - a[1].length);

    categories.forEach(([category, docs]) => {
      if (leftColumnCount <= rightColumnCount) {
        leftColumn.push(category);
        leftColumnCount += docs.length;
      } else {
        rightColumn.push(category);
        rightColumnCount += docs.length;
      }
    });

    return [leftColumn, rightColumn] as const;
  };

  const [leftColumnCategories, rightColumnCategories] = getBalancedColumns();
  const documentsByCategory = getDocumentsByCategory();

  return (
    <FormSectionContainer>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Required Documents</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleAll}
            className="ml-4"
          >
            {areAllDocumentsSelected() ? 'Uncheck All' : 'Check All'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {leftColumnCategories.map(category => (
              <FormFieldGroup 
                key={category} 
                title={`${category} (${documentsByCategory[category].length})`} 
                description={`Select all required ${category.toLowerCase()}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 pb-2 border-b">
                    <Checkbox
                      id={`category-${category}`}
                      checked={isCategoryFullySelected(documentsByCategory[category])}
                      data-state={isCategoryPartiallySelected(documentsByCategory[category]) ? 'indeterminate' : undefined}
                      onCheckedChange={() => handleCategoryToggle(documentsByCategory[category])}
                    />
                    <Label 
                      htmlFor={`category-${category}`} 
                      className="text-sm font-medium cursor-pointer"
                    >
                      Select All {category}
                    </Label>
                  </div>
                  {documentsByCategory[category].map(document => (
                    <div key={document} className="flex items-start space-x-3 pl-4">
                      <Checkbox
                        id={document}
                        checked={formData.requiredDocuments?.includes(document)}
                        onCheckedChange={() => handleDocumentToggle(document)}
                      />
                      <Label 
                        htmlFor={document} 
                        className="text-sm leading-tight cursor-pointer"
                      >
                        {document}
                      </Label>
                    </div>
                  ))}
                </div>
              </FormFieldGroup>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {rightColumnCategories.map(category => (
              <FormFieldGroup 
                key={category} 
                title={`${category} (${documentsByCategory[category].length})`} 
                description={`Select all required ${category.toLowerCase()}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 pb-2 border-b">
                    <Checkbox
                      id={`category-${category}`}
                      checked={isCategoryFullySelected(documentsByCategory[category])}
                      data-state={isCategoryPartiallySelected(documentsByCategory[category]) ? 'indeterminate' : undefined}
                      onCheckedChange={() => handleCategoryToggle(documentsByCategory[category])}
                    />
                    <Label 
                      htmlFor={`category-${category}`} 
                      className="text-sm font-medium cursor-pointer"
                    >
                      Select All {category}
                    </Label>
                  </div>
                  {documentsByCategory[category].map(document => (
                    <div key={document} className="flex items-start space-x-3 pl-4">
                      <Checkbox
                        id={document}
                        checked={formData.requiredDocuments?.includes(document)}
                        onCheckedChange={() => handleDocumentToggle(document)}
                      />
                      <Label 
                        htmlFor={document} 
                        className="text-sm leading-tight cursor-pointer"
                      >
                        {document}
                      </Label>
                    </div>
                  ))}
                </div>
              </FormFieldGroup>
            ))}
          </div>
        </div>

        <FormFieldWrapper
          label="Document Acknowledgment"
          required
          error={getFieldValidationState('acknowledgeDocuments') === 'invalid' ? getFieldError('acknowledgeDocuments') : undefined}
        >
          <div className="flex items-start space-x-3">
            <Checkbox
              id="acknowledgeDocuments"
              checked={formData.acknowledgeDocuments}
              onCheckedChange={(checked) => updateField('acknowledgeDocuments', checked === true)}
            />
            <Label 
              htmlFor="acknowledgeDocuments" 
              className="text-sm leading-tight cursor-pointer"
            >
              I acknowledge that I have reviewed and will submit all required documents for this transaction
            </Label>
          </div>
        </FormFieldWrapper>

        <Alert>
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-2">
              <li>Select all documents that are required for this transaction</li>
              <li>Documents are organized by category for easier reference</li>
              <li>You can select/deselect entire categories or individual documents</li>
              <li>Use the "Check All" button to quickly select or deselect all documents</li>
              <li>You must acknowledge that you will submit all required documents</li>
              <li>Additional documents may be required based on specific transaction details</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </FormSectionContainer>
  );
};