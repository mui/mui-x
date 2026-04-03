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
  useChartKeyboardNavigation,
  type UseChartKeyboardNavigationSignature,
} from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import {
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
} from '../internals/plugins/featurePlugins/useChartVisibilityManager';

export const POLAR_PLUGINS = [
  useChartTooltip,
  useChartInteraction,
  useChartPolarAxis,
  useChartHighlight,
  useChartKeyboardNavigation,
  useChartVisibilityManager,
] as const;

export type PolarPluginSignatures<SeriesType extends 'line' = 'line'> = [
  UseChartTooltipSignature<SeriesType>,
  UseChartInteractionSignature,
  UseChartPolarAxisSignature,
  UseChartHighlightSignature<SeriesType>,
  UseChartKeyboardNavigationSignature,
  UseChartVisibilityManagerSignature<SeriesType>,
];
