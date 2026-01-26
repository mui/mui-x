'use client';
import * as React from 'react';
import { useRegisterPointerInteractions, ChartsWebGLSurface } from '@mui/x-charts/internals';
import {
  type HeatmapRendererPlotProps,
  selectorHeatmapItemAtPosition,
} from '@mui/x-charts-pro/internals';
import { HeatmapWebGLPlot } from './HeatmapWebGLPlot';

export function HeatmapWebGLRenderer({ borderRadius }: HeatmapRendererPlotProps) {
  useRegisterPointerInteractions(selectorHeatmapItemAtPosition);

  return (
    <ChartsWebGLSurface>
      <HeatmapWebGLPlot borderRadius={borderRadius} />
    </ChartsWebGLSurface>
  );
}
