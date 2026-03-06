import { type HeatmapClassKey } from '../Heatmap';
import { type SankeyClassKey } from '../SankeyChart/sankeyClasses';

export interface ChartsProComponentNameToClassKey {
  // Heatmap components
  MuiHeatmap: HeatmapClassKey;

  // SankeyChart components
  MuiSankeyChart: SankeyClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChartsProComponentNameToClassKey {}
}

// disable automatic export
export {};
