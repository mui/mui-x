import {
  type ConvertSignaturesIntoPlugins,
  useChartHighlight,
  type UseChartHighlightSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import { useChartFunnelAxis } from './funnelAxisPlugin/useChartFunnelAxis';
import { type UseChartFunnelAxisSignature } from './funnelAxisPlugin/useChartFunnelAxis.types';

export type FunnelChartPluginSignatures = [
  UseChartFunnelAxisSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartVisibilityManagerSignature,
  UseChartProExportSignature,
];

export const FUNNEL_CHART_PLUGINS: ConvertSignaturesIntoPlugins<FunnelChartPluginSignatures> = [
  useChartFunnelAxis,
  useChartInteraction,
  useChartHighlight,
  useChartVisibilityManager,
  useChartProExport,
];
