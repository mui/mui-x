import {
  useChartZAxis,
  UseChartZAxisSignature,
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
  useChartInteraction,
  UseChartInteractionSignature,
  useChartHighlight,
  UseChartHighlightSignature,
  useChartKeyboardNavigation,
  UseChartKeyboardNavigationSignature,
  useChartBrush,
  UseChartBrushSignature,
  ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import { useChartProZoom, UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

export type BarChartProPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartCartesianAxisSignature<'bar'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartKeyboardNavigationSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export const BAR_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<BarChartProPluginSignatures> = [
  useChartZAxis,
  useChartBrush,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartKeyboardNavigation,
  useChartProZoom,
  useChartProExport,
];
