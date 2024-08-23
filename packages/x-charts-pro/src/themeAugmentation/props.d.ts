import { ScatterChartProps } from '@mui/x-charts';
import { BarChartProProps } from '../BarChartPro';
import { HeatmapProps } from '../Heatmap/Heatmap';
import { LineChartProProps } from '../LineChartPro';
import { HeatmapItemProps } from '../Heatmap/HeatmapItem';
import { HeatmapPlotProps } from '../Heatmap/HeatmapPlot';

export interface ChartsProComponentsPropsList {
  // BarChartPro components
  MuiBarChartPro: BarChartProProps;
  // LineChartPro components
  MuiLineChartPro: LineChartProProps;
  // Heatmap components
  MuiHeatmap: HeatmapProps;
  MuiHeatmapItem: HeatmapItemProps;
  MuiHeatmapPlot: HeatmapPlotProps;
  // ScatterChartPro components
  MuiScatterChartPro: ScatterChartProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChartsProComponentsPropsList {}
}

// disable automatic export
export {};
