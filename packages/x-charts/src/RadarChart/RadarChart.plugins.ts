import {
  useChartPolarAxis,
  type UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import {
  useChartInteraction,
  type UseChartInteractionSignature,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import {
  useChartHighlight,
  type UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight';

export const RADAR_PLUGINS = [useChartInteraction, useChartPolarAxis, useChartHighlight] as const;

export type RadarChartPluginSignatures = [
  UseChartInteractionSignature,
  UseChartPolarAxisSignature,
  UseChartHighlightSignature,
];
