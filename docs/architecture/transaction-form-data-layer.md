# Transaction Form Data Layer Architecture

## Current Implementation Analysis

### Airtable Integration
- Direct API calls in utility function
- Hardcoded base and table IDs
- Basic error handling
- Limited retry logic
- No request queuing or offline support

### Data Transformation
- Mixed concerns in utility functions
- Inline data formatting
- Limited validation before submission
- No type safety for API responses

## Proposed Data Layer Architecture

### 1. API Service Layer

#### Base API Client
```typescript
// src/services/api/baseClient.ts
interface ApiClient {
  get: <T>(endpoint: string) => Promise<T>;
  post: <T>(endpoint: string, data: any) => Promise<T>;
  put: <T>(endpoint: string, data: any) => Promise<T>;
  delete: (endpoint: string) => Promise<void>;
}

class AirtableClient implements ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private retryConfig: RetryConfig;

  constructor(config: AirtableConfig) {
    this.baseUrl = `https://api.airtable.com/v0/${config.baseId}`;
    this.headers = {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    };
    this.retryConfig = {
      maxRetries: 3,
      backoffFactor: 2,
      initialDelay: 1000
    };
  }
}
```

#### Transaction API Service
```typescript
// src/services/api/transactionService.ts
interface TransactionService {
  submitForm: (data: TransactionFormData) => Promise<SubmissionResult>;
  validateConnection: () => Promise<boolean>;
  getSubmissionStatus: (id: string) => Promise<SubmissionStatus>;
}

class AirtableTransactionService implements TransactionService {
  private client: ApiClient;
  private tableId: string;
  private queueService: SubmissionQueueService;

  constructor(client: ApiClient, config: AirtableConfig) {
    this.client = client;
    this.tableId = config.tableId;
    this.queueService = new SubmissionQueueService();
  }
}
```

### 2. Data Transformation Layer

#### Data Transformers
```typescript
// src/services/transformers/airtableTransformer.ts
interface DataTransformer<T, U> {
  transform: (data: T) => U;
  validate: (data: T) => ValidationResult;
}

class AirtableTransformer implements DataTransformer<TransactionFormData, AirtableRecord> {
  private formatters: DataFormatters;
  
  transform(data: TransactionFormData): AirtableRecord {
    return {
      fields: {
        // Property Information
        "Property Address": this.formatters.formatAddress(data.propertyAddress),
        "MLS Number": this.formatters.formatMLS(data.mlsNumber),
        "Sale Price": this.formatters.formatCurrency(data.salePrice),
        
        // Commission Information
        "Commission Base": data.commissionBase,
        "Total Commission": this.formatters.formatCurrency(data.totalCommission),
        
        // Additional fields...
      }
    };
  }
}
```

#### Data Formatters
```typescript
// src/services/transformers/formatters.ts
interface DataFormatters {
  formatCurrency: (value: string | number) => number;
  formatPercentage: (value: string | number) => number;
  formatDate: (date: Date) => string;
  formatAddress: (address: string) => string;
  formatPhone: (phone: string) => string;
}

class AirtableFormatters implements DataFormatters {
  formatCurrency(value: string | number): number {
    // Enhanced currency formatting with validation
    const cleaned = this.cleanNumericString(value);
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) {
      throw new ValidationError('Invalid currency format');
    }
    return parsed;
  }
}
```

### 3. Offline Support & Queue Management

#### Submission Queue
```typescript
// src/services/queue/submissionQueue.ts
interface QueueItem {
  id: string;
  data: TransactionFormData;
  attempts: number;
  lastAttempt: Date | null;
  status: 'pending' | 'processing' | 'failed' | 'completed';
}

class SubmissionQueueService {
  private queue: QueueItem[];
  private storage: StorageService;

  async enqueue(data: TransactionFormData): Promise<string> {
    const id = generateUniqueId();
    const item: QueueItem = {
      id,
      data,
      attempts: 0,
      lastAttempt: null,
      status: 'pending'
    };
    
    await this.storage.save(item);
    this.processQueue();
    return id;
  }
}
```

#### Persistence Service
```typescript
// src/services/storage/storageService.ts
interface StorageService {
  save: (key: string, data: any) => Promise<void>;
  load: (key: string) => Promise<any>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

class LocalStorageService implements StorageService {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  async save(key: string, data: any): Promise<void> {
    const serialized = JSON.stringify(data);
    localStorage.setItem(`${this.prefix}:${key}`, serialized);
  }
}
```

### 4. Error Handling & Recovery

#### Error Types
```typescript
// src/services/errors/apiErrors.ts
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public isRetryable: boolean
  ) {
    super(message);
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
  }
}
```

#### Retry Logic
```typescript
// src/services/retry/retryService.ts
interface RetryConfig {
  maxRetries: number;
  backoffFactor: number;
  initialDelay: number;
}

class RetryService {
  constructor(private config: RetryConfig) {}

  async withRetry<T>(
    operation: () => Promise<T>,
    isRetryable: (error: Error) => boolean
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (!isRetryable(error)) throw error;
        
        const delay = this.calculateDelay(attempt);
        await this.wait(delay);
      }
    }
    
    throw lastError;
  }
}
```

## Implementation Strategy

1. Core Services Implementation
- Create base API client
- Implement data transformers
- Set up storage service

2. Queue Management
- Implement submission queue
- Add offline support
- Create recovery mechanisms

3. Error Handling
- Implement retry logic
- Add error tracking
- Enhance validation

4. Migration Steps
- Create new services
- Gradually migrate API calls
- Add queue support
- Enhance error handling

## Benefits

1. Reliability
- Robust error handling
- Automatic retries
- Offline support

2. Maintainability
- Clear separation of concerns
- Type-safe implementations
- Centralized data transformation

3. Scalability
- Queue-based processing
- Configurable retry logic
- Extensible service architecture

4. User Experience
- Better error messages
- Offline capability
- Progress tracking

## Monitoring & Debugging

1. Logging Strategy
- Request/response logging
- Error tracking
- Performance metrics

2. Debugging Tools
- Queue inspector
- Retry status
- Error details

3. Performance Monitoring
- API response times
- Queue length
- Error rates