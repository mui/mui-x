import {
  useChartInteraction,
  UseChartInteractionSignature,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import {
  useChartHighlight,
  UseChartHighlightSignature,
} from '../internals/plugins/featurePlugins/useChartHighlight';
import { ConvertSignaturesIntoPlugins } from '../internals/plugins/models/helpers';

export type PieChartPluginsSignatures = [UseChartInteractionSignature, UseChartHighlightSignature];

export const PIE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<PieChartPluginsSignatures> = [
  useChartInteraction,
  useChartHighlight,
];
