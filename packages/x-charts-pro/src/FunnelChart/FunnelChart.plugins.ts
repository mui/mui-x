import {
  ConvertSignaturesIntoPlugins,
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
  useChartHighlight,
  UseChartHighlightSignature,
  useChartInteraction,
  UseChartInteractionSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type FunnelChartPluginsSignatures = [
  UseChartCartesianAxisSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProExportSignature,
];

export const FUNNEL_CHART_PLUGINS: ConvertSignaturesIntoPlugins<FunnelChartPluginsSignatures> = [
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartProExport,
];
