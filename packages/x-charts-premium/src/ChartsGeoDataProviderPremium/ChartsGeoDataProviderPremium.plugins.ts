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
  useChartZAxis,
  type UseChartZAxisSignature,
  type ChartSeriesType,
} from '@mui/x-charts/internals';
import { useChartProExport, type UseChartProExportSignature } from '@mui/x-charts-pro/plugins';
import {
  useGeoProjection,
  type UseGeoProjectionSignature,
} from '../internals/plugins/useGeoProjection';
import {
  useGeoProjectionZoom,
  type UseGeoProjectionZoomSignature,
} from '../internals/plugins/useGeoProjectionZoom';

export const GEO_PREMIUM_PLUGINS = [
  useChartZAxis,
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartKeyboardNavigation,
  useChartVisibilityManager,
  useChartProExport,
  useGeoProjection,
  useGeoProjectionZoom,
] as const;

export type GeoPremiumPluginSignatures<SeriesType extends ChartSeriesType = ChartSeriesType> = [
  UseChartZAxisSignature,
  UseChartTooltipSignature<SeriesType>,
  UseChartInteractionSignature,
  UseChartHighlightSignature<SeriesType>,
  UseChartKeyboardNavigationSignature,
  UseChartVisibilityManagerSignature<SeriesType>,
  UseChartProExportSignature,
  UseGeoProjectionSignature,
  UseGeoProjectionZoomSignature,
];
