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
  useChartKeyboardNavigation,
  type UseChartKeyboardNavigationSignature,
  useChartItemClick,
  type UseChartItemClickSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
  useChartProZoom,
  type UseChartProZoomSignature,
} from '@mui/x-charts-pro/plugins';

export type HeatmapPremiumPluginSignatures = [
  UseChartZAxisSignature,
  UseChartTooltipSignature<'heatmap'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'heatmap'>,
  UseChartHighlightSignature,
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
