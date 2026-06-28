import createKnex, { type Knex } from 'knex';
import type { GridColDef, GridRowId, GridRowModel } from '@mui/x-data-grid';
import type {
  DataStudioComputedFields,
  DataStudioRequestContext,
  DataStudioServerDataSource,
  DataStudioSourceBaseOptions,
  DataStudioSourceSchema,
} from './types';
import {
  assertAutoSchemaAllowed,
  assertMutationEnabled,
  assertRowIdField,
  createColumnsFromFields,
  createDefaultDescriptor,
  getConfiguredColumns,
  getAllowedFields,
  isMutationEnabled,
  runDataStudioSourceAfterHook,
  runDataStudioSourceBeforeHook,
} from './utils';
import { DataStudioServerError } from './errors';
import { addComputedFieldColumns, getDataStudioSynthesisAccessors } from './synthesis';
import { getKnexDataStudioRows } from './knexDataSourceRows';
import { getKnexJoinRows } from './knexJoinSource';

export interface CreateDataStudioDataSourceFromKnexOptions<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> extends DataStudioSourceBaseOptions<any, TContext> {
  knex: Knex;
  table: string;
  /**
   * Maps a joined data source id (from a `params.join` definition) to its
   * physical table on this source's connection. Defaults to identity (the join
   * references sources by their table name). Set this when source ids differ
   * from table names.
   * @param {string} sourceId The joined data source id from the join definition.
   * @returns {string} The physical table name on this source's connection.
   */
  resolveJoinTable?: (sourceId: string) => string;
}

export interface CreateDataStudioDataSourcesFromKnexOptions {
  knex: Knex;
  mode?: 'strict' | 'auto';
  include?: string[];
  exclude?: string[];
  schemas?: Record<string, DataStudioSourceSchema>;
  rowIdFields?: Record<string, string>;
  hiddenFields?: Record<string, string[]>;
  computedFields?: Record<string, DataStudioComputedFields>;
}

export interface CreateDataStudioDataSourceFromSQLiteOptions<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> extends Omit<CreateDataStudioDataSourceFromKnexOptions<TContext>, 'knex'> {
  filename: string;
}

export interface CreateDataStudioDataSourceFromMySQLOptions<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> extends Omit<CreateDataStudioDataSourceFromKnexOptions<TContext>, 'knex'> {
  connection: Knex.Config['connection'];
}

export interface CreateDataStudioDataSourceFromPostgresOptions<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> extends Omit<CreateDataStudioDataSourceFromKnexOptions<TContext>, 'knex'> {
  connection: Knex.Config['connection'];
}

function parseCount(row: Record<string, unknown> | undefined) {
  if (!row) {
    return 0;
  }

  const value = row.count ?? row['count(*)'] ?? Object.values(row)[0];
  return Number(value);
}

async function getColumnsFromKnex(
  knex: Knex,
  table: string,
  hiddenFields?: string[],
  computedFields?: DataStudioComputedFields,
): Promise<GridColDef[]> {
  const columnInfo = await knex(table).columnInfo();
  return addComputedFieldColumns(
    createColumnsFromFields(Object.keys(columnInfo), hiddenFields, columnInfo),
    computedFields,
  );
}

async function getRowCount(knex: Knex, table: string) {
  const countRows = await knex(table).count({ count: '*' });
  return parseCount(countRows[0] as Record<string, unknown>);
}

function pickKnownFields(row: GridRowModel, allowedFields: Set<string>) {
  const knownRow: GridRowModel = {};

  Object.entries(row).forEach(([field, value]) => {
    if (allowedFields.has(field)) {
      knownRow[field] = value;
    }
  });

  return knownRow;
}

