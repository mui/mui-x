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

export type AreaChartPluginSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'areaRange'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartKeyboardNavigationSignature,
];

export const AREA_CHART_PLUGINS: ConvertSignaturesIntoPlugins<AreaChartPluginSignatures> = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartKeyboardNavigation,
];
