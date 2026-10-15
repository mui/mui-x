import type { Dataset } from '@mui/x-internals/types';

export type ChartState = {
  label?: string;
  synced: boolean;
  dimensions: Dataset<string | number | null>;
  values: Dataset<number | null>;
  type: string;
  configuration: Record<string, string | number | boolean | null>;
  dimensionsLabel?: string;
  valuesLabel?: string;
  maxDimensions?: number;
  maxValues?: number;
};

/**
 * Exports the Data Grid's data as an Excel file, with the options the Grid's own export uses.
 * @returns {Promise<void>} A promise that resolves once the export is done.
 */
export type GridChartsExcelExport = () => Promise<void>;

export interface GridChartsIntegrationContextValue {
  chartStateLookup: Record<string, ChartState>;
  setChartState: (id: string, state: Partial<ChartState>) => void;
  /**
   * The Grid's own Excel export, published while a Grid with `chartsIntegration` is mounted, so
   * that a chart bound to it can offer the Grid's data next to its own. `null` when no Grid is
   * bound, or when the Grid disabled its Excel export.
   */
  exportGridDataAsExcel: GridChartsExcelExport | null;
  /**
   * Publishes, or clears, the Grid's Excel export.
   * @param {GridChartsExcelExport | null} exportGridDataAsExcel The Grid's export, or `null` to clear it.
   * @returns {void}
   */
  setExportGridDataAsExcel: (exportGridDataAsExcel: GridChartsExcelExport | null) => void;
}
