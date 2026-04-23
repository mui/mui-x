import {
  useChartTooltip,
  type UseChartTooltipSignature,
  useChartInteraction,
  type UseChartInteractionSignature,
  useChartHighlight,
  type UseChartHighlightSignature,
  useChartPolarAxis,
  type UseChartPolarAxisSignature,
  useChartVisibilityManager,
  type UseChartVisibilityManagerSignature,
  useChartKeyboardNavigation,
  type UseChartKeyboardNavigationSignature,
  type PolarChartSeriesType,
} from '@mui/x-charts/internals';
import { useChartProExport, type UseChartProExportSignature } from '../internals/plugins/useChartProExport';


export const RADIAL_PRO_PLUGINS = [
  useChartTooltip,
  useChartInteraction,
  useChartPolarAxis,
  useChartHighlight,
  useChartKeyboardNavigation,
  useChartVisibilityManager,
  useChartProExport,
] as const;

export type RadialProPluginSignatures<SeriesType extends PolarChartSeriesType = PolarChartSeriesType> =
  [
    UseChartTooltipSignature<SeriesType>,
    UseChartInteractionSignature,
    UseChartPolarAxisSignature,
    UseChartHighlightSignature<SeriesType>,
    UseChartKeyboardNavigationSignature,
    UseChartVisibilityManagerSignature<SeriesType>,
    UseChartProExportSignature,
  ];
