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
  useChartKeyboardNavigation,
  type UseChartKeyboardNavigationSignature,
  useChartBrush,
  type UseChartBrushSignature,
  type ConvertSignaturesIntoPlugins,
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import {
  useChartProZoom,
  type UseChartProZoomSignature,
} from '../internals/plugins/useChartProZoom';

export type LineChartProPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature<'line'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'line'>,
  UseChartHighlightSignature,
  UseChartVisibilityManagerSignature<'line'>,
  UseChartKeyboardNavigationSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export const LINE_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<LineChartProPluginSignatures> = [
  useChartZAxis,
  useChartBrush,
  useChartTooltip,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartVisibilityManager,
  useChartKeyboardNavigation,
  useChartProZoom,
  useChartProExport,
];
