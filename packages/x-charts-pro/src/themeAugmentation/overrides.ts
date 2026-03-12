import { type HeatmapClassKey } from '../Heatmap';
import { type FunnelSectionClasses } from '../FunnelChart/funnelSectionClasses';

export interface ChartsProComponentNameToClassKey {
  // FunnelChart components
  MuiFunnelChart: 'section' | 'sectionLabel';
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
