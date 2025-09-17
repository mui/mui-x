// This file should be removed after creating all plugins in favor of a file per chart type.
import { ChartSeriesType } from '../../models/seriesType/config';
import {
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
} from './featurePlugins/useChartCartesianAxis';
import { useChartHighlight, UseChartHighlightSignature } from './featurePlugins/useChartHighlight';
import {
  useChartInteraction,
  UseChartInteractionSignature,
} from './featurePlugins/useChartInteraction';
import { UseChartPolarAxisSignature } from './featurePlugins/useChartPolarAxis';
import {
  useChartClosestPoint,
  UseChartClosestPointSignature,
} from './featurePlugins/useChartClosestPoint';
import { useChartZAxis, UseChartZAxisSignature } from './featurePlugins/useChartZAxis';

export type AllPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartPolarAxisSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartClosestPointSignature,
];

export type DefaultPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartClosestPointSignature,
];

export const DEFAULT_PLUGINS = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartClosestPoint,
] as const;
