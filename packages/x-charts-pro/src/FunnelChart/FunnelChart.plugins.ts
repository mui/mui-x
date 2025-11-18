import {
  ConvertSignaturesIntoPlugins,
  useChartHighlight,
  UseChartHighlightSignature,
  useChartInteraction,
  UseChartInteractionSignature,
  useChartVisibleSeries,
  UseChartVisibleSeriesSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import { useChartFunnelAxis } from './funnelAxisPlugin/useChartFunnelAxis';
import { UseChartFunnelAxisSignature } from './funnelAxisPlugin/useChartFunnelAxis.types';

export type FunnelChartPluginSignatures = [
  UseChartFunnelAxisSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartVisibleSeriesSignature,
  UseChartProExportSignature,
];

export const FUNNEL_CHART_PLUGINS: ConvertSignaturesIntoPlugins<FunnelChartPluginSignatures> = [
  useChartFunnelAxis,
  useChartInteraction,
  useChartHighlight,
  useChartVisibleSeries,
  useChartProExport,
];
