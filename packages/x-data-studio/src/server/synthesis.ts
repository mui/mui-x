import type { GridColDef, GridRowsProp, GridSortModel, GridValidRowModel } from '@mui/x-data-grid';
import type {
  DataStudioDataSourceAccessors,
  DataStudioGetRowsParams,
  DataStudioGetRowsResponse,
  DataStudioPivotColumn,
  DataStudioPivotModel,
} from '../models';
import { DataStudioServerError } from './errors';
import type { DataStudioComputedFields } from './types';

export const DATA_STUDIO_GROUP_KEY_FIELD = '__dataStudioGroupKey';
export const DATA_STUDIO_CHILDREN_COUNT_FIELD = '__dataStudioChildrenCount';
export const DATA_STUDIO_SYNTHETIC_ID_FIELD = '__dataStudioSyntheticId';
export const DATA_STUDIO_PIVOT_FIELD_SEPARATOR = '>->';

type DataStudioAggregationFunctionName =
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'size'
  | 'sizeTrue'
  | 'sizeFalse';

type DataStudioAggregationModel = Record<string, string>;

interface DataStudioSynthesisOptions<R extends GridValidRowModel = any> {
  rowIdField?: string;
  computedFields?: DataStudioComputedFields<R>;
  extraFields?: string[];
}

export function getDataStudioSynthesisAccessors(
  accessors: DataStudioDataSourceAccessors | undefined,
): DataStudioDataSourceAccessors {
  return {
    groupKeyField: DATA_STUDIO_GROUP_KEY_FIELD,
    childrenCountField: DATA_STUDIO_CHILDREN_COUNT_FIELD,
    aggregatedValueFieldPattern: '{field}',
    ...accessors,
  };
}

export function hasDataStudioSynthesis(params: DataStudioGetRowsParams) {
  return (
    Boolean(params.pivotModel) ||
    Boolean(params.groupFields?.length) ||
    Object.keys(params.aggregationModel ?? {}).length > 0
  );
}

export function getComputedFieldNames(computedFields: DataStudioComputedFields | undefined) {
  return Object.keys(computedFields ?? {});
}

export function addComputedFieldColumns<R extends GridValidRowModel>(
  columns: GridColDef<R>[],
  computedFields: DataStudioComputedFields<R> | undefined,
): GridColDef<R>[] {
  const existingFields = new Set(columns.map((column) => column.field));
  const computedColumns = getComputedFieldNames(computedFields)
    .filter((field) => !existingFields.has(field))
    .map((field) => ({ field }) as GridColDef<R>);

  return columns.concat(computedColumns);
}

export function applyComputedFields<R extends GridValidRowModel>(
  rows: GridRowsProp<R>,
  computedFields: DataStudioComputedFields<R> | undefined,
) {
  const entries = Object.entries(computedFields ?? {}).filter(([, computedField]) =>
    Boolean(computedField.valueGetter),
  );

  if (entries.length === 0) {
    return [...rows];
  }

  return rows.map((row) => {
    const nextRow = { ...row };

    entries.forEach(([field, computedField]) => {
      nextRow[field as keyof R] = computedField.valueGetter!(row) as R[keyof R];
    });

    return nextRow;
  });
}

function getPaginationRange(params: DataStudioGetRowsParams) {
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
  return String(value ?? '');
}

function normalizeString(value: unknown) {
  return stringify(value).toLowerCase();
}

function getAllowedFields(
  columns: GridColDef[],
  rowIdField: string | undefined,
  extraFields: string[],
) {
  return new Set([
    ...columns.map((column) => column.field),
    ...extraFields,
    DATA_STUDIO_GROUP_KEY_FIELD,
    DATA_STUDIO_CHILDREN_COUNT_FIELD,
    DATA_STUDIO_SYNTHETIC_ID_FIELD,
    ...(rowIdField ? [rowIdField] : []),
  ]);
}

function assertKnownSynthesisField(field: string, allowedFields: Set<string>) {
  if (!allowedFields.has(field)) {
    throw new DataStudioServerError(
      `MUI X Data Studio: Unknown field "${field}" in a grouped, aggregated, or pivoted request.
This prevents Data Studio from synthesizing a server-side response safely.
Expose the field in the Data Studio schema or define it as a computed field.`,
    );
  }
}

