export interface ChartsProComponentNameToClassKey {
  // Heatmap components
  MuiHeatmapPlot: 'root';

  // SankeyChart components
  MuiSankeyPlot: 'root';
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChartsProComponentNameToClassKey {}
}

// disable automatic export
export {};
