import {
  ConvertSignaturesIntoPlugins,
  useChartHighlight,
  UseChartHighlightSignature,
  useChartInteraction,
  UseChartInteractionSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import { useChartFunnelAxis } from './funnelAxisPlugin/useChartFunnelAxis';
import { UseChartFunnelAxisSignature } from './funnelAxisPlugin/useChartFunnelAxis.types';

export type FunnelChartPluginsSignatures = [
  UseChartFunnelAxisSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProExportSignature,
];

export const FUNNEL_CHART_PLUGINS: ConvertSignaturesIntoPlugins<FunnelChartPluginsSignatures> = [
  useChartFunnelAxis,
  useChartInteraction,
  useChartHighlight,
  useChartProExport,
];
