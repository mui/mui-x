import { type HeatmapClassKey } from '../Heatmap';
import { type FunnelClassKey } from '../FunnelChart/funnelClasses';
import { type FunnelSectionClasses } from '../FunnelChart/funnelSectionClasses';

export interface ChartsProComponentNameToClassKey {
  // FunnelChart components
  MuiFunnelChart: FunnelClassKey;
  /** @deprecated Use `MuiFunnelChart` instead. */
  MuiFunnelSection: keyof FunnelSectionClasses;

  // Heatmap components
  MuiHeatmap: HeatmapClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChartsProComponentNameToClassKey {}
}

// disable automatic export
export {};
