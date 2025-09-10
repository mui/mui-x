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

export type BarChartProPluginSignatures = [
  UseChartZAxisSignature,
  UseChartCartesianAxisSignature<'bar'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProZoomSignature,
  UseChartProExportSignature,
];

export const BAR_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<BarChartProPluginSignatures> = [
  useChartZAxis,
  useChartCartesianAxis,
  useChartInteraction,
  useChartHighlight,
  useChartProZoom,
  useChartProExport,
];
