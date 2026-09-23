import {
  useChartHighlight,
  useChartTooltip,
  useChartInteraction,
  useChartKeyboardNavigation,
  useChartVisibilityManager,
} from '@mui/x-charts/internals';
import type {
  ConvertSignaturesIntoPlugins,
  UseChartHighlightSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartKeyboardNavigationSignature,
  UseChartVisibilityManagerSignature,
} from '@mui/x-charts/internals';
import { useChartProExport } from '../internals/plugins/useChartProExport';
import type { UseChartProExportSignature } from '../internals/plugins/useChartProExport';
import { useChartFunnelAxis } from './funnelAxisPlugin/useChartFunnelAxis';
import type { UseChartFunnelAxisSignature } from './funnelAxisPlugin/useChartFunnelAxis.types';

export type FunnelChartPluginSignatures = [
  UseChartFunnelAxisSignature,
  UseChartTooltipSignature<'funnel'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature<'funnel'>,
  UseChartVisibilityManagerSignature<'funnel'>,
  UseChartProExportSignature,
  UseChartKeyboardNavigationSignature,
];

export const FUNNEL_CHART_PLUGINS: ConvertSignaturesIntoPlugins<FunnelChartPluginSignatures> = [
  useChartFunnelAxis,
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartVisibilityManager,
  useChartProExport,
  useChartKeyboardNavigation,
];
