import {
  ConvertSignaturesIntoPlugins,
  UseChartHighlightSignature,
  UseChartInteractionSignature,
  PIE_CHART_PLUGINS,
  UseChartKeyboardNavigationSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type PieChartProPluginSignatures = [
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartKeyboardNavigationSignature,
  UseChartProExportSignature,
];

export const PIE_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<PieChartProPluginSignatures> = [
  ...PIE_CHART_PLUGINS,
  useChartProExport,
];
