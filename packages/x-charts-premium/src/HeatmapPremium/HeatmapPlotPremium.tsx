'use client';
import { HeatmapSVGPlot, type HeatmapRendererPlotProps } from '@mui/x-charts-pro/internals';
import { HeatmapWebGLPlot } from './webgl/HeatmapWebGLPlot';

export interface HeatmapPlotPremiumProps extends HeatmapRendererPlotProps {
  renderer: 'svg-single' | 'webgl';
}

export function HeatmapPlotPremium({ renderer, borderRadius, ...props }: HeatmapPlotPremiumProps) {
  if (renderer === 'webgl') {
    return <HeatmapWebGLPlot borderRadius={borderRadius} />;
  }

  return <HeatmapSVGPlot borderRadius={borderRadius} {...props} />;
}
