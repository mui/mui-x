import { describe, expect, it, vi } from 'vitest';
import type { GridGetRowsParams } from '@mui/x-data-grid';
import { DATA_STUDIO_PROTOCOL_VERSION } from './models';
import { createDataStudioDataSourceFromAPI } from './createDataStudioDataSourceFromAPI';

const params: GridGetRowsParams = {
  sortModel: [{ field: 'name', sort: 'asc' }],
  filterModel: { items: [{ field: 'country', operator: 'contains', value: 'us' }] },
  start: 0,
  end: 24,
};

function createResponse(body: unknown, init: Partial<Response> = {}) {
  return {
    ok: true,
    status: 200,
    json: async () => body,
    ...init,
  } as Response;
}

describe('createDataStudioDataSourceFromAPI', () => {
  it('posts Data Grid rows params using the Data Studio protocol', async () => {
    const rowsResponse = { rows: [{ id: 1, name: 'Alice' }], rowCount: 1 };
    const fetchMock = vi.fn(async () => createResponse(rowsResponse));
    const dataSource = createDataStudioDataSourceFromAPI({
      dataSourceId: 'customers',
      rowsUrl: '/data-studio/rows',
      fetch: fetchMock as typeof fetch,
    });

    await expect(dataSource.getRows(params)).resolves.toEqual(rowsResponse);

    expect(fetchMock).toHaveBeenCalledWith('/data-studio/rows', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'customers',
        params,
      }),
    });
  });

  it('throws a Data Studio error when the rows endpoint fails', async () => {
    const fetchMock = vi.fn(async () =>
      createResponse({ error: 'Nope' }, { ok: false, status: 500 }),
    );
    const dataSource = createDataStudioDataSourceFromAPI({
      dataSourceId: 'customers',
      rowsUrl: '/data-studio/rows',
      fetch: fetchMock as typeof fetch,
    });

    await expect(dataSource.getRows(params)).rejects.toThrow('Server error: Nope');
  });

  it('posts create, update, and delete mutations using the Data Studio protocol', async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));

      if (url.includes('create-row')) {
        return createResponse(body.row);
      }

      if (url.includes('update-row')) {
        return createResponse(body.params.updatedRow);
      }

      return createResponse({ id: body.rowId, _action: 'delete' });
    });
    const dataSource = createDataStudioDataSourceFromAPI({
      dataSourceId: 'customers',
      rowsUrl: '/data-studio/rows',
      createRowUrl: '/data-studio/create-row',
      updateRowUrl: '/data-studio/update-row',
      deleteRowUrl: '/data-studio/delete-row',
      fetch: fetchMock as typeof fetch,
    });

    await expect(dataSource.createRow!({ id: 1, name: 'Alice' })).resolves.toEqual({
      id: 1,
      name: 'Alice',
    });
    await expect(
      dataSource.updateRow!({
        rowId: 1,
        previousRow: { id: 1, name: 'Alice' },
        updatedRow: { id: 1, name: 'Alicia' },
      }),
    ).resolves.toEqual({ id: 1, name: 'Alicia' });
    await expect(dataSource.deleteRow!(1, { id: 1, name: 'Alicia' })).resolves.toEqual({
      id: 1,
      _action: 'delete',
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/data-studio/create-row',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          version: DATA_STUDIO_PROTOCOL_VERSION,
          dataSourceId: 'customers',
          row: { id: 1, name: 'Alice' },
        }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/data-studio/update-row',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          version: DATA_STUDIO_PROTOCOL_VERSION,
          dataSourceId: 'customers',
          params: {
            rowId: 1,
            previousRow: { id: 1, name: 'Alice' },
            updatedRow: { id: 1, name: 'Alicia' },
          },
        }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      '/data-studio/delete-row',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          version: DATA_STUDIO_PROTOCOL_VERSION,
          dataSourceId: 'customers',
          rowId: 1,
          row: { id: 1, name: 'Alicia' },
        }),
      }),
    );
  });

  it('posts grouping, aggregation, and pivoting rows params using the Data Studio protocol', async () => {
    const premiumParams = {
      ...params,
      groupKeys: ['United States'],
      groupFields: ['country', 'city'],
      aggregationModel: { sales: 'sum' },
      pivotModel: {
        rows: [{ field: 'country' }],
        columns: [{ field: 'year', sort: 'asc' }],
        values: [{ field: 'sales', aggFunc: 'sum' }],
      },
    };
    const rowsResponse = {
      rows: [{ id: 'United States', country: 'United States', salesAggregate: 120 }],
      rowCount: 1,
      aggregateRow: { sales: 120 },
      pivotColumns: [{ key: '2026', group: '2026' }],
    };
    const fetchMock = vi.fn(async () => createResponse(rowsResponse));
    const dataSource = createDataStudioDataSourceFromAPI({
      dataSourceId: 'sales',
      rowsUrl: '/data-studio/rows',
      fetch: fetchMock as typeof fetch,
    });

    await expect(dataSource.getRows(premiumParams)).resolves.toEqual(rowsResponse);

    expect(fetchMock).toHaveBeenCalledWith('/data-studio/rows', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'sales',
        params: premiumParams,
      }),
    });
  });

  it('creates Premium Data Source accessors from configured row fields', () => {
    const dataSource = createDataStudioDataSourceFromAPI({
      dataSourceId: 'sales',
      rowsUrl: '/data-studio/rows',
      accessors: {
        groupKeyField: 'country',
        childrenCountField: 'childrenCount',
        aggregatedValueFieldPattern: '{field}Aggregate',
      },
    });

    expect(dataSource.getGroupKey?.({ country: 'United States' })).toBe('United States');
    expect(dataSource.getChildrenCount?.({ childrenCount: 3 })).toBe(3);
    // A row without the children-count field is treated as a true leaf (`0`).
    // `-1` is reserved for values that are present but non-numeric (the
    // Data Grid "group with unknown count" sentinel).
    expect(dataSource.getChildrenCount?.({ childrenCount: undefined })).toBe(0);
    expect(dataSource.getChildrenCount?.({ childrenCount: 'oops' })).toBe(-1);
    expect(dataSource.getAggregatedValue?.({ salesAggregate: 120 }, 'sales')).toBe(120);
  });
});
