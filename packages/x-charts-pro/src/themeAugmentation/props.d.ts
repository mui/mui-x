import { ScatterChartProProps } from '../ScatterChartPro';
import { BarChartProProps } from '../BarChartPro';
import { HeatmapProps } from '../Heatmap/Heatmap';
import { LineChartProProps } from '../LineChartPro';

export interface ChartsProComponentsPropsList {
  // BarChartPro components
  MuiBarChartPro: BarChartProProps;
  // LineChartPro components
  MuiLineChartPro: LineChartProProps;
  // Heatmap components
  MuiHeatmap: HeatmapProps;
  // ScatterChartPro components
  MuiScatterChartPro: ScatterChartProProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChartsProComponentsPropsList {}
}

// disable automatic export
export {};
