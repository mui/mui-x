import { type UseChartAnimationSignature, useChartAnimation } from './useChartAnimation';
import { type UseChartDimensionsSignature, useChartDimensions } from './useChartDimensions';
import {
  type UseChartExperimentalFeaturesSignature,
  useChartExperimentalFeatures,
} from './useChartExperimentalFeature';
import { type UseChartIdSignature, useChartId, UseChartIdParameters } from './useChartId';
import { type UseChartSeriesSignature, useChartSeries } from './useChartSeries';
import {
  type UseChartInteractionListenerSignature,
  useChartInteractionListener,
} from './useChartInteractionListener';

/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the Charts components.
 */
export const CHART_CORE_PLUGINS = [
  useChartId,
  useChartExperimentalFeatures,
  useChartDimensions,
  useChartSeries,
  useChartInteractionListener,
  useChartAnimation,
] as const;

export type ChartCorePluginSignatures = [
  UseChartIdSignature,
  UseChartExperimentalFeaturesSignature,
  UseChartDimensionsSignature,
  UseChartSeriesSignature,
  UseChartAnimationSignature,
  UseChartInteractionListenerSignature,
];

export interface ChartCorePluginParameters extends UseChartIdParameters {}
