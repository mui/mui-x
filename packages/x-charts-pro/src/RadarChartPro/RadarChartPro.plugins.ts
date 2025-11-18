import {
  ConvertSignaturesIntoPlugins,
  useChartHighlight,
  UseChartHighlightSignature,
  useChartInteraction,
  UseChartInteractionSignature,
  useChartPolarAxis,
  UseChartPolarAxisSignature,
  useChartVisibleSeries,
  UseChartVisibleSeriesSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';

export type RadarChartProPluginSignatures = [
  UseChartInteractionSignature,
  UseChartPolarAxisSignature,
  UseChartHighlightSignature,
  UseChartVisibleSeriesSignature,
  UseChartProExportSignature,
];

export const RADAR_CHART_PRO_PLUGINS: ConvertSignaturesIntoPlugins<RadarChartProPluginSignatures> =
  [
    useChartInteraction,
    useChartPolarAxis,
    useChartHighlight,
    useChartVisibleSeries,
    useChartProExport,
  ];
