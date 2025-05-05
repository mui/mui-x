import { type UseChartAnimationSignature, useChartAnimation } from './useChartAnimation';
import { type UseChartDimensionsSignature, useChartDimensions } from './useChartDimensions';
import { type UseChartIdSignature, useChartId, UseChartIdParameters } from './useChartId';
import { type UseChartSeriesSignature, useChartSeries } from './useChartSeries';

/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the Charts components.
 */
export const CHART_CORE_PLUGINS = [
  useChartId,
  useChartDimensions,
  useChartSeries,
  useChartAnimation,
] as const;

export type ChartCorePluginSignatures = [
  UseChartIdSignature,
  UseChartDimensionsSignature,
  UseChartSeriesSignature,
  UseChartAnimationSignature,
];

export interface ChartCorePluginParameters extends UseChartIdParameters {}
