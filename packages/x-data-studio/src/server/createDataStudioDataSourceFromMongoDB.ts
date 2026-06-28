import type { GridRowId, GridRowModel, GridValidRowModel } from '@mui/x-data-grid';
import type {
  DataStudioMongoCollectionLike,
  DataStudioRequestContext,
  DataStudioServerDataSource,
  DataStudioSourceBaseOptions,
} from './types';
import {
  assertAutoSchemaAllowed,
  assertMutationEnabled,
  assertRowIdField,
  createColumnsFromRow,
  createDefaultDescriptor,
  getAllowedFields,
  getConfiguredColumns,
  isMutationEnabled,
  runDataStudioSourceAfterHook,
  runDataStudioSourceBeforeHook,
} from './utils';
import { DataStudioServerError } from './errors';
import { addComputedFieldColumns, getDataStudioSynthesisAccessors } from './synthesis';
import { getMongoDataStudioRows } from './mongoDataSourceRows';

export interface CreateDataStudioDataSourceFromMongoDBOptions<
  R extends GridValidRowModel = any,
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
> extends DataStudioSourceBaseOptions<R, TContext> {
  collection: DataStudioMongoCollectionLike;
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
This prevents the MongoDB data source from identifying the row to mutate.
Include the configured rowIdField in the row payload.`,
    );
  }

  return rowId;
}

function getRequiredCollectionMethod<TMethod extends keyof DataStudioMongoCollectionLike>(
  collection: DataStudioMongoCollectionLike,
  method: TMethod,
  dataSourceId: string,
) {
  const collectionMethod = collection[method];

  if (!collectionMethod) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The MongoDB collection for data source "${dataSourceId}" does not implement ${String(method)}().
This prevents the MongoDB adapter from handling the requested row mutation.
Pass a collection object that supports ${String(method)}() before enabling row mutations.`,
    );
  }

  return collectionMethod;
}

async function getRequiredMongoRow(
  collection: DataStudioMongoCollectionLike,
  rowIdField: string,
  rowId: GridRowId,
  dataSourceId: string,
) {
  const findOne = getRequiredCollectionMethod(collection, 'findOne', dataSourceId);
  const row = await findOne.call(collection, { [rowIdField]: rowId });

  if (!row) {
    throw new DataStudioServerError(
      `MUI X Data Studio: Cannot find row "${String(rowId)}" in data source "${dataSourceId}".
This prevents the MongoDB data source from mutating an unknown row.
Use a rowId returned by the data source before calling row mutation endpoints.`,
      404,
    );
  }

  return row;
}

export function createDataStudioDataSourceFromMongoDB<
  R extends GridValidRowModel = any,
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
>(
  options: CreateDataStudioDataSourceFromMongoDBOptions<R, TContext>,
): DataStudioServerDataSource<R, TContext> {
  const dataSource: DataStudioServerDataSource<R, TContext> = {
    id: options.id,

    async getSchema() {
      const sample = (await options.collection.findOne?.()) as R | null | undefined;
      const configuredColumns = getConfiguredColumns(options);

      if (!configuredColumns) {
        assertAutoSchemaAllowed(options);
      }

      const columns = addComputedFieldColumns(
        configuredColumns ?? createColumnsFromRow(sample ?? undefined, options.hiddenFields),
        options.computedFields,
      );
      const rowCount = await options.collection.countDocuments({});
      const accessors = getDataStudioSynthesisAccessors(
        options.schema?.accessors ?? options.accessors,
      );

      return createDefaultDescriptor({
        ...options,
        schema: options.schema ? { ...options.schema, accessors } : undefined,
        accessors,
        columns,
        rowCount,
      });
    },

    async getRows(params) {
      const schema = await this.getSchema();

      return getMongoDataStudioRows(options, params, schema.columns, schema.rowIdField);
    },
  };

  if (isMutationEnabled(options, 'createRow')) {
    dataSource.createRow = async (params, context) => {
      assertMutationEnabled(options, 'createRow');
      const schema = await dataSource.getSchema();
      assertRowIdField(schema.rowIdField, options.id, 'createRow');
      const allowedFields = getAllowedFields(schema.columns, schema.rowIdField);
      const insertOne = getRequiredCollectionMethod(options.collection, 'insertOne', options.id);
      const payload = await runDataStudioSourceBeforeHook(options, {
        operation: 'createRow',
        dataSourceId: options.id,
        context,
        payload: params,
      });
      const row = pickKnownFields(payload.row, allowedFields);
      const rowId = getRequiredRowId(row, schema.rowIdField, options.id, 'createRow');

      await insertOne.call(options.collection, row);

      const result = await getRequiredMongoRow(
        options.collection,
        schema.rowIdField,
        rowId,
        options.id,
      );
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
      const updateOne = getRequiredCollectionMethod(options.collection, 'updateOne', options.id);
      const payload = await runDataStudioSourceBeforeHook(options, {
        operation: 'updateRow',
        dataSourceId: options.id,
        context,
        payload: params,
      });

      await getRequiredMongoRow(options.collection, schema.rowIdField, payload.rowId, options.id);
      await updateOne.call(
        options.collection,
        { [schema.rowIdField]: payload.rowId },
        { $set: pickKnownFields(payload.updatedRow, allowedFields) },
      );

      const result = await getRequiredMongoRow(
        options.collection,
        schema.rowIdField,
        payload.rowId,
        options.id,
      );
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
      const deleteOne = getRequiredCollectionMethod(options.collection, 'deleteOne', options.id);
      const payload = await runDataStudioSourceBeforeHook(options, {
        operation: 'deleteRow',
        dataSourceId: options.id,
        context,
        payload: params,
      });
      const deletedRow = await getRequiredMongoRow(
        options.collection,
        schema.rowIdField,
        payload.rowId,
        options.id,
      );

      await deleteOne.call(options.collection, { [schema.rowIdField]: payload.rowId });

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
