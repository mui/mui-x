// This file should be removed after creating all plugins in favor of a file per chart type.

import {
  ChartSeriesType,
  ConvertSignaturesIntoPlugins,
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
  useChartInteraction,
  UseChartInteractionSignature,
  useChartZAxis,
  UseChartZAxisSignature,
  useChartHighlight,
  UseChartHighlightSignature,
  useChartPolarAxis,
  UseChartPolarAxisSignature,
  useChartBrush,
  UseChartBrushSignature,
  useChartVisibilityManager,
  UseChartVisibilityManagerSignature,
} from '@mui/x-charts/internals';
import { useChartProExport, UseChartProExportSignature } from './useChartProExport';
import { useChartProZoom, UseChartProZoomSignature } from './useChartProZoom';

export type AllPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartPolarAxisSignature<TSeries>,
  UseChartHighlightSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
  UseChartVisibilityManagerSignature,
];

export type AllPluginsType<TSeries extends ChartSeriesType = ChartSeriesType> =
  ConvertSignaturesIntoPlugins<AllPluginSignatures<TSeries>>;

export const ALL_PLUGINS = [
  useChartZAxis,
  useChartBrush,
  useChartInteraction,
  useChartCartesianAxis,
  useChartPolarAxis,
  useChartHighlight,
  useChartProZoom,
  useChartProExport,
  useChartVisibilityManager,
];

export type DefaultPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartPolarAxisSignature<TSeries>,
  UseChartHighlightSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
  UseChartVisibilityManagerSignature,
];

export type DefaultPluginsType<TSeries extends ChartSeriesType = ChartSeriesType> =
  ConvertSignaturesIntoPlugins<DefaultPluginSignatures<TSeries>>;

export const DEFAULT_PLUGINS = [
  useChartZAxis,
  useChartBrush,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartProZoom,
  useChartProExport,
  useChartVisibilityManager,
];
