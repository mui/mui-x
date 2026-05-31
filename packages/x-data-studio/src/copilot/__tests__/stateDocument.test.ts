import { describe, it, expect } from 'vitest';
import type { DataStudioDataSource } from '../../DataStudio/DataStudio.types';
import { snapshotState } from '../stateDocument';
import { createFakeStateApi } from '../__testHarness__/createFakeStateApi';

const DATASETS: ReadonlyArray<DataStudioDataSource<any>> = [
  { id: 'products', label: 'Products', columns: [{ field: 'name' }], rows: [] },
  { id: 'orders', label: 'Orders', columns: [{ field: 'orderId' }], rows: [] },
];

describe('snapshotState', () => {
  it('captures active dataSource + active view + views into a normalized document', () => {
    const { api } = createFakeStateApi({
      dataSources: DATASETS,
      initialActiveDataSourceId: 'products',
      initialActiveSheetId: 'v1',
      initialSheets: [
        { id: 'v1', label: 'Sheet 1', dataSourceId: 'products' },
        { id: 'v2', label: 'Sheet 2', dataSourceId: 'orders' },
      ],
    });
    const doc = snapshotState(api, DATASETS);
    expect(doc.active.dataSourceId).toBe('products');
    expect(doc.active.sheetId).toBe('v1');
    expect(doc.dataSources).toEqual([
      { id: 'products', label: 'Products' },
      { id: 'orders', label: 'Orders' },
    ]);
    expect(doc.sheetOrder).toEqual(['v1', 'v2']);
    expect(doc.sheets.v1).toEqual({
      id: 'v1',
      label: 'Sheet 1',
      dataSourceId: 'products',
      initialState: {},
    });
  });

  it('returns null active selection when nothing is selected', () => {
    const { api } = createFakeStateApi({
      dataSources: DATASETS,
      initialActiveDataSourceId: '',
    });
    const doc = snapshotState(api, DATASETS);
    expect(doc.active.dataSourceId).toBeNull();
    expect(doc.active.sheetId).toBeNull();
  });
});
