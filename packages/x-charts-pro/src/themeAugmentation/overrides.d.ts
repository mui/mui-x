import { HeatmapClassKey } from '../Heatmap';

export interface ChartsProComponentNameToClassKey {
  // Heatmap components
  MuiHeatmap: HeatmapClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChartsProComponentNameToClassKey {}
}

// disable automatic export
export {};
