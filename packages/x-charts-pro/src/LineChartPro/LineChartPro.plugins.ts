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
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import { useChartProZoom, UseChartProZoomSignature } from '../internals/plugins/useChartProZoom';

export type LineChartProPluginsSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'line'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export const LINE_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<LineChartProPluginsSignatures> = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartProZoom,
  useChartProExport,
];
