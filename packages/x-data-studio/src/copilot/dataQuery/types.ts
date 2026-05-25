import type { GridRowModel } from '@mui/x-data-grid';

/**
 * Input shape for `queryStudioData`. Intentionally minimal in v1 — the agent
 * picks a dataset and an optional row limit; the data layer returns the
 * dataset's static rows (no filter / sort / aggregation yet).
 */
export interface StudioDataQueryInput {
  datasetId: string;
  limit?: number;
}

export interface StudioDataQueryColumnMeta {
  field: string;
  headerName?: string;
}

/**
 * Result returned by `queryStudioData`. Shape mirrors `GridDataQueryResult`
 * so the PDF plugin's `buildPdfReportState` can ingest it without changes.
 */
export interface StudioDataQueryResult {
  meta: {
    datasetId: string;
    rowCount: number;
    columns: ReadonlyArray<StudioDataQueryColumnMeta>;
  };
  rows: ReadonlyArray<GridRowModel>;
}

export const QUERY_STUDIO_DATA_TOOL_NAME = 'queryStudioData' as const;
