import type { RefObject } from '@mui/x-internals/types';
import type { GridRowId, GridRowModel } from '@mui/x-data-grid-pro';
import { getVisibleRows } from '@mui/x-data-grid-pro/internals';
import type { GridPrivateApiPremium } from '../../../../models/gridApiPremium';

export type GridDataQueryMode = 'rows' | 'aggregate';
export type GridDataQueryRowFilter = 'visible' | 'selected' | 'all';
export type GridDataAggregationFn = 'sum' | 'avg' | 'min' | 'max' | 'count';

export interface GridDataAggregationRequest {
  field: string;
  fn: GridDataAggregationFn;
}

export interface GridDataQueryInput {
  mode: GridDataQueryMode;
  columns?: string[];
  rowFilter?: GridDataQueryRowFilter;
  limit?: number;
  aggregations?: GridDataAggregationRequest[];
}

export interface GridDataQueryPreviewColumn {
  field: string;
  headerName?: string;
}

export interface GridDataAggregationResult {
  field: string;
  fn: GridDataAggregationFn;
  value: number | null;
}

export interface GridDataQuerySample {
  /** First N visible rows projected to a short, display-friendly set of columns. */
  rows?: Array<Record<string, string>>;
  /** Columns shown in the sample table, in display order. */
  columns?: GridDataQueryPreviewColumn[];
  /** Computed aggregation values, for `mode === 'aggregate'`. */
  aggregations?: GridDataAggregationResult[];
}

export interface GridDataQueryPreview {
  mode: GridDataQueryMode;
  rowFilter: GridDataQueryRowFilter;
  rowCount: number;
  columns: GridDataQueryPreviewColumn[];
  aggregations: GridDataAggregationRequest[];
  willTruncate: boolean;
  /** Cheap, in-browser preview the approval card uses to show what would be sent. */
  sample: GridDataQuerySample;
}

export interface GridDataQueryResult {
  meta: {
    mode: GridDataQueryMode;
    rowFilter: GridDataQueryRowFilter;
    rowCount: number;
    truncatedBy: number;
    columns: GridDataQueryPreviewColumn[];
  };
  rows?: Array<Record<string, unknown>>;
  aggregations?: GridDataAggregationResult[];
}

export const DEFAULT_ROW_LIMIT = 500;

function collectRows(
  apiRef: RefObject<GridPrivateApiPremium>,
  rowFilter: GridDataQueryRowFilter,
): GridRowModel[] {
  if (rowFilter === 'visible') {
    // `getVisibleRows().rows` returns `GridRowEntry` objects (`{id, model}`),
    // not the raw row models — unwrap so downstream field access works.
    const entries = getVisibleRows(apiRef).rows as Array<{ id: GridRowId; model: GridRowModel }>;
    return entries.map((entry) => entry.model);
  }
  if (rowFilter === 'selected') {
    const selectedMap = apiRef.current.getSelectedRows();
    const rows: GridRowModel[] = [];
    selectedMap.forEach((row) => {
      rows.push(row);
    });
    return rows;
  }
  // 'all'
  const allIds = apiRef.current.getAllRowIds();
  return allIds
    .map((id: GridRowId) => apiRef.current.getRow(id))
    .filter((row): row is GridRowModel => row != null);
}

