import { type FunnelClasses } from '../FunnelChart';

type ExtractSafe<T, U extends T> = T extends U ? T : never;

export interface ChartsProComponentNameToClassKey {
  // FunnelChart components
  MuiFunnelChart: ExtractSafe<keyof FunnelClasses, 'section' | 'sectionLabel'>;

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
