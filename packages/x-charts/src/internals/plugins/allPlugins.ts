// This file should be removed after creating all plugins in favor of a file per chart type.
import { type ChartSeriesType } from '../../models/seriesType/config';
import {
  useChartCartesianAxis,
  type UseChartCartesianAxisSignature,
} from './featurePlugins/useChartCartesianAxis';
import {
  useChartHighlight,
  type UseChartHighlightSignature,
} from './featurePlugins/useChartHighlight';
import {
  useChartInteraction,
  type UseChartInteractionSignature,
} from './featurePlugins/useChartInteraction';
import {
  useChartKeyboardNavigation,
  type UseChartKeyboardNavigationSignature,
} from './featurePlugins/useChartKeyboardNavigation';
import { type UseChartPolarAxisSignature } from './featurePlugins/useChartPolarAxis';
import {
  useChartClosestPoint,
  type UseChartClosestPointSignature,
} from './featurePlugins/useChartClosestPoint';
import { useChartZAxis, type UseChartZAxisSignature } from './featurePlugins/useChartZAxis';
import { useChartBrush, type UseChartBrushSignature } from './featurePlugins/useChartBrush';
import { useChartTooltip, type UseChartTooltipSignature } from './featurePlugins/useChartTooltip';

export type AllPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartPolarAxisSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
];

export type DefaultPluginSignatures<TSeries extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<TSeries>,
  UseChartHighlightSignature,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
];

export const DEFAULT_PLUGINS = [
  useChartZAxis,
  useChartBrush,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartClosestPoint,
  useChartKeyboardNavigation,
] as const;
