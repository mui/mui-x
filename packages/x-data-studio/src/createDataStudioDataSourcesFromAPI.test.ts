import { describe, expect, it, vi } from 'vitest';
import type { GridGetRowsParams } from '@mui/x-data-grid';
import { DATA_STUDIO_PROTOCOL_VERSION, type DataStudioSchemaResponse } from './models';
import { createDataStudioDataSourcesFromAPI } from './createDataStudioDataSourcesFromAPI';

const params: GridGetRowsParams = {
  sortModel: [],
  filterModel: { items: [] },
  start: 0,
  end: 9,
};

function createResponse(body: unknown, init: Partial<Response> = {}) {
  return {
    ok: true,
    status: 200,
    json: async () => body,
    ...init,
  } as Response;
}

describe('createDataStudioDataSourcesFromAPI', () => {
  it('loads schema descriptors and creates remote dataSources', async () => {
    const schema: DataStudioSchemaResponse = {
      version: DATA_STUDIO_PROTOCOL_VERSION,
      dataSources: [
        {
          id: 'customers',
          label: 'Customers',
          columns: [{ field: 'name' }],
          rowIdField: 'customerId',
          rowCount: 2,
          capabilities: {
            filtering: true,
            sorting: true,
            pagination: true,
            lazyLoading: true,
            editing: false,
            createRow: false,
            updateRow: false,
            deleteRow: false,
            rowGrouping: false,
            aggregation: false,
            pivoting: false,
          },
          endpoints: {
            rows: '/custom/customers/rows',
          },
        },
      ],
    };
    const rowsResponse = { rows: [{ customerId: 'C-1', name: 'Alice' }], rowCount: 1 };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createResponse(schema))
      .mockResolvedValueOnce(createResponse(rowsResponse));

    const [dataSource] = await createDataStudioDataSourcesFromAPI({
      schemaUrl: '/data-studio/schema',
      fetch: fetchMock as typeof fetch,
    });

    expect(dataSource).toMatchObject({
      id: 'customers',
      label: 'Customers',
      columns: [{ field: 'name' }],
    });
    expect(dataSource.getRowId?.({ customerId: 'C-1' })).toBe('C-1');

    await expect(dataSource.connector!.getRows(params)).resolves.toEqual(rowsResponse);
    expect(fetchMock).toHaveBeenLastCalledWith('/custom/customers/rows', expect.any(Object));
  });

  it('forwards schema chartDefaults to the Data Source (enables server-side chart aggregation)', async () => {
    const schema: DataStudioSchemaResponse = {
      version: DATA_STUDIO_PROTOCOL_VERSION,
      dataSources: [
        {
          id: 'orders',
          label: 'Orders',
          columns: [{ field: 'country' }, { field: 'sales' }],
          capabilities: {
            filtering: true,
            sorting: true,
            pagination: true,
            lazyLoading: true,
            editing: false,
            createRow: false,
            updateRow: false,
            deleteRow: false,
            rowGrouping: true,
            aggregation: true,
            pivoting: false,
          },
          chartDefaults: { dimensions: ['country'], values: ['sales'] },
        },
      ],
    };
    const fetchMock = vi.fn().mockResolvedValueOnce(createResponse(schema));

    const [dataSource] = await createDataStudioDataSourcesFromAPI({
      schemaUrl: '/data-studio/schema',
      fetch: fetchMock as typeof fetch,
    });

    expect(dataSource.chartDefaults).toEqual({ dimensions: ['country'], values: ['sales'] });
  });

  it('omits chartDefaults when the schema descriptor does not declare it', async () => {
    const schema: DataStudioSchemaResponse = {
      version: DATA_STUDIO_PROTOCOL_VERSION,
      dataSources: [
        {
          id: 'plain',
          label: 'Plain',
          columns: [{ field: 'name' }],
          capabilities: {
            filtering: true,
            sorting: true,
            pagination: true,
            lazyLoading: true,
            editing: false,
            createRow: false,
            updateRow: false,
            deleteRow: false,
            rowGrouping: false,
            aggregation: false,
            pivoting: false,
          },
        },
      ],
    };
    const fetchMock = vi.fn().mockResolvedValueOnce(createResponse(schema));

    const [dataSource] = await createDataStudioDataSourcesFromAPI({
      schemaUrl: '/data-studio/schema',
      fetch: fetchMock as typeof fetch,
    });

    expect(dataSource.chartDefaults).toBeUndefined();
  });

  it('derives the rows endpoint from the schema endpoint', async () => {
    const schema: DataStudioSchemaResponse = {
      version: DATA_STUDIO_PROTOCOL_VERSION,
      dataSources: [
        {
          id: 'orders',
          label: 'Orders',
          columns: [{ field: 'id' }],
          capabilities: {
            filtering: true,
            sorting: true,
            pagination: true,
            lazyLoading: true,
            editing: false,
            createRow: false,
            updateRow: false,
            deleteRow: false,
            rowGrouping: false,
            aggregation: false,
            pivoting: false,
          },
        },
      ],
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createResponse(schema))
      .mockResolvedValueOnce(createResponse({ rows: [], rowCount: 0 }));

    const [dataSource] = await createDataStudioDataSourcesFromAPI({
      schemaUrl: '/data-studio/coffee-beans/schema',
      fetch: fetchMock as typeof fetch,
    });

    await dataSource.connector!.getRows(params);

    expect(fetchMock).toHaveBeenLastCalledWith(
      '/data-studio/coffee-beans/rows',
      expect.any(Object),
    );
  });

  it('derives mutation endpoints when the schema enables mutation capabilities', async () => {
    const schema: DataStudioSchemaResponse = {
      version: DATA_STUDIO_PROTOCOL_VERSION,
      dataSources: [
        {
          id: 'orders',
          label: 'Orders',
          columns: [{ field: 'id' }],
          rowIdField: 'id',
          capabilities: {
            filtering: true,
            sorting: true,
            pagination: true,
            lazyLoading: true,
            editing: true,
            createRow: true,
            updateRow: true,
            deleteRow: true,
            rowGrouping: false,
            aggregation: false,
            pivoting: false,
          },
        },
      ],
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createResponse(schema))
      .mockResolvedValue(createResponse({ id: 1 }));

    const [dataSource] = await createDataStudioDataSourcesFromAPI({
      schemaUrl: '/data-studio/coffee-beans/schema',
      fetch: fetchMock as typeof fetch,
    });

    await dataSource.connector!.createRow!({ id: 1 });
    await dataSource.connector!.updateRow!({
      rowId: 1,
      previousRow: { id: 1 },
      updatedRow: { id: 1 },
    });
    await dataSource.connector!.deleteRow!(1);

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/data-studio/coffee-beans/create-row',
      expect.any(Object),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      '/data-studio/coffee-beans/update-row',
      expect.any(Object),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      '/data-studio/coffee-beans/delete-row',
      expect.any(Object),
    );
  });

  it('wires server-side grouping, aggregation, and pivoting accessors from schema descriptors', async () => {
    const schema: DataStudioSchemaResponse = {
      version: DATA_STUDIO_PROTOCOL_VERSION,
      dataSources: [
        {
          id: 'sales',
          label: 'Sales',
          columns: [{ field: 'country' }, { field: 'sales' }],
          rowIdField: 'id',
          capabilities: {
            filtering: true,
            sorting: true,
            pagination: true,
            lazyLoading: true,
            editing: false,
            createRow: false,
            updateRow: false,
            deleteRow: false,
            rowGrouping: true,
            aggregation: true,
            pivoting: true,
          },
          accessors: {
            groupKeyField: 'country',
            childrenCountField: 'childrenCount',
            aggregatedValueFields: {
              sales: 'salesTotal',
            },
          },
        },
      ],
    };
    const fetchMock = vi.fn(async () => createResponse(schema));

    const [dataSource] = await createDataStudioDataSourcesFromAPI({
      schemaUrl: '/data-studio/schema',
      fetch: fetchMock as typeof fetch,
    });

    expect(dataSource.connector!.getGroupKey?.({ country: 'United States' })).toBe('United States');
    expect(dataSource.connector!.getChildrenCount?.({ childrenCount: 7 })).toBe(7);
    expect(dataSource.connector!.getAggregatedValue?.({ salesTotal: 220 }, 'sales')).toBe(220);
  });

  it('throws a Data Studio error when schema discovery fails', async () => {
    const fetchMock = vi.fn(async () =>
      createResponse({ error: 'Schema unavailable' }, { ok: false, status: 404 }),
    );

    await expect(
      createDataStudioDataSourcesFromAPI({
        schemaUrl: '/missing/schema',
        fetch: fetchMock as typeof fetch,
      }),
    ).rejects.toThrow('Server error: Schema unavailable');
  });
});
