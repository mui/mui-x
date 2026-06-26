// This file should be removed after creating all plugins in favor of a file per chart type.

import {
  useChartCartesianAxis,
  useChartTooltip,
  useChartInteraction,
  useChartZAxis,
  useChartHighlight,
  useChartBrush,
  useChartVisibilityManager,
  useProgressiveRendering,
} from '@mui/x-charts/internals';
import type {
  ChartSeriesType,
  UseChartCartesianAxisSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartZAxisSignature,
  UseChartHighlightSignature,
  UseChartPolarAxisSignature,
  UseChartBrushSignature,
  UseChartVisibilityManagerSignature,
  UseProgressiveRenderingSignature,
} from '@mui/x-charts/internals';
import { useChartProExport } from './useChartProExport';
import type { UseChartProExportSignature } from './useChartProExport';
import { useChartProZoom } from './useChartProZoom';
import type { UseChartProZoomSignature } from './useChartProZoom';

export type AllPluginSignatures<SeriesType extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature<SeriesType>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<SeriesType>,
  UseChartPolarAxisSignature<SeriesType>,
  UseChartHighlightSignature<SeriesType>,
  UseChartVisibilityManagerSignature<SeriesType>,
  UseChartProZoomSignature,
  UseChartProExportSignature,
  UseChartVisibilityManagerSignature<SeriesType>,
  UseProgressiveRenderingSignature,
];

export type DefaultPluginSignatures<SeriesType extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature<SeriesType>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<SeriesType>,
  UseChartPolarAxisSignature<SeriesType>,
  UseChartHighlightSignature<SeriesType>,
  UseChartVisibilityManagerSignature<SeriesType>,
  UseChartProZoomSignature,
  UseChartProExportSignature,
  UseChartVisibilityManagerSignature<SeriesType>,
  UseProgressiveRenderingSignature,
];

export const DEFAULT_PLUGINS = [
  useChartZAxis,
  useChartBrush,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartVisibilityManager,
  useChartProZoom,
  useChartProExport,
  useChartVisibilityManager,
  useProgressiveRendering,
];
