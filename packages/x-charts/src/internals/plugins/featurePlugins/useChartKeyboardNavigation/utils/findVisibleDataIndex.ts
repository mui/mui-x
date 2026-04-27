import type { SeriesId } from '../../../../../models/seriesType/common';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { ProcessedSeries } from '../../../corePlugins/useChartSeries/useChartSeries.types';

/**
 * Walk forward (or backward) from `startIndex` and return the first dataIndex
 * whose data point is visible. Returns `null` if every traversed index is hidden.
 *
 * Series-level hidden flags are filtered upstream (see `getNonEmptySeriesArray`),
 * so only per-data-point hidden flags are relevant here. Today only Pie sets a
 * `hidden` flag on individual data items; for other series types the data
 * elements are scalars or objects without that field, and this helper returns
 * the proposed index unchanged.
 */
export function findVisibleDataIndex({
  processedSeries,
  type,
  seriesId,
  startIndex,
  dataLength,
  direction,
  allowCycles,
}: {
  processedSeries: ProcessedSeries<ChartSeriesType>;
  type: ChartSeriesType;
  seriesId: SeriesId;
  startIndex: number;
  dataLength: number;
  direction: 1 | -1;
  allowCycles: boolean;
}): number | null {
  if (dataLength <= 0) {
    return null;
  }

  const seriesData = processedSeries[type]?.series[seriesId]?.data as
    | ReadonlyArray<unknown>
    | undefined;

  const isIndexHidden = (idx: number): boolean => {
    if (!seriesData) {
      return false;
    }
    const item = seriesData[idx];
    return (
      typeof item === 'object' &&
      item !== null &&
      'hidden' in item &&
      Boolean((item as { hidden?: unknown }).hidden)
    );
  };

  let dataIndex = startIndex;
  for (let attempt = 0; attempt < dataLength; attempt += 1) {
    if (dataIndex >= 0 && dataIndex < dataLength && !isIndexHidden(dataIndex)) {
      return dataIndex;
    }

    if (allowCycles) {
      dataIndex = (dataIndex + direction + dataLength) % dataLength;
    } else {
      const next = dataIndex + direction;
      if (next < 0 || next >= dataLength) {
        return null;
      }
      dataIndex = next;
    }
  }

  return null;
}
