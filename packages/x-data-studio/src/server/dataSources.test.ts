import createKnex, { type Knex } from 'knex';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { DATA_STUDIO_PROTOCOL_VERSION, type DataStudioGetRowsParams } from '../models';
import { createDataStudioDataSourcesFromAPI } from '../createDataStudioDataSourcesFromAPI';
import { createDataStudioDataSourceFromCSV } from './createDataStudioDataSourceFromCSV';
import { createDataStudioDataSourceFromKnex } from './createDataStudioDataSourceFromKnex';
import { createDataStudioDataSourceFromMongoDB } from './createDataStudioDataSourceFromMongoDB';
import { createDataStudioEndpointResponse } from './createDataStudioEndpoint';
import { createDataStudioServer } from './createDataStudioServer';
import { createNextDataStudioHandler } from './adapters';
import { DataStudioServerError } from './errors';
import {
  DATA_STUDIO_CHILDREN_COUNT_FIELD,
  DATA_STUDIO_GROUP_KEY_FIELD,
  DATA_STUDIO_SYNTHETIC_ID_FIELD,
} from './synthesis';

function createParams(params: Partial<DataStudioGetRowsParams> = {}): DataStudioGetRowsParams {
  return {
    sortModel: [],
    filterModel: { items: [] },
    start: 0,
    end: 99,
    ...params,
  };
}

