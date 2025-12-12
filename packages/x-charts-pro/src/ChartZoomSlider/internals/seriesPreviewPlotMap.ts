import type * as React from 'react';
import { type ChartSeriesType } from '@mui/x-charts/internals';
import { BarPreviewPlot } from './previews/BarPreviewPlot';
import { ScatterPreviewPlot } from './previews/ScatterPreviewPlot';
import { LineAreaPreviewPlot } from './previews/LineAreaPreviewPlot';
import { type PreviewPlotProps } from './previews/PreviewPlot.types';

export const seriesPreviewPlotMap = new Map<ChartSeriesType, React.ComponentType<PreviewPlotProps>>(
  [
    ['bar', BarPreviewPlot],
    ['line', LineAreaPreviewPlot],
    ['scatter', ScatterPreviewPlot],
  ] as const,
);
