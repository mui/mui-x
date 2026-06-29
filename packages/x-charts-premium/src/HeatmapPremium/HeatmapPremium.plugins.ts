import {
  useChartZAxis,
  useChartCartesianAxis,
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartBrush,
  useChartKeyboardNavigation,
  useChartItemClick,
} from '@mui/x-charts/internals';
import type {
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  ConvertSignaturesIntoPlugins,
  UseChartBrushSignature,
  UseChartKeyboardNavigationSignature,
  UseChartItemClickSignature,
} from '@mui/x-charts/internals';
import { useChartProExport, useChartProZoom } from '@mui/x-charts-pro/plugins';
import type {
  UseChartProExportSignature,
  UseChartProZoomSignature,
} from '@mui/x-charts-pro/plugins';

export type HeatmapPremiumPluginSignatures = [
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

export const HEATMAP_PREMIUM_PLUGINS = [
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
] as ConvertSignaturesIntoPlugins<HeatmapPremiumPluginSignatures>;
