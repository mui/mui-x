import fs from 'node:fs';
import path from 'node:path';
import createKnex, { type Knex } from 'knex';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DATA_STUDIO_PROTOCOL_VERSION, type DataStudioGetRowsParams } from '../../src/models';
import {
  createDataStudioDataSourceFromSQLite,
  createDataStudioEndpointResponse,
  createDataStudioDataSourceFromMySQL,
  createDataStudioDataSourceFromPostgres,
  createDataStudioServer,
} from '../../src/server';
import {
  DATA_STUDIO_CHILDREN_COUNT_FIELD,
  DATA_STUDIO_GROUP_KEY_FIELD,
} from '../../src/server/synthesis';

const shouldRun = process.env.DATA_STUDIO_DATABASES === '1';
const coffeeBeansDatabasePathCandidates = [
  path.resolve(process.cwd(), 'docs/data/data-studio/overview/coffee-beans.sqlite'),
  path.resolve(process.cwd(), '../../docs/data/data-studio/overview/coffee-beans.sqlite'),
];
const coffeeBeansDatabasePath =
  coffeeBeansDatabasePathCandidates.find((candidate) => fs.existsSync(candidate)) ??
  coffeeBeansDatabasePathCandidates[0];

function createParams(params: Partial<DataStudioGetRowsParams> = {}): DataStudioGetRowsParams {
  return {
    sortModel: [],
    filterModel: { items: [] },
    start: 0,
    end: 99,
    ...params,
  };
}

async function resetSalesTable(knex: Knex) {
  const hasTable = await knex.schema.hasTable('sales');

  if (hasTable) {
    await knex.schema.dropTable('sales');
  }

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
}

async function expectFilteredSalesRows(
  getRows: (params: DataStudioGetRowsParams) => Promise<{ rows: any[]; rowCount?: number }>,
) {
  await expect(
    getRows(
      createParams({
        filterModel: { items: [{ field: 'country', operator: 'equals', value: 'US' }] },
        sortModel: [{ field: 'amount', sort: 'desc' }],
        start: 0,
        end: 1,
      }),
    ),
  ).resolves.toMatchObject({
    rows: [
      { id: 1, country: 'US', amount: 20 },
      { id: 3, country: 'US', amount: 10 },
    ],
    rowCount: 2,
  });
}

async function expectFilteredAggregateIgnoresLazyRange(
  getRows: (
    params: DataStudioGetRowsParams,
  ) => Promise<{ rows: any[]; rowCount?: number; aggregateRow?: Record<string, unknown> }>,
) {
  await expect(
    getRows(
      createParams({
        filterModel: { items: [{ field: 'country', operator: 'equals', value: 'US' }] },
        sortModel: [{ field: 'amount', sort: 'asc' }],
        aggregationModel: { amount: 'avg' },
        start: 0,
        end: 0,
      }),
    ),
  ).resolves.toMatchObject({
    rows: [{ id: 3, country: 'US', amount: 10 }],
    rowCount: 2,
    aggregateRow: { amount: 15 },
  });
}

async function expectMutableSalesRows(dataSource: {
  createRow?: Function;
  updateRow?: Function;
  deleteRow?: Function;
  getRows: (params: DataStudioGetRowsParams) => Promise<{ rows: any[]; rowCount?: number }>;
}) {
  await expect(
    dataSource.createRow!({ row: { id: 4, country: 'DE', amount: 40 } }, {}),
  ).resolves.toMatchObject({
    id: 4,
    country: 'DE',
    amount: 40,
  });
  await expect(
    dataSource.updateRow!(
      {
        rowId: 4,
        previousRow: { id: 4, country: 'DE', amount: 40 },
        updatedRow: { id: 4, country: 'DE', amount: 45 },
      },
      {},
    ),
  ).resolves.toMatchObject({
    id: 4,
    country: 'DE',
    amount: 45,
  });
  await expect(dataSource.deleteRow!({ rowId: 4 }, {})).resolves.toMatchObject({
    id: 4,
    country: 'DE',
    amount: 45,
    _action: 'delete',
  });
  await expect(
    dataSource.getRows(
      createParams({
        filterModel: { items: [{ field: 'id', operator: 'equals', value: 4 }] },
      }),
    ),
  ).resolves.toMatchObject({
    rows: [],
    rowCount: 0,
  });
}

