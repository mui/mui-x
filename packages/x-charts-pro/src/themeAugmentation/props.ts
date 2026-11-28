import type { ScatterChartProProps } from '../ScatterChartPro';
import type { BarChartProProps } from '../BarChartPro';
import type { HeatmapProps } from '../Heatmap/Heatmap';
import type { LineChartProProps } from '../LineChartPro';
import type { FunnelChartProps } from '../FunnelChart';
import type { FunnelSectionProps } from '../FunnelChart/FunnelSection';
import type { FunnelSectionLabelProps } from '../FunnelChart/FunnelSectionLabel';
import type { SankeyChartProps } from '../SankeyChart/SankeyChart';
import type { PieChartProProps } from '../PieChartPro';
import type { RadarChartProProps } from '../RadarChartPro';

export interface ChartsProComponentsPropsList {
  // BarChartPro components
  MuiBarChartPro: BarChartProProps;
  // LineChartPro components
  MuiLineChartPro: LineChartProProps;
  // PieChartPro components
  MuiPieChartPro: PieChartProProps;
  // RadarChartPro components
  MuiRadarChartPro: RadarChartProProps;
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
