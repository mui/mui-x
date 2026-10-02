// This file should be removed after creating all plugins in favor of a file per chart type.
import type { ChartSeriesType } from '../../models/seriesType/config';
import { useChartCartesianAxis } from './featurePlugins/useChartCartesianAxis';
import type { UseChartCartesianAxisSignature } from './featurePlugins/useChartCartesianAxis';
import { useChartHighlight } from './featurePlugins/useChartHighlight';
import type { UseChartHighlightSignature } from './featurePlugins/useChartHighlight';
import { useChartInteraction } from './featurePlugins/useChartInteraction';
import type { UseChartInteractionSignature } from './featurePlugins/useChartInteraction';
import { useChartKeyboardNavigation } from './featurePlugins/useChartKeyboardNavigation';
import type { UseChartKeyboardNavigationSignature } from './featurePlugins/useChartKeyboardNavigation';
import type { UseChartPolarAxisSignature } from './featurePlugins/useChartPolarAxis';
import { useChartClosestPoint } from './featurePlugins/useChartClosestPoint';
import type { UseChartClosestPointSignature } from './featurePlugins/useChartClosestPoint';
import { useChartZAxis } from './featurePlugins/useChartZAxis';
import type { UseChartZAxisSignature } from './featurePlugins/useChartZAxis';
import { useChartBrush } from './featurePlugins/useChartBrush';
import type { UseChartBrushSignature } from './featurePlugins/useChartBrush';
import { useChartVisibilityManager } from './featurePlugins/useChartVisibilityManager';
import type { UseChartVisibilityManagerSignature } from './featurePlugins/useChartVisibilityManager';
import { useChartTooltip } from './featurePlugins/useChartTooltip';
import type { UseChartTooltipSignature } from './featurePlugins/useChartTooltip';
import { useProgressiveRendering } from './featurePlugins/useProgressiveRendering';
import type { UseProgressiveRenderingSignature } from './featurePlugins/useProgressiveRendering';

export type AllPluginSignatures<SeriesType extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartCartesianAxisSignature<SeriesType>,
  UseChartPolarAxisSignature,
  UseChartTooltipSignature<SeriesType>,
  UseChartInteractionSignature,
  UseChartHighlightSignature<SeriesType>,
  UseChartVisibilityManagerSignature<SeriesType>,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
  UseProgressiveRenderingSignature,
];

export type DefaultPluginSignatures<SeriesType extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature<SeriesType>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<SeriesType>,
  UseChartHighlightSignature<SeriesType>,
  UseChartVisibilityManagerSignature<SeriesType>,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
  UseProgressiveRenderingSignature,
];

export const DEFAULT_PLUGINS = [
  useChartZAxis,
  useChartBrush,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartVisibilityManager,
  useChartClosestPoint,
  useChartKeyboardNavigation,
  useProgressiveRendering,
] as const;
