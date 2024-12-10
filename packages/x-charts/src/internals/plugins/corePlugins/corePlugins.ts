import { ConvertPluginsIntoSignatures } from '../models/helpers';
import { useChartId, UseChartIdParameters } from './useChartId';

/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the Charts components.
 */
export const CHART_CORE_PLUGINS = [useChartId] as const;

export type ChartCorePluginSignatures = ConvertPluginsIntoSignatures<typeof CHART_CORE_PLUGINS>;

export interface ChartCorePluginParameters extends UseChartIdParameters {}
