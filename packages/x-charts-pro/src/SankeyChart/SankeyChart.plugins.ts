import {
  type ConvertSignaturesIntoPlugins,
  useChartTooltip,
  type UseChartTooltipSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartKeyboardNavigation,
  type UseChartKeyboardNavigationSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import { useSankeyHighlight, type UseSankeyHighlightSignature } from './plugins';

export type SankeyChartPluginSignatures = [
  UseChartTooltipSignature<'sankey'>,
  UseChartInteractionSignature,
  UseSankeyHighlightSignature,
  UseChartProExportSignature,
  UseChartKeyboardNavigationSignature,
];

export const SANKEY_CHART_PLUGINS: ConvertSignaturesIntoPlugins<SankeyChartPluginSignatures> = [
  useChartTooltip,
  useChartInteraction,
  useSankeyHighlight,
  useChartProExport,
  useChartKeyboardNavigation,
];
