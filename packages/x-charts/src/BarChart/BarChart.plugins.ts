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
import { ConvertSignaturesIntoPlugins } from '../internals/plugins/models/helpers';

export type BarChartPluginsSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'bar'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
];

export const BAR_CHART_PLUGINS: ConvertSignaturesIntoPlugins<BarChartPluginsSignatures> = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
];
