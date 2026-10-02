import {
  useChartTooltip,
  useChartInteraction,
  useChartHighlight,
  useChartKeyboardNavigation,
  useChartVisibilityManager,
  useChartZAxis,
} from '@mui/x-charts/internals';
import type {
  ChartSeriesType,
  UseChartZAxisSignature,
  UseChartTooltipSignature,
  UseChartInteractionSignature,
  UseChartHighlightSignature,
  UseChartKeyboardNavigationSignature,
  UseChartVisibilityManagerSignature,
} from '@mui/x-charts/internals';
import { useChartProExport } from '@mui/x-charts-pro/plugins';
import type { UseChartProExportSignature } from '@mui/x-charts-pro/plugins';
import { useGeoProjection } from '../internals/plugins/useGeoProjection';
import type { UseGeoProjectionSignature } from '../internals/plugins/useGeoProjection';
import { useGeoProjectionZoom } from '../internals/plugins/useGeoProjectionZoom';
import type { UseGeoProjectionZoomSignature } from '../internals/plugins/useGeoProjectionZoom';

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
