import {
  useChartZAxis,
  useChartCartesianAxis,
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartClosestPoint,
  useChartKeyboardNavigation,
  useChartBrush,
  useChartVisibilityManager,
  useProgressiveRendering,
} from '@mui/x-charts/internals';
import type {
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
  UseChartBrushSignature,
  ConvertSignaturesIntoPlugins,
  UseChartVisibilityManagerSignature,
  UseProgressiveRenderingSignature,
} from '@mui/x-charts/internals';
import { useChartProExport } from '../internals/plugins/useChartProExport';
import type { UseChartProExportSignature } from '../internals/plugins/useChartProExport';
import { useChartProZoom } from '../internals/plugins/useChartProZoom';
import type { UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

export type ScatterChartProPluginSignatures = [
  UseChartZAxisSignature,
  UseChartBrushSignature,
  UseChartTooltipSignature<'scatter'>,
  UseChartInteractionSignature,
  UseChartCartesianAxisSignature<'scatter'>,
  UseChartHighlightSignature<'scatter'>,
  UseChartVisibilityManagerSignature<'scatter'>,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
  UseProgressiveRenderingSignature,
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
    useProgressiveRendering,
  ];
