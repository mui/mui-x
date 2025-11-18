import {
  useChartPolarAxis,
  UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import {
  useChartInteraction,
  UseChartInteractionSignature,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import {
  useChartHighlight,
  UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight';
import {
  useChartVisibleSeries,
  UseChartVisibleSeriesSignature,
} from '../internals/plugins/featurePlugins/useChartVisibleSeries';

export const RADAR_PLUGINS = [
  useChartInteraction,
  useChartPolarAxis,
  useChartHighlight,
  useChartVisibleSeries,
] as const;

export type RadarChartPluginSignatures = [
  UseChartInteractionSignature,
  UseChartPolarAxisSignature,
  UseChartHighlightSignature,
  UseChartVisibleSeriesSignature,
];
