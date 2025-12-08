import {
  useChartZAxis,
  type UseChartZAxisSignature,
  useChartCartesianAxis,
  type UseChartCartesianAxisSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartHighlight,
  type UseChartHighlightSignature,
  type ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type HeatmapPluginSignatures = [
  UseChartZAxisSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'heatmap'>,
  UseChartHighlightSignature,
  UseChartProExportSignature,
];

export const HEATMAP_PLUGINS = [
  useChartZAxis,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartProExport,
] as ConvertSignaturesIntoPlugins<HeatmapPluginSignatures>;
