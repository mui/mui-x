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

export type LineChartProPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartCartesianAxisSignature<'line'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartKeyboardNavigationSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export const LINE_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<LineChartProPluginSignatures> = [
  useChartZAxis,
  useChartBrush,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartKeyboardNavigation,
  useChartProZoom,
  useChartProExport,
];
