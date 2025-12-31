import {
  useChartPolarAxis,
  type UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import {
  useChartTooltip,
  type UseChartTooltipSignature,
} from '../internals/plugins/featurePlugins/useChartTooltip';
import {
  useChartInteraction,
  type UseChartInteractionSignature,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import {
  useChartHighlight,
  type UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight';
import {
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
} from '../internals/plugins/featurePlugins/useChartVisibilityManager';

export const RADAR_PLUGINS = [
  useChartTooltip,
  useChartInteraction,
  useChartPolarAxis,
  useChartHighlight,
  useChartVisibilityManager,
] as const;

export type RadarChartPluginSignatures = [
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartPolarAxisSignature,
  UseChartHighlightSignature,
  UseChartVisibilityManagerSignature<'radar'>,
];
