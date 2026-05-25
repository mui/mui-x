import { describe, it, expect } from 'vitest';
import type { DataStudioDataset } from '../../DataStudio/DataStudio.types';
import { createTestExecutor } from '../__testHarness__/createTestExecutor';

const DATASETS: ReadonlyArray<DataStudioDataset<any>> = [
  { id: 'products', label: 'Products', columns: [{ field: 'name' }], rows: [] },
  { id: 'orders', label: 'Orders', columns: [{ field: 'orderId' }], rows: [] },
];

function runPatches(ops: ReadonlyArray<{ op: string; path: string; value?: unknown }>) {
  return ops.map((o) => JSON.stringify(o)).join('\n');
}

describe('Studio copilot reconcilers', () => {
  it('/active/datasetId routes to selectDataset', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialActiveDatasetId: 'products',
    });
    executor.applyEnvelope({
      setGridState: runPatches([
        { op: 'replace', path: '/active/datasetId', value: 'orders' },
      ]),
    });
    expect(fake.api.activeDatasetId).toBe('orders');
  });

  it('/active/viewId routes to selectView', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [{ id: 'v1', label: 'A', datasetId: 'products' }],
    });
    executor.applyEnvelope({
      setGridState: runPatches([{ op: 'replace', path: '/active/viewId', value: 'v1' }]),
    });
    expect(fake.api.activeViewId).toBe('v1');
  });

  it('/views/<id>/label routes to renameView', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [{ id: 'v1', label: 'Old', datasetId: 'products' }],
    });
    const result = executor.applyEnvelope({
      setGridState: runPatches([
        { op: 'replace', path: '/views/v1/label', value: 'New Title' },
      ]),
    });
    expect(result.applied).toHaveLength(1);
    expect(fake.views[0].label).toBe('New Title');
  });

  it('/views/<id>/datasetId routes to updateView with datasetId', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [{ id: 'v1', label: 'A', datasetId: 'products' }],
    });
    executor.applyEnvelope({
      setGridState: runPatches([
        { op: 'replace', path: '/views/v1/datasetId', value: 'orders' },
      ]),
    });
    expect(fake.views[0].datasetId).toBe('orders');
  });

  it('/views/<id>/initialState writes through updateView', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [{ id: 'v1', label: 'A', datasetId: 'products', kind: 'grid' }],
    });
    executor.applyEnvelope({
      setGridState: runPatches([
        {
          op: 'replace',
          path: '/views/v1/initialState',
          value: { filter: { filterModel: { items: [] } } },
        },
      ]),
    });
    expect(fake.views[0].initialState).toEqual({ filter: { filterModel: { items: [] } } });
  });

  it('/views/<id>/chartConfig writes through updateView on chart views', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [{ id: 'v1', label: 'Chart', datasetId: 'products', kind: 'chart' }],
    });
    executor.applyEnvelope({
      setGridState: runPatches([
        { op: 'replace', path: '/views/v1/chartConfig', value: { type: 'bar' } as any },
      ]),
    });
    expect((fake.views[0] as any).chartConfig).toEqual({ type: 'bar' });
  });

  it('chartEditing guard removes the handler from the registry', () => {
    const { executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [{ id: 'v1', label: 'Chart', datasetId: 'products', kind: 'chart' }],
      guardOverrides: { chartEditing: false },
    });
    const result = executor.applyEnvelope({
      setGridState: runPatches([
        { op: 'replace', path: '/views/v1/chartConfig', value: { type: 'line' } as any },
      ]),
    });
    expect(result.applied).toHaveLength(0);
    expect(result.skipped[0].reason).toBe('unknown');
  });

  it('viewEditing guard removes the handler from the registry', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [{ id: 'v1', label: 'A', datasetId: 'products' }],
      guardOverrides: { viewEditing: false },
    });
    const result = executor.applyEnvelope({
      setGridState: runPatches([
        { op: 'replace', path: '/views/v1/initialState', value: { sorting: { sortModel: [] } } },
      ]),
    });
    expect(result.applied).toHaveLength(0);
    expect(result.skipped[0].reason).toBe('unknown');
    expect(fake.views[0].initialState).toBeUndefined();
  });

  it('mixed envelope: rename command + initialState patch in one turn', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [{ id: 'v1', label: 'A', datasetId: 'products' }],
    });
    const result = executor.applyEnvelope({
      runCommands: JSON.stringify({
        type: 'studio.renameView',
        params: { viewId: 'v1', label: 'Renamed' },
      }),
      setGridState: JSON.stringify({
        op: 'replace',
        path: '/views/v1/initialState',
        value: { pinnedColumns: { left: ['name'] } },
      }),
    });
    expect(result.applied.length).toBeGreaterThanOrEqual(2);
    expect(fake.views[0].label).toBe('Renamed');
    expect(fake.views[0].initialState).toEqual({ pinnedColumns: { left: ['name'] } });
  });

  it('deep path under /views/<id>/initialState applies the subtree change', () => {
    const { fake, executor } = createTestExecutor({
      datasets: DATASETS,
      initialViews: [
        {
          id: 'v1',
          label: 'A',
          datasetId: 'products',
          initialState: { sorting: { sortModel: [] } },
        },
      ],
    });
    executor.applyEnvelope({
      setGridState: runPatches([
        {
          op: 'replace',
          path: '/views/v1/initialState/sorting/sortModel',
          value: [{ field: 'name', sort: 'asc' }],
        },
      ]),
    });
    expect(fake.views[0].initialState?.sorting?.sortModel).toEqual([
      { field: 'name', sort: 'asc' },
    ]);
  });
});
