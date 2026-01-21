import { type UseChartAnimationSignature, useChartAnimation } from './useChartAnimation';
import { type UseChartDimensionsSignature, useChartDimensions } from './useChartDimensions';
import {
  type UseChartExperimentalFeaturesSignature,
  useChartExperimentalFeatures,
} from './useChartExperimentalFeature';
import { type UseChartIdSignature, useChartId, type UseChartIdParameters } from './useChartId';
import {
  type UseSeriesConfigSignature,
  useSeriesConfig,
  type UseSeriesConfigParameters,
} from './useSeriesConfig';
import { type UseChartSeriesSignature, useChartSeries } from './useChartSeries';
import {
  type UseChartInteractionListenerSignature,
  useChartInteractionListener,
} from './useChartInteractionListener';
import type { ChartSeriesType } from '../../../models/seriesType/config';

/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the Charts components.
 */
export const CHART_CORE_PLUGINS = [
  useChartId,
  useSeriesConfig,
  useChartExperimentalFeatures,
  useChartDimensions,
  useChartSeries,
  useChartInteractionListener,
  useChartAnimation,
] as const;

export type ChartCorePluginSignatures<TSeriesType extends ChartSeriesType = ChartSeriesType> = [
  UseChartIdSignature,
  UseSeriesConfigSignature<TSeriesType>,
  UseChartExperimentalFeaturesSignature,
  UseChartDimensionsSignature,
  UseChartSeriesSignature<TSeriesType>,
  UseChartAnimationSignature,
  UseChartInteractionListenerSignature,
];

export interface ChartCorePluginParameters
  extends UseChartIdParameters, UseSeriesConfigParameters {}
