import { describe, it, expect } from 'vitest';
import type { DataStudioDataSource } from '../../DataStudio/DataStudio.types';
import { snapshotState } from '../stateDocument';
import { createFakeStateApi } from '../__testHarness__/createFakeStateApi';

const DATASETS: ReadonlyArray<DataStudioDataSource<any>> = [
  {
    id: 'products',
    label: 'Products',
    columns: [{ field: 'name', headerName: 'Name', type: 'string' }],
    rows: [],
    joinGroup: 'shop',
    supportsServerGrouping: true,
  },
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
      {
        id: 'products',
        label: 'Products',
        columns: [{ field: 'name', type: 'string', headerName: 'Name' }],
        joinGroup: 'shop',
        supportsServerGrouping: true,
      },
      { id: 'orders', label: 'Orders', columns: [{ field: 'orderId' }] },
    ]);
    expect(doc.sheetOrder).toEqual(['v1', 'v2']);
    expect(doc.sheets.v1).toEqual({
      id: 'v1',
      label: 'Sheet 1',
      dataSourceId: 'products',
      type: 'grid',
      initialState: {},
      params: {},
    });
  });

  it('serializes joint source configs into jointSources', () => {
    const { api } = createFakeStateApi({
      dataSources: DATASETS,
      initialActiveDataSourceId: 'products',
    });
    const definition = {
      base: 'products',
      joins: [
        {
          sourceId: 'orders',
          type: 'inner' as const,
          on: [{ leftField: 'name', rightField: 'orderId' }],
        },
      ],
      columns: [{ sourceId: 'products', field: 'name', as: 'name' }],
    };
    const docEmpty = snapshotState(api, DATASETS);
    expect(docEmpty.jointSources).toEqual([]);
    const doc = snapshotState(api, DATASETS, [{ id: 'j1', label: 'P+O', definition }]);
    expect(doc.jointSources).toEqual([{ id: 'j1', label: 'P+O', definition }]);
  });

  // CONTRACT TEST. This golden shape is the source of truth for the copilot
  // state document. The backend `StudioStateDocumentSchema`
  // (brussels: apps/mui-backend/src/copilot/clients/data-studio/protocol/
  // state-document.ts) MUST mirror it exactly — the backend route 400s on any
  // mismatch. If this snapshot shape changes, update that schema (+ its fixture)
  // in lockstep.
  it('produces the canonical contract shape (keep in sync with the backend schema)', () => {
    const dataSources: ReadonlyArray<DataStudioDataSource<any>> = [
      {
        id: 'sales',
        label: 'Sales',
        columns: [
          { field: 'category', type: 'string', headerName: 'Category' },
          { field: 'amount', type: 'number' },
        ],
        rows: [],
        joinGroup: 'shop',
        supportsServerGrouping: true,
      },
    ];
    const { api } = createFakeStateApi({
      dataSources,
      initialActiveDataSourceId: 'sales',
      initialActiveSheetId: 's1',
      initialSheets: [
        {
          id: 's1',
          label: 'Chart',
          dataSourceId: 'sales',
          type: 'chart',
          params: { summary: { groupBy: 'category' } },
        },
      ],
    });
    const definition = {
      base: 'sales',
      joins: [
        {
          sourceId: 'sales',
          type: 'inner' as const,
          on: [{ leftField: 'category', rightField: 'amount' }],
        },
      ],
      columns: [{ sourceId: 'sales', field: 'amount', as: 'amount' }],
    };
    const doc = snapshotState(api, dataSources, [{ id: 'j1', label: 'Sales joined', definition }]);
    expect(doc).toEqual({
      active: { dataSourceId: 'sales', sheetId: 's1' },
      dataSources: [
        {
          id: 'sales',
          label: 'Sales',
          columns: [
            { field: 'category', type: 'string', headerName: 'Category' },
            { field: 'amount', type: 'number' },
          ],
          joinGroup: 'shop',
          supportsServerGrouping: true,
        },
      ],
      sheets: {
        s1: {
          id: 's1',
          label: 'Chart',
          dataSourceId: 'sales',
          type: 'chart',
          initialState: {},
          params: { summary: { groupBy: 'category' } },
        },
      },
      sheetOrder: ['s1'],
      jointSources: [{ id: 'j1', label: 'Sales joined', definition }],
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
