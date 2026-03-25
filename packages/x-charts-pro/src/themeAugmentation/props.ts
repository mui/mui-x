import { type ScatterChartProProps } from '../ScatterChartPro';
import { type BarChartProProps } from '../BarChartPro';
import { type HeatmapProps } from '../Heatmap/Heatmap';
import { type LineChartProProps } from '../LineChartPro';
import { type FunnelChartProps } from '../FunnelChart';
import { type FunnelSectionProps } from '../FunnelChart/FunnelSection';
import { type FunnelSectionLabelProps } from '../FunnelChart/FunnelSectionLabel';
import { type SankeyChartProps } from '../SankeyChart/SankeyChart';

export interface ChartsProComponentsPropsList {
  // BarChartPro components
  MuiBarChartPro: BarChartProProps;
  // LineChartPro components
  MuiLineChartPro: LineChartProProps;
  // Heatmap components
  MuiHeatmap: HeatmapProps;
  // ScatterChartPro components
  MuiScatterChartPro: ScatterChartProProps;
  // FunnelChart components
  MuiFunnelChart: FunnelChartProps;
  MuiFunnelSection: FunnelSectionProps;
  MuiFunnelSectionLabel: FunnelSectionLabelProps;
  // SankeyChart components
  MuiSankeyChart: SankeyChartProps;
}

declare module '@mui/material/styles' {
  interface ComponentsPropsList extends ChartsProComponentsPropsList {}
}

// disable automatic export
export {};
