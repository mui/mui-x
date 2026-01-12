import {
  useChartZAxis,
  type UseChartZAxisSignature,
  useChartCartesianAxis,
  type UseChartCartesianAxisSignature,
  useChartTooltip,
  type UseChartTooltipSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartHighlight,
  type UseChartHighlightSignature,
  useChartBrush,
  type UseChartBrushSignature,
  useChartItemClick,
  type UseChartItemClickSignature,
  type ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import {
  useChartProZoom,
  type UseChartProZoomSignature,
} from '../internals/plugins/useChartProZoom';

export type HeatmapPluginSignatures = [
  UseChartZAxisSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'heatmap'>,
  UseChartHighlightSignature,
  UseChartProExportSignature,
  UseChartBrushSignature,
  UseChartProZoomSignature,
  UseChartItemClickSignature<'heatmap'>,
];

export const HEATMAP_PLUGINS = [
  useChartZAxis,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartProExport,
  useChartBrush,
  useChartProZoom,
  useChartItemClick,
] as ConvertSignaturesIntoPlugins<HeatmapPluginSignatures>;
