import {
  type ConvertSignaturesIntoPlugins,
  useChartHighlight,
  type UseChartHighlightSignature,
  useChartTooltip,
  type UseChartTooltipSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
} from '@mui/x-charts/internals';
import {
  useChartProExport,
  type UseChartProExportSignature,
} from '../internals/plugins/useChartProExport';
import { useChartFunnelAxis } from './funnelAxisPlugin/useChartFunnelAxis';
import { type UseChartFunnelAxisSignature } from './funnelAxisPlugin/useChartFunnelAxis.types';

export type FunnelChartPluginSignatures = [
  UseChartFunnelAxisSignature,
  UseChartTooltipSignature<'funnel'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartProExportSignature,
];

export const FUNNEL_CHART_PLUGINS: ConvertSignaturesIntoPlugins<FunnelChartPluginSignatures> = [
  useChartFunnelAxis,
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartProExport,
];
