import {
  useChartInteraction,
  UseChartInteractionSignature,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import {
  useChartHighlight,
  UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight';
import {
  useChartKeyboardNavigation,
  UseChartKeyboardNavigationSignature,
} from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import { ConvertSignaturesIntoPlugins } from '../internals/plugins/models/helpers';

export type PieChartPluginSignatures = [
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartKeyboardNavigationSignature,
];
export const PIE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<PieChartPluginSignatures> = [
  useChartInteraction,
  useChartHighlight,
  useChartKeyboardNavigation,
];
