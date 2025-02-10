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

export type HeatmapPluginsSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'heatmap'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
];

export const HEATMAP_PLUGINS = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
] as ConvertSignaturesIntoPlugins<HeatmapPluginsSignatures>;
