import {
  useChartZAxis,
  type UseChartZAxisSignature,
} from '../internals/plugins/featurePlugins/useChartZAxis';
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
import { type ConvertSignaturesIntoPlugins } from '../internals/plugins/models/helpers';
import {
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
} from '../internals/plugins/featurePlugins/useChartVisibilityManager';

export type RadialLineChartPluginSignatures = [
  UseChartZAxisSignature,
  UseChartTooltipSignature<'line'>,
  UseChartInteractionSignature,
  UseChartPolarAxisSignature<'line'>,
  UseChartHighlightSignature<'line'>,
  UseChartVisibilityManagerSignature<'line'>,
  UseChartKeyboardNavigationSignature,
];

export const LINE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<RadialLineChartPluginSignatures> = [
  useChartZAxis,
  useChartTooltip,
  useChartInteraction,
  useChartPolarAxis,
  useChartHighlight,
  useChartVisibilityManager,
  useChartKeyboardNavigation,
];
