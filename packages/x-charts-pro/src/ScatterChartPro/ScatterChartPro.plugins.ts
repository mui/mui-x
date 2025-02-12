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
  ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import { useChartProZoom, UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

export type ScatterChartProPluginsSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'scatter'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartVoronoiSignature,
  UseChartProZoomSignature,
];

export const SCATTER_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<ScatterChartProPluginsSignatures> =
  [
    useChartZAxis,
    useChartCartesianAxis,
    useChartInteraction,
    useChartHighlight,
    useChartVoronoi,
    useChartProZoom,
  ];
