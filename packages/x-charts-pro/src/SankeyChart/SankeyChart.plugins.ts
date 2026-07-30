import {
  useChartTooltip,
  useChartInteraction,
  useChartKeyboardNavigation,
  useChartHighlight,
} from '@mui/x-charts/internals';
import type {
  ConvertSignaturesIntoPlugins,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartKeyboardNavigationSignature,
  UseChartHighlightSignature,
} from '@mui/x-charts/internals';
import { useChartProExport } from '../internals/plugins/useChartProExport';
import type { UseChartProExportSignature } from '../internals/plugins/useChartProExport';

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
