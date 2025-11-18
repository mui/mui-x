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
import {
  useChartVisibleSeries,
  UseChartVisibleSeriesSignature,
} from '../internals/plugins/featurePlugins/useChartVisibleSeries';

export type PieChartPluginSignatures = [
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartVisibleSeriesSignature,
  UseChartKeyboardNavigationSignature,
];
export const PIE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<PieChartPluginSignatures> = [
  useChartInteraction,
  useChartHighlight,
  useChartVisibleSeries,
  useChartKeyboardNavigation,
];
