import { getValueToPositionMapper, useScatterSeriesContext, useXAxes, useYAxes } from '../hooks';
import {
  type DefaultizedScatterSeriesType,
  type ScatterItemIdentifier,
  type ScatterValueType,
} from '../models/seriesType/scatter';

export interface ResolvedScatterItem {
  cx: number;
  cy: number;
  series: DefaultizedScatterSeriesType;
  scatterPoint: ScatterValueType;
}

/**
 * Resolves a scatter item identifier to its on-screen position and the owning
 * series. Shared by `FocusedScatterMark`, `HighlightedScatterMark`, and other
 * overlay components that need to draw an SVG element at a specific scatter point.
 *
 * Returns `null` if the identifier is missing, the identifier doesn't point to
 * a scatter series, or the referenced point can't be resolved.
 */
export function useScatterItemPosition(
  item: Pick<ScatterItemIdentifier, 'seriesId' | 'dataIndex'> | null | undefined,
): ResolvedScatterItem | null {
  const scatterSeries = useScatterSeriesContext();
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();

  if (!item || !scatterSeries) {
    return null;
  }

  const series = scatterSeries.series[item.seriesId];
  if (!series) {
    return null;
  }

  const scatterPoint = series.data[item.dataIndex];
  if (!scatterPoint) {
    return null;
  }

  const xAxisId = series.xAxisId ?? xAxisIds[0];
  const yAxisId = series.yAxisId ?? yAxisIds[0];
  const cx = getValueToPositionMapper(xAxis[xAxisId].scale)(scatterPoint.x);
  const cy = getValueToPositionMapper(yAxis[yAxisId].scale)(scatterPoint.y);

  return { cx, cy, series, scatterPoint };
}