async function expectSynthesizedSalesRows(
  getRows: (params: DataStudioGetRowsParams) => Promise<{ rows: any[]; rowCount?: number }>,
) {
  await expect(
    getRows(
      createParams({
        sortModel: [{ field: 'country', sort: 'asc' }],
        pivotModel: {
          rows: [{ field: 'country' }],
          columns: [{ field: 'amountBucket', sort: 'asc' }],
          values: [{ field: 'amount', aggFunc: 'sum' }],
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
}

describe.skipIf(!shouldRun)('Data Studio database data sources', () => {
  describe('Postgres', () => {
    const connection = {
      host: '127.0.0.1',
      port: 55432,
      user: 'datastudio',
      password: 'datastudio',
      database: 'datastudio',
    };
    let seedKnex: Knex;

    beforeAll(async () => {
      seedKnex = createKnex({ client: 'pg', connection });
      await resetSalesTable(seedKnex);
    });

    afterAll(async () => {
      await seedKnex.destroy();
    });

    it('loads rows through the Postgres helper', async () => {
      expect.assertions(1);

      const dataSource = createDataStudioDataSourceFromPostgres({
        id: 'sales',
        table: 'sales',
        connection,
        rowIdField: 'id',
        mutations: true,
        computedFields: {
          amountBucket: {
            knex: (knex) => knex.raw("case when amount >= 20 then 'high' else 'low' end"),
          },
        },
      });

      try {
        await expectFilteredSalesRows((params) => dataSource.getRows(params));
        await expectFilteredAggregateIgnoresLazyRange((params) => dataSource.getRows(params));
        await expectSynthesizedSalesRows((params) => dataSource.getRows(params));
        await expectMutableSalesRows(dataSource);
      } finally {
        await dataSource.destroy?.();
      }
    });
  });

  describe('MySQL', () => {
    const connection = {
      host: '127.0.0.1',
      port: 53306,
      user: 'datastudio',
      password: 'datastudio',
      database: 'datastudio',
    };
    let seedKnex: Knex;

    beforeAll(async () => {
      seedKnex = createKnex({ client: 'mysql2', connection });
      await resetSalesTable(seedKnex);
    });

    afterAll(async () => {
      await seedKnex.destroy();
    });

    it('loads rows through the MySQL helper', async () => {
      expect.assertions(1);

      const dataSource = createDataStudioDataSourceFromMySQL({
        id: 'sales',
        table: 'sales',
        connection,
        rowIdField: 'id',
        mutations: true,
        computedFields: {
          amountBucket: {
            knex: (knex) => knex.raw("case when amount >= 20 then 'high' else 'low' end"),
          },
        },
      });

      try {
        await expectFilteredSalesRows((params) => dataSource.getRows(params));
        await expectFilteredAggregateIgnoresLazyRange((params) => dataSource.getRows(params));
        await expectSynthesizedSalesRows((params) => dataSource.getRows(params));
        await expectMutableSalesRows(dataSource);
      } finally {
        await dataSource.destroy?.();
      }
    });
  });
});

describe('Data Studio Coffee Beans SQLite data source', () => {
  const dataSources = [
    createDataStudioDataSourceFromSQLite({
      id: 'customers',
      table: 'customers',
      filename: coffeeBeansDatabasePath,
      label: 'Customers',
      rowIdField: 'Customer ID',
      hiddenFields: ['__rowId'],
    }),
    createDataStudioDataSourceFromSQLite({
      id: 'products',
      table: 'products',
      filename: coffeeBeansDatabasePath,
      label: 'Products',
      rowIdField: 'Product ID',
      hiddenFields: ['__rowId'],
    }),
    createDataStudioDataSourceFromSQLite({
      id: 'orders',
      table: 'orders',
      filename: coffeeBeansDatabasePath,
      label: 'Orders',
      rowIdField: '__rowId',
      hiddenFields: ['__rowId'],
    }),
  ];
  const server = createDataStudioServer({ dataSources });

  afterAll(async () => {
    await Promise.all(dataSources.map((dataSource) => dataSource.destroy?.()));
  });

  it('loads grouped customers from the embedded Coffee Beans SQLite database', async () => {
    const response = await createDataStudioEndpointResponse(server, {
      method: 'POST',
      url: 'http://localhost/data-studio/rows',
      body: {
        version: DATA_STUDIO_PROTOCOL_VERSION,
        dataSourceId: 'customers',
        params: {
          groupKeys: [],
          paginationModel: { page: 0, pageSize: 50 },
          sortModel: [],
          filterModel: {
            items: [],
            logicOperator: 'and',
            quickFilterValues: [],
            quickFilterLogicOperator: 'and',
          },
          start: 0,
          end: 49,
          groupFields: ['Country'],
          aggregationModel: {},
        },
      },
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      rowCount: 4,
      rows: [
        // 12 customers have an empty `Country`; SQL `GROUP BY` surfaces them as
        // their own blank group (akin to the Data Grid's "(Blanks)" group).
        expect.objectContaining({
          Country: '',
          [DATA_STUDIO_GROUP_KEY_FIELD]: '',
          [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 12,
        }),
        expect.objectContaining({
          Country: 'Ireland',
          [DATA_STUDIO_GROUP_KEY_FIELD]: 'Ireland',
          [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 150,
        }),
        expect.objectContaining({
          Country: 'United Kingdom',
          [DATA_STUDIO_GROUP_KEY_FIELD]: 'United Kingdom',
          [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 68,
        }),
        expect.objectContaining({
          Country: 'United States',
          [DATA_STUDIO_GROUP_KEY_FIELD]: 'United States',
          [DATA_STUDIO_CHILDREN_COUNT_FIELD]: 782,
        }),
      ],
    });
  });

  it('loads product and order rows from the embedded Coffee Beans SQLite database', async () => {
    await Promise.all(
      ['products', 'orders'].map(async (dataSourceId) => {
        const response = await createDataStudioEndpointResponse(server, {
          method: 'POST',
          url: 'http://localhost/data-studio/rows',
          body: {
            version: DATA_STUDIO_PROTOCOL_VERSION,
            dataSourceId,
            params: createParams({ start: 0, end: 0 }),
          },
        });

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          rows: [expect.any(Object)],
          rowCount: expect.any(Number),
        });
        expect((response.body as { rowCount: number }).rowCount).toBeGreaterThan(0);
      }),
    );
  });
});
