import { useChartAnimation } from './useChartAnimation';
import { ConvertPluginsIntoSignatures } from '../models/helpers';
import { useChartDimensions } from './useChartDimensions';
import { useChartId, UseChartIdParameters } from './useChartId';
import { useChartSeries } from './useChartSeries';
import { useChartInteractionListener } from './useChartInteractionListener';

/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the Charts components.
 */
export const CHART_CORE_PLUGINS = [
  useChartId,
  useChartDimensions,
  useChartSeries,
  useChartInteractionListener,
  useChartAnimation,
] as const;

export type ChartCorePluginSignatures = ConvertPluginsIntoSignatures<typeof CHART_CORE_PLUGINS>;

export interface ChartCorePluginParameters extends UseChartIdParameters {}