describe('Data Studio server protocol', () => {
  it('serves schema and rows through split endpoints', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'orders',
      label: 'Orders',
      rowIdField: 'id',
      rows: [
        { id: 1, country: 'United States', total: 20 },
        { id: 2, country: 'France', total: 10 },
      ],
    });
    const server = createDataStudioServer({ dataSources: [dataSource] });

    const schemaResponse = await createDataStudioEndpointResponse(server, {
      method: 'GET',
      url: 'http://localhost/data-studio/schema',
    });

    expect(schemaResponse.status).toBe(200);
    expect(schemaResponse.body).toMatchObject({
      version: DATA_STUDIO_PROTOCOL_VERSION,
      dataSources: [{ id: 'orders', label: 'Orders', rowCount: 2 }],
    });

    const rowsResponse = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio/rows',
      body: {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'orders',
        params: createParams({
          filterModel: { items: [{ field: 'country', operator: 'contains', value: 'states' }] },
          start: 0,
          end: 0,
        }),
      },
    });

    expect(rowsResponse.status).toBe(200);
    expect(rowsResponse.body).toEqual({
      rows: [{ id: 1, country: 'United States', total: 20 }],
      rowCount: 1,
    });
  });

  it('groups a date column by a server-side bin (month) over the whole source', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'orders',
      rowIdField: 'id',
      rows: [
        { id: 1, orderDate: '2024-01-05', amount: 10 },
        { id: 2, orderDate: '2024-01-20', amount: 20 },
        { id: 3, orderDate: '2024-02-15', amount: 7 },
        // Non-ISO but JS-parseable — the in-memory adapter still buckets it.
        { id: 4, orderDate: 'March 3, 2024', amount: 3 },
      ],
    });

    const response = await dataSource.getRows(
      createParams({
        groupFields: ['orderDate'],
        aggregationModel: { amount: 'sum' },
        binning: { orderDate: { kind: 'date', granularity: 'month' } },
      }),
    );

    const byKey = Object.fromEntries(
      response.rows.map((row) => [row[DATA_STUDIO_GROUP_KEY_FIELD], row]),
    );
    expect(Object.keys(byKey).sort()).toEqual(['2024-01', '2024-02', '2024-03']);
    expect(byKey['2024-01'].amount).toBe(30);
    expect(byKey['2024-01'][DATA_STUDIO_CHILDREN_COUNT_FIELD]).toBe(2);
    expect(byKey['2024-02'].amount).toBe(7);
    expect(byKey['2024-03'].amount).toBe(3);
  });

  it('groups a numeric column into server-side equal-width brackets', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'orders',
      rowIdField: 'id',
      // amount range [0, 100] → 5 bins → width 20 → buckets 0/20/40/60/80.
      rows: [
        { id: 1, amount: 0, qty: 1 },
        { id: 2, amount: 5, qty: 1 },
        { id: 3, amount: 25, qty: 1 },
        { id: 4, amount: 95, qty: 1 },
        { id: 5, amount: 100, qty: 1 }, // max clamps into the last bracket (80), not its own bin.
      ],
    });

    const response = await dataSource.getRows(
      createParams({
        groupFields: ['amount'],
        aggregationModel: { qty: 'sum' },
        binning: { amount: { kind: 'numeric', bins: 5 } },
      }),
    );

    const counts = Object.fromEntries(
      response.rows.map((row) => [
        row[DATA_STUDIO_GROUP_KEY_FIELD],
        row[DATA_STUDIO_CHILDREN_COUNT_FIELD],
      ]),
    );
    // 0 → [0,20); 5 → [0,20); 25 → [20,40); 95 → [80,100); 100 → clamped to [80,100).
    expect(counts['0']).toBe(2);
    expect(counts['20']).toBe(1);
    expect(counts['80']).toBe(2);
  });

  it('serves schema and rows through a single endpoint action query', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'orders',
      rows: [{ id: 1, status: 'open' }],
    });
    const server = createDataStudioServer({ dataSources: [dataSource] });

    const schemaResponse = await createDataStudioEndpointResponse(server, {
      method: 'GET',
      url: 'http://localhost/data-studio?action=schema',
    });
    const rowsResponse = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio?action=rows',
      body: {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'orders',
        params: createParams({ start: 0, end: 0 }),
      },
    });

    expect(schemaResponse.status).toBe(200);
    expect(rowsResponse.body).toEqual({
      rows: [{ id: 1, status: 'open' }],
      rowCount: 1,
    });
  });

  it('forwards Premium grouping, aggregation, and pivoting rows params and responses', async () => {
    const premiumParams = createParams({
      groupKeys: ['United States'],
      groupFields: ['country', 'city'],
      aggregationModel: { sales: 'sum' },
      pivotModel: {
        rows: [{ field: 'country' }],
        columns: [{ field: 'year', sort: 'asc' }],
        values: [{ field: 'sales', aggFunc: 'sum' }],
      },
    });
    const premiumResponse = {
      rows: [{ id: 'United States', country: 'United States', salesAggregate: 120 }],
      rowCount: 1,
      aggregateRow: { sales: 120 },
      pivotColumns: [{ key: '2026', group: '2026' }],
    };
    const dataSource = {
      id: 'sales',
      getSchema: vi.fn(() => ({
        id: 'sales',
        label: 'Sales',
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
          pivoting: true,
        },
      })),
      getRows: vi.fn(async () => premiumResponse),
    };
    const server = createDataStudioServer({ dataSources: [dataSource] });

    const rowsResponse = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio/rows',
      body: {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'sales',
        params: premiumParams,
      },
    });

    expect(dataSource.getRows).toHaveBeenCalledWith(premiumParams);
    expect(rowsResponse).toMatchObject({
      status: 200,
      body: premiumResponse,
    });
  });

  it('supports the Data Grid server-side data source feature contract end-to-end', async () => {
    const serverDataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      label: 'Sales',
      rowIdField: 'id',
      mutations: true,
      rows: [
        { id: 1, country: 'US', city: 'Boston', year: '2025', amount: 20 },
        { id: 2, country: 'US', city: 'Boston', year: '2026', amount: 10 },
        { id: 3, country: 'US', city: 'New York', year: '2025', amount: 15 },
        { id: 4, country: 'FR', city: 'Paris', year: '2026', amount: 30 },
      ],
    });
    const server = createDataStudioServer({ dataSources: [serverDataSource] });
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      const response = await createDataStudioEndpointResponse(server, {
        method: init?.method ?? 'GET',
        url: `http://localhost${url}`,
        body: init?.body ? JSON.parse(String(init.body)) : undefined,
      });

      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        json: async () => response.body,
      } as Response;
    });

    const [dataSource] = await createDataStudioDataSourcesFromAPI({
      schemaUrl: '/data-studio/sales/schema',
      fetch: fetchMock as typeof fetch,
    });

    expect(dataSource.connector?.getGroupKey).toEqual(expect.any(Function));
    expect(dataSource.connector?.getChildrenCount).toEqual(expect.any(Function));
    expect(dataSource.connector?.getAggregatedValue).toEqual(expect.any(Function));
    expect(dataSource.connector?.createRow).toEqual(expect.any(Function));
    expect(dataSource.connector?.updateRow).toEqual(expect.any(Function));
    expect(dataSource.connector?.deleteRow).toEqual(expect.any(Function));

    await expect(
      dataSource.connector!.getRows(
        createParams({
          filterModel: { items: [{ field: 'country', operator: 'equals', value: 'US' }] },
          sortModel: [{ field: 'amount', sort: 'asc' }],
          paginationModel: { page: 0, pageSize: 2 },
          start: 0,
          end: 1,
        }),
      ),
    ).resolves.toEqual({
      rows: [
        { id: 2, country: 'US', city: 'Boston', year: '2026', amount: 10 },
        { id: 3, country: 'US', city: 'New York', year: '2025', amount: 15 },
      ],
      rowCount: 3,
    });

    const rootGroups = await dataSource.connector!.getRows(
      createParams({
        groupFields: ['country', 'city'],
        groupKeys: [],
        sortModel: [{ field: 'country', sort: 'asc' }],
        aggregationModel: { amount: 'sum' },
      }),
    );

    expect(rootGroups.rows).toEqual([
      expect.objectContaining({
        country: 'FR',
        [DATA_STUDIO_GROUP_KEY_FIELD]: 'FR',
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 1,
        amount: 30,
      }),
      expect.objectContaining({
        country: 'US',
        [DATA_STUDIO_GROUP_KEY_FIELD]: 'US',
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 3,
        amount: 45,
      }),
    ]);
    expect(dataSource.connector!.getGroupKey?.(rootGroups.rows[1])).toBe('US');
    expect(dataSource.connector!.getChildrenCount?.(rootGroups.rows[1])).toBe(3);
    expect(dataSource.connector!.getAggregatedValue?.(rootGroups.rows[1], 'amount')).toBe(45);

    const cityGroups = await dataSource.connector!.getRows(
      createParams({
        groupFields: ['country', 'city'],
        groupKeys: ['US'],
        sortModel: [{ field: 'city', sort: 'asc' }],
        aggregationModel: { amount: 'sum' },
      }),
    );

    expect(cityGroups.rows).toEqual([
      expect.objectContaining({
        city: 'Boston',
        [DATA_STUDIO_GROUP_KEY_FIELD]: 'Boston',
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 2,
        amount: 30,
      }),
      expect.objectContaining({
        city: 'New York',
        [DATA_STUDIO_GROUP_KEY_FIELD]: 'New York',
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 1,
        amount: 15,
      }),
    ]);

    const leafRows = await dataSource.connector!.getRows(
      createParams({
        groupFields: ['country', 'city'],
        groupKeys: ['US', 'Boston'],
        sortModel: [{ field: 'amount', sort: 'asc' }],
      }),
    );

    expect(leafRows.rows).toEqual([
      expect.objectContaining({
        id: 2,
        [DATA_STUDIO_GROUP_KEY_FIELD]: 2,
      }),
      expect.objectContaining({
        id: 1,
        [DATA_STUDIO_GROUP_KEY_FIELD]: 1,
      }),
    ]);
    expect(dataSource.connector!.getGroupKey?.(leafRows.rows[0])).toBe('2');
    expect(dataSource.connector!.getGroupKey?.(leafRows.rows[1])).toBe('1');

    const pivotRows = await dataSource.connector!.getRows(
      createParams({
        pivotModel: {
          rows: [{ field: 'country' }],
          columns: [{ field: 'year', sort: 'asc' }],
          values: [{ field: 'amount', aggFunc: 'sum' }],
        },
        groupKeys: [],
        sortModel: [{ field: 'country', sort: 'asc' }],
      }),
    );

    expect(pivotRows).toMatchObject({
      rows: [
        expect.objectContaining({
          country: 'FR',
          [DATA_STUDIO_GROUP_KEY_FIELD]: 'FR',
          '2025>->amount': 0,
          '2026>->amount': 30,
        }),
        expect.objectContaining({
          country: 'US',
          [DATA_STUDIO_GROUP_KEY_FIELD]: 'US',
          '2025>->amount': 35,
          '2026>->amount': 10,
        }),
      ],
      aggregateRow: {
        '2025>->amount': 35,
        '2026>->amount': 40,
      },
      pivotColumns: [
        { key: '2025', group: '2025' },
        { key: '2026', group: '2026' },
      ],
      rowCount: 2,
    });
    expect(dataSource.connector!.getAggregatedValue?.(pivotRows.rows[1], '2025>->amount')).toBe(35);

    await expect(
      dataSource.connector!.createRow!({
        id: 5,
        country: 'DE',
        city: 'Berlin',
        year: '2026',
        amount: 25,
      }),
    ).resolves.toMatchObject({ id: 5 });
    await expect(
      dataSource.connector!.updateRow!({
        rowId: 5,
        previousRow: { id: 5, amount: 25 },
        updatedRow: { id: 5, amount: 50 },
      }),
    ).resolves.toMatchObject({ id: 5, amount: 50 });
    await expect(dataSource.connector!.deleteRow!(5)).resolves.toMatchObject({
      id: 5,
      _action: 'delete',
    });
  });

  it('serves create, update, and delete row mutations through split endpoints', async () => {
    const sourceEvents: string[] = [];
    const requestEvents: string[] = [];
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'orders',
      rowIdField: 'id',
      mutations: true,
      rows: [{ id: 1, status: 'open', owner: 'initial' }],
      hooks: {
        onBefore({ operation, payload, context }) {
          sourceEvents.push(`${operation}:before:${context.role}`);

          if (operation === 'createRow') {
            return {
              row: {
                ...(payload as { row: Record<string, unknown> }).row,
                owner: context.userId,
              },
            } as any;
          }

          if (operation === 'updateRow') {
            const params = payload as { updatedRow: Record<string, unknown> };

            return {
              ...params,
              updatedRow: {
                ...params.updatedRow,
                updatedBy: context.userId,
              },
            } as any;
          }

          return undefined;
        },
        onAfter({ operation, result, context }) {
          sourceEvents.push(`${operation}:after:${context.role}`);

          if (operation === 'deleteRow') {
            return {
              ...(result as Record<string, unknown>),
              deletedBy: context.userId,
            } as any;
          }

          return undefined;
        },
      },
    });
    const server = createDataStudioServer({
      createContext(request) {
        const role = request.headers?.['x-role'];

        return {
          role: Array.isArray(role) ? role[0] : role,
          userId: 'user-1',
        };
      },
      onBeforeRequest({ operation, context }) {
        requestEvents.push(`${operation}:before:${context.role}`);
      },
      onAfterRequest({ operation, context, result, error }) {
        let status = 'empty';

        if (error) {
          status = 'error';
        } else if (result) {
          status = 'result';
        }

        requestEvents.push(`${operation}:after:${context.role}:${status}`);
      },
      dataSources: [dataSource],
    });

    const createRowResponse = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio/create-row',
      headers: { 'x-role': 'editor' },
      body: {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'orders',
        row: { id: 2, status: 'new' },
      },
    });
    const updateRowResponse = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio/update-row',
      headers: { 'x-role': 'editor' },
      body: {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'orders',
        params: {
          rowId: 2,
          previousRow: { id: 2, status: 'new', owner: 'user-1' },
          updatedRow: { id: 2, status: 'closed' },
        },
      },
    });
    const deleteRowResponse = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio/delete-row',
      headers: { 'x-role': 'editor' },
      body: {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'orders',
        rowId: 2,
      },
    });

    expect(createRowResponse).toMatchObject({
      status: 200,
      body: { id: 2, status: 'new', owner: 'user-1' },
    });
    expect(updateRowResponse).toMatchObject({
      status: 200,
      body: { id: 2, status: 'closed', owner: 'user-1', updatedBy: 'user-1' },
    });
    expect(deleteRowResponse).toMatchObject({
      status: 200,
      body: {
        id: 2,
        status: 'closed',
        owner: 'user-1',
        updatedBy: 'user-1',
        _action: 'delete',
        deletedBy: 'user-1',
      },
    });
    expect(requestEvents).toEqual([
      'createRow:before:editor',
      'createRow:after:editor:result',
      'updateRow:before:editor',
      'updateRow:after:editor:result',
      'deleteRow:before:editor',
      'deleteRow:after:editor:result',
    ]);
    expect(sourceEvents).toEqual([
      'createRow:before:editor',
      'createRow:after:editor',
      'updateRow:before:editor',
      'updateRow:after:editor',
      'deleteRow:before:editor',
      'deleteRow:after:editor',
    ]);
  });

  it('serves mutation action aliases through a single endpoint', async () => {
    const dataSource = createDataStudioDataSourceFromCSV<any>({
      id: 'orders',
      rowIdField: 'id',
      mutations: true,
      rows: [],
    });
    const server = createDataStudioServer({ dataSources: [dataSource] });

    const createRowResponse = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio?action=create',
      body: {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'orders',
        row: { id: 1, status: 'open' },
      },
    });
    const updateRowResponse = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio?action=update-row',
      body: {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'orders',
        params: {
          rowId: 1,
          previousRow: { id: 1, status: 'open' },
          updatedRow: { id: 1, status: 'closed' },
        },
      },
    });
    const deleteRowResponse = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio?action=delete',
      body: {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'orders',
        rowId: 1,
      },
    });

    expect(createRowResponse).toMatchObject({ status: 200, body: { id: 1, status: 'open' } });
    expect(updateRowResponse).toMatchObject({ status: 200, body: { id: 1, status: 'closed' } });
    expect(deleteRowResponse).toMatchObject({
      status: 200,
      body: { id: 1, status: 'closed', _action: 'delete' },
    });
  });

  it('returns JSON errors for invalid endpoint actions, methods, bodies, and disabled mutations', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'orders',
      rowIdField: 'id',
      rows: [{ id: 1, status: 'open' }],
    });
    const server = createDataStudioServer({ dataSources: [dataSource] });

    await expect(
      createDataStudioEndpointResponse(server, {
        method: 'GET',
        url: 'http://localhost/data-studio',
      }),
    ).resolves.toMatchObject({
      status: 400,
      body: { error: expect.stringContaining('Missing Data Studio endpoint action') },
    });

    await expect(
      createDataStudioEndpointResponse(server, {
        method: 'GET',
        url: 'http://localhost/data-studio/rows',
      }),
    ).resolves.toMatchObject({
      status: 405,
      body: { error: expect.stringContaining('received GET, but expected POST') },
    });

    await expect(
      createDataStudioEndpointResponse(server, {
        method: 'POST',
        url: 'http://localhost/data-studio/create-row',
        body: undefined,
      }),
    ).resolves.toMatchObject({
      status: 400,
      body: { error: expect.stringContaining('received an invalid request body') },
    });

    await expect(
      createDataStudioEndpointResponse(server, {
        method: 'POST',
        url: 'http://localhost/data-studio/update-row',
        body: {
          version: DATA_STUDIO_PROTOCOL_VERSION,
          dataSourceId: 'orders',
          params: {
            rowId: 1,
            previousRow: { id: 1, status: 'open' },
            updatedRow: { id: 1, status: 'closed' },
          },
        },
      }),
    ).resolves.toMatchObject({
      status: 405,
      body: { error: expect.stringContaining('operation is disabled') },
    });
  });

  it('runs request after hooks when authentication fails', async () => {
    const events: string[] = [];
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'orders',
      rowIdField: 'id',
      mutations: true,
      rows: [{ id: 1, status: 'open' }],
    });
    const server = createDataStudioServer({
      createContext(request) {
        const role = request.headers?.['x-role'];

        return {
          role: Array.isArray(role) ? role[0] : role,
        };
      },
      onBeforeRequest({ context }) {
        events.push(`before:${context.role}`);

        if (context.role !== 'editor') {
          throw new DataStudioServerError(
            `MUI X Data Studio: The test user is not allowed to mutate rows.
This prevents unauthorized users from changing the data source.
Authenticate with an editor role before calling mutation endpoints.`,
            403,
          );
        }
      },
      onAfterRequest({ context, error }) {
        events.push(`after:${context.role}:${error ? 'error' : 'success'}`);
      },
      dataSources: [dataSource],
    });

    const response = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio/delete-row',
      headers: { 'x-role': 'reader' },
      body: {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'orders',
        rowId: 1,
      },
    });

    expect(response).toMatchObject({
      status: 403,
      body: { error: expect.stringContaining('not allowed to mutate rows') },
    });
    expect(events).toEqual(['before:reader', 'after:reader:error']);
  });

  it('passes framework adapter headers into the request context', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'orders',
      rows: [{ id: 1, status: 'open' }],
    });
    const server = createDataStudioServer({
      createContext(request) {
        const tenant = request.headers?.['x-tenant'];

        return {
          tenant: Array.isArray(tenant) ? tenant[0] : tenant,
        };
      },
      onBeforeRequest({ context }) {
        if (context.tenant !== 'coffee') {
          throw new DataStudioServerError(
            `MUI X Data Studio: Missing tenant header.
This prevents the endpoint from scoping the request.
Send x-tenant with each Data Studio request.`,
            401,
          );
        }
      },
      dataSources: [dataSource],
    });
    const handler = createNextDataStudioHandler(server);
    const response = {
      status: vi.fn(() => response),
      json: vi.fn(),
      setHeader: vi.fn(),
    };

    await handler(
      {
        method: 'GET',
        url: '/data-studio/schema',
        headers: {
          host: 'localhost',
          'x-tenant': 'coffee',
        },
      },
      response,
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSources: [expect.objectContaining({ id: 'orders' })],
      }),
    );
  });

  it('returns protocol errors as JSON endpoint responses', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'orders',
      rows: [{ id: 1, status: 'open' }],
    });
    const server = createDataStudioServer({ dataSources: [dataSource] });

    const rowsResponse = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio/rows',
      body: {
        version: 999,
        dataSourceId: 'orders',
        params: createParams({ start: 0, end: 0 }),
      },
    });

    expect(rowsResponse.status).toBe(400);
    expect(rowsResponse.body).toMatchObject({
      error: expect.stringContaining('Unsupported protocol version "999"'),
    });
  });

  it('returns unexpected endpoint errors as JSON 500 responses', async () => {
    const consoleError = vi.spyOn(globalThis.console, 'error').mockImplementation(() => {});
    const dataSource = {
      id: 'orders',
      getSchema: vi.fn(() => ({
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
          rowGrouping: true,
          aggregation: true,
          pivoting: true,
        },
      })),
      getRows: vi.fn(async () => {
        throw new Error('Database unavailable');
      }),
    };
    const server = createDataStudioServer({ dataSources: [dataSource] });

    try {
      const rowsResponse = await createDataStudioEndpointResponse(server, {
        method: 'POST',
        url: 'http://localhost/data-studio/rows',
        body: {
          version: DATA_STUDIO_PROTOCOL_VERSION,
          dataSourceId: 'orders',
          params: createParams({ start: 0, end: 0 }),
        },
      });

      expect(rowsResponse.status).toBe(500);
      expect(rowsResponse.body).toMatchObject({
        error: expect.stringContaining('Database unavailable'),
      });
      expect(consoleError).toHaveBeenCalledWith(
        'MUI X Data Studio: Endpoint request failed.',
        expect.objectContaining({ action: 'rows', dataSourceId: 'orders' }),
        expect.any(Error),
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});

describe('createDataStudioDataSourceFromCSV', () => {
  it('filters, sorts, and slices rows with an inclusive start/end range', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      rows: [
        { id: 1, country: 'US', amount: 20 },
        { id: 2, country: 'FR', amount: 30 },
        { id: 3, country: 'US', amount: 10 },
      ],
    });

    const response = await dataSource.getRows(
      createParams({
        filterModel: { items: [{ field: 'country', operator: 'equals', value: 'US' }] },
        sortModel: [{ field: 'amount', sort: 'desc' }],
        start: 0,
        end: 1,
      }),
    );

    expect(response).toEqual({
      rows: [
        { id: 1, country: 'US', amount: 20 },
        { id: 3, country: 'US', amount: 10 },
      ],
      rowCount: 2,
    });
  });

  it('uses start/end when lazy loading requests also include paginationModel', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      rows: [
        { id: 1, amount: 10 },
        { id: 2, amount: 20 },
        { id: 3, amount: 30 },
        { id: 4, amount: 40 },
      ],
    });

    const response = await dataSource.getRows(
      createParams({
        paginationModel: { page: 0, pageSize: 1 },
        start: 2,
        end: 3,
      }),
    );

    expect(response).toEqual({
      rows: [
        { id: 3, amount: 30 },
        { id: 4, amount: 40 },
      ],
      rowCount: 4,
    });
  });

  it('requires configured columns in strict schema mode', () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      mode: 'strict',
      rows: [{ id: 1, amount: 20 }],
    });

    expect(() => dataSource.getSchema()).toThrow(
      'MUI X Data Studio: Strict schema mode requires columns for data source "sales".',
    );
  });

  it('declares Premium Data Source capabilities and accessors when configured', () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      rows: [{ id: 1, country: 'US', childrenCount: 2, salesAggregate: 20 }],
      accessors: {
        groupKeyField: 'country',
        childrenCountField: 'childrenCount',
        aggregatedValueFieldPattern: '{field}Aggregate',
      },
      schema: {
        capabilities: {
          pivoting: true,
        },
      },
    });

    expect(dataSource.getSchema()).toMatchObject({
      capabilities: {
        rowGrouping: true,
        aggregation: true,
        pivoting: true,
      },
      accessors: {
        groupKeyField: 'country',
        childrenCountField: 'childrenCount',
        aggregatedValueFieldPattern: '{field}Aggregate',
      },
    });
  });

  it('synthesizes grouped rows and all built-in aggregation functions', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      rows: [
        {
          id: 1,
          country: 'US',
          sumValue: 20,
          avgValue: 20,
          minValue: 5,
          maxValue: 5,
          sizeValue: null,
          trueValue: true,
          falseValue: false,
        },
        {
          id: 2,
          country: 'US',
          sumValue: 10,
          avgValue: 10,
          minValue: 7,
          maxValue: 7,
          sizeValue: 'present',
          trueValue: true,
          falseValue: true,
        },
        {
          id: 3,
          country: 'FR',
          sumValue: 30,
          avgValue: 30,
          minValue: 3,
          maxValue: 9,
          sizeValue: undefined,
          trueValue: false,
          falseValue: false,
        },
      ],
    });

    const response = await dataSource.getRows(
      createParams({
        groupFields: ['country'],
        sortModel: [{ field: 'country', sort: 'asc' }],
        aggregationModel: {
          sumValue: 'sum',
          avgValue: 'avg',
          minValue: 'min',
          maxValue: 'max',
          sizeValue: 'size',
          trueValue: 'sizeTrue',
          falseValue: 'sizeFalse',
        },
      }),
    );

    expect(response).toMatchObject({
      rowCount: 2,
      aggregateRow: {
        sumValue: 60,
        avgValue: 20,
        minValue: 3,
        maxValue: 9,
        sizeValue: 2,
        trueValue: 2,
        falseValue: 2,
      },
    });
    expect(response.rows).toEqual([
      expect.objectContaining({
        country: 'FR',
        [DATA_STUDIO_GROUP_KEY_FIELD]: 'FR',
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 1,
        sumValue: 30,
        avgValue: 30,
        minValue: 3,
        maxValue: 9,
        sizeValue: 0,
        trueValue: 0,
        falseValue: 1,
      }),
      expect.objectContaining({
        country: 'US',
        [DATA_STUDIO_GROUP_KEY_FIELD]: 'US',
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 2,
        sumValue: 30,
        avgValue: 15,
        minValue: 5,
        maxValue: 7,
        sizeValue: 2,
        trueValue: 2,
        falseValue: 1,
      }),
    ]);
  });

  it('aggregates numeric edge cases (zero average, negatives, all-null groups)', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      rows: [
        // group "zero" averages to exactly 0 (-5 + 5) — must report 0, not null.
        { id: 1, bucket: 'zero', value: -5 },
        { id: 2, bucket: 'zero', value: 5 },
        // group "zeros" is all zeros — average is 0, sum is 0.
        { id: 3, bucket: 'zeros', value: 0 },
        { id: 4, bucket: 'zeros', value: 0 },
        // group "neg" is all negative — min/max/avg must stay negative.
        { id: 5, bucket: 'neg', value: -10 },
        { id: 6, bucket: 'neg', value: -2 },
        // group "empty" has no numeric values — every numeric aggregation is null.
        { id: 7, bucket: 'empty', value: null },
        { id: 8, bucket: 'empty', value: null },
      ],
    });

    const response = await dataSource.getRows(
      createParams({
        groupFields: ['bucket'],
        sortModel: [{ field: 'bucket', sort: 'asc' }],
        aggregationModel: {
          value: 'avg',
        },
      }),
    );

    const byBucket = Object.fromEntries(
      response.rows.map((row) => [row.bucket, row.value]),
    );

    expect(byBucket).toEqual({
      empty: null,
      neg: -6,
      zero: 0,
      zeros: 0,
    });
  });

  it('aggregates min/max/sum/avg consistently for a single negative-average group', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      rows: [
        { id: 1, bucket: 'a', value: -8 },
        { id: 2, bucket: 'a', value: 8 },
        { id: 3, bucket: 'a', value: -3 },
      ],
    });

    const get = (fn: string) =>
      dataSource.getRows(
        createParams({ groupFields: ['bucket'], aggregationModel: { value: fn } }),
      );

    const [sum, avg, min, max] = await Promise.all([
      get('sum'),
      get('avg'),
      get('min'),
      get('max'),
    ]);

    expect(sum.rows[0].value).toBe(-3);
    expect(avg.rows[0].value).toBe(-1);
    expect(min.rows[0].value).toBe(-8);
    expect(max.rows[0].value).toBe(8);
  });

  it('computes min/max over text and date columns, not just numbers', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      rows: [
        { id: 1, bucket: 'a', name: 'Charlie', date: '2024-03-10' },
        { id: 2, bucket: 'a', name: 'Alice', date: '2024-01-05' },
        { id: 3, bucket: 'a', name: 'Bob', date: '2024-12-31' },
      ],
    });

    const get = (field: string, fn: string) =>
      dataSource.getRows(
        createParams({ groupFields: ['bucket'], aggregationModel: { [field]: fn } }),
      );

    const [nameMin, nameMax, dateMin, dateMax] = await Promise.all([
      get('name', 'min'),
      get('name', 'max'),
      get('date', 'min'),
      get('date', 'max'),
    ]);

    expect(nameMin.rows[0].name).toBe('Alice');
    expect(nameMax.rows[0].name).toBe('Charlie');
    expect(dateMin.rows[0].date).toBe('2024-01-05');
    expect(dateMax.rows[0].date).toBe('2024-12-31');
  });

  it('loads nested group children and applies lazy ranges', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      rows: [
        { id: 1, country: 'US', city: 'New York', amount: 20 },
        { id: 2, country: 'US', city: 'Boston', amount: 10 },
        { id: 3, country: 'US', city: 'Boston', amount: 30 },
        { id: 4, country: 'FR', city: 'Paris', amount: 40 },
      ],
    });

    const response = await dataSource.getRows(
      createParams({
        groupFields: ['country', 'city'],
        groupKeys: ['US'],
        sortModel: [{ field: 'city', sort: 'asc' }],
        start: 0,
        end: 0,
        aggregationModel: { amount: 'sum' },
      }),
    );

    expect(response).toMatchObject({
      rowCount: 2,
      aggregateRow: { amount: 60 },
      rows: [
        expect.objectContaining({
          city: 'Boston',
          [DATA_STUDIO_GROUP_KEY_FIELD]: 'Boston',
          [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 2,
          amount: 40,
        }),
      ],
    });
  });

  it('hydrates grouped leaf rows with Data Grid group keys', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      rows: [
        { id: 1, country: 'US', city: 'Boston', amount: 20 },
        { id: 2, country: 'US', city: 'Boston', amount: 10 },
        { id: 3, country: 'US', city: 'New York', amount: 30 },
      ],
    });

    const response = await dataSource.getRows(
      createParams({
        groupFields: ['country', 'city'],
        groupKeys: ['US', 'Boston'],
        sortModel: [{ field: 'amount', sort: 'asc' }],
      }),
    );

    expect(response).toEqual({
      rows: [
        { id: 2, country: 'US', city: 'Boston', amount: 10, [DATA_STUDIO_GROUP_KEY_FIELD]: 2 },
        { id: 1, country: 'US', city: 'Boston', amount: 20, [DATA_STUDIO_GROUP_KEY_FIELD]: 1 },
      ],
      rowCount: 2,
    });
  });

  it('synthesizes pivot columns and pivoted aggregate values', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      rows: [
        { id: 1, country: 'US', year: '2025', amount: 20 },
        { id: 2, country: 'US', year: '2026', amount: 10 },
        { id: 3, country: 'FR', year: '2025', amount: 30 },
      ],
    });

    const response = await dataSource.getRows(
      createParams({
        sortModel: [{ field: 'country', sort: 'asc' }],
        pivotModel: {
          rows: [{ field: 'country' }],
          columns: [{ field: 'year', sort: 'asc' }],
          values: [{ field: 'amount', aggFunc: '' }],
        },
      }),
    );

    expect(response).toMatchObject({
      rowCount: 2,
      pivotColumns: [
        { key: '2025', group: '2025' },
        { key: '2026', group: '2026' },
      ],
      aggregateRow: {
        '2025>->amount': 50,
        '2026>->amount': 10,
      },
    });
    expect(response.rows).toEqual([
      expect.objectContaining({
        country: 'FR',
        [DATA_STUDIO_GROUP_KEY_FIELD]: 'FR',
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 1,
        '2025>->amount': 30,
        '2026>->amount': 0,
      }),
      expect.objectContaining({
        country: 'US',
        [DATA_STUDIO_GROUP_KEY_FIELD]: 'US',
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 2,
        '2025>->amount': 20,
        '2026>->amount': 10,
      }),
    ]);
  });

  it('uses in-memory computed fields for grouping and pivoting', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      rows: [
        { id: 1, country: 'US', amount: 20 },
        { id: 2, country: 'US', amount: 10 },
        { id: 3, country: 'FR', amount: 30 },
      ],
      computedFields: {
        amountBucket: {
          valueGetter: (row) => (row.amount >= 20 ? 'high' : 'low'),
        },
      },
    });

    expect(dataSource.getSchema()).toMatchObject({
      columns: expect.arrayContaining([{ field: 'amountBucket' }]),
    });

    await expect(
      dataSource.getRows(
        createParams({
          groupFields: ['amountBucket'],
          sortModel: [{ field: 'amountBucket', sort: 'asc' }],
          aggregationModel: { amount: 'sum' },
        }),
      ),
    ).resolves.toMatchObject({
      rows: [
        expect.objectContaining({ amountBucket: 'high', amount: 50 }),
        expect.objectContaining({ amountBucket: 'low', amount: 10 }),
      ],
      aggregateRow: { amount: 60 },
      rowCount: 2,
    });
  });

  it('creates, updates, and deletes rows when mutations are enabled', async () => {
    const dataSource = createDataStudioDataSourceFromCSV({
      id: 'sales',
      rowIdField: 'id',
      mutations: true,
      rows: [{ id: 1, country: 'US', amount: 20 }],
    });

    await expect(
      dataSource.createRow!({ row: { id: 2, country: 'FR', amount: 30 } }, {}),
    ).resolves.toEqual({
      id: 2,
      country: 'FR',
      amount: 30,
    });
    await expect(
      dataSource.updateRow!(
        {
          rowId: 2,
          previousRow: { id: 2, country: 'FR', amount: 30 },
          updatedRow: { id: 2, country: 'FR', amount: 35 },
        },
        {},
      ),
    ).resolves.toEqual({
      id: 2,
      country: 'FR',
      amount: 35,
    });
    await expect(dataSource.deleteRow!({ rowId: 2 }, {})).resolves.toEqual({
      id: 2,
      country: 'FR',
      amount: 35,
      _action: 'delete',
    });

    await expect(dataSource.getRows(createParams())).resolves.toEqual({
      rows: [{ id: 1, country: 'US', amount: 20 }],
      rowCount: 1,
    });
  });
});

