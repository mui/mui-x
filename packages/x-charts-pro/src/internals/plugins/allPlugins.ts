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
} from '@mui/x-charts/internals';
import { useChartProExport } from './useChartProExport';
import { useChartProZoom, UseChartProZoomSignature } from './useChartProZoom';

export type AllPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartPolarAxisSignature<TSeries>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProZoomSignature,
];

export type AllPluginsType<TSeries extends ChartSeriesType = ChartSeriesType> =
  ConvertSignaturesIntoPlugins<AllPluginSignatures<TSeries>>;

export const ALL_PLUGINS = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartPolarAxis,
  useChartInteraction,
  useChartHighlight,
  useChartProZoom,
];

export type DefaultPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartPolarAxisSignature<TSeries>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProZoomSignature,
];

export type DefaultPluginsType<TSeries extends ChartSeriesType = ChartSeriesType> =
  ConvertSignaturesIntoPlugins<DefaultPluginSignatures<TSeries>>;

export const DEFAULT_PLUGINS = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartProZoom,
  useChartProExport,
];
