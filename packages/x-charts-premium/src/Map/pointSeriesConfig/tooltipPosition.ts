import { createSelectorMemoized } from '@mui/x-internals/store';
import type { SeriesId, TooltipItemPositionSelector } from '@mui/x-charts/internals';
import {
  selectorChartSeriesProcessed,
  selectorChartsTooltipItem,
  useGeoProjectionSelectors,
} from '@mui/x-charts/internals';

/**
 * Positions a map point tooltip from its projected coordinates. It lives in the map
 * series config (rather than the core tooltip plugin) so the geo projection is a
 * tracked dependency and d3-geo is only bundled with map charts.
 */
const selectorTooltipItemPosition: TooltipItemPositionSelector = createSelectorMemoized(
  selectorChartsTooltipItem,
  useGeoProjectionSelectors.selectorGeoTooltipPosition,
  selectorChartSeriesProcessed,
  // `selectorChartsTooltipItem` is typed with the community series types, which
  // don't include `mapPoint`, so the identifier is matched structurally here.
  (
    identifier: { type: string; seriesId?: SeriesId; dataIndex?: number } | null,
    { projection },
    processedSeries,
  ) => {
    if (
      identifier?.type !== 'mapPoint' ||
      identifier.seriesId === undefined ||
      identifier.dataIndex === undefined
    ) {
      return null;
    }

    if (projection == null) {
      return null;
    }

    const item = processedSeries.mapPoint?.series[identifier.seriesId]?.data[identifier.dataIndex];

    if (item == null) {
      return null;
    }

    const point = projection(item.coordinates);

    if (point == null) {
      return null;
    }

    return { x: point[0], y: point[1] };
  },
);

export default selectorTooltipItemPosition;
