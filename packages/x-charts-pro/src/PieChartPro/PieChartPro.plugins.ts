import { PIE_CHART_PLUGINS } from '@mui/x-charts/internals';
import type {
  ConvertSignaturesIntoPlugins,
  UseChartHighlightSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartKeyboardNavigationSignature,
  UseChartVisibilityManagerSignature,
} from '@mui/x-charts/internals';
import { useChartProExport } from '../internals/plugins/useChartProExport';
import type { UseChartProExportSignature } from '../internals/plugins/useChartProExport';

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
