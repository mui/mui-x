import {
  useChartZAxis,
  UseChartZAxisSignature,
  useChartCartesianAxis,
  UseChartCartesianAxisSignature,
  useChartInteraction,
  UseChartInteractionSignature,
  useChartHighlight,
  UseChartHighlightSignature,
  ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import { useChartProZoom, UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

export type LineChartProPluginsSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'line'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProZoomSignature,
];

export const LINE_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<LineChartProPluginsSignatures> = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartProZoom,
];
