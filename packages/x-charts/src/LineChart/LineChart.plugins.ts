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

export type LineChartPluginsSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'line'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
];

export const LINE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<LineChartPluginsSignatures> = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
];
