# Form Testing and State Management

## Overview

This document outlines the testing strategy and state management implementation for the real estate transaction form system. The implementation focuses on comprehensive test coverage and robust state handling.

## State Management

### Store Implementation

```typescript
// src/forms/store/formStore.ts
interface FormStore {
  state: FormState;
  dispatch: (action: FormAction) => void;
  subscribe: (listener: (state: FormState) => void) => () => void;
}

/**
 * Form store implementation with subscription management
 * Implements observable pattern for state updates
 */
export class TransactionFormStore implements FormStore {
  private state: FormState;
  private listeners: Set<(state: FormState) => void>;
  private commandSync: CommandSyncService;

  constructor(
    initialState: FormState,
    commandSync: CommandSyncService
  ) {
    this.state = initialState;
    this.listeners = new Set();
    this.commandSync = commandSync;
  }

  /**
   * Dispatch action to update state
   * Implements optimistic updates with rollback
   */
  async dispatch(action: FormAction): Promise<void> {
    // Create snapshot for rollback
    const previousState = { ...this.state };

    try {
      // Apply local update
      this.state = formReducer(this.state, action);
      this.notifyListeners();

      // Sync with Command if needed
      if (this.shouldSync(action)) {
        await this.syncWithCommand(action);
      }
    } catch (error) {
      // Rollback on failure
      this.state = previousState;
      this.notifyListeners();
      throw error;
    }
  }

  /**
   * Subscribe to state changes
   * Returns unsubscribe function
   */
  subscribe(listener: (state: FormState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Determine if action requires Command sync
   * Implements sync strategy based on action type
   */
  private shouldSync(action: FormAction): boolean {
    const syncActions = [
      'UPDATE_PROPERTY',
      'UPDATE_COMMISSION',
      'UPDATE_DOCUMENTS'
    ];
    return syncActions.includes(action.type);
  }
}
```

## Testing Strategy

### Unit Tests

```typescript
// src/forms/__tests__/formStore.test.ts
import { TransactionFormStore } from '../store/formStore';
import { MockCommandSync } from '../__mocks__/commandSync';

describe('TransactionFormStore', () => {
  let store: TransactionFormStore;
  let commandSync: MockCommandSync;

  beforeEach(() => {
    commandSync = new MockCommandSync();
    store = new TransactionFormStore(initialState, commandSync);
  });

  /**
   * Test state updates with sync requirements
   */
  test('handles optimistic updates with rollback', async () => {
    // Setup
    const updateAction = {
      type: 'UPDATE_PROPERTY',
      payload: { address: '123 Main St' }
    };
    commandSync.mockFailure();

    // Act & Assert
    const initialState = store.getState();
    await expect(store.dispatch(updateAction)).rejects.toThrow();
    expect(store.getState()).toEqual(initialState);
  });

  /**
   * Test subscription management
   */
  test('notifies subscribers of state changes', () => {
    // Setup
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);

    // Act
    store.dispatch({
      type: 'UPDATE_FIELD',
      field: 'propertyAddress',
      value: '123 Main St'
    });

    // Assert
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          propertyAddress: '123 Main St'
        })
      })
    );

    // Cleanup
    unsubscribe();
  });
});
```

### Integration Tests

```typescript
// src/forms/__tests__/integration/formFlow.test.ts
import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionForm } from '../../components/TransactionForm';
import { mockCommandAPI } from '../../__mocks__/commandAPI';

/**
 * Test complete form submission flow
 */
describe('Transaction Form Flow', () => {
  beforeEach(() => {
    mockCommandAPI.reset();
  });

  test('completes successful submission flow', async () => {
    // Setup
    render(<TransactionForm />);

    // Property Information
    await fillPropertySection({
      address: '123 Main St',
      price: '500000',
      mls: 'PM-123456'
    });
    await clickNext();

    // Commission Information
    await fillCommissionSection({