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

export type AllPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature<TSeries>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartPolarAxisSignature<TSeries>,
  UseChartHighlightSignature<TSeries>,
  UseChartVisibilityManagerSignature<TSeries>,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export type AllPluginsType<TSeries extends ChartSeriesType = ChartSeriesType> =
  ConvertSignaturesIntoPlugins<AllPluginSignatures<TSeries>>;

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
];

export type DefaultPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature<TSeries>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartPolarAxisSignature<TSeries>,
  UseChartHighlightSignature<TSeries>,
  UseChartVisibilityManagerSignature<TSeries>,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export type DefaultPluginsType<TSeries extends ChartSeriesType = ChartSeriesType> =
  ConvertSignaturesIntoPlugins<DefaultPluginSignatures<TSeries>>;

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
];
