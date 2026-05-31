import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorageSheetsPersistenceAdapter } from './sheetsPersistence';
import type { DataStudioSheet } from './DataStudio.types';

const STORAGE_KEY = 'mui-x-data-studio-sheets:v1:default';

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

describe('createLocalStorageSheetsPersistenceAdapter', () => {
  it('round-trips the current DataStudioSheet shape (regression: views[] validation dropped every sheet)', () => {
    const adapter = createLocalStorageSheetsPersistenceAdapter();
    const sheets: DataStudioSheet[] = [
      { id: 's1', label: 'Pivot table', dataSourceId: 'customers', type: 'pivot', params: {} },
      { id: 's2', label: 'Spreadsheet', dataSourceId: null, type: 'spreadsheet', params: {} },
      { id: 's3', label: 'Orders view', dataSourceId: 'orders' },
    ];

    adapter.write(sheets);

    expect(adapter.read()).toEqual(sheets);
  });

  it('persists a free-form sheet (dataSourceId: null)', () => {
    const adapter = createLocalStorageSheetsPersistenceAdapter();
    adapter.write([{ id: 'free', label: 'Blank', dataSourceId: null, type: 'spreadsheet' }]);

    const read = adapter.read();
    expect(read).toHaveLength(1);
    expect(read![0].dataSourceId).toBe(null);
  });

  it('returns null when nothing has been written', () => {
    expect(createLocalStorageSheetsPersistenceAdapter().read()).toBe(null);
  });

  it('drops malformed entries but keeps valid ones', () => {
    store[STORAGE_KEY] = JSON.stringify({
      version: 1,
      sheets: [
        { id: 'ok', label: 'Good', dataSourceId: 'customers' },
        { label: 'no id', dataSourceId: 'customers' }, // missing id
        { id: 'bad-binding', dataSourceId: 42 }, // dataSourceId not string|null
        'not an object',
      ],
    });

    const read = createLocalStorageSheetsPersistenceAdapter().read();
    expect(read?.map((s) => s.id)).toEqual(['ok']);
  });

  it('namespaces by key so distinct studios do not collide', () => {
    const a = createLocalStorageSheetsPersistenceAdapter({ key: 'studio-a' });
    const b = createLocalStorageSheetsPersistenceAdapter({ key: 'studio-b' });
    a.write([{ id: 'a1', label: 'A', dataSourceId: null }]);

    expect(a.read()?.map((s) => s.id)).toEqual(['a1']);
    expect(b.read()).toBe(null);
  });
});
