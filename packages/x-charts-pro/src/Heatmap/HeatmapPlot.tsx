'use client';
import { HeatmapSVGPlot } from './HeatmapSVGPlot';
import { type HeatmapRendererPlotProps } from './Heatmap.types';

export interface HeatmapPlotProps extends HeatmapRendererPlotProps {}

export function HeatmapPlot({ borderRadius, ...props }: HeatmapPlotProps) {
  return <HeatmapSVGPlot borderRadius={borderRadius} {...props} />;
}
