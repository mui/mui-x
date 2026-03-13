import { type HeatmapClassKey } from '../Heatmap';

export interface ChartsProComponentNameToClassKey {
  // Heatmap components
  MuiHeatmap: HeatmapClassKey;

  // SankeyChart components
  MuiSankeyPlot: 'root';
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChartsProComponentNameToClassKey {}
}

// disable automatic export
export {};
