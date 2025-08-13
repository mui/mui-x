import {
  useChartZAxis,
  UseChartZAxisSignature,
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
  useChartInteraction,
  UseChartInteractionSignature,
  useChartHighlight,
  UseChartHighlightSignature,
  useChartVoronoi,
  UseChartVoronoiSignature,
  useChartKeyboardNavigation,
  UseChartKeyboardNavigationSignature,
  ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import { useChartProZoom, UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

export type ScatterChartProPluginsSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'scatter'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartVoronoiSignature,
  UseChartKeyboardNavigationSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export const SCATTER_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<ScatterChartProPluginsSignatures> =
  [
    useChartZAxis,
    useChartCartesianAxis,
    useChartInteraction,
    useChartHighlight,
    useChartVoronoi,
    useChartKeyboardNavigation,
    useChartProZoom,
    useChartProExport,
  ];
