/**
 * A value exceljs can write natively.
 */
export type ChartExcelCellValue = string | number | boolean | Date | null;

export interface ChartExcelColumn {
  /** Addresses the cell inside a row object. */
  key: string;
  /** Text written on the header row. */
  header: string;
  /** Excel number format, e.g. `yyyy-mm-dd`. */
  numFmt?: string;
}

/**
 * Identifies a table. Tables sharing an id are merged into a single sheet,
 * which is how bar and line series end up together.
 */
export type ChartExcelTableId =
  | 'category'
  | 'scatter'
  | 'pie'
  | 'funnel'
  | 'heatmap'
  | 'rangeBar'
  | 'ohlc'
  | 'mapShape'
  | 'sankeyNodes'
  | 'sankeyLinks';

export interface ChartExcelTable {
  id: ChartExcelTableId;
  columns: ChartExcelColumn[];
  rows: Record<string, ChartExcelCellValue>[];
}

export interface ResolvedChartExcelOptions {
  /**
   * Include series and items hidden through the legend.
   *
   * On by default: hiding a series is a way of reading the chart, not a statement about
   * the data, and silently dropping rows from an export is the harder failure to notice.
   * Set to `false` to export only what is on screen.
   */
  includeHiddenSeries: boolean;
  /** Add a `formatted*` column next to each formatted value. */
  includeFormattedValues: boolean;
  /** Escape text cells that Excel would read as a formula. */
  escapeFormulas: boolean;
}

export const DEFAULT_CHART_EXCEL_OPTIONS: ResolvedChartExcelOptions = {
  includeHiddenSeries: true,
  includeFormattedValues: false,
  escapeFormulas: true,
};
