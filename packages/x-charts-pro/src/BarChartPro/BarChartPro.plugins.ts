import {
  useChartZAxis,
  type UseChartZAxisSignature,
  useChartCartesianAxis,
  type UseChartCartesianAxisSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartHighlight,
  type UseChartHighlightSignature,
  useChartKeyboardNavigation,
  type UseChartKeyboardNavigationSignature,
  useChartBrush,
  type UseChartBrushSignature,
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

export type BarChartProPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'bar'>,
  UseChartHighlightSignature,
  UseChartKeyboardNavigationSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export const BAR_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<BarChartProPluginSignatures> = [
  useChartZAxis,
  useChartBrush,
  useChartInteraction,
  useChartCartesianAxis,
  useChartHighlight,
  useChartKeyboardNavigation,
  useChartProZoom,
  useChartProExport,
];
