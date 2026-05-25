import { describe, it, expect } from 'vitest';
import type { DataStudioDataset } from '../../DataStudio/DataStudio.types';
import { snapshotState } from '../stateDocument';
import { createFakeStateApi } from '../__testHarness__/createFakeStateApi';

const DATASETS: ReadonlyArray<DataStudioDataset<any>> = [
  { id: 'products', label: 'Products', columns: [{ field: 'name' }], rows: [] },
  { id: 'orders', label: 'Orders', columns: [{ field: 'orderId' }], rows: [] },
];

describe('snapshotState', () => {
  it('captures active dataset + active view + views into a normalized document', () => {
    const { api } = createFakeStateApi({
      datasets: DATASETS,
      initialActiveDatasetId: 'products',
      initialActiveViewId: 'v1',
      initialViews: [
        { id: 'v1', label: 'Sheet 1', datasetId: 'products' },
        { id: 'v2', label: 'Chart 1', datasetId: 'orders', kind: 'chart' },
      ],
    });
    const doc = snapshotState(api, DATASETS);
    expect(doc.active.datasetId).toBe('products');
    expect(doc.active.viewId).toBe('v1');
    expect(doc.datasets).toEqual([
      { id: 'products', label: 'Products' },
      { id: 'orders', label: 'Orders' },
    ]);
    expect(doc.viewOrder).toEqual(['v1', 'v2']);
    expect(doc.views.v1).toEqual({
      id: 'v1',
      label: 'Sheet 1',
      datasetId: 'products',
      kind: 'grid',
      initialState: {},
      chartConfig: {},
    });
    expect(doc.views.v2.kind).toBe('chart');
  });

  it('coerces missing kind to grid', () => {
    const { api } = createFakeStateApi({
      datasets: DATASETS,
      initialViews: [{ id: 'v1', label: 'No kind', datasetId: 'products' }],
    });
    const doc = snapshotState(api, DATASETS);
    expect(doc.views.v1.kind).toBe('grid');
  });

  it('returns null active selection when nothing is selected', () => {
    const { api } = createFakeStateApi({
      datasets: DATASETS,
      initialActiveDatasetId: '',
    });
    const doc = snapshotState(api, DATASETS);
    expect(doc.active.datasetId).toBeNull();
    expect(doc.active.viewId).toBeNull();
  });
});
