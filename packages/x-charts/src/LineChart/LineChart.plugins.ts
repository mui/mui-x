import {
  useChartZAxis,
  UseChartZAxisSignature,
} from '../internals/plugins/featurePlugins/useChartZAxis';
import {
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
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

export type LineChartPluginSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'line'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartKeyboardNavigationSignature,
];

export const LINE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<LineChartPluginSignatures> = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartKeyboardNavigation,
];
