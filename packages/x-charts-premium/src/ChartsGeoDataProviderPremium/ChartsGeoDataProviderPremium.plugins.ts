import {
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
  type ChartSeriesType,
} from '@mui/x-charts/internals';
import { useChartProExport, type UseChartProExportSignature } from '@mui/x-charts-pro/plugins';
import {
  useGeoProjection,
  type UseGeoProjectionSignature,
} from '../internals/plugins/useGeoProjection';

export const GEO_PREMIUM_PLUGINS = [
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartKeyboardNavigation,
  useChartVisibilityManager,
  useChartProExport,
  useGeoProjection,
] as const;

export type GeoPremiumPluginSignatures<SeriesType extends ChartSeriesType = ChartSeriesType> = [
  UseChartTooltipSignature<SeriesType>,
  UseChartInteractionSignature,
  UseChartHighlightSignature<SeriesType>,
  UseChartKeyboardNavigationSignature,
  UseChartVisibilityManagerSignature<SeriesType>,
  UseChartProExportSignature,
  UseGeoProjectionSignature,
];
