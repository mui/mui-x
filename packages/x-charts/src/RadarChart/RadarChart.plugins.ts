import {
  useChartPolarAxis,
  UseChartPolarAxisSignature,
} from '../plugins/featurePlugins/useChartPolarAxis';
import {
  useChartInteraction,
  UseChartInteractionSignature,
} from '../plugins/featurePlugins/useChartInteraction';
import {
  useChartHighlight,
  UseChartHighlightSignature,
} from '../plugins/featurePlugins/useChartHighlight';

export const RADAR_PLUGINS = [useChartPolarAxis, useChartInteraction, useChartHighlight] as const;

export type RadarChartPluginsSignatures = [
  UseChartPolarAxisSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
];
