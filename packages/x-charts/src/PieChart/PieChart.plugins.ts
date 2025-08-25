import {
  useChartInteraction,
  UseChartInteractionSignature,
} from '../plugins/featurePlugins/useChartInteraction';
import {
  useChartHighlight,
  UseChartHighlightSignature,
} from '../plugins/featurePlugins/useChartHighlight';
import { ConvertSignaturesIntoPlugins } from '../plugins/models/helpers';

export type PieChartPluginSignatures = [UseChartInteractionSignature, UseChartHighlightSignature];

export const PIE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<PieChartPluginSignatures> = [
  useChartInteraction,
  useChartHighlight,
];
