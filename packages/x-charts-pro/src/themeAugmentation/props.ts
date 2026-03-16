import { type ScatterChartProProps } from '../ScatterChartPro';
import { type BarChartProProps } from '../BarChartPro';
import { type HeatmapProps } from '../Heatmap/Heatmap';
import { type LineChartProProps } from '../LineChartPro';
import { type SankeyChartProps } from '../SankeyChart/SankeyChart';

export interface ChartsProComponentsPropsList {
  // BarChartPro components
  MuiBarChartPro: BarChartProProps;
  // LineChartPro components
  MuiLineChartPro: LineChartProProps;
  // Heatmap components
  MuiHeatmap: HeatmapProps;
  // ScatterChartPro components
  MuiScatterChartPro: ScatterChartProProps;
  // SankeyChart components
  MuiSankeyChart: SankeyChartProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChartsProComponentsPropsList {}
}

// disable automatic export
export {};
