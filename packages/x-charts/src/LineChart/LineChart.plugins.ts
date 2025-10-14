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
import {
  useChartBrush,
  UseChartBrushSignature,
} from '../internals/plugins/featurePlugins/useChartBrush';

export type LineChartPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartCartesianAxisSignature<'line'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartKeyboardNavigationSignature,
];

export const LINE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<LineChartPluginSignatures> = [
  useChartZAxis,
  useChartBrush,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartKeyboardNavigation,
];
