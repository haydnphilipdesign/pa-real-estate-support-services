import { submitForm, getLastSubmission, clearLastSubmission } from '../services/submission';
import { mockTransactionData } from '../__mocks__/mockData';
import { validateForm } from '../services/validation';
import { analyticsService } from '../../../services/analytics';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('../services/validation');
vi.mock('../../../services/analytics', () => ({
  analyticsService: {
    trackFormSubmission: vi.fn(),
    trackFormSubmissionSuccess: vi.fn(),
    trackFormSubmissionError: vi.fn(),
    trackValidation: vi.fn(),
    trackSectionValidation: vi.fn(),
    trackFormValidation: vi.fn()
  }
}));

vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

// Mock localStorage
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    _getStore: () => store // Helper for testing
  };
};

const localStorageMock = createLocalStorageMock();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch API
global.fetch = vi.fn();

// Mock Date for consistent transaction IDs
const mockDate = new Date('2024-02-04T12:00:00Z');
vi.setSystemTime(mockDate);

describe('Form Submission Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    (validateForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ isValid: true, errors: [] });
  });

  describe('submitForm', () => {
    it('should successfully submit valid form data', async () => {
      const expectedTransactionId = `TX-20240204-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const mockResponse = {
        success: true,
        transactionId: expectedTransactionId,
        submissionDate: mockDate.toISOString()
      };

      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(async (url, options) => {
        const body = JSON.parse(options.body);
        return {
          ok: true,
          json: async () => ({
            ...mockResponse,
            transactionId: body.transactionId // Use the actual generated transaction ID
          })
        };
      });

      const result = await submitForm(mockTransactionData);

      expect(result.success).toBe(true);
      expect(result.transactionId).toBeDefined();
      expect(result.submissionDate).toBeDefined();
      expect(global.fetch).toHaveBeenCalledWith('/api/transactions', expect.any(Object));
      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(true);
      expect(analyticsService.trackFormSubmissionSuccess).toHaveBeenCalledWith(result.transactionId);
    });

    it('should handle validation failures', async () => {
      const mockErrors = ['Required field missing', 'Invalid format'];
      (validateForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ isValid: false, errors: mockErrors });

      const result = await submitForm(mockTransactionData);

      expect(result.success).toBe(false);
      expect(result.errors).toEqual(mockErrors);
      expect(global.fetch).not.toHaveBeenCalled();
      expect(analyticsService.trackFormSubmission).toHaveBeenCalledWith(false, mockErrors);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(async () => ({
        ok: false,
        status: 400,
        json: async () => ({ message: errorMessage })
      }));

      const result = await submitForm(mockTransactionData);

      expect(result.success).toBe(false);
      expect(result.errors?.[0]).toBe(errorMessage);
      expect(analyticsService.trackFormSubmissionError).toHaveBeenCalledWith([errorMessage]);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(networkError);

      const result = await submitForm(mockTransactionData);

      expect(result.success).toBe(false);
      expect(result.errors?.[0]).toBe('Network error');
      expect(analyticsService.trackFormSubmissionError).toHaveBeenCalledWith(['Network error']);
    });

    it('should process and format data correctly', async () => {
      (global.fetch as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(async (url, options) => ({
        ok: true,
        json: async () => ({ success: true })
      }));

      const testData = {
        ...mockTransactionData,
        salePrice: '$100,000.00',
        clients: [
          { 
            name: 'John Doe ',
            email: ' TEST@email.com ',
            phone: '(123) 456-7890'
          }
        ]
      };

      await submitForm(testData);

      const fetchCall = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
      const submittedData = JSON.parse(fetchCall[1].body);

      expect(submittedData.salePrice).toBe('100000.00');
      expect(submittedData.clients[0].email).toBe('test@email.com');
      expect(submittedData.clients[0].phone).toBe('1234567890');
      expect(submittedData.clients[0].name.trim()).toBe('John Doe');
    });
  });

  describe('Local Storage Operations', () => {
    const mockData = {
      ...mockTransactionData,
      transactionId: 'TX-TEST-123',
      submissionDate: mockDate.toISOString(),
      status: 'pending' as const
    };

    it('should save and retrieve submission data', () => {
      const dataKey = `transaction_${mockData.transactionId}`;
      localStorageMock.setItem(dataKey, JSON.stringify(mockData));
      localStorageMock.setItem('lastTransactionId', mockData.transactionId);

      const recovered = getLastSubmission();
      expect(recovered).toEqual(mockData);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('lastTransactionId');
      expect(localStorageMock.getItem).toHaveBeenCalledWith(dataKey);
    });

    it('should handle missing data gracefully', () => {
      const recovered = getLastSubmission();
      expect(recovered).toBeNull();
    });

    it('should clear submission data', () => {
      const dataKey = `transaction_${mockData.transactionId}`;
      localStorageMock.setItem(dataKey, JSON.stringify(mockData));
      localStorageMock.setItem('lastTransactionId', mockData.transactionId);

      clearLastSubmission();

      expect(localStorageMock.getItem('lastTransactionId')).toBeNull();
      expect(localStorageMock.getItem(dataKey)).toBeNull();
    });

    it('should handle clear errors gracefully', () => {
      // Mock localStorage.removeItem to throw an error
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      expect(() => clearLastSubmission()).not.toThrow();
    });
  });

  afterAll(() => {
    vi.useRealTimers();
  });
}); 