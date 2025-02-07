import { TransactionFormData } from '../types';
import { validateForm } from './validation';
import { analyticsService } from '../../../services/analytics';

export interface SubmissionResult {
  success: boolean;
  errors?: string[];
  transactionId?: string;
  submissionDate?: string;
}

interface ProcessedFormData extends TransactionFormData {
  submissionDate: string;
  transactionId: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
}

// Process form data before submission
function processFormData(data: TransactionFormData): ProcessedFormData {
  const now = new Date();
  const transactionId = `TX-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

  return {
    ...data,
    submissionDate: now.toISOString(),
    transactionId,
    status: 'pending'
  };
}

// Format currency values
function formatCurrencyValues(data: ProcessedFormData): ProcessedFormData {
  const currencyFields = ['salePrice', 'totalCommission', 'listingAgentCommission', 'buyersAgentCommission'];
  
  return {
    ...data,
    ...Object.fromEntries(
      currencyFields.map(field => [
        field,
        data[field] ? parseFloat(data[field].replace(/[^0-9.-]/g, '')).toFixed(2) : undefined
      ])
    )
  };
}

// Clean and normalize data
function normalizeFormData(data: ProcessedFormData): ProcessedFormData {
  return {
    ...data,
    clients: data.clients?.map(client => ({
      ...client,
      phone: client.phone?.replace(/\D/g, ''),
      email: client.email?.toLowerCase().trim(),
      name: client.name?.trim()
    })),
    propertyAddress: data.propertyAddress?.trim(),
    agentName: data.agentName?.trim(),
    notes: data.notes?.trim() || undefined
  };
}

// Add these new interfaces and types
interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffFactor: number;
}

interface SubmissionProgress {
  stage: 'validation' | 'processing' | 'uploading' | 'complete';
  progress: number;
  message: string;
}

type ProgressCallback = (progress: SubmissionProgress) => void;

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffFactor: 2
};

// Add this before the submitToApi function
async function submitWithRetry(
  data: ProcessedFormData,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  onProgress?: ProgressCallback
): Promise<SubmissionResult> {
  let attempt = 1;
  let delay = config.delayMs;

  while (attempt <= config.maxAttempts) {
    try {
      onProgress?.({
        stage: 'uploading',
        progress: (attempt - 1) / config.maxAttempts * 100,
        message: `Attempt ${attempt} of ${config.maxAttempts}...`
      });

      let response;
      try {
        response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } catch (error) {
        throw new Error('Network error');
      }

      if (!response) {
        throw new Error('Network error');
      }

      if (response.ok) {
        const result = await response.json();
        onProgress?.({
          stage: 'complete',
          progress: 100,
          message: 'Submission successful'
        });
        return {
          success: true,
          transactionId: result.transactionId,
          submissionDate: result.submissionDate
        };
      }

      // For 400/422 errors, don't retry and return API Error
      if (response.status === 400 || response.status === 422) {
        onProgress?.({
          stage: 'complete',
          progress: 100,
          message: 'Submission failed'
        });
        return {
          success: false,
          errors: ['API Error']
        };
      }

      // For other errors, retry
      throw new Error('API Error');
    } catch (error) {
      if (attempt === config.maxAttempts) {
        onProgress?.({
          stage: 'complete',
          progress: 100,
          message: 'Submission failed'
        });
        return {
          success: false,
          errors: [error instanceof Error ? error.message : 'Maximum retry attempts reached']
        };
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= config.backoffFactor;
      attempt++;
    }
  }

  return {
    success: false,
    errors: ['Unexpected error during retry']
  };
}

// Save form data to local storage
function saveToLocalStorage(data: ProcessedFormData): void {
  try {
    localStorage.setItem(`transaction_${data.transactionId}`, JSON.stringify(data));
    localStorage.setItem('lastTransactionId', data.transactionId);
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
}

// Modify the submitForm function
export async function submitForm(
  formData: TransactionFormData,
  onProgress?: ProgressCallback
): Promise<SubmissionResult> {
  // Start progress tracking
  onProgress?.({
    stage: 'validation',
    progress: 0,
    message: 'Validating form data...'
  });

  // Validate form before submission
  const validation = validateForm(formData);
  if (!validation.isValid) {
    analyticsService.trackFormSubmission(false, validation.errors);
    return {
      success: false,
      errors: validation.errors
    };
  }

  try {
    onProgress?.({
      stage: 'processing',
      progress: 25,
      message: 'Processing form data...'
    });

    // Process and transform form data
    let processedData = processFormData(formData);
    processedData = formatCurrencyValues(processedData);
    processedData = normalizeFormData(processedData);

    onProgress?.({
      stage: 'uploading',
      progress: 50,
      message: 'Submitting form...'
    });

    // Track submission attempt
    analyticsService.trackFormSubmission(true);

    // Submit to API with retry logic
    const result = await submitWithRetry(processedData, DEFAULT_RETRY_CONFIG, onProgress);
    
    if (result.success) {
      // Save to local storage on successful submission
      saveToLocalStorage(processedData);
      
      // Track successful submission
      analyticsService.trackFormSubmissionSuccess(processedData.transactionId);

      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: 'Submission complete'
      });
    } else {
      // Track failed submission
      analyticsService.trackFormSubmissionError(result.errors || ['Unknown error']);

      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: 'Submission failed'
      });
    }

    return result;
  } catch (error) {
    // Track unexpected error
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
    analyticsService.trackFormSubmissionError([errorMessage]);
    
    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'Submission failed'
    });

    return {
      success: false,
      errors: [errorMessage]
    };
  }
}

// Get last submission from local storage
export function getLastSubmission(): ProcessedFormData | null {
  try {
    const lastTransactionId = localStorage.getItem('lastTransactionId');
    if (!lastTransactionId) return null;

    const data = localStorage.getItem(`transaction_${lastTransactionId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving last submission:', error);
    return null;
  }
}

// Clear last submission from local storage
export function clearLastSubmission(): void {
  try {
    const lastTransactionId = localStorage.getItem('lastTransactionId');
    if (lastTransactionId) {
      localStorage.removeItem(`transaction_${lastTransactionId}`);
      localStorage.removeItem('lastTransactionId');
    }
  } catch (error) {
    console.error('Error clearing last submission:', error);
  }
} 