export function assertDataStudioAggregationFunction(
  aggregationFunction: string,
): asserts aggregationFunction is DataStudioAggregationFunctionName {
  if (
    aggregationFunction !== 'sum' &&
    aggregationFunction !== 'avg' &&
    aggregationFunction !== 'min' &&
    aggregationFunction !== 'max' &&
    aggregationFunction !== 'size' &&
    aggregationFunction !== 'sizeTrue' &&
    aggregationFunction !== 'sizeFalse'
  ) {
    throw new DataStudioServerError(
      `MUI X Data Studio: Unsupported aggregation function "${aggregationFunction}".
This prevents Data Studio from synthesizing server-side aggregated values.
Use one of the built-in aggregation functions: sum, avg, min, max, size, sizeTrue, or sizeFalse.`,
    );
  }
}

export function getDataStudioAggregationFunction(
  aggregationFunction: unknown,
): DataStudioAggregationFunctionName {
  const normalizedAggregationFunction = String(aggregationFunction || 'sum');

  assertDataStudioAggregationFunction(normalizedAggregationFunction);

  return normalizedAggregationFunction;
}

function aggregateValues(values: unknown[], aggregationFunction: string) {
  const normalizedAggregationFunction = getDataStudioAggregationFunction(aggregationFunction);

  switch (normalizedAggregationFunction) {
    case 'sum':
      return values.reduce<number>((sum, value) => {
        return typeof value === 'number' && !Number.isNaN(value) ? sum + value : sum;
      }, 0);
    case 'avg': {
      let sum = 0;
      let valuesCount = 0;

      values.forEach((value) => {
        if (typeof value === 'number' && !Number.isNaN(value)) {
          valuesCount += 1;
          sum += value;
        }
      });

      // Return `null` only when there is no numeric value to average. A valid
      // average of exactly `0` (e.g. `[-5, 5]` or `[0, 0]`) must be reported as
      // `0`, matching SQL `AVG` and the Data Grid's built-in `avg` aggregator.
      if (valuesCount === 0) {
        return null;
      }

      return sum / valuesCount;
    }
    case 'min':
    case 'max': {
      // Seed from the first non-null value rather than `±Infinity` so the
      // comparison stays type-generic: this matches SQL `MIN`/`MAX` and the
      // Data Grid's built-in comparators for text and date columns, not just
      // numbers. `null`/`undefined` are skipped (SQL ignores NULLs).
      let result: any = null;
      let hasValidValue = false;

      values.forEach((value) => {
        if (value == null) {
          return;
        }
        if (!hasValidValue) {
          result = value;
          hasValidValue = true;
          return;
        }
        const isMore = (value as any) > result;
        const isLess = (value as any) < result;
        if (normalizedAggregationFunction === 'min' ? isLess : isMore) {
          result = value;
        }
      });

      return hasValidValue ? result : null;
    }
    case 'size':
      return values.filter((value) => typeof value !== 'undefined').length;
    case 'sizeTrue':
      return values.filter((value) => value === true).length;
    case 'sizeFalse':
      return values.filter((value) => value === false).length;
    default:
      throw /* minify-error-disabled */ new Error('MUI X: Unreachable');
  }
}

function aggregateRows<R extends GridValidRowModel>(
  rows: R[],
  aggregationModel: DataStudioAggregationModel | undefined,
  allowedFields: Set<string>,
) {
  const aggregateRow: GridValidRowModel = {};

  Object.entries(aggregationModel ?? {}).forEach(([field, aggregationFunction]) => {
    assertKnownSynthesisField(field, allowedFields);
    aggregateRow[field] = aggregateValues(
      rows.map((row) => row[field]),
      aggregationFunction,
    );
  });

  return aggregateRow;
}

export function getDataStudioPivotValues(pivotModel: DataStudioPivotModel | undefined) {
  return (pivotModel?.values ?? []).map((value) => ({
    field: value.field,
    aggregationFunction: getDataStudioAggregationFunction(value.aggFunc),
  }));
}

export function getDataStudioPivotColumnFields(pivotModel: DataStudioPivotModel | undefined) {
  return pivotModel?.columns?.map((column) => column.field) ?? [];
}

export function getDataStudioPivotRowFields(pivotModel: DataStudioPivotModel | undefined) {
  return pivotModel?.rows?.map((row) => row.field) ?? [];
}

function getPivotPath<R extends GridValidRowModel>(row: R, pivotColumnFields: string[]) {
  return pivotColumnFields.map((field) => stringify(row[field]));
}

