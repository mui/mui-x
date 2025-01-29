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
} from '@mui/x-charts/internals';
import { useChartProZoom, UseChartProZoomSignature } from './useChartProZoom';

export type AllPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProZoomSignature,
];

export type AllPluginsType<TSeries extends ChartSeriesType = ChartSeriesType> =
  ConvertSignaturesIntoPlugins<AllPluginSignatures<TSeries>>;

export const ALL_PLUGINS = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartProZoom,
];
