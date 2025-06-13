import {
  useChartZAxis,
  UseChartZAxisSignature,
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
  useChartInteraction,
  UseChartInteractionSignature,
  useChartHighlight,
  UseChartHighlightSignature,
  ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type HeatmapPluginsSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'heatmap'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProExportSignature,
];

export const HEATMAP_PLUGINS = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartProExport,
] as ConvertSignaturesIntoPlugins<HeatmapPluginsSignatures>;