export function getDataStudioPivotValueField(path: string[], valueField: string) {
  return path.length === 0
    ? valueField
    : path.concat(valueField).join(DATA_STUDIO_PIVOT_FIELD_SEPARATOR);
}

function compareRowsByFields<R extends GridValidRowModel>(
  a: R,
  b: R,
  sortModel: GridSortModel,
  allowedFields: Set<string>,
) {
  for (const sortItem of sortModel) {
    assertKnownSynthesisField(sortItem.field, allowedFields);

    const comparison = normalizeString(a[sortItem.field]).localeCompare(
      normalizeString(b[sortItem.field]),
      undefined,
      {
        numeric: true,
        sensitivity: 'base',
      },
    );

    if (comparison !== 0) {
      return sortItem.sort === 'desc' ? -comparison : comparison;
    }
  }

  return 0;
}

function sortRows<R extends GridValidRowModel>(
  rows: R[],
  sortModel: GridSortModel,
  allowedFields: Set<string>,
) {
  if (sortModel.length === 0) {
    return rows;
  }

  return [...rows].sort((a, b) => compareRowsByFields(a, b, sortModel, allowedFields));
}

function sliceRows<R extends GridValidRowModel>(rows: R[], params: DataStudioGetRowsParams) {
  const { offset, limit } = getPaginationRange(params);
  return limit === 0 ? [] : rows.slice(offset, offset + limit);
}

