import {
  useChartZAxis,
  UseChartZAxisSignature,
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
  useChartInteraction,
  UseChartInteractionSignature,
  useChartHighlight,
  UseChartHighlightSignature,
  useChartClosestPoint,
  UseChartClosestPointSignature,
  useChartKeyboardNavigation,
  UseChartKeyboardNavigationSignature,
  ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import { useChartProZoom, UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

export type ScatterChartProPluginSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'scatter'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartClosestPointSignature,
  UseChartKeyboardNavigationSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export const SCATTER_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<ScatterChartProPluginSignatures> =
  [
    useChartZAxis,
    useChartCartesianAxis,
    useChartInteraction,
    useChartHighlight,
    useChartClosestPoint,
    useChartKeyboardNavigation,
    useChartProZoom,
    useChartProExport,
  ];
