import {
  useChartZAxis,
  type UseChartZAxisSignature,
} from '../internals/plugins/featurePlugins/useChartZAxis';
import {
  useChartCartesianAxis,
  type UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
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
import { type ConvertSignaturesIntoPlugins } from '../internals/plugins/models/helpers';
import {
  useChartBrush,
  type UseChartBrushSignature,
} from '../internals/plugins/featurePlugins/useChartBrush';
import {
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
} from '../internals/plugins/featurePlugins/useChartVisibilityManager';

export type LineChartPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature<'line'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'line'>,
  UseChartHighlightSignature,
  UseChartVisibilityManagerSignature<'line'>,
  UseChartKeyboardNavigationSignature,
];

export const LINE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<LineChartPluginSignatures> = [
  useChartZAxis,
  useChartBrush,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartVisibilityManager,
  useChartKeyboardNavigation,
];
