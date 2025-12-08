import {
  useChartZAxis,
  type UseChartZAxisSignature,
  useChartCartesianAxis,
  type UseChartCartesianAxisSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartHighlight,
  type UseChartHighlightSignature,
  useChartClosestPoint,
  type UseChartClosestPointSignature,
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

export type ScatterChartProPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'scatter'>,
  UseChartHighlightSignature,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export const SCATTER_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<ScatterChartProPluginSignatures> =
  [
    useChartZAxis,
    useChartBrush,
    useChartInteraction,
    useChartCartesianAxis,
    useChartHighlight,
    useChartClosestPoint,
    useChartKeyboardNavigation,
    useChartProZoom,
    useChartProExport,
  ];
