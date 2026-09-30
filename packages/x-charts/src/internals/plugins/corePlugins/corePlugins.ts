import { useChartAnimation } from './useChartAnimation';
import type { UseChartAnimationSignature } from './useChartAnimation';
import { useChartDimensions } from './useChartDimensions';
import type { UseChartDimensionsSignature } from './useChartDimensions';
import { useChartElementRef } from './useChartElementRef';
import type { UseChartElementRefSignature } from './useChartElementRef';
import { useChartExperimentalFeatures } from './useChartExperimentalFeature';
import type { UseChartExperimentalFeaturesSignature } from './useChartExperimentalFeature';
import { useChartId } from './useChartId';
import type { UseChartIdSignature, UseChartIdParameters } from './useChartId';
import { useChartSeriesConfig } from './useChartSeriesConfig';
import type {
  UseChartSeriesConfigSignature,
  UseChartSeriesConfigParameters,
} from './useChartSeriesConfig';
import { useChartSeries } from './useChartSeries';
import type { UseChartSeriesSignature } from './useChartSeries';
import { useChartInteractionListener } from './useChartInteractionListener';
import type { UseChartInteractionListenerSignature } from './useChartInteractionListener';
import type { ChartSeriesType } from '../../../models/seriesType/config';

/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the Charts components.
 */
export const CHART_CORE_PLUGINS = [
  useChartElementRef,
  useChartId,
  useChartSeriesConfig,
  useChartExperimentalFeatures,
  useChartDimensions,
  useChartSeries,
  useChartInteractionListener,
  useChartAnimation,
] as const;

export type ChartCorePluginSignatures<SeriesType extends ChartSeriesType = ChartSeriesType> = [
  UseChartElementRefSignature,
  UseChartIdSignature,
  UseChartSeriesConfigSignature<SeriesType>,
  UseChartExperimentalFeaturesSignature<SeriesType>,
  UseChartDimensionsSignature,
  UseChartSeriesSignature<SeriesType>,
  UseChartAnimationSignature,
  UseChartInteractionListenerSignature,
];

export interface ChartCorePluginParameters
  extends UseChartIdParameters, UseChartSeriesConfigParameters {}
