// This file should be removed after creating all plugins in favor of a file per chart type.

import {
  type ChartSeriesType,
  type ConvertSignaturesIntoPlugins,
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
  useChartPolarAxis,
  type UseChartPolarAxisSignature,
  useChartBrush,
  type UseChartBrushSignature,
  type UseChartVisibilityManagerSignature,
  useChartVisibilityManager,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
  useChartProZoom,
  type UseChartProZoomSignature,
} from '@mui/x-charts-pro/plugins';
import { useChartWebGL, type UseChartWebGLSignature } from './useChartWebGL';

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
  UseChartWebGLSignature,
];

export type AllPluginsType<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ConvertSignaturesIntoPlugins<AllPluginSignatures<SeriesType>>;

export const ALL_PLUGINS = [
  useChartZAxis,
  useChartBrush,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartPolarAxis,
  useChartHighlight,
  useChartVisibilityManager,
  useChartProZoom,
  useChartProExport,
  useChartWebGL,
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
  UseChartWebGLSignature,
];

export type DefaultPluginsType<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ConvertSignaturesIntoPlugins<DefaultPluginSignatures<SeriesType>>;

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
  useChartWebGL,
];
