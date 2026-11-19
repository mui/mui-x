import type { BarChartPremiumProps } from '../BarChartPremium';
import type { CandlestickChartProps } from '../CandlestickChart';
import type { HeatmapPremiumProps } from '../HeatmapPremium';
import type { RadialBarChartProps } from '../RadialBarChart';
import type { RadialLineChartProps } from '../RadialLineChart';
import type { ScatterChartPremiumProps } from '../ScatterChartPremium';
import type { ChartsGeoDataProviderPremiumProps } from '../ChartsGeoDataProviderPremium';

export interface ChartsPremiumComponentsPropsList {
  // BarChartPremium components
  MuiBarChartPremium: BarChartPremiumProps;
  // CandlestickChart components
  MuiCandlestickChart: CandlestickChartProps;
  // HeatmapPremium components
  MuiHeatmapPremium: HeatmapPremiumProps;
  // RadialBarChart components
  MuiRadialBarChart: RadialBarChartProps;
  // RadialLineChart components
  MuiRadialLineChart: RadialLineChartProps;
  // ScatterChartPremium components
  MuiScatterChartPremium: ScatterChartPremiumProps;
  // ChartsGeoDataProviderPremium components
  MuiChartsGeoDataProviderPremium: ChartsGeoDataProviderPremiumProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChartsPremiumComponentsPropsList {}
}

// disable automatic export
export {};