function padTwo(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

// Server-side date bucket (mirrors `viewRegistry/binning.ts` `dateBucket`), used by
// the in-memory adapter so a CSV/in-memory source can group a date column by month
// etc. over the whole dataset. Operates on any JS-parseable date.
function dateBinValue(
  value: unknown,
  granularity: 'day' | 'month' | 'quarter' | 'year',
): string | null {
  if (value == null || value === '') {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value as string | number);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  switch (granularity) {
    case 'year':
      return `${year}`;
    case 'quarter':
      return `${year}-Q${Math.floor(month / 3) + 1}`;
    case 'day':
      return `${year}-${padTwo(month + 1)}-${padTwo(date.getDate())}`;
    case 'month':
    default:
      return `${year}-${padTwo(month + 1)}`;
  }
}

type NumericExtent = { min: number; max: number } | null;

function numericExtentOf<R extends GridValidRowModel>(rows: R[], field: string): NumericExtent {
  let min = Infinity;
  let max = -Infinity;
  for (const row of rows) {
    const value = Number(row[field]);
    if (Number.isFinite(value)) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }
  return Number.isFinite(min) && Number.isFinite(max) ? { min, max } : null;
}

// The bracket lower bound for a numeric value, rounded to match the knex adapter
// (0 decimals when the bin width is >= 1, else 2).
function numericBinValue(value: unknown, min: number, max: number, bins: number): number | null {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  if (max <= min || bins <= 1) {
    return min;
  }
  const width = (max - min) / bins;
  let index = Math.floor((numeric - min) / width);
  if (index >= bins) {
    index = bins - 1;
  }
  if (index < 0) {
    index = 0;
  }
  const decimals = width >= 1 ? 0 : 2;
  const factor = 10 ** decimals;
  return Math.round((min + index * width) * factor) / factor;
}

// The group value for a row + field: the date/numeric bucket when a binning
// directive is declared, else the raw stringified value. `extent` is the numeric
// column range, precomputed once per grouping level.
function getSynthesisGroupValue(
  row: GridValidRowModel,
  field: string,
  binning: DataStudioGetRowsParams['binning'],
  extent: NumericExtent,
) {
  const directive = binning?.[field];
  if (directive?.kind === 'date') {
    return dateBinValue(row[field], directive.granularity) ?? '';
  }
  if (directive?.kind === 'numeric') {
    if (!extent) {
      return '';
    }
    const bucket = numericBinValue(row[field], extent.min, extent.max, directive.bins);
    return bucket == null ? '' : String(bucket);
  }
  return stringify(row[field]);
}

function scopeRowsByGroupKeys<R extends GridValidRowModel>(
  rows: R[],
  groupFields: string[],
  groupKeys: string[],
  binning: DataStudioGetRowsParams['binning'],
) {
  const extents = groupKeys.map((_, index) =>
    binning?.[groupFields[index]]?.kind === 'numeric'
      ? numericExtentOf(rows, groupFields[index])
      : null,
  );
  return rows.filter((row) =>
    groupKeys.every(
      (groupKey, index) =>
        getSynthesisGroupValue(row, groupFields[index], binning, extents[index]) === groupKey,
    ),
  );
}

function groupByField<R extends GridValidRowModel>(
  rows: R[],
  field: string,
  binning: DataStudioGetRowsParams['binning'],
) {
  const extent = binning?.[field]?.kind === 'numeric' ? numericExtentOf(rows, field) : null;
  const groups = new Map<string, R[]>();

  rows.forEach((row) => {
    const groupKey = getSynthesisGroupValue(row, field, binning, extent);
    const groupRows = groups.get(groupKey);

    if (groupRows) {
      groupRows.push(row);
    } else {
      groups.set(groupKey, [row]);
    }
  });

  return groups;
}

export function createDataStudioSyntheticGroupId(groupFields: string[], groupKeys: string[]) {
  return ['data-studio-group', ...groupFields.slice(0, groupKeys.length), ...groupKeys].join('/');
}

function assertGroupFields(groupFields: string[], allowedFields: Set<string>) {
  groupFields.forEach((field) => assertKnownSynthesisField(field, allowedFields));
}

function assertPivotModel(
  pivotModel: DataStudioPivotModel | undefined,
  allowedFields: Set<string>,
) {
  getDataStudioPivotRowFields(pivotModel).forEach((field) =>
    assertKnownSynthesisField(field, allowedFields),
  );
  getDataStudioPivotColumnFields(pivotModel).forEach((field) =>
    assertKnownSynthesisField(field, allowedFields),
  );
  getDataStudioPivotValues(pivotModel).forEach((value) => {
    assertKnownSynthesisField(value.field, allowedFields);
    assertDataStudioAggregationFunction(value.aggregationFunction);
  });
}

function sortPivotTuples(tuples: string[][], pivotModel: DataStudioPivotModel | undefined) {
  const pivotColumns = pivotModel?.columns ?? [];

  return [...tuples].sort((a, b) => {
    for (let index = 0; index < pivotColumns.length; index += 1) {
      const sort = pivotColumns[index].sort;

      if (!sort) {
        continue;
      }

      const comparison = normalizeString(a[index]).localeCompare(
        normalizeString(b[index]),
        undefined,
        {
          numeric: true,
          sensitivity: 'base',
        },
      );

      if (comparison !== 0) {
        return sort === 'desc' ? -comparison : comparison;
      }
    }

    return 0;
  });
}

export function buildDataStudioPivotColumnTree(tuples: string[][]): DataStudioPivotColumn[] {
  const nodes: DataStudioPivotColumn[] = [];
  const nodeLookup = new Map<string, DataStudioPivotColumn>();

  tuples.forEach((tuple) => {
    let parentKey = '';
    let children = nodes;

    tuple.forEach((key) => {
      const lookupKey = `${parentKey}/${key}`;
      let node = nodeLookup.get(lookupKey);

      if (!node) {
        node = { key, group: key };
        nodeLookup.set(lookupKey, node);
        children.push(node);
      }

      parentKey = lookupKey;
      node.children ??= [];
      children = node.children;
    });
  });

  const trimEmptyChildren = (node: DataStudioPivotColumn) => {
    if (node.children?.length) {
      node.children.forEach(trimEmptyChildren);
    } else {
      delete node.children;
    }
  };

  nodes.forEach(trimEmptyChildren);
  return nodes;
}

function getPivotTuples<R extends GridValidRowModel>(
  rows: R[],
  pivotModel: DataStudioPivotModel | undefined,
) {
  const pivotColumnFields = getDataStudioPivotColumnFields(pivotModel);
  const tupleLookup = new Map<string, string[]>();

  if (pivotColumnFields.length === 0) {
    return [];
  }

  rows.forEach((row) => {
    const tuple = getPivotPath(row, pivotColumnFields);
    tupleLookup.set(JSON.stringify(tuple), tuple);
  });

  return sortPivotTuples([...tupleLookup.values()], pivotModel);
}

function aggregatePivotValues<R extends GridValidRowModel>(
  rows: R[],
  pivotModel: DataStudioPivotModel | undefined,
  pivotTuples: string[][],
  allowedFields: Set<string>,
) {
  const pivotColumnFields = getDataStudioPivotColumnFields(pivotModel);
  const pivotValues = getDataStudioPivotValues(pivotModel);
  const aggregateRow: GridValidRowModel = {};
  const tuples = pivotColumnFields.length === 0 ? [[]] : pivotTuples;

  pivotValues.forEach((value) => {
    assertKnownSynthesisField(value.field, allowedFields);
    assertDataStudioAggregationFunction(value.aggregationFunction);

    tuples.forEach((tuple) => {
      const tupleRows =
        tuple.length === 0
          ? rows
          : rows.filter((row) =>
              pivotColumnFields.every((field, index) => stringify(row[field]) === tuple[index]),
            );
      const outputField = getDataStudioPivotValueField(tuple, value.field);

      aggregateRow[outputField] = aggregateValues(
        tupleRows.map((row) => row[value.field]),
        value.aggregationFunction,
      );
    });
  });

  return aggregateRow;
}

function getDataStudioLeafGroupKey(row: GridValidRowModel, rowIdField: string | undefined) {
  return row[rowIdField ?? 'id'] ?? row.id ?? row[DATA_STUDIO_SYNTHETIC_ID_FIELD];
}

function hydrateDataStudioSyntheticLeafRows<R extends GridValidRowModel>(
  rows: R[],
  rowIdField: string | undefined,
) {
  return rows.map((row) => ({
    ...row,
    [DATA_STUDIO_GROUP_KEY_FIELD]: getDataStudioLeafGroupKey(row, rowIdField),
  }));
}

function applyRowGrouping<R extends GridValidRowModel>(
  rows: R[],
  params: DataStudioGetRowsParams,
  columns: GridColDef[],
  allowedFields: Set<string>,
  options: DataStudioSynthesisOptions<R>,
): DataStudioGetRowsResponse {
  const groupFields = params.groupFields ?? [];
  const groupKeys = params.groupKeys ?? [];
  const scopedRows = scopeRowsByGroupKeys(rows, groupFields, groupKeys, params.binning);
  const currentGroupField = groupFields[groupKeys.length];
  const aggregateRow = aggregateRows(scopedRows, params.aggregationModel, allowedFields);

  assertGroupFields(groupFields, allowedFields);

  if (!currentGroupField) {
    const sortedRows = sortRows(scopedRows, params.sortModel ?? [], allowedFields);

    return {
      rows: hydrateDataStudioSyntheticLeafRows(sliceRows(sortedRows, params), options.rowIdField),
      rowCount: sortedRows.length,
      ...(Object.keys(aggregateRow).length > 0 ? { aggregateRow } : {}),
    };
  }

  const groupedRows = [...groupByField(scopedRows, currentGroupField, params.binning)].map(
    ([groupKey, groupRows]) => {
      const nextGroupKeys = groupKeys.concat(groupKey);
      // Do NOT set `[options.rowIdField]` here — it would surface the synthetic
      // id in the visible row-id column. The client picks the synthetic id from
      // `__dataStudioSyntheticId` via `getRowId`.
      const row: GridValidRowModel = {
        [DATA_STUDIO_SYNTHETIC_ID_FIELD]: createDataStudioSyntheticGroupId(
          groupFields,
          nextGroupKeys,
        ),
        [DATA_STUDIO_GROUP_KEY_FIELD]: groupKey,
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: groupRows.length,
        [currentGroupField]: groupKey,
        ...aggregateRows(groupRows, params.aggregationModel, allowedFields),
      };

      groupKeys.forEach((ancestorGroupKey, index) => {
        row[groupFields[index]] = ancestorGroupKey;
      });

      return row;
    },
  );
  const sortedRows = sortRows(groupedRows, params.sortModel ?? [], allowedFields);

  return {
    rows: sliceRows(sortedRows, params),
    rowCount: sortedRows.length,
    ...(Object.keys(aggregateRow).length > 0 ? { aggregateRow } : {}),
  };
}

function pivotLeafRows<R extends GridValidRowModel>(
  rows: R[],
  params: DataStudioGetRowsParams,
  pivotModel: DataStudioPivotModel,
  pivotTuples: string[][],
  allowedFields: Set<string>,
  rowIdField: string | undefined,
) {
  const pivotColumnFields = getDataStudioPivotColumnFields(pivotModel);
  const pivotValues = getDataStudioPivotValues(pivotModel);

  return hydrateDataStudioSyntheticLeafRows(
    sortRows(rows, params.sortModel ?? [], allowedFields),
    rowIdField,
  ).map((row) => {
    const nextRow: GridValidRowModel = { ...row };

    pivotValues.forEach((value) => {
      const tuple = getPivotPath(row, pivotColumnFields);
      const tupleKnown =
        pivotColumnFields.length === 0 ||
        pivotTuples.some((pivotTuple) => JSON.stringify(pivotTuple) === JSON.stringify(tuple));
      const outputField = getDataStudioPivotValueField(tuple, value.field);

      if (tupleKnown) {
        nextRow[outputField] = row[value.field];
      }
    });

    return nextRow;
  });
}

function applyPivoting<R extends GridValidRowModel>(
  rows: R[],
  params: DataStudioGetRowsParams,
  allowedFields: Set<string>,
  options: DataStudioSynthesisOptions<R>,
): DataStudioGetRowsResponse {
  const pivotModel = params.pivotModel!;
  const rowFields = getDataStudioPivotRowFields(pivotModel);
  const groupKeys = params.groupKeys ?? [];
  const scopedRows = scopeRowsByGroupKeys(rows, rowFields, groupKeys, params.binning);
  const pivotTuples = getPivotTuples(scopedRows, pivotModel);
  const pivotColumns = buildDataStudioPivotColumnTree(pivotTuples);
  const aggregateRow = aggregatePivotValues(scopedRows, pivotModel, pivotTuples, allowedFields);
  const currentGroupField = rowFields[groupKeys.length];

  assertPivotModel(pivotModel, allowedFields);

  if (rowFields.length === 0) {
    const row = {
      [DATA_STUDIO_SYNTHETIC_ID_FIELD]: 'data-studio-pivot-root',
      ...aggregateRow,
    };

    return {
      rows: [row],
      rowCount: 1,
      aggregateRow,
      pivotColumns,
    };
  }

  if (!currentGroupField) {
    const leafRows = pivotLeafRows(
      scopedRows,
      params,
      pivotModel,
      pivotTuples,
      allowedFields,
      options.rowIdField,
    );

    return {
      rows: sliceRows(leafRows, params),
      rowCount: leafRows.length,
      aggregateRow,
      pivotColumns,
    };
  }

  const groupedRows = [...groupByField(scopedRows, currentGroupField, params.binning)].map(
    ([groupKey, groupRows]) => {
      const nextGroupKeys = groupKeys.concat(groupKey);
      // Synthetic id stays on `__dataStudioSyntheticId` only — see comment in
      // `applyRowGrouping`.
      const row: GridValidRowModel = {
        [DATA_STUDIO_SYNTHETIC_ID_FIELD]: createDataStudioSyntheticGroupId(
          rowFields,
          nextGroupKeys,
        ),
        [DATA_STUDIO_GROUP_KEY_FIELD]: groupKey,
        [DATA_STUDIO_CHILDREN_COUNT_FIELD]: groupRows.length,
        [currentGroupField]: groupKey,
        ...aggregatePivotValues(groupRows, pivotModel, pivotTuples, allowedFields),
      };

      groupKeys.forEach((ancestorGroupKey, index) => {
        row[rowFields[index]] = ancestorGroupKey;
      });

      return row;
    },
  );
  const sortedRows = sortRows(groupedRows, params.sortModel ?? [], allowedFields);

  return {
    rows: sliceRows(sortedRows, params),
    rowCount: sortedRows.length,
    aggregateRow,
    pivotColumns,
  };
}

export function applyDataStudioSynthesis<R extends GridValidRowModel>(
  rows: GridRowsProp<R>,
  params: DataStudioGetRowsParams,
  columns: GridColDef<R>[],
  options: DataStudioSynthesisOptions<R> = {},
): DataStudioGetRowsResponse {
  const allowedFields = getAllowedFields(columns, options.rowIdField, [
    ...getComputedFieldNames(options.computedFields),
    ...(options.extraFields ?? []),
  ]);
  const sourceRows = [...rows] as R[];

  if (params.pivotModel) {
    return applyPivoting(sourceRows, params, allowedFields, options);
  }

  if (params.groupFields?.length) {
    return applyRowGrouping(sourceRows, params, columns, allowedFields, options);
  }

  const sortedRows = sortRows(sourceRows, params.sortModel ?? [], allowedFields);
  const aggregateRow = aggregateRows(sourceRows, params.aggregationModel, allowedFields);

  return {
    rows: sliceRows(sortedRows, params),
    rowCount: sortedRows.length,
    ...(Object.keys(aggregateRow).length > 0 ? { aggregateRow } : {}),
  };
}
