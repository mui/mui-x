import { describe, it, expect } from 'vitest';
import type { DataStudioDataSource } from '../../DataStudio/DataStudio.types';
import { createTestExecutor } from '../__testHarness__/createTestExecutor';

const DATASETS: ReadonlyArray<DataStudioDataSource<any>> = [
  { id: 'products', label: 'Products', columns: [{ field: 'name' }], rows: [] },
  { id: 'orders', label: 'Orders', columns: [{ field: 'orderId' }], rows: [] },
];

function runPatches(ops: ReadonlyArray<{ op: string; path: string; value?: unknown }>) {
  return ops.map((o) => JSON.stringify(o)).join('\n');
}

describe('Studio copilot reconcilers', () => {
  it('/active/dataSourceId routes to selectDataSource', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialActiveDataSourceId: 'products',
    });
    executor.applyEnvelope({
      setGridState: runPatches([{ op: 'replace', path: '/active/dataSourceId', value: 'orders' }]),
    });
    expect(fake.api.activeDataSourceId).toBe('orders');
  });

  it('/active/sheetId routes to selectSheet', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [{ id: 'v1', label: 'A', dataSourceId: 'products' }],
    });
    executor.applyEnvelope({
      setGridState: runPatches([{ op: 'replace', path: '/active/sheetId', value: 'v1' }]),
    });
    expect(fake.api.activeSheetId).toBe('v1');
  });

  it('/sheets/<id>/label routes to renameSheet', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [{ id: 'v1', label: 'Old', dataSourceId: 'products' }],
    });
    const result = executor.applyEnvelope({
      setGridState: runPatches([{ op: 'replace', path: '/sheets/v1/label', value: 'New Title' }]),
    });
    expect(result.applied).toHaveLength(1);
    expect(fake.sheets[0].label).toBe('New Title');
  });

  it('/sheets/<id>/dataSourceId routes to updateSheet with dataSourceId', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [{ id: 'v1', label: 'A', dataSourceId: 'products' }],
    });
    executor.applyEnvelope({
      setGridState: runPatches([
        { op: 'replace', path: '/sheets/v1/dataSourceId', value: 'orders' },
      ]),
    });
    expect(fake.sheets[0].dataSourceId).toBe('orders');
  });

  it('/sheets/<id>/initialState writes through updateSheet', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [{ id: 'v1', label: 'A', dataSourceId: 'products', kind: 'grid' }],
    });
    executor.applyEnvelope({
      setGridState: runPatches([
        {
          op: 'replace',
          path: '/sheets/v1/initialState',
          value: { filter: { filterModel: { items: [] } } },
        },
      ]),
    });
    expect(fake.sheets[0].initialState).toEqual({ filter: { filterModel: { items: [] } } });
  });

  it('/sheets/<id>/params writes through updateSheet (chart/pivot config)', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [{ id: 'v1', label: 'A', dataSourceId: 'products', type: 'chart' }],
    });
    executor.applyEnvelope({
      setGridState: runPatches([
        {
          op: 'replace',
          path: '/sheets/v1/params',
          value: { summary: { groupBy: 'category', chartType: 'column' } },
        },
      ]),
    });
    expect(fake.sheets[0].params).toEqual({
      summary: { groupBy: 'category', chartType: 'column' },
    });
  });

  it('viewEditing guard removes the handler from the registry', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [{ id: 'v1', label: 'A', dataSourceId: 'products' }],
      guardOverrides: { viewEditing: false },
    });
    const result = executor.applyEnvelope({
      setGridState: runPatches([
        { op: 'replace', path: '/sheets/v1/initialState', value: { sorting: { sortModel: [] } } },
      ]),
    });
    expect(result.applied).toHaveLength(0);
    expect(result.skipped[0].reason).toBe('unknown');
    expect(fake.sheets[0].initialState).toBeUndefined();
  });

  it('mixed envelope: rename command + initialState patch in one turn', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [{ id: 'v1', label: 'A', dataSourceId: 'products' }],
    });
    const result = executor.applyEnvelope({
      runCommands: JSON.stringify({
        type: 'studio.renameSheet',
        params: { sheetId: 'v1', label: 'Renamed' },
      }),
      setGridState: JSON.stringify({
        op: 'replace',
        path: '/sheets/v1/initialState',
        value: { pinnedColumns: { left: ['name'] } },
      }),
    });
    expect(result.applied.length).toBeGreaterThanOrEqual(2);
    expect(fake.sheets[0].label).toBe('Renamed');
    expect(fake.sheets[0].initialState).toEqual({ pinnedColumns: { left: ['name'] } });
  });

  it('deep path under /sheets/<id>/initialState applies the subtree change', () => {
    const { fake, executor } = createTestExecutor({
      dataSources: DATASETS,
      initialSheets: [
        {
          id: 'v1',
          label: 'A',
          dataSourceId: 'products',
          initialState: { sorting: { sortModel: [] } },
        },
      ],
    });
    executor.applyEnvelope({
      setGridState: runPatches([
        {
          op: 'replace',
          path: '/sheets/v1/initialState/sorting/sortModel',
          value: [{ field: 'name', sort: 'asc' }],
        },
      ]),
    });
    expect(fake.sheets[0].initialState?.sorting?.sortModel).toEqual([
      { field: 'name', sort: 'asc' },
    ]);
  });
});
