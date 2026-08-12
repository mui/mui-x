import {
  useChartZAxis,
  useChartCartesianAxis,
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartBrush,
  useChartItemClick,
  useChartKeyboardNavigation,
} from '@mui/x-charts/internals';
import type {
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartBrushSignature,
  UseChartItemClickSignature,
  UseChartKeyboardNavigationSignature,
  ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import { useChartProExport } from '../internals/plugins/useChartProExport';
import type { UseChartProExportSignature } from '../internals/plugins/useChartProExport';
import { useChartProZoom } from '../internals/plugins/useChartProZoom';
import type { UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

export type HeatmapPluginSignatures = [
  UseChartZAxisSignature,
  UseChartTooltipSignature<'heatmap'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'heatmap'>,
  UseChartHighlightSignature<'heatmap'>,
  UseChartProExportSignature,
  UseChartBrushSignature,
  UseChartProZoomSignature,
  UseChartItemClickSignature<'heatmap'>,
  UseChartKeyboardNavigationSignature,
];

export const HEATMAP_PLUGINS: ConvertSignaturesIntoPlugins<HeatmapPluginSignatures> = [
  useChartZAxis,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartProExport,
  useChartBrush,
  useChartProZoom,
  useChartItemClick,
  useChartKeyboardNavigation,
];