function resolveColumns(
  apiRef: RefObject<GridPrivateApiPremium>,
  requested: string[] | undefined,
): GridDataQueryPreviewColumn[] {
  const lookup = apiRef.current.state.columns?.lookup ?? {};
  const orderedFields = apiRef.current.state.columns?.orderedFields ?? [];
  const visibilityModel = apiRef.current.state.columns?.columnVisibilityModel ?? {};
  const isVisible = (field: string) => visibilityModel[field] !== false;

  const sourceFields =
    requested && requested.length > 0 ? requested : orderedFields.filter(isVisible);

  return sourceFields
    .filter((field) => lookup[field])
    .map((field) => ({
      field,
      headerName: (lookup[field] as { headerName?: string }).headerName,
    }));
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function aggregateRows(
  rows: GridRowModel[],
  aggregations: GridDataAggregationRequest[],
): GridDataAggregationResult[] {
  return aggregations.map(({ field, fn }) => {
    if (fn === 'count') {
      const nonNull = rows.filter((row) => row[field] !== undefined && row[field] !== null).length;
      return { field, fn, value: nonNull };
    }

    const numbers = rows.map((row) => toNumber(row[field])).filter((n): n is number => n !== null);

    if (numbers.length === 0) {
      return { field, fn, value: null };
    }
    if (fn === 'sum') {
      return { field, fn, value: numbers.reduce((a, b) => a + b, 0) };
    }
    if (fn === 'avg') {
      const sum = numbers.reduce((a, b) => a + b, 0);
      return { field, fn, value: sum / numbers.length };
    }
    if (fn === 'min') {
      return { field, fn, value: Math.min(...numbers) };
    }
    return { field, fn, value: Math.max(...numbers) };
  });
}

const SAMPLE_ROW_COUNT = 3;
const SAMPLE_COLUMN_COUNT = 6;
const SAMPLE_CELL_MAX_LEN = 32;

function formatSampleCell(value: unknown): string {
  if (value == null) {
    return '';
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString();
  }
  if (typeof value === 'string') {
    return value.length > SAMPLE_CELL_MAX_LEN
      ? `${value.slice(0, SAMPLE_CELL_MAX_LEN - 1)}…`
      : value;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'object') {
    // Demo datasets occasionally carry `{value, label}` (e.g. country
    // singleSelect). Show the label when present, otherwise truncate JSON.
    const obj = value as { label?: unknown; name?: unknown; value?: unknown };
    if (typeof obj.label === 'string') {
      return formatSampleCell(obj.label);
    }
    if (typeof obj.name === 'string') {
      return formatSampleCell(obj.name);
    }
    if (typeof obj.value === 'string' || typeof obj.value === 'number') {
      return formatSampleCell(obj.value);
    }
    try {
      const json = JSON.stringify(value);
      return formatSampleCell(json);
    } catch {
      return '';
    }
  }
  return String(value);
}

function buildSample(
  input: GridDataQueryInput,
  rows: GridRowModel[],
  columns: GridDataQueryPreviewColumn[],
): GridDataQuerySample {
  if (input.mode === 'aggregate') {
    const aggregations = input.aggregations ?? [];
    if (aggregations.length === 0) {
      return {};
    }
    return { aggregations: aggregateRows(rows, aggregations) };
  }

  if (columns.length === 0 || rows.length === 0) {
    return {};
  }
  const sampleColumns = columns.slice(0, SAMPLE_COLUMN_COUNT);
  const sampleRows = rows.slice(0, SAMPLE_ROW_COUNT).map((row) => {
    const out: Record<string, string> = {};
    sampleColumns.forEach(({ field }) => {
      out[field] = formatSampleCell(row[field]);
    });
    return out;
  });
  return { rows: sampleRows, columns: sampleColumns };
}

export function previewGridDataQuery(
  input: GridDataQueryInput,
  apiRef: RefObject<GridPrivateApiPremium>,
): GridDataQueryPreview {
  const rowFilter: GridDataQueryRowFilter = input.rowFilter ?? 'visible';
  const columns = resolveColumns(apiRef, input.columns);
  const rows = collectRows(apiRef, rowFilter);
  const limit = input.limit ?? DEFAULT_ROW_LIMIT;
  const willTruncate = input.mode === 'rows' && rows.length > limit;

  return {
    mode: input.mode,
    rowFilter,
    rowCount: rows.length,
    columns,
    aggregations: input.aggregations ?? [],
    willTruncate,
    sample: buildSample(input, rows, columns),
  };
}

export function executeGridDataQuery(
  input: GridDataQueryInput,
  apiRef: RefObject<GridPrivateApiPremium>,
): GridDataQueryResult {
  const rowFilter: GridDataQueryRowFilter = input.rowFilter ?? 'visible';
  const columns = resolveColumns(apiRef, input.columns);
  const fields = columns.map((c) => c.field);
  const allRows = collectRows(apiRef, rowFilter);
  const limit = input.limit ?? DEFAULT_ROW_LIMIT;

  const meta = {
    mode: input.mode,
    rowFilter,
    rowCount: allRows.length,
    truncatedBy: 0,
    columns,
  };

  if (input.mode === 'aggregate') {
    return {
      meta,
      aggregations: aggregateRows(allRows, input.aggregations ?? []),
    };
  }

  const limitedRows = allRows.length > limit ? allRows.slice(0, limit) : allRows;
  if (allRows.length > limit) {
    meta.truncatedBy = allRows.length - limit;
  }

  const rows = limitedRows.map((row) => {
    const out: Record<string, unknown> = {};
    fields.forEach((field) => {
      out[field] = row[field];
    });
    return out;
  });

  return { meta, rows };
}
