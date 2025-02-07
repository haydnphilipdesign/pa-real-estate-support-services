import { TransactionFormData } from '../types';
import { validateSection } from './validation';

interface SectionDependency {
  section: number;
  condition: (formData: TransactionFormData) => boolean;
}

interface SectionConfig {
  dependencies?: SectionDependency[];
  requiredFields: (keyof TransactionFormData)[];
  validateAccess?: (formData: TransactionFormData) => boolean;
}

// Define section configurations
const sectionConfigs: Record<number, SectionConfig> = {
  0: { // Role Section
    requiredFields: ['role'],
  },
  1: { // Property Section
    dependencies: [
      { section: 0, condition: (data) => Boolean(data.role) }
    ],
    requiredFields: ['propertyAddress', 'salePrice', 'propertyStatus'],
  },
  2: { // Client Section
    dependencies: [
      { section: 1, condition: (data) => Boolean(data.propertyAddress && data.salePrice) }
    ],
    requiredFields: ['clients'],
    validateAccess: (data) => data.clients?.length > 0,
  },
  3: { // Commission Section
    dependencies: [
      { section: 2, condition: (data) => Boolean(data.clients?.[0]?.name) }
    ],
    requiredFields: ['commissionBase', 'totalCommission'],
  },
  4: { // Property Details Section
    dependencies: [
      { section: 1, condition: (data) => Boolean(data.propertyAddress) }
    ],
    requiredFields: ['accessType'],
  },
  5: { // Warranty Section
    dependencies: [
      { section: 1, condition: (data) => Boolean(data.propertyAddress) }
    ],
    requiredFields: ['homeWarrantyPurchased'],
  },
  6: { // Title Company Section
    dependencies: [
      { section: 1, condition: (data) => Boolean(data.propertyAddress) }
    ],
    requiredFields: ['titleCompany', 'tcFeePaidBy'],
  },
  7: { // Documents Section
    dependencies: [
      { section: 1, condition: (data) => Boolean(data.propertyAddress) },
      { section: 2, condition: (data) => Boolean(data.clients?.[0]?.name) }
    ],
    requiredFields: ['acknowledgeDocuments'],
  },
  8: { // Additional Info Section
    dependencies: [
      { section: 1, condition: (data) => Boolean(data.propertyAddress) }
    ],
    requiredFields: [],
  },
  9: { // Signature Section
    dependencies: [
      { section: 7, condition: (data) => Boolean(data.acknowledgeDocuments) }
    ],
    requiredFields: ['agentName', 'dateSubmitted', 'confirmationChecked'],
  },
};

export function canAccessSection(
  sectionIndex: number,
  formData: TransactionFormData,
  completedSections: number[]
): boolean {
  // Always allow access to role section
  if (sectionIndex === 0) return true;

  const config = sectionConfigs[sectionIndex];
  if (!config) return false;

  // Check dependencies
  if (config.dependencies) {
    for (const dep of config.dependencies) {
      if (!completedSections.includes(dep.section) || !dep.condition(formData)) {
        return false;
      }
    }
  }

  // Check custom validation
  if (config.validateAccess && !config.validateAccess(formData)) {
    return false;
  }

  return true;
}

export function getRequiredFieldsForSection(sectionIndex: number): (keyof TransactionFormData)[] {
  return sectionConfigs[sectionIndex]?.requiredFields || [];
}

export function validateSectionAccess(
  sectionIndex: number,
  formData: TransactionFormData,
  completedSections: number[]
): { isValid: boolean; error?: string } {
  // Check if we can access this section
  if (!canAccessSection(sectionIndex, formData, completedSections)) {
    return {
      isValid: false,
      error: 'Please complete previous sections before accessing this one.'
    };
  }

  // Validate required fields for previous sections
  for (let i = 0; i < sectionIndex; i++) {
    const validation = validateSection(i, formData);
    if (!validation.isValid) {
      return {
        isValid: false,
        error: `Please complete section ${i + 1} before proceeding.`
      };
    }
  }

  return { isValid: true };
}

export function getNextSection(
  currentSection: number,
  formData: TransactionFormData,
  completedSections: number[]
): number {
  const nextSection = currentSection + 1;
  
  // If we're at the end, stay there
  if (nextSection >= Object.keys(sectionConfigs).length) {
    return currentSection;
  }

  // Check if we can access the next section
  if (!canAccessSection(nextSection, formData, completedSections)) {
    return currentSection;
  }

  return nextSection;
}

export function getPreviousSection(currentSection: number): number {
  return Math.max(-1, currentSection - 1);
}

export function getSectionProgress(
  formData: TransactionFormData,
  completedSections: number[]
): {
  totalSections: number;
  completedCount: number;
  currentProgress: number;
} {
  const totalSections = Object.keys(sectionConfigs).length;
  const completedCount = completedSections.length;
  const currentProgress = (completedCount / totalSections) * 100;

  return {
    totalSections,
    completedCount,
    currentProgress
  };
} 