function getRequiredRowId(
  row: GridRowModel,
  rowIdField: string,
  dataSourceId: string,
  operation: 'createRow' | 'updateRow' | 'deleteRow',
) {
  const rowId = row[rowIdField] as GridRowId | undefined;

  if (rowId == null) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The "${operation}" operation received a row without "${rowIdField}" for data source "${dataSourceId}".
This prevents the SQL data source from identifying the row to mutate.
Include the configured rowIdField in the row payload.`,
    );
  }

  return rowId;
}

function getInsertedRowId(insertResult: unknown, rowIdField: string): GridRowId | undefined {
  const result = Array.isArray(insertResult) ? insertResult[0] : insertResult;

  if (result && typeof result === 'object' && rowIdField in result) {
    return (result as GridRowModel)[rowIdField] as GridRowId;
  }

  return result as GridRowId | undefined;
}

async function getKnexRowById(
  options: CreateDataStudioDataSourceFromKnexOptions<any>,
  rowIdField: string,
  rowId: GridRowId,
) {
  return options.knex(options.table).select('*').where(rowIdField, rowId).first();
}

async function getRequiredKnexRowById(
  options: CreateDataStudioDataSourceFromKnexOptions<any>,
  rowIdField: string,
  rowId: GridRowId,
) {
  const row = await getKnexRowById(options, rowIdField, rowId);

  if (!row) {
    throw new DataStudioServerError(
      `MUI X Data Studio: Cannot find row "${String(rowId)}" in data source "${options.id}".
This prevents the SQL data source from mutating an unknown row.
Use a rowId returned by the data source before calling row mutation endpoints.`,
      404,
    );
  }

  return row as GridRowModel;
}

export function createDataStudioDataSourceFromKnex<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
>(
  options: CreateDataStudioDataSourceFromKnexOptions<TContext>,
): DataStudioServerDataSource<any, TContext> {
  const dataSource: DataStudioServerDataSource<any, TContext> = {
    id: options.id,

    async getSchema() {
      const configuredColumns = getConfiguredColumns(options);

      if (!configuredColumns) {
        assertAutoSchemaAllowed(options);
      }

      const columns = addComputedFieldColumns(
        configuredColumns ??
          (await getColumnsFromKnex(
            options.knex,
            options.table,
            options.hiddenFields,
            options.computedFields,
          )),
        options.computedFields,
      );
      const accessors = getDataStudioSynthesisAccessors(
        options.schema?.accessors ?? options.accessors,
      );

      return createDefaultDescriptor({
        ...options,
        schema: options.schema ? { ...options.schema, accessors } : undefined,
        accessors,
        columns,
        rowCount: await getRowCount(options.knex, options.table),
      });
    },

    async getRows(params) {
      const schema = await this.getSchema();

      if (params.join) {
        // Self-handle a joint-source request: this (base/fact) source joins the
        // referenced sibling tables on its own connection. See knexJoinSource.ts.
        return getKnexJoinRows(
          {
            knex: options.knex,
            baseSourceId: options.id,
            baseTable: options.table,
            baseRowIdField: schema.rowIdField,
            resolveTable: options.resolveJoinTable ?? ((sourceId) => sourceId),
          },
          params,
        );
      }

      return getKnexDataStudioRows(options, params, schema.columns, schema.rowIdField);
    },
  };

  if (isMutationEnabled(options, 'createRow')) {
    dataSource.createRow = async (params, context) => {
      assertMutationEnabled(options, 'createRow');
      const schema = await dataSource.getSchema();
      assertRowIdField(schema.rowIdField, options.id, 'createRow');
      const allowedFields = getAllowedFields(schema.columns, schema.rowIdField);
      const payload = await runDataStudioSourceBeforeHook(options, {
        operation: 'createRow',
        dataSourceId: options.id,
        context,
        payload: params,
      });
      const row = pickKnownFields(payload.row, allowedFields);
      let rowId = row[schema.rowIdField] as GridRowId | undefined;
      const insertResult = await options.knex(options.table).insert(row, [schema.rowIdField]);

      if (rowId == null) {
        rowId = getInsertedRowId(insertResult, schema.rowIdField);
      }

      if (rowId == null) {
        rowId = getRequiredRowId(row, schema.rowIdField, options.id, 'createRow');
      }

      const result = await getRequiredKnexRowById(options, schema.rowIdField, rowId);
      return runDataStudioSourceAfterHook(options, {
        operation: 'createRow',
        dataSourceId: options.id,
        context,
        payload,
        result,
      });
    };
  }

  if (isMutationEnabled(options, 'updateRow')) {
    dataSource.updateRow = async (params, context) => {
      assertMutationEnabled(options, 'updateRow');
      const schema = await dataSource.getSchema();
      assertRowIdField(schema.rowIdField, options.id, 'updateRow');
      const allowedFields = getAllowedFields(schema.columns, schema.rowIdField);
      const payload = await runDataStudioSourceBeforeHook(options, {
        operation: 'updateRow',
        dataSourceId: options.id,
        context,
        payload: params,
      });
      const updatedRow = pickKnownFields(payload.updatedRow, allowedFields);
      await getRequiredKnexRowById(options, schema.rowIdField, payload.rowId);
      await options.knex(options.table).where(schema.rowIdField, payload.rowId).update(updatedRow);

      const result = await getRequiredKnexRowById(options, schema.rowIdField, payload.rowId);
      return runDataStudioSourceAfterHook(options, {
        operation: 'updateRow',
        dataSourceId: options.id,
        context,
        payload,
        result,
      });
    };
  }

  if (isMutationEnabled(options, 'deleteRow')) {
    dataSource.deleteRow = async (params, context) => {
      assertMutationEnabled(options, 'deleteRow');
      const schema = await dataSource.getSchema();
      assertRowIdField(schema.rowIdField, options.id, 'deleteRow');
      const payload = await runDataStudioSourceBeforeHook(options, {
        operation: 'deleteRow',
        dataSourceId: options.id,
        context,
        payload: params,
      });
      const deletedRow = await getRequiredKnexRowById(options, schema.rowIdField, payload.rowId);

      await options.knex(options.table).where(schema.rowIdField, payload.rowId).delete();

      const result = { ...deletedRow, _action: 'delete' };
      return runDataStudioSourceAfterHook(options, {
        operation: 'deleteRow',
        dataSourceId: options.id,
        context,
        payload,
        result,
      });
    };
  }

  return dataSource;
}

async function getKnexTables(knex: Knex) {
  const client = String(knex.client.config.client);

  if (client.includes('sqlite')) {
    const rows = await knex('sqlite_master')
      .select('name')
      .where('type', 'table')
      .whereNot('name', 'like', 'sqlite_%');
    return rows.map((row) => row.name as string);
  }

  if (client.includes('pg') || client.includes('postgres')) {
    const rows = await knex('information_schema.tables')
      .select('table_name')
      .where('table_schema', 'public');
    return rows.map((row) => row.table_name as string);
  }

  if (client.includes('mysql')) {
    const rows = await knex('information_schema.tables')
      .select('table_name')
      .whereRaw('table_schema = database()');
    return rows.map((row) => row.table_name as string);
  }

  throw new DataStudioServerError(
    `MUI X Data Studio: Automatic table discovery is not implemented for Knex client "${client}".
This prevents Data Studio from deriving the SQL data source schema automatically.
Pass include with the table names to expose.`,
  );
}

export async function createDataStudioDataSourcesFromKnex(
  options: CreateDataStudioDataSourcesFromKnexOptions,
) {
  const includedTables = options.include ?? (await getKnexTables(options.knex));
  const excludedTables = new Set(options.exclude ?? []);

  return includedTables
    .filter((table) => !excludedTables.has(table))
    .map((table) =>
      createDataStudioDataSourceFromKnex({
        id: table,
        table,
        knex: options.knex,
        mode: options.mode,
        schema: options.schemas?.[table],
        rowIdField: options.rowIdFields?.[table],
        hiddenFields: options.hiddenFields?.[table],
        computedFields: options.computedFields?.[table],
      }),
    );
}

export function createDataStudioDataSourceFromSQLite<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
>(options: CreateDataStudioDataSourceFromSQLiteOptions<TContext>) {
  const { filename, ...sourceOptions } = options;
  const knex = createKnex({
    client: 'better-sqlite3',
    connection: {
      filename,
    },
    useNullAsDefault: true,
  });

  return {
    ...createDataStudioDataSourceFromKnex({ ...sourceOptions, knex }),
    destroy: () => knex.destroy(),
  };
}

export function createDataStudioDataSourceFromMySQL<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
>(options: CreateDataStudioDataSourceFromMySQLOptions<TContext>) {
  const { connection, ...sourceOptions } = options;
  const knex = createKnex({
    client: 'mysql2',
    connection,
  });

  return {
    ...createDataStudioDataSourceFromKnex({ ...sourceOptions, knex }),
    destroy: () => knex.destroy(),
  };
}

export function createDataStudioDataSourceFromPostgres<
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
>(options: CreateDataStudioDataSourceFromPostgresOptions<TContext>) {
  const { connection, ...sourceOptions } = options;
  const knex = createKnex({
    client: 'pg',
    connection,
  });

  return {
    ...createDataStudioDataSourceFromKnex({ ...sourceOptions, knex }),
    destroy: () => knex.destroy(),
  };
}
