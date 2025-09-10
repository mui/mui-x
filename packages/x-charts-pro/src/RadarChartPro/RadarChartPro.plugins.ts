import {
  ConvertSignaturesIntoPlugins,
  useChartHighlight,
  UseChartHighlightSignature,
  useChartInteraction,
  UseChartInteractionSignature,
  useChartPolarAxis,
  UseChartPolarAxisSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type RadarChartProPluginSignatures = [
  UseChartPolarAxisSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProExportSignature,
];

export const RADAR_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<RadarChartProPluginSignatures> =
  [useChartPolarAxis, useChartInteraction, useChartHighlight, useChartProExport];
