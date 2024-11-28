// This file should be removed after creating all plugins  in favor of a file per chart type.
import { useChartInteraction } from './featurePlugins/useChartInteraction';

export const ALL_PLUGINS = [useChartInteraction] as const;
