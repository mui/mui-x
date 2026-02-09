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
  useChartClosestPoint,
  type UseChartClosestPointSignature,
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

export type ScatterChartProPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature<'scatter'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'scatter'>,
  UseChartHighlightSignature,
  UseChartVisibilityManagerSignature<'scatter'>,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export const SCATTER_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<ScatterChartProPluginSignatures> =
  [
    useChartZAxis,
    useChartBrush,
    useChartTooltip,
    useChartInteraction,
    useChartCartesianAxis,
    useChartHighlight,
    useChartVisibilityManager,
    useChartClosestPoint,
    useChartKeyboardNavigation,
    useChartProZoom,
    useChartProExport,
  ];
