/**
 * Minimal contract a host data-query result must satisfy for the PDF plugin
 * to consume it. The Grid's `GridDataQueryResult` already matches this shape;
 * other hosts can ship results in the same shape (or a superset) and the
 * PDF plugin works unmodified.
 */
export interface PdfReportQueryResultLike {
  meta: {
    rowCount?: number;
    columns?: ReadonlyArray<unknown>;
    [key: string]: unknown;
  };
  rows?: ReadonlyArray<unknown>;
  aggregations?: ReadonlyArray<{ field?: string; fn?: string; value?: unknown }>;
}

interface BuildPdfReportStateOptions<TQueryResult extends PdfReportQueryResultLike> {
  queryResults: ReadonlyMap<string, TQueryResult>;
  gridApi?: unknown;
  reportTitle?: string;
}

/**
 * Builds the runtime `state` object the json-render PDF spec resolves
 * `$state`, `$template`, `$item`, and `repeat` references against.
 *
 * Shape — JSON-pointer paths the prompt tells the model to use:
 *
 *   /queries/<toolCallId>/meta/rowCount       — row count of that approval
 *   /queries/<toolCallId>/meta/columnCount    — number of columns returned
 *   /queries/<toolCallId>/meta/columns/N      — Nth column field id
 *   /queries/<toolCallId>/aggregations/N/value— scalar from an aggregate query
 *   /queries/<toolCallId>/aggregations/N/field
 *   /queries/<toolCallId>/aggregations/N/fn
 *   /queries/<toolCallId>/rows                — array of row objects (use with `repeat`)
 *   /grid/rowCount                            — total rows in the grid
 *   /grid/visibleRowCount                     — rows after filter/sort
 *   /grid/columns/N/field
 *   /grid/columns/N/headerName
 *   /generatedAt                              — ISO timestamp of this render
 *   /reportTitle                              — optional title forwarded by host
 */
export function buildPdfReportState<TQueryResult extends PdfReportQueryResultLike>(
  options: BuildPdfReportStateOptions<TQueryResult>,
): Record<string, unknown> {
  const { queryResults, gridApi, reportTitle } = options;

  const queries: Record<string, unknown> = {};
  for (const [toolCallId, result] of queryResults) {
    queries[toolCallId] = {
      meta: {
        ...result.meta,
        columnCount: result.meta.columns?.length ?? 0,
      },
      rows: result.rows ?? [],
      aggregations: result.aggregations ?? [],
    };
  }

  return {
    queries,
    grid: extractGridSummary(gridApi),
    generatedAt: new Date().toISOString(),
    reportTitle: reportTitle ?? '',
  };
}

interface GridLikeApi {
  state?: unknown;
  getRowsCount?: () => number;
  getAllColumns?: () => ReadonlyArray<{ field: string; headerName?: string }>;
  getVisibleRows?: () => { rows: ReadonlyArray<unknown> };
}

function extractGridSummary(gridApi: unknown): {
  rowCount: number;
  visibleRowCount: number;
  columns: ReadonlyArray<{ field: string; headerName: string }>;
} {
  const api = gridApi as GridLikeApi | null | undefined;
  if (!api) {
    return { rowCount: 0, visibleRowCount: 0, columns: [] };
  }
  let rowCount = 0;
  let visibleRowCount = 0;
  let columns: Array<{ field: string; headerName: string }> = [];
  try {
    rowCount = typeof api.getRowsCount === 'function' ? api.getRowsCount() : 0;
  } catch {
    rowCount = 0;
  }
  try {
    const visible = typeof api.getVisibleRows === 'function' ? api.getVisibleRows() : undefined;
    visibleRowCount = visible?.rows?.length ?? rowCount;
  } catch {
    visibleRowCount = rowCount;
  }
  try {
    const cols = typeof api.getAllColumns === 'function' ? api.getAllColumns() : undefined;
    columns =
      cols?.map((col) => ({ field: col.field, headerName: col.headerName ?? col.field })) ?? [];
  } catch {
    columns = [];
  }
  return { rowCount, visibleRowCount, columns };
}