describe('createDataStudioDataSourceFromKnex', () => {
  let knex: Knex;

  beforeAll(async () => {
    knex = createKnex({
      client: 'better-sqlite3',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
    });

    await knex.schema.createTable('sales', (table) => {
      table.integer('id').primary();
      table.string('country');
      table.integer('amount');
    });
    await knex('sales').insert([
      { id: 1, country: 'US', amount: 20 },
      { id: 2, country: 'FR', amount: 30 },
      { id: 3, country: 'US', amount: 10 },
    ]);
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it('derives columns and applies SQL filtering, sorting, and slicing', async () => {
    const dataSource = createDataStudioDataSourceFromKnex({
      id: 'sales',
      knex,
      table: 'sales',
      rowIdField: 'id',
    });

    await expect(dataSource.getSchema()).resolves.toMatchObject({
      id: 'sales',
      columns: [{ field: 'id' }, { field: 'country' }, { field: 'amount' }],
      rowCount: 3,
    });

    const response = await dataSource.getRows(
      createParams({
        filterModel: { items: [{ field: 'country', operator: 'equals', value: 'US' }] },
        sortModel: [{ field: 'amount', sort: 'desc' }],
        start: 0,
        end: 1,
      }),
    );

    expect(response).toEqual({
      rows: [
        { id: 1, country: 'US', amount: 20 },
        { id: 3, country: 'US', amount: 10 },
      ],
      rowCount: 2,
    });
  });

  it('hydrates SQL grouped leaf rows with Data Grid group keys', async () => {
    const dataSource = createDataStudioDataSourceFromKnex({
      id: 'sales',
      knex,
      table: 'sales',
      rowIdField: 'id',
    });

    const response = await dataSource.getRows(
      createParams({
        groupFields: ['country'],
        groupKeys: ['US'],
        sortModel: [{ field: 'amount', sort: 'asc' }],
      }),
    );

    expect(response).toEqual({
      rows: [
        { id: 3, country: 'US', amount: 10, [DATA_STUDIO_GROUP_KEY_FIELD]: 3 },
        { id: 1, country: 'US', amount: 20, [DATA_STUDIO_GROUP_KEY_FIELD]: 1 },
      ],
      rowCount: 2,
    });
  });

  it('groups a numeric column into SQL equal-width brackets (server-side numeric binning)', async () => {
    const dataSource = createDataStudioDataSourceFromKnex({
      id: 'sales',
      knex,
      table: 'sales',
      rowIdField: 'id',
    });

    // amount values 10/20/30 → range [10, 30] → 2 bins → width 10 → buckets 10/20.
    // 10 → [10,20); 20 → [20,30); 30 → clamps into the last bracket (20), not its own bin.
    const response = await dataSource.getRows(
      createParams({
        groupFields: ['amount'],
        aggregationModel: { id: 'size' },
        binning: { amount: { kind: 'numeric', bins: 2 } },
      }),
    );

    const counts = Object.fromEntries(
      response.rows.map((row) => [
        String(row[DATA_STUDIO_GROUP_KEY_FIELD]),
        row[DATA_STUDIO_CHILDREN_COUNT_FIELD],
      ]),
    );

    expect(counts['10']).toBe(1);
    expect(counts['20']).toBe(2);
  });

  it('runs SQL aggregate queries separately from paginated row reads', async () => {
    const queries: string[] = [];
    const listener = (query: { sql: string }) => queries.push(query.sql.toLowerCase());
    const dataSource = createDataStudioDataSourceFromKnex({
      id: 'sales',
      knex,
      table: 'sales',
      rowIdField: 'id',
    });

    knex.on('query', listener);

    try {
      const response = await dataSource.getRows(
        createParams({
          filterModel: { items: [{ field: 'country', operator: 'equals', value: 'US' }] },
          sortModel: [{ field: 'amount', sort: 'asc' }],
          aggregationModel: { amount: 'avg' },
          start: 0,
          end: 0,
        }),
      );
      const aggregateQuery = queries.find((query) => query.includes('avg('));

      expect(response).toEqual({
        rows: [{ id: 3, country: 'US', amount: 10 }],
        rowCount: 2,
        aggregateRow: { amount: 15 },
      });
      expect(aggregateQuery).toBeDefined();
      expect(aggregateQuery).not.toContain('limit');
      expect(queries.some((query) => query.includes('limit'))).toBe(true);
    } finally {
      knex.off('query', listener);
    }
  });

  it('synthesizes SQL grouped and pivoted rows with computed field expressions', async () => {
    const dataSource = createDataStudioDataSourceFromKnex({
      id: 'sales',
      knex,
      table: 'sales',
      rowIdField: 'id',
      computedFields: {
        amountBucket: {
          knex: (db) => db.raw("case when amount >= 20 then 'high' else 'low' end"),
        },
      },
    });

    await expect(dataSource.getSchema()).resolves.toMatchObject({
      columns: expect.arrayContaining([{ field: 'amountBucket' }]),
      accessors: {
        groupKeyField: DATA_STUDIO_GROUP_KEY_FIELD,
        childrenCountField: DATA_STUDIO_CHILDREN_COUNT_FIELD,
        aggregatedValueFieldPattern: '{field}',
      },
      capabilities: {
        rowGrouping: true,
        aggregation: true,
        pivoting: true,
      },
    });

    await expect(
      dataSource.getRows(
        createParams({
          filterModel: { items: [{ field: 'amountBucket', operator: 'equals', value: 'high' }] },
          groupFields: ['country'],
          sortModel: [{ field: 'country', sort: 'asc' }],
          aggregationModel: { amount: 'sum' },
        }),
      ),
    ).resolves.toMatchObject({
      rows: [
        expect.objectContaining({ country: 'FR', amount: 30 }),
        expect.objectContaining({ country: 'US', amount: 20 }),
      ],
      aggregateRow: { amount: 50 },
      rowCount: 2,
    });

    await expect(
      dataSource.getRows(
        createParams({
          sortModel: [{ field: 'country', sort: 'asc' }],
          pivotModel: {
            rows: [{ field: 'country' }],
            columns: [{ field: 'amountBucket', sort: 'asc' }],
            values: [{ field: 'amount', aggFunc: '' }],
          },
        }),
      ),
    ).resolves.toMatchObject({
      rows: [
        expect.objectContaining({
          country: 'FR',
          'high>->amount': 30,
          'low>->amount': 0,
        }),
        expect.objectContaining({
          country: 'US',
          'high>->amount': 20,
          'low>->amount': 10,
        }),
      ],
      aggregateRow: {
        'high>->amount': 50,
        'low>->amount': 10,
      },
      pivotColumns: [
        { key: 'high', group: 'high' },
        { key: 'low', group: 'low' },
      ],
      rowCount: 2,
    });
  });

  it('creates, updates, and deletes SQL rows when mutations are enabled', async () => {
    const dataSource = createDataStudioDataSourceFromKnex({
      id: 'sales',
      knex,
      table: 'sales',
      rowIdField: 'id',
      mutations: true,
    });

    await expect(
      dataSource.createRow!({ row: { id: 4, country: 'DE', amount: 40, unknown: 'ignored' } }, {}),
    ).resolves.toEqual({ id: 4, country: 'DE', amount: 40 });
    await expect(
      dataSource.updateRow!(
        {
          rowId: 4,
          previousRow: { id: 4, country: 'DE', amount: 40 },
          updatedRow: { id: 4, country: 'DE', amount: 45, unknown: 'ignored' },
        },
        {},
      ),
    ).resolves.toEqual({ id: 4, country: 'DE', amount: 45 });
    await expect(dataSource.deleteRow!({ rowId: 4 }, {})).resolves.toEqual({
      id: 4,
      country: 'DE',
      amount: 45,
      _action: 'delete',
    });

    await expect(knex('sales').where('id', 4).first()).resolves.toBeUndefined();
  });
});

describe('createDataStudioDataSourceFromMongoDB', () => {
  function getMongoGroupId(stage: Record<string, unknown>) {
    const groupStage = stage.$group as Record<string, any> | undefined;
    const idField = '_id';

    return groupStage?.[idField];
  }

  it('builds MongoDB filter, sort, skip, and limit calls from rows params', async () => {
    const toArray = vi.fn(async () => [{ id: 2, country: 'FR', amount: 30 }]);
    const cursor = {
      sort: vi.fn(() => cursor),
      skip: vi.fn(() => cursor),
      limit: vi.fn(() => cursor),
      toArray,
    };
    const collection = {
      findOne: vi.fn(async () => ({ id: 1, country: 'US', amount: 20 })),
      find: vi.fn(() => cursor),
      countDocuments: vi.fn(async () => 1),
    };
    const dataSource = createDataStudioDataSourceFromMongoDB({
      id: 'sales',
      collection,
      rowIdField: 'id',
    });

    const response = await dataSource.getRows(
      createParams({
        filterModel: { items: [{ field: 'country', operator: 'equals', value: 'FR' }] },
        sortModel: [{ field: 'amount', sort: 'desc' }],
        start: 5,
        end: 9,
      }),
    );

    expect(collection.find).toHaveBeenCalledWith({ $and: [{ country: 'FR' }] });
    expect(cursor.sort).toHaveBeenCalledWith({ amount: -1 });
    expect(cursor.skip).toHaveBeenCalledWith(5);
    expect(cursor.limit).toHaveBeenCalledWith(5);
    expect(response).toEqual({
      rows: [{ id: 2, country: 'FR', amount: 30 }],
      rowCount: 1,
    });
  });

  it('runs MongoDB aggregate pipelines separately from paginated row reads', async () => {
    const rows = [
      { id: 1, country: 'US', amount: 20 },
      { id: 2, country: 'FR', amount: 30 },
      { id: 3, country: 'US', amount: 10 },
    ];
    const aggregatePipelines: Record<string, unknown>[][] = [];
    const collection = {
      findOne: vi.fn(async () => rows[0]),
      find: vi.fn(),
      countDocuments: vi.fn(async () => rows.length),
      aggregate: vi.fn((pipeline: Record<string, unknown>[]) => {
        aggregatePipelines.push(pipeline);

        return {
          toArray: vi.fn(async () => {
            if (pipeline.some((stage) => '$count' in stage)) {
              return [{ count: 2 }];
            }

            if (pipeline.some((stage) => getMongoGroupId(stage) === null)) {
              return [{ amount: 15 }];
            }

            return [rows[2]];
          }),
        };
      }),
    };
    const dataSource = createDataStudioDataSourceFromMongoDB({
      id: 'sales',
      collection,
      rowIdField: 'id',
    });

    const response = await dataSource.getRows(
      createParams({
        filterModel: { items: [{ field: 'country', operator: 'equals', value: 'US' }] },
        sortModel: [{ field: 'amount', sort: 'asc' }],
        aggregationModel: { amount: 'avg' },
        start: 0,
        end: 0,
      }),
    );

    expect(response).toEqual({
      rows: [{ id: 3, country: 'US', amount: 10 }],
      rowCount: 2,
      aggregateRow: { amount: 15 },
    });
    expect(collection.find).not.toHaveBeenCalled();
    expect(
      aggregatePipelines.some((pipeline) =>
        pipeline.some((stage) => (stage.$group as any)?.amount),
      ),
    ).toBe(true);
    expect(aggregatePipelines.some((pipeline) => pipeline.some((stage) => '$limit' in stage))).toBe(
      true,
    );
  });

  it('hydrates MongoDB grouped leaf rows with Data Grid group keys', async () => {
    const rows = [
      { id: 1, country: 'US', amount: 20 },
      { id: 3, country: 'US', amount: 10 },
    ];
    const collection = {
      findOne: vi.fn(async () => rows[0]),
      find: vi.fn(),
      countDocuments: vi.fn(async () => rows.length),
      aggregate: vi.fn((pipeline: Record<string, unknown>[]) => ({
        toArray: vi.fn(async () => {
          if (pipeline.some((stage) => '$count' in stage)) {
            return [{ count: 2 }];
          }

          return rows;
        }),
      })),
    };
    const dataSource = createDataStudioDataSourceFromMongoDB({
      id: 'sales',
      collection,
      rowIdField: 'id',
    });

    const response = await dataSource.getRows(
      createParams({
        groupFields: ['country'],
        groupKeys: ['US'],
        sortModel: [{ field: 'amount', sort: 'asc' }],
      }),
    );

    expect(response).toEqual({
      rows: [
        { id: 1, country: 'US', amount: 20, [DATA_STUDIO_GROUP_KEY_FIELD]: 1 },
        { id: 3, country: 'US', amount: 10, [DATA_STUDIO_GROUP_KEY_FIELD]: 3 },
      ],
      rowCount: 2,
    });
  });

  it('synthesizes MongoDB grouped and pivoted rows with computed field expressions', async () => {
    const rows = [
      { id: 1, country: 'US', amount: 20 },
      { id: 2, country: 'FR', amount: 30 },
      { id: 3, country: 'US', amount: 10 },
    ];
    const aggregatePipelines: Record<string, unknown>[][] = [];
    const collection = {
      findOne: vi.fn(async () => rows[0]),
      find: vi.fn(),
      countDocuments: vi.fn(async () => rows.length),
      aggregate: vi.fn((pipeline: Record<string, unknown>[]) => {
        aggregatePipelines.push(pipeline);

        return {
          toArray: vi.fn(async () => {
            if (pipeline.some((stage) => getMongoGroupId(stage)?.amountBucket)) {
              return [{ amountBucket: 'high' }, { amountBucket: 'low' }];
            }

            if (pipeline.some((stage) => getMongoGroupId(stage) === null)) {
              return [{ 'high>->amount': 50, 'low>->amount': 10 }];
            }

            if (pipeline.some((stage) => '$count' in stage)) {
              return [{ count: 2 }];
            }

            return [
              {
                country: 'FR',
                [DATA_STUDIO_GROUP_KEY_FIELD]: 'FR',
                [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 1,
                'high>->amount': 30,
                'low>->amount': 0,
              },
              {
                country: 'US',
                [DATA_STUDIO_GROUP_KEY_FIELD]: 'US',
                [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 2,
                'high>->amount': 20,
                'low>->amount': 10,
              },
            ];
          }),
        };
      }),
    };
    const dataSource = createDataStudioDataSourceFromMongoDB({
      id: 'sales',
      collection,
      rowIdField: 'id',
      computedFields: {
        amountBucket: {
          mongo: { $cond: [{ $gte: ['$amount', 20] }, 'high', 'low'] },
        },
      },
    });

    await expect(
      dataSource.getRows(
        createParams({
          sortModel: [{ field: 'country', sort: 'asc' }],
          pivotModel: {
            rows: [{ field: 'country' }],
            columns: [{ field: 'amountBucket', sort: 'asc' }],
            values: [{ field: 'amount', aggFunc: '' }],
          },
        }),
      ),
    ).resolves.toMatchObject({
      rows: [
        expect.objectContaining({
          country: 'FR',
          'high>->amount': 30,
          'low>->amount': 0,
        }),
        expect.objectContaining({
          country: 'US',
          'high>->amount': 20,
          'low>->amount': 10,
        }),
      ],
      aggregateRow: {
        'high>->amount': 50,
        'low>->amount': 10,
      },
      pivotColumns: [
        { key: 'high', group: 'high' },
        { key: 'low', group: 'low' },
      ],
      rowCount: 2,
    });
    expect(
      aggregatePipelines.some((pipeline) =>
        pipeline.some((stage) => getMongoGroupId(stage)?.amountBucket),
      ),
    ).toBe(true);
    expect(
      aggregatePipelines.some((pipeline) =>
        pipeline.some((stage) => (stage.$group as any)?.['high>->amount']),
      ),
    ).toBe(true);
  });

  it('creates, updates, and deletes MongoDB rows when mutations are enabled', async () => {
    const rows = [{ id: 1, country: 'US', amount: 20 }];
    const cursor = {
      toArray: vi.fn(async () => rows),
    };
    const collection = {
      findOne: vi.fn(async (filter?: Record<string, unknown>) => {
        if (!filter || Object.keys(filter).length === 0) {
          return rows[0];
        }

        return rows.find((row) => row.id === filter.id) ?? null;
      }),
      find: vi.fn(() => cursor),
      countDocuments: vi.fn(async () => rows.length),
      insertOne: vi.fn(async (row: any) => {
        rows.push(row);
        return { insertedId: row.id };
      }),
      updateOne: vi.fn(async (filter: Record<string, unknown>, update: any) => {
        const row = rows.find((item) => item.id === filter.id);

        if (row) {
          Object.assign(row, update.$set);
        }

        return { matchedCount: row ? 1 : 0 };
      }),
      deleteOne: vi.fn(async (filter: Record<string, unknown>) => {
        const index = rows.findIndex((row) => row.id === filter.id);

        if (index !== -1) {
          rows.splice(index, 1);
        }

        return { deletedCount: index === -1 ? 0 : 1 };
      }),
    };
    const dataSource = createDataStudioDataSourceFromMongoDB({
      id: 'sales',
      collection,
      rowIdField: 'id',
      mutations: true,
    });

    await expect(
      dataSource.createRow!({ row: { id: 2, country: 'FR', amount: 30 } }, {}),
    ).resolves.toEqual({
      id: 2,
      country: 'FR',
      amount: 30,
    });
    await expect(
      dataSource.updateRow!(
        {
          rowId: 2,
          previousRow: { id: 2, country: 'FR', amount: 30 },
          updatedRow: { id: 2, country: 'FR', amount: 35 },
        },
        {},
      ),
    ).resolves.toEqual({ id: 2, country: 'FR', amount: 35 });
    await expect(dataSource.deleteRow!({ rowId: 2 }, {})).resolves.toEqual({
      id: 2,
      country: 'FR',
      amount: 35,
      _action: 'delete',
    });
    expect(rows).toEqual([{ id: 1, country: 'US', amount: 20 }]);
  });
});

describe('createDataStudioDataSourceFromKnex joint sources', () => {
  let knex: Knex;

  // A small star schema: orders (fact) joined to products + customers (dimensions).
  const ordersJoin = {
    base: 'orders',
    joins: [
      {
        sourceId: 'products',
        type: 'inner' as const,
        on: [{ leftField: 'product_id', rightField: 'id' }],
      },
      {
        sourceId: 'customers',
        type: 'left' as const,
        on: [{ leftField: 'customer_id', rightField: 'id' }],
      },
    ],
    columns: [
      { sourceId: 'products', field: 'category', as: 'category' },
      { sourceId: 'customers', field: 'country', as: 'country' },
      { sourceId: 'orders', field: 'amount', as: 'amount' },
    ],
  };

  function createOrders() {
    return createDataStudioDataSourceFromKnex({ id: 'orders', knex, table: 'orders', rowIdField: 'id' });
  }

  beforeAll(async () => {
    knex = createKnex({
      client: 'better-sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    });

    await knex.schema.createTable('products', (table) => {
      table.integer('id').primary();
      table.string('category');
    });
    await knex.schema.createTable('customers', (table) => {
      table.integer('id').primary();
      table.string('country');
    });
    await knex.schema.createTable('orders', (table) => {
      table.integer('id').primary();
      table.integer('product_id');
      table.integer('customer_id');
      table.integer('amount');
    });

    await knex('products').insert([
      { id: 1, category: 'Bikes' },
      { id: 2, category: 'Bikes' },
      { id: 3, category: 'Parts' },
    ]);
    await knex('customers').insert([
      { id: 1, country: 'US' },
      { id: 2, country: 'FR' },
    ]);
    await knex('orders').insert([
      { id: 1, product_id: 1, customer_id: 1, amount: 100 },
      { id: 2, product_id: 2, customer_id: 1, amount: 50 },
      { id: 3, product_id: 3, customer_id: 2, amount: 30 },
      { id: 4, product_id: 1, customer_id: 2, amount: 20 },
    ]);
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it('returns flat joined rows with a unique synthetic id per row', async () => {
    const response = await createOrders().getRows(
      createParams({ join: ordersJoin, sortModel: [{ field: 'amount', sort: 'asc' }] }),
    );

    expect(response.rowCount).toBe(4);
    expect(response.rows.map((row) => ({ amount: row.amount, category: row.category, country: row.country }))).toEqual([
      { amount: 20, category: 'Bikes', country: 'FR' },
      { amount: 30, category: 'Parts', country: 'FR' },
      { amount: 50, category: 'Bikes', country: 'US' },
      { amount: 100, category: 'Bikes', country: 'US' },
    ]);
    const ids = response.rows.map((row) => row[DATA_STUDIO_SYNTHETIC_ID_FIELD]);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(4);
  });

  it('groups and aggregates over the joined result (many-to-one: no fan-out inflation)', async () => {
    const response = await createOrders().getRows(
      createParams({
        join: ordersJoin,
        groupFields: ['category'],
        aggregationModel: { amount: 'sum' },
        sortModel: [{ field: 'category', sort: 'asc' }],
      }),
    );

    const byCategory = Object.fromEntries(
      response.rows.map((row) => [row.category, row.amount]),
    );
    expect(byCategory).toEqual({ Bikes: 170, Parts: 30 });
    // Star join is many-to-one, so the grouped total must equal the raw fact total.
    const total = response.rows.reduce((sum, row) => sum + (row.amount as number), 0);
    expect(total).toBe(200);
  });

  it('groups by a second dimension column from another joined table', async () => {
    const response = await createOrders().getRows(
      createParams({
        join: ordersJoin,
        groupFields: ['country'],
        aggregationModel: { amount: 'sum' },
        sortModel: [{ field: 'country', sort: 'asc' }],
      }),
    );

    expect(Object.fromEntries(response.rows.map((row) => [row.country, row.amount]))).toEqual({
      FR: 50,
      US: 150,
    });
  });

  it('applies server-side numeric binning over a joined column', async () => {
    const response = await createOrders().getRows(
      createParams({
        join: ordersJoin,
        groupFields: ['amount'],
        aggregationModel: { amount: 'sum' },
        binning: { amount: { kind: 'numeric', bins: 2 } },
      }),
    );

    // amount range [20, 100] → 2 bins → width 40 → buckets 20 / 60.
    const counts = Object.fromEntries(
      response.rows.map((row) => [
        String(row[DATA_STUDIO_GROUP_KEY_FIELD]),
        row[DATA_STUDIO_CHILDREN_COUNT_FIELD],
      ]),
    );
    expect(counts['20']).toBe(3); // 20, 30, 50
    expect(counts['60']).toBe(1); // 100 (max clamps into the last bucket)
  });

  it('filters the joined result by a joined column', async () => {
    const response = await createOrders().getRows(
      createParams({
        join: ordersJoin,
        filterModel: { items: [{ field: 'category', operator: 'equals', value: 'Bikes' }] },
        sortModel: [{ field: 'amount', sort: 'asc' }],
      }),
    );

    expect(response.rowCount).toBe(3);
    expect(response.rows.map((row) => row.amount)).toEqual([20, 50, 100]);
  });

  it('pivots the joined result (category × country)', async () => {
    const response = await createOrders().getRows(
      createParams({
        join: ordersJoin,
        pivotModel: {
          rows: [{ field: 'category' }],
          columns: [{ field: 'country' }],
          values: [{ field: 'amount', aggFunc: 'sum' } as any],
        },
      }),
    );

    expect(response.pivotColumns).toBeDefined();
    expect(response.rows.length).toBeGreaterThan(0);
    expect(response.rows.map((row) => row.category).sort()).toEqual(['Bikes', 'Parts']);
  });

  it('rejects a request whose join base does not match the routed source', async () => {
    const customers = createDataStudioDataSourceFromKnex({
      id: 'customers',
      knex,
      table: 'customers',
      rowIdField: 'id',
    });
    await expect(customers.getRows(createParams({ join: ordersJoin }))).rejects.toThrow(
      /does not match the data source/,
    );
  });

  it('rejects an output column referencing an unknown field', async () => {
    await expect(
      createOrders().getRows(
        createParams({
          join: {
            ...ordersJoin,
            columns: [{ sourceId: 'products', field: 'nope', as: 'nope' }],
          },
        }),
      ),
    ).rejects.toThrow(/not a column of data source "products"/);
  });

  it('rejects a joined source that is not a table on the connection', async () => {
    await expect(
      createOrders().getRows(
        createParams({
          join: {
            ...ordersJoin,
            joins: [
              {
                sourceId: 'ghost',
                type: 'inner',
                on: [{ leftField: 'product_id', rightField: 'id' }],
              },
            ],
            columns: [{ sourceId: 'orders', field: 'amount', as: 'amount' }],
          },
        }),
      ),
    ).rejects.toThrow(/does not resolve to a readable table/);
  });

  it('rejects a reserved output alias', async () => {
    await expect(
      createOrders().getRows(
        createParams({
          join: {
            ...ordersJoin,
            columns: [{ sourceId: 'orders', field: 'amount', as: '__dataStudioAmount' }],
          },
        }),
      ),
    ).rejects.toThrow(/reserved/);
  });

  it('rejects duplicate output aliases', async () => {
    await expect(
      createOrders().getRows(
        createParams({
          join: {
            ...ordersJoin,
            columns: [
              { sourceId: 'orders', field: 'amount', as: 'value' },
              { sourceId: 'products', field: 'category', as: 'value' },
            ],
          },
        }),
      ),
    ).rejects.toThrow(/Duplicate output alias/);
  });

  it('keeps unmatched joined rows with a RIGHT join', async () => {
    // product 3 (Parts) has matching orders; add a product with no orders.
    await knex('products').insert([{ id: 9, category: 'Ghost' }]);
    try {
      const response = await createOrders().getRows(
        createParams({
          join: {
            base: 'orders',
            joins: [
              {
                sourceId: 'products',
                type: 'right',
                on: [{ leftField: 'product_id', rightField: 'id' }],
              },
            ],
            columns: [
              { sourceId: 'products', field: 'category', as: 'category' },
              { sourceId: 'orders', field: 'amount', as: 'amount' },
            ],
          },
          sortModel: [{ field: 'amount', sort: 'asc' }],
        }),
      );

      // The Ghost product is kept even though it has no order (amount null).
      const ghost = response.rows.find((row) => row.category === 'Ghost');
      expect(ghost).toBeDefined();
      expect(ghost!.amount).toBe(null);
      // Each kept row still has a stable, unique synthetic id.
      const ids = response.rows.map((row) => row[DATA_STUDIO_SYNTHETIC_ID_FIELD]);
      expect(new Set(ids).size).toBe(ids.length);
    } finally {
      await knex('products').where('id', 9).delete();
    }
  });

  it('keeps unmatched rows from both sides with a FULL join', async () => {
    // An order pointing at a non-existent product + a product with no orders.
    await knex('products').insert([{ id: 9, category: 'Ghost' }]);
    await knex('orders').insert([{ id: 99, product_id: 404, customer_id: 1, amount: 7 }]);
    try {
      const response = await createOrders().getRows(
        createParams({
          join: {
            base: 'orders',
            joins: [
              {
                sourceId: 'products',
                type: 'full',
                on: [{ leftField: 'product_id', rightField: 'id' }],
              },
            ],
            columns: [
              { sourceId: 'products', field: 'category', as: 'category' },
              { sourceId: 'orders', field: 'amount', as: 'amount' },
            ],
          },
        }),
      );

      // Unmatched product (no order) → amount null; unmatched order (no product) → category null.
      expect(response.rows.some((row) => row.category === 'Ghost' && row.amount == null)).toBe(true);
      expect(response.rows.some((row) => row.amount === 7 && row.category == null)).toBe(true);
      const ids = response.rows.map((row) => row[DATA_STUDIO_SYNTHETIC_ID_FIELD]);
      expect(new Set(ids).size).toBe(ids.length);
    } finally {
      await knex('orders').where('id', 99).delete();
      await knex('products').where('id', 9).delete();
    }
  });

  it('rejects an unsupported join type', async () => {
    await expect(
      createOrders().getRows(
        createParams({
          join: {
            ...ordersJoin,
            joins: [
              {
                sourceId: 'products',
                type: 'cross' as any,
                on: [{ leftField: 'product_id', rightField: 'id' }],
              },
            ],
            columns: [{ sourceId: 'orders', field: 'amount', as: 'amount' }],
          },
        }),
      ),
    ).rejects.toThrow(/Unsupported join type "cross"/);
  });
});
