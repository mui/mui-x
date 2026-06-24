import {
  useChartZAxis,
  useChartPolarAxis,
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartKeyboardNavigation,
  useChartVisibilityManager,
} from '@mui/x-charts/internals';
import type {
  UseChartZAxisSignature,
  UseChartPolarAxisSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartKeyboardNavigationSignature,
  UseChartVisibilityManagerSignature,
  ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import { useChartProExport } from '@mui/x-charts-pro/plugins';
import type { UseChartProExportSignature } from '@mui/x-charts-pro/plugins';

export type RadialLineChartPluginSignatures = [
  UseChartZAxisSignature,
  UseChartTooltipSignature<'radialLine'>,
  UseChartInteractionSignature,
  UseChartPolarAxisSignature<'radialLine'>,
  UseChartHighlightSignature<'radialLine'>,
  UseChartVisibilityManagerSignature<'radialLine'>,
  UseChartKeyboardNavigationSignature,
  UseChartProExportSignature,
];

export const RADIAL_LINE_CHART_PLUGINS: ConvertSignaturesIntoPlugins<RadialLineChartPluginSignatures> =
  [
    useChartZAxis,
    useChartTooltip,
    useChartInteraction,
    useChartPolarAxis,
    useChartHighlight,
    useChartVisibilityManager,
    useChartKeyboardNavigation,
    useChartProExport,
  ];
