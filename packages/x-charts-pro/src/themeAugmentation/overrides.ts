import { type HeatmapChartClassKey } from '../Heatmap/heatmapChartClasses';
import { type HeatmapClassKey } from '../Heatmap';

export interface ChartsProComponentNameToClassKey {
  // Heatmap components
  MuiHeatmapChart: HeatmapChartClassKey;
  /** @deprecated Use `MuiHeatmapChart` instead. */
  MuiHeatmap: HeatmapClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChartsProComponentNameToClassKey {}
}

// disable automatic export
export {};
