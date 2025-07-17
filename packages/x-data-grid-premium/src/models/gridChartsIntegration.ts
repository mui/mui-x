import type { Axis } from '@mui/x-internals/types';

export type ChartState = {
  label?: string;
  synced: boolean;
  categories: Axis<string | number | null>;
  series: Axis<number | null>;
  type: string;
  configuration: Record<string, string | number | boolean | null>;
};

export interface GridChartsIntegrationContextValue {
  chartStateLookup: Record<string, ChartState>;
  setChartState: (id: string, state: Partial<ChartState>) => void;
}
