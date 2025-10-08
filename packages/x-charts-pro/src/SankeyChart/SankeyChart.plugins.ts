import {
  ConvertSignaturesIntoPlugins,
  useChartInteraction,
  UseChartInteractionSignature,
} from '@mui/x-charts/internals';
import { useSankeyHighlight, UseSankeyHighlightSignature } from './plugins';

export type SankeyChartPluginSignatures = [
  UseChartInteractionSignature,
  UseSankeyHighlightSignature,
];

export const SANKEY_CHART_PLUGINS: ConvertSignaturesIntoPlugins<SankeyChartPluginSignatures> = [
  useChartInteraction,
  useSankeyHighlight,
];
