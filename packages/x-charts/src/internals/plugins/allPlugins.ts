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
import {
  useChartKeyboardNavigation,
  UseChartKeyboardNavigationSignature,
} from './featurePlugins/useChartKeyboardNavigation';
import { UseChartPolarAxisSignature } from './featurePlugins/useChartPolarAxis';
import {
  useChartClosestPoint,
  UseChartClosestPointSignature,
} from './featurePlugins/useChartClosestPoint';
import { useChartZAxis, UseChartZAxisSignature } from './featurePlugins/useChartZAxis';
import { useChartBrush, UseChartBrushSignature } from './featurePlugins/useChartBrush';

export type AllPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartPolarAxisSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
];

export type DefaultPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
];

export const DEFAULT_PLUGINS = [
  useChartZAxis,
  useChartBrush,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartClosestPoint,
  useChartKeyboardNavigation,
] as const;
