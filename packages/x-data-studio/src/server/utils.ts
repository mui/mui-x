import type {
  GridColDef,
  GridFilterItem,
  GridRowsProp,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { GridLogicOperator } from '@mui/x-data-grid';
import {
  DATA_STUDIO_PROTOCOL_VERSION,
  type DataStudioDataSourceAccessors,
  type DataStudioDataSourceCapabilities,
  type DataStudioDataSourceDescriptor,
  type DataStudioGetRowsParams,
  type DataStudioRowMutationAction,
} from '../models';
import { DataStudioServerError } from './errors';
import type {
  DataStudioRequestContext,
  DataStudioComputedFields,
  DataStudioSourceBaseOptions,
  DataStudioSourceHookParams,
} from './types';
import { applyComputedFields, applyDataStudioSynthesis, hasDataStudioSynthesis } from './synthesis';

export const DEFAULT_DATA_STUDIO_CAPABILITIES: DataStudioDataSourceCapabilities = {
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
};

export function isMutationEnabled(
  options: Pick<DataStudioSourceBaseOptions, 'mutations'>,
  operation: DataStudioRowMutationAction,
) {
  if (options.mutations === true) {
    return true;
  }

  if (options.mutations == null || options.mutations === false) {
    return false;
  }

  return options.mutations[operation] === true;
}

function getMutationCapabilities(options: Pick<DataStudioSourceBaseOptions, 'mutations'>) {
  const capabilities = {
    createRow: isMutationEnabled(options, 'createRow'),
    updateRow: isMutationEnabled(options, 'updateRow'),
    deleteRow: isMutationEnabled(options, 'deleteRow'),
  };

  return {
    ...capabilities,
    editing: capabilities.createRow || capabilities.updateRow || capabilities.deleteRow,
  };
}

function getAccessorCapabilities(accessors: DataStudioDataSourceAccessors | undefined) {
  const hasGroupingAccessors = Boolean(accessors?.groupKeyField || accessors?.childrenCountField);
  const hasAggregationAccessors = Boolean(
    accessors?.aggregatedValueFields || accessors?.aggregatedValueFieldPattern,
  );

  return {
    rowGrouping: hasGroupingAccessors,
    aggregation: hasAggregationAccessors,
    pivoting: hasGroupingAccessors && hasAggregationAccessors,
  };
}

export function createDefaultDescriptor<
  R extends GridValidRowModel,
  TContext extends DataStudioRequestContext = DataStudioRequestContext,
>(
  options: DataStudioSourceBaseOptions<R, TContext> & {
    columns: GridColDef<R>[];
    rowCount?: number;
  },
): DataStudioDataSourceDescriptor<R> {
  const accessors = options.schema?.accessors ?? options.accessors;

  return {
    id: options.id,
    label: options.schema?.label ?? options.label ?? options.id,
    columns: options.schema?.columns ?? options.columns,
    rowIdField: options.schema?.rowIdField ?? options.rowIdField,
    rowCount: options.rowCount,
    capabilities: {
      ...DEFAULT_DATA_STUDIO_CAPABILITIES,
      ...getAccessorCapabilities(accessors),
      ...options.schema?.capabilities,
      ...getMutationCapabilities(options),
    },
    accessors,
    endpoints: options.schema?.endpoints,
    joinGroup: options.joinGroup,
    meta: options.schema?.meta,
  };
}

export async function runDataStudioSourceBeforeHook<
  TPayload,
  TContext extends DataStudioRequestContext,
>(
  options: DataStudioSourceBaseOptions<any, TContext>,
  params: DataStudioSourceHookParams<TPayload, unknown, TContext>,
) {
  const nextPayload = await options.hooks?.onBefore?.(params);
  return (nextPayload ?? params.payload) as TPayload;
}

export async function runDataStudioSourceAfterHook<
  TPayload,
  TResult,
  TContext extends DataStudioRequestContext,
>(
  options: DataStudioSourceBaseOptions<any, TContext>,
  params: DataStudioSourceHookParams<TPayload, TResult, TContext>,
) {
  const nextResult = await options.hooks?.onAfter?.(params);
  return (nextResult ?? params.result) as TResult;
}

export function assertMutationEnabled(
  options: Pick<DataStudioSourceBaseOptions, 'id' | 'mutations'>,
  operation: DataStudioRowMutationAction,
) {
  if (!isMutationEnabled(options, operation)) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The "${operation}" operation is disabled for data source "${options.id}".
This prevents the server from mutating rows unexpectedly.
Enable the operation with the data source mutations option before calling it.`,
      405,
    );
  }
}

export function assertRowIdField(
  rowIdField: string | undefined,
  dataSourceId: string,
  operation: DataStudioRowMutationAction,
): asserts rowIdField is string {
  if (!rowIdField) {
    throw new DataStudioServerError(
      `MUI X Data Studio: The "${operation}" operation requires a rowIdField for data source "${dataSourceId}".
This prevents the server from identifying the row to mutate.
Configure rowIdField before enabling row mutations.`,
    );
  }
}

export function getConfiguredColumns<R extends GridValidRowModel>(
  options: DataStudioSourceBaseOptions<R, any>,
) {
  return options.schema?.columns ?? options.columns;
}

export function assertAutoSchemaAllowed(options: DataStudioSourceBaseOptions<any, any>) {
  if (options.mode === 'strict') {
    throw new DataStudioServerError(
      `MUI X Data Studio: Strict schema mode requires columns for data source "${options.id}".
This prevents Data Studio from auto-deriving a schema that may not match the server contract.
Pass schema.columns or columns, or switch this data source to auto mode.`,
    );
  }
}

// Maps a SQL column affinity (as reported by Knex `columnInfo()` or SQLite
// `PRAGMA table_info`) to the matching Data Grid column `type`. Returns
// `undefined` for unknown/textual affinities so the column defaults to a
// regular string column.
const NUMERIC_AFFINITIES = new Set([
  'int',
  'integer',
  'tinyint',
  'smallint',
  'mediumint',
  'bigint',
  'int2',
  'int4',
  'int8',
  'real',
  'double',
  'double precision',
  'float',
  'numeric',
  'decimal',
]);

export function sqlAffinityToGridType(affinity: string | undefined): 'number' | undefined {
  if (!affinity) {
    return undefined;
  }
  const normalized = affinity.toLowerCase().split('(')[0].trim();
  return NUMERIC_AFFINITIES.has(normalized) ? 'number' : undefined;
}

export interface CreateColumnsFieldInfo {
  type?: string;
}

function buildColumn<R extends GridValidRowModel = any>(
  field: string,
  info?: CreateColumnsFieldInfo,
): GridColDef<R> {
  const column: GridColDef<R> = {
    field,
    headerName: field,
    minWidth: Math.max(120, field.length * 10),
  };
  const type = sqlAffinityToGridType(info?.type);
  if (type) {
    column.type = type;
  }
  return column;
}

export function createColumnsFromRow<R extends GridValidRowModel = any>(
  row: R | undefined,
  hiddenFields: string[] = [],
): GridColDef<R>[] {
  const hiddenFieldLookup = new Set(hiddenFields);

  return Object.keys(row ?? {})
    .filter((field) => !hiddenFieldLookup.has(field))
    .map((field) => buildColumn<R>(field));
}

export function createColumnsFromFields<R extends GridValidRowModel = any>(
  fields: string[],
  hiddenFields: string[] = [],
  columnInfo?: Record<string, CreateColumnsFieldInfo | undefined>,
): GridColDef<R>[] {
  const hiddenFieldLookup = new Set(hiddenFields);

  return fields
    .filter((field) => !hiddenFieldLookup.has(field))
    .map((field) => buildColumn<R>(field, columnInfo?.[field]));
}

export function getAllowedFields(columns: GridColDef[], rowIdField?: string) {
  return new Set([...columns.map((column) => column.field), ...(rowIdField ? [rowIdField] : [])]);
}

export function assertKnownField(field: string, allowedFields: Set<string>) {
  if (!allowedFields.has(field)) {
    throw new DataStudioServerError(
      `MUI X Data Studio: Unknown field "${field}" in the remote data source request.
This prevents Data Studio from safely translating the request to the backend store.
Ensure the client only sends fields exposed by the Data Studio schema.`,
    );
  }
}

export function getPaginationRange(params: DataStudioGetRowsParams) {
  const start = typeof params.start === 'number' ? params.start : Number(params.start);
  const end = params.end;

  if (Number.isFinite(start) && typeof end === 'number') {
    return {
      offset: start,
      limit: Math.max(0, end - start + 1),
    };
  }

  if (params.paginationModel) {
    return {
      offset: params.paginationModel.page * params.paginationModel.pageSize,
      limit: params.paginationModel.pageSize,
    };
  }

  return {
    offset: 0,
    limit: 0,
  };
}

function stringify(value: unknown) {
  return String(value ?? '').toLowerCase();
}

function normalizeArray(value: unknown) {
  return Array.isArray(value) ? value : [value];
}

export function matchesFilterItem(rowValue: unknown, item: GridFilterItem) {
  const value = item.value;
  const rowString = stringify(rowValue);
  const valueString = stringify(value);

  switch (item.operator) {
    case 'contains':
      return rowString.includes(valueString);
    case 'doesNotContain':
      return !rowString.includes(valueString);
    case 'equals':
    case '=':
      return rowString === valueString;
    case 'doesNotEqual':
    case '!=':
      return rowString !== valueString;
    case 'startsWith':
      return rowString.startsWith(valueString);
    case 'endsWith':
      return rowString.endsWith(valueString);
    case 'isEmpty':
      return rowValue == null || rowValue === '';
    case 'isNotEmpty':
      return rowValue != null && rowValue !== '';
    case 'isAnyOf':
      return normalizeArray(value).some((itemValue) => stringify(itemValue) === rowString);
    case '>':
      return Number(rowValue) > Number(value);
    case '>=':
      return Number(rowValue) >= Number(value);
    case '<':
      return Number(rowValue) < Number(value);
    case '<=':
      return Number(rowValue) <= Number(value);
    default:
      throw new DataStudioServerError(
        `MUI X Data Studio: Unsupported filter operator "${item.operator}".
This prevents Data Studio from translating the remote data source request.
Use a supported Data Grid filter operator or add support to the server data source.`,
      );
  }
}

export function applyInMemoryQuery<R extends GridValidRowModel>(
  rows: GridRowsProp<R>,
  params: DataStudioGetRowsParams,
  columns: GridColDef<R>[],
  rowIdField?: string,
  computedFields?: DataStudioComputedFields<R>,
) {
  const allowedFields = getAllowedFields(columns, rowIdField);
  let filteredRows = applyComputedFields(rows, computedFields);
  const filterItems = params.filterModel.items ?? [];

  if (filterItems.length > 0) {
    filteredRows = filteredRows.filter((row) => {
      const results = filterItems.map((item) => {
        assertKnownField(item.field, allowedFields);
        return matchesFilterItem(row[item.field], item);
      });

      return (params.filterModel.logicOperator ?? GridLogicOperator.And) === GridLogicOperator.Or
        ? results.some(Boolean)
        : results.every(Boolean);
    });
  }

  if (params.filterModel.quickFilterValues?.length) {
    const searchableFields = columns.map((column) => column.field);
    const quickFilterLogic = params.filterModel.quickFilterLogicOperator ?? GridLogicOperator.And;

    filteredRows = filteredRows.filter((row) => {
      const quickFilterResults = params.filterModel.quickFilterValues!.map((value) =>
        searchableFields.some((field) => stringify(row[field]).includes(stringify(value))),
      );

      return quickFilterLogic === GridLogicOperator.Or
        ? quickFilterResults.some(Boolean)
        : quickFilterResults.every(Boolean);
    });
  }

  if (hasDataStudioSynthesis(params)) {
    return applyDataStudioSynthesis(filteredRows, params, columns, {
      rowIdField,
      computedFields,
    });
  }

  const sortedRows = sortRows(filteredRows, params.sortModel ?? [], allowedFields);
  const { offset, limit } = getPaginationRange(params);

  return {
    rows: limit === 0 ? [] : sortedRows.slice(offset, offset + limit),
    rowCount: sortedRows.length,
  };
}

function sortRows<R extends GridValidRowModel>(
  rows: R[],
  sortModel: GridSortModel,
  allowedFields: Set<string>,
) {
  if (sortModel.length === 0) {
    return rows;
  }

  sortModel.forEach((sortItem) => assertKnownField(sortItem.field, allowedFields));

  return [...rows].sort((a, b) => {
    for (const sortItem of sortModel) {
      const aValue = a[sortItem.field];
      const bValue = b[sortItem.field];
      const comparison = stringify(aValue).localeCompare(stringify(bValue), undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      if (comparison !== 0) {
        return sortItem.sort === 'desc' ? -comparison : comparison;
      }
    }

    return 0;
  });
}

export function getProtocolVersion() {
  return DATA_STUDIO_PROTOCOL_VERSION;
}
