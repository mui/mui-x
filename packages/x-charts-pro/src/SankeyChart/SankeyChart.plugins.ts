import {
  ConvertSignaturesIntoPlugins,
  useChartHighlight,
  // useChartHighlight,
  UseChartHighlightSignature,
  useChartInteraction,
  UseChartInteractionSignature,
} from '@mui/x-charts/internals';
import {} from // useChartProExport,
// UseChartProExportSignature,
'../internals/plugins/useChartProExport';

export type SankeyChartPluginsSignatures = [
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  // UseChartProExportSignature,
];

export const SANKEY_CHART_PLUGINS: ConvertSignaturesIntoPlugins<SankeyChartPluginsSignatures> = [
  useChartInteraction,
  useChartHighlight,
  // useChartProExport,
];
