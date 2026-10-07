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
  /**
   * Exports the Data Grid's data as an Excel file.
   * Published by the Grid so the chart can offer it next to its own export, which only covers
   * the dimensions and values selected for the chart.
   */
  exportDataAsExcel?: () => Promise<void>;
};

export interface GridChartsIntegrationContextValue {
  chartStateLookup: Record<string, ChartState>;
  setChartState: (id: string, state: Partial<ChartState>) => void;
}
