'use client';
import * as React from 'react';
import { useRegisterPointerInteractions } from '@mui/x-charts/internals';
import {
  type HeatmapRendererPlotProps,
  selectorHeatmapItemAtPosition,
} from '@mui/x-charts-pro/internals';
import { HeatmapWebGLPlot } from './HeatmapWebGLPlot';
import { ChartsWebGLLayer } from '../../ChartsWebGLLayer';

export function HeatmapWebGLRenderer({ borderRadius }: HeatmapRendererPlotProps) {
  useRegisterPointerInteractions(selectorHeatmapItemAtPosition);

  return (
    <ChartsWebGLLayer>
      <HeatmapWebGLPlot borderRadius={borderRadius} />
    </ChartsWebGLLayer>
  );
}
