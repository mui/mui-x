import {
  useChartTooltip,
  useChartInteraction,
  useChartKeyboardNavigation,
  useChartHighlight,
  useChartItemClick,
} from '@mui/x-charts/internals';
import type {
  ConvertSignaturesIntoPlugins,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartKeyboardNavigationSignature,
  UseChartHighlightSignature,
  UseChartItemClickSignature,
} from '@mui/x-charts/internals';
import { useChartProExport } from '@mui/x-charts-pro/plugins';
import type { UseChartProExportSignature } from '@mui/x-charts-pro/plugins';

export type TreemapChartPluginSignatures = [
  UseChartTooltipSignature<'treemap'>,
  UseChartInteractionSignature,
  UseChartHighlightSignature<'treemap'>,
  UseChartProExportSignature,
  UseChartKeyboardNavigationSignature,
  UseChartItemClickSignature<'treemap'>,
];

export const TREEMAP_CHART_PLUGINS = [
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartProExport,
  useChartKeyboardNavigation,
  useChartItemClick,
] as ConvertSignaturesIntoPlugins<TreemapChartPluginSignatures>;
