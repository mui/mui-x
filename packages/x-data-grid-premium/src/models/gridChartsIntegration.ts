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

export interface GridChartsIntegrationContextValue {
  chartStateLookup: Record<string, ChartState>;
  setChartState: (id: string, state: Partial<ChartState>) => void;
}
