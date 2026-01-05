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
  type ConvertSignaturesIntoPlugins,
  useChartBrush,
  type UseChartBrushSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import {
  useChartProZoom,
  type UseChartProZoomSignature,
} from '../internals/plugins/useChartProZoom';
import {
  useHeatmapCellClick,
  type UseHeatmapCellClickSignature,
} from './plugins/useHeatmapCellClick';

export type HeatmapPluginSignatures = [
  UseChartZAxisSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'heatmap'>,
  UseChartHighlightSignature,
  UseChartProExportSignature,
  UseChartBrushSignature,
  UseChartProZoomSignature,
  UseHeatmapCellClickSignature,
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
  useHeatmapCellClick,
] as ConvertSignaturesIntoPlugins<HeatmapPluginSignatures>;
