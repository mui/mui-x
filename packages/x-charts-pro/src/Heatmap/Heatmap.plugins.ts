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
  useChartVisibleSeries,
  UseChartVisibleSeriesSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type HeatmapPluginSignatures = [
  UseChartZAxisSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'heatmap'>,
  UseChartHighlightSignature,
  UseChartVisibleSeriesSignature,
  UseChartProExportSignature,
];

export const HEATMAP_PLUGINS = [
  useChartZAxis,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartVisibleSeries,
  useChartProExport,
] as ConvertSignaturesIntoPlugins<HeatmapPluginSignatures>;
