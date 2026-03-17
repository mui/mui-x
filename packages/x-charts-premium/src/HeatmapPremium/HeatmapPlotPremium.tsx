'use client';
import { HeatmapSVGPlot, type HeatmapRendererPlotProps } from '@mui/x-charts-pro/internals';

export interface HeatmapPlotPremiumProps extends HeatmapRendererPlotProps {}

export function HeatmapPlotPremium({ borderRadius, ...props }: HeatmapPlotPremiumProps) {
  return <HeatmapSVGPlot borderRadius={borderRadius} {...props} />;
}
