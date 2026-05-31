import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorageJointSourcesPersistenceAdapter } from './jointSourcesPersistence';
import type { DataStudioJointSourceConfig } from './DataStudio.types';

const STORAGE_KEY = 'mui-x-data-studio-joint-sources:v1:default';

// The test env stubs `window.localStorage` with a partial mock, so install a
// functional Map-backed implementation to exercise the adapter deterministically.
let store: Record<string, string> = {};
const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');

const fakeLocalStorage: Storage = {
  getItem: (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
  setItem: (key, value) => {
    store[key] = String(value);
  },
  removeItem: (key) => {
    delete store[key];
  },
  clear: () => {
    store = {};
  },
  key: (index) => Object.keys(store)[index] ?? null,
  get length() {
    return Object.keys(store).length;
  },
};

const sampleConfig: DataStudioJointSourceConfig = {
  id: 'joint-sales-enriched-abc',
  label: 'Sales enriched',
  definition: {
    base: 'sales',
    joins: [
      { sourceId: 'product', type: 'inner', on: [{ leftField: 'product_key', rightField: 'product_key' }] },
    ],
    columns: [
      { sourceId: 'sales', field: 'sales_amount', as: 'sales_amount' },
      { sourceId: 'product', field: 'category', as: 'category' },
    ],
  },
};

beforeEach(() => {
  store = {};
  Object.defineProperty(window, 'localStorage', {
    value: fakeLocalStorage,
    configurable: true,
    writable: true,
  });
});

afterEach(() => {
  if (originalDescriptor) {
    Object.defineProperty(window, 'localStorage', originalDescriptor);
  }
});

describe('createLocalStorageJointSourcesPersistenceAdapter', () => {
  it('round-trips joint source configs', () => {
    const adapter = createLocalStorageJointSourcesPersistenceAdapter();
    adapter.write([sampleConfig]);
    expect(adapter.read()).toEqual([sampleConfig]);
  });

  it('returns null when nothing has been written', () => {
    expect(createLocalStorageJointSourcesPersistenceAdapter().read()).toBe(null);
  });

  it('drops malformed entries but keeps valid ones', () => {
    store[STORAGE_KEY] = JSON.stringify({
      version: 1,
      jointSources: [
        sampleConfig,
        { id: 'no-label', definition: sampleConfig.definition }, // missing label
        { id: 'bad-def', label: 'x', definition: { base: 'sales' } }, // joins/columns not arrays
        'not an object',
      ],
    });

    const read = createLocalStorageJointSourcesPersistenceAdapter().read();
    expect(read?.map((config) => config.id)).toEqual([sampleConfig.id]);
  });

  it('namespaces by key so distinct studios do not collide', () => {
    const a = createLocalStorageJointSourcesPersistenceAdapter({ key: 'studio-a' });
    const b = createLocalStorageJointSourcesPersistenceAdapter({ key: 'studio-b' });
    a.write([sampleConfig]);

    expect(a.read()?.map((config) => config.id)).toEqual([sampleConfig.id]);
    expect(b.read()).toBe(null);
  });
});
