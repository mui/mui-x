import {
  useChartZAxis,
  type UseChartZAxisSignature,
  useChartPolarAxis,
  type UseChartPolarAxisSignature,
  useChartTooltip,
  type UseChartTooltipSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartHighlight,
  type UseChartHighlightSignature,
  useChartKeyboardNavigation,
  type UseChartKeyboardNavigationSignature,
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
  type ConvertSignaturesIntoPlugins,
} from '@mui/x-charts/internals';
import { useChartProExport, type UseChartProExportSignature } from '../plugins';

export type RadialBarChartPluginSignatures = [
  UseChartZAxisSignature,
  UseChartTooltipSignature<'radialBar'>,
  UseChartInteractionSignature,
  UseChartPolarAxisSignature<'radialBar'>,
  UseChartHighlightSignature<'radialBar'>,
  UseChartVisibilityManagerSignature<'radialBar'>,
  UseChartKeyboardNavigationSignature,
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
    useChartProExport,
  ];
