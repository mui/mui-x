import {
  useChartTooltip,
  useChartInteraction,
  useChartKeyboardNavigation,
  useChartHighlight,
} from '@mui/x-charts/internals';
import type {
  ConvertSignaturesIntoPlugins,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartKeyboardNavigationSignature,
  UseChartHighlightSignature,
} from '@mui/x-charts/internals';
import { useChartProExport } from '../internals/plugins/useChartProExport';
import type { UseChartProExportSignature } from '../internals/plugins/useChartProExport';

export type TreemapChartPluginSignatures = [
  UseChartTooltipSignature<'treemap'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature<'treemap'>,
  UseChartProExportSignature,
  UseChartKeyboardNavigationSignature,
];

export const TREEMAP_CHART_PLUGINS: ConvertSignaturesIntoPlugins<TreemapChartPluginSignatures> = [
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartProExport,
  useChartKeyboardNavigation,
];
