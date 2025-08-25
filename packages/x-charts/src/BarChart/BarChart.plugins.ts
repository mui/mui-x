import { useChartZAxis, UseChartZAxisSignature } from '../plugins/featurePlugins/useChartZAxis';
import {
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
} from '../plugins/featurePlugins/useChartCartesianAxis';
import {
  useChartInteraction,
  UseChartInteractionSignature,
} from '../plugins/featurePlugins/useChartInteraction';
import {
  useChartHighlight,
  UseChartHighlightSignature,
} from '../plugins/featurePlugins/useChartHighlight';
import { ConvertSignaturesIntoPlugins } from '../plugins/models/helpers';

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
