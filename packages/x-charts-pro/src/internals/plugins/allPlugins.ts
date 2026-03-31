// This file should be removed after creating all plugins in favor of a file per chart type.

import {
  type ChartSeriesType,
  useChartCartesianAxis,
  type UseChartCartesianAxisSignature,
  useChartTooltip,
  type UseChartTooltipSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartZAxis,
  type UseChartZAxisSignature,
  useChartHighlight,
  type UseChartHighlightSignature,
  type UseChartPolarAxisSignature,
  useChartBrush,
  type UseChartBrushSignature,
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
} from '@mui/x-charts/internals';
import { useChartProExport, type UseChartProExportSignature } from './useChartProExport';
import { useChartProZoom, type UseChartProZoomSignature } from './useChartProZoom';

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
];
