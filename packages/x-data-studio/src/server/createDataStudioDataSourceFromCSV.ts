import type { GridRowId, GridRowModel, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';
import type {
  DataStudioRequestContext,
  DataStudioServerDataSource,
  DataStudioSourceBaseOptions,
} from './types';
import { DataStudioServerError } from './errors';
import {
  applyInMemoryQuery,
  assertAutoSchemaAllowed,
  assertMutationEnabled,
  assertRowIdField,
  createColumnsFromRow,
  createDefaultDescriptor,
  getConfiguredColumns,
  isMutationEnabled,
  runDataStudioSourceAfterHook,
  runDataStudioSourceBeforeHook,
} from './utils';
import { addComputedFieldColumns, getDataStudioSynthesisAccessors } from './synthesis';

export interface CreateDataStudioDataSourceFromCSVOptions<
  R extends GridValidRowModel = any,
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> extends DataStudioSourceBaseOptions<R, TContext> {
  rows: GridRowsProp<R>;
}

export function createDataStudioDataSourceFromCSV<
  R extends GridValidRowModel = any,
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
>(
  options: CreateDataStudioDataSourceFromCSVOptions<R, TContext>,
): DataStudioServerDataSource<R, TContext> {
  const rows = [...options.rows] as R[];
  const dataSource: DataStudioServerDataSource<R, TContext> = {
    id: options.id,

    getSchema() {
      const configuredColumns = getConfiguredColumns(options);

      if (!configuredColumns) {
        assertAutoSchemaAllowed(options);
      }

      const columns = addComputedFieldColumns(
        configuredColumns ?? createColumnsFromRow(rows[0], options.hiddenFields),
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
        rowCount: rows.length,
      });
    },

    async getRows(params) {
      const schema = await this.getSchema();
      return applyInMemoryQuery(
        rows,
        params,
        schema.columns,
        schema.rowIdField,
        options.computedFields,
      );
    },
  };

  if (isMutationEnabled(options, 'createRow')) {
    dataSource.createRow = async (params, context) => {
      assertMutationEnabled(options, 'createRow');
      const schema = await dataSource.getSchema();
      assertRowIdField(schema.rowIdField, options.id, 'createRow');
      const payload = await runDataStudioSourceBeforeHook(options, {
        operation: 'createRow',
        dataSourceId: options.id,
        context,
        payload: params,
      });
      const row = payload.row as R;
      const rowId = getRowId(row, schema.rowIdField, options.id, 'createRow');

      if (getRowIndex(rows, schema.rowIdField, rowId) !== -1) {
        throw new DataStudioServerError(
          `MUI X Data Studio: Cannot create row "${String(rowId)}" in data source "${options.id}" because it already exists.
This prevents the CSV data source from creating duplicate row identifiers.
Create rows with a unique value in the configured rowIdField.`,
        );
      }

      rows.push(row);
      return runDataStudioSourceAfterHook(options, {
        operation: 'createRow',
        dataSourceId: options.id,
        context,
        payload,
        result: row,
      });
    };
  }

  if (isMutationEnabled(options, 'updateRow')) {
    dataSource.updateRow = async (params, context) => {
      assertMutationEnabled(options, 'updateRow');
      const schema = await dataSource.getSchema();
      assertRowIdField(schema.rowIdField, options.id, 'updateRow');
      const payload = await runDataStudioSourceBeforeHook(options, {
        operation: 'updateRow',
        dataSourceId: options.id,
        context,
        payload: params,
      });
      const rowIndex = getRequiredRowIndex(rows, schema.rowIdField, payload.rowId, options.id);
      const updatedRow = { ...rows[rowIndex], ...payload.updatedRow } as R;

      rows[rowIndex] = updatedRow;
      return runDataStudioSourceAfterHook(options, {
        operation: 'updateRow',
        dataSourceId: options.id,
        context,
        payload,
        result: updatedRow,
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
      const rowIndex = getRequiredRowIndex(rows, schema.rowIdField, payload.rowId, options.id);
      const [deletedRow] = rows.splice(rowIndex, 1);
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

function getRowId(
  row: GridRowModel,
  rowIdField: string,
  dataSourceId: string,
  operation: 'createRow' | 'updateRow' | 'deleteRow',
): GridRowId {
  const rowId = row[rowIdField] as GridRowId | undefined;

  if (rowId == null) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The "${operation}" operation received a row without "${rowIdField}" for data source "${dataSourceId}".
This prevents the CSV data source from identifying the row to mutate.
Include the configured rowIdField in the row payload.`,
    );
  }

  return rowId;
}

function getRowIndex<R extends GridValidRowModel>(rows: R[], rowIdField: string, rowId: GridRowId) {
  return rows.findIndex((row) => row[rowIdField] === rowId);
}

function getRequiredRowIndex<R extends GridValidRowModel>(
  rows: R[],
  rowIdField: string,
  rowId: GridRowId,
  dataSourceId: string,
) {
  const rowIndex = getRowIndex(rows, rowIdField, rowId);

  if (rowIndex === -1) {
    throw new DataStudioServerError(
      `MUI X Data Studio: Cannot find row "${String(rowId)}" in data source "${dataSourceId}".
This prevents the CSV data source from mutating an unknown row.
Use a rowId returned by the data source before calling row mutation endpoints.`,
      404,
    );
  }

  return rowIndex;
}
