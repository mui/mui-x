import {
  type ConvertSignaturesIntoPlugins,
  useChartTooltip,
  type UseChartTooltipSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartKeyboardNavigation,
  type UseChartKeyboardNavigationSignature,
  useChartHighlight,
  type UseChartHighlightSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type SankeyChartPluginSignatures = [
  UseChartTooltipSignature<'sankey'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature<'sankey'>,
  UseChartProExportSignature,
  UseChartKeyboardNavigationSignature,
];

export const SANKEY_CHART_PLUGINS: ConvertSignaturesIntoPlugins<SankeyChartPluginSignatures> = [
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartProExport,
  useChartKeyboardNavigation,
];
