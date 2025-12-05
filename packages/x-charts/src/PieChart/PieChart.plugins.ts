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
import { type ConvertSignaturesIntoPlugins } from '../internals/plugins/models/helpers';
import {
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
} from '../internals/plugins/featurePlugins/useChartVisibilityManager';

export type PieChartPluginSignatures = [
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartVisibilityManagerSignature,
  UseChartKeyboardNavigationSignature,
];
export const PIE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<PieChartPluginSignatures> = [
  useChartInteraction,
  useChartHighlight,
  useChartVisibilityManager,
  useChartKeyboardNavigation,
];
