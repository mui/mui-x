import {
  useChartZAxis,
  useChartPolarAxis,
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartKeyboardNavigation,
  useChartItemClick,
  useChartVisibilityManager,
} from '@mui/x-charts/internals';
import type {
  UseChartZAxisSignature,
  UseChartPolarAxisSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartKeyboardNavigationSignature,
  UseChartItemClickSignature,
  UseChartVisibilityManagerSignature,
  ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import { useChartProExport } from '../plugins';
import type { UseChartProExportSignature } from '../plugins';

export type RadialBarChartPluginSignatures = [
  UseChartZAxisSignature,
  UseChartTooltipSignature<'radialBar'>,
  UseChartInteractionSignature,
  UseChartPolarAxisSignature<'radialBar'>,
  UseChartHighlightSignature<'radialBar'>,
  UseChartVisibilityManagerSignature<'radialBar'>,
  UseChartKeyboardNavigationSignature,
  UseChartItemClickSignature<'radialBar'>,
  UseChartProExportSignature,
];

export const RADIAL_BAR_CHART_PLUGINS: ConvertSignaturesIntoPlugins<RadialBarChartPluginSignatures> =
  [
    useChartZAxis,
    useChartTooltip,
    useChartInteraction,
    useChartPolarAxis,
    useChartHighlight,
    useChartVisibilityManager,
    useChartKeyboardNavigation,
    useChartItemClick,
    useChartProExport,
  ];
