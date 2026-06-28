import { describe, it, expect } from 'vitest';
import type { DataStudioDataSource } from '../../DataStudio/DataStudio.types';
import { createQueryStudioDataProvider } from '../dataQuery';

const DATASETS: ReadonlyArray<DataStudioDataSource<any>> = [
  {
    id: 'products',
    label: 'Products',
    columns: [
      { field: 'name', headerName: 'Name' },
      { field: 'price' },
    ],
    rows: [
      { id: 1, name: 'Apple', price: 1.5 },
      { id: 2, name: 'Banana', price: 0.5 },
      { id: 3, name: 'Cherry', price: 3 },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    columns: [{ field: 'orderId' }],
    rows: [],
  },
];

describe('queryStudioData provider', () => {
  it('declares the queryStudioData tool name', () => {
    const provider = createQueryStudioDataProvider(() => DATASETS);
    expect(provider.toolNames).toEqual(['queryStudioData']);
  });

  it('validateInput rejects missing dataSourceId', () => {
    const provider = createQueryStudioDataProvider(() => DATASETS);
    const result = provider.validateInput({});
    expect(result.ok).toBe(false);
  });

  it('validateInput rejects unknown dataSourceId', () => {
    const provider = createQueryStudioDataProvider(() => DATASETS);
    const result = provider.validateInput({ dataSourceId: 'ghost' });
    expect(result.ok).toBe(false);
  });

  it('validateInput accepts a known dataSourceId', () => {
    const provider = createQueryStudioDataProvider(() => DATASETS);
    const result = provider.validateInput({ dataSourceId: 'products', limit: 5 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.input.dataSourceId).toBe('products');
      expect(result.input.limit).toBe(5);
    }
  });

  it('preview returns row count without exposing rows', () => {
    const provider = createQueryStudioDataProvider(() => DATASETS);
    const result = provider.preview({ dataSourceId: 'products' });
    expect(result).toEqual({
      meta: {
        dataSourceId: 'products',
        rowCount: 3,
        columns: [
          { field: 'name', headerName: 'Name' },
          { field: 'price', headerName: undefined },
        ],
      },
    });
  });

  it('execute returns rows up to the limit', () => {
    const provider = createQueryStudioDataProvider(() => DATASETS);
    const result = provider.execute({ dataSourceId: 'products', limit: 2 });
    expect(result.meta.rowCount).toBe(2);
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0].name).toBe('Apple');
  });

  it('execute returns empty rows for a dataSource-only dataSource', () => {
    const provider = createQueryStudioDataProvider(() => DATASETS);
    const result = provider.execute({ dataSourceId: 'orders' });
    expect(result.meta.rowCount).toBe(0);
    expect(result.rows).toEqual([]);
  });

  it('redactForBackend strips rows but keeps meta', () => {
    const provider = createQueryStudioDataProvider(() => DATASETS);
    const result = provider.execute({ dataSourceId: 'products' });
    const redacted = provider.redactForBackend!(result, 'call-1');
    expect(redacted).toEqual({ meta: result.meta });
  });
});
