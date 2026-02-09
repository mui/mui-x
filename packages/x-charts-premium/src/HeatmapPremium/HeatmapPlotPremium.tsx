'use client';
import { HeatmapSVGPlot, type HeatmapRendererPlotProps } from '@mui/x-charts-pro/internals';
import { HeatmapWebGLRenderer } from './webgl/HeatmapWebGLRenderer';

export interface HeatmapPlotPremiumProps extends HeatmapRendererPlotProps {
  renderer: 'svg-single' | 'webgl';
}

export function HeatmapPlotPremium({ renderer, borderRadius, ...props }: HeatmapPlotPremiumProps) {
  if (renderer === 'webgl') {
    return <HeatmapWebGLRenderer borderRadius={borderRadius} />;
  }

  return <HeatmapSVGPlot borderRadius={borderRadius} {...props} />;
}
