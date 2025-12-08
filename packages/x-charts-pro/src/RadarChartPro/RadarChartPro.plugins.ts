import {
  type ConvertSignaturesIntoPlugins,
  useChartHighlight,
  type UseChartHighlightSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartPolarAxis,
  type UseChartPolarAxisSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type RadarChartProPluginSignatures = [
  UseChartInteractionSignature,
  UseChartPolarAxisSignature,
  UseChartHighlightSignature,
  UseChartProExportSignature,
];

export const RADAR_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<RadarChartProPluginSignatures> =
  [useChartInteraction, useChartPolarAxis, useChartHighlight, useChartProExport];
