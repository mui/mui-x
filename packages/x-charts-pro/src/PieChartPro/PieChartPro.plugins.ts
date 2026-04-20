import {
  type ConvertSignaturesIntoPlugins,
  type UseChartHighlightSignature,
  type UseChartTooltipSignature,
  type UseChartInteractionSignature,
  PIE_CHART_PLUGINS,
  type UseChartKeyboardNavigationSignature,
  type UseChartVisibilityManagerSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type PieChartProPluginSignatures = [
  UseChartTooltipSignature<'pie'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature<'pie'>,
  UseChartVisibilityManagerSignature<'pie'>,
  UseChartKeyboardNavigationSignature,
  UseChartProExportSignature,
];

export const PIE_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<PieChartProPluginSignatures> = [
  ...PIE_CHART_PLUGINS,
  useChartProExport,
];
