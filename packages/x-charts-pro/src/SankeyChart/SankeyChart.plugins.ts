import {
  type ConvertSignaturesIntoPlugins,
  useChartInteraction,
  type UseChartInteractionSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
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
