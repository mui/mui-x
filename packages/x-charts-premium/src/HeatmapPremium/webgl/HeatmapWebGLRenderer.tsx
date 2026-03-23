'use client';
import * as React from 'react';
import { type HeatmapRendererPlotProps } from '@mui/x-charts-pro/internals';
import { HeatmapWebGLPlot } from './HeatmapWebGLPlot';
import { ChartsWebGLLayer } from '../../ChartsWebGLLayer';

export function HeatmapWebGLRenderer({ borderRadius }: HeatmapRendererPlotProps) {
  return (
    <ChartsWebGLLayer>
      <HeatmapWebGLPlot borderRadius={borderRadius} />
    </ChartsWebGLLayer>
  );
}
