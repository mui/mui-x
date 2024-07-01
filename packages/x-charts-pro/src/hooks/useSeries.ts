import * as React from 'react';
import { useSeries } from '@mui/x-charts/internals';

/**
 * Get access to the internal state of heatmap series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns { series: Record<SeriesId, DefaultizedHeatmapSeriesType>; seriesOrder: SeriesId[]; } | undefined heatmapSeries
 */
export function useHeatmapSeries() {
  const series = useSeries();

  return React.useMemo(() => series.heatmap, [series.heatmap]);
}
