import {
  ConvertSignaturesIntoPlugins,
  useChartInteraction,
  UseChartInteractionSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import { useSankeyHighlight, type UseSankeyHighlightSignature } from './plugins';

export type SankeyChartPluginSignatures = [
  UseChartInteractionSignature,
  UseSankeyHighlightSignature,
  UseChartProExportSignature,
];

export const SANKEY_CHART_PLUGINS: ConvertSignaturesIntoPlugins<SankeyChartPluginSignatures> = [
  useChartInteraction,
  useSankeyHighlight,
  useChartProExport,
];
