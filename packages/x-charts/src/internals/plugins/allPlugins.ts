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
import {
  useChartVisibilityManager,
  UseChartVisibilityManagerSignature,
} from './featurePlugins/useChartVisibilityManager';

export type AllPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartPolarAxisSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartVisibilityManagerSignature,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
];

export type DefaultPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartHighlightSignature,
  UseChartVisibilityManagerSignature,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
];

export const DEFAULT_PLUGINS = [
  useChartZAxis,
  useChartBrush,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartVisibilityManager,
  useChartClosestPoint,
  useChartKeyboardNavigation,
] as const;
