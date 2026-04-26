import type { SeriesId } from '../../../../../models/seriesType/common';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type {
  IsItemVisibleFunction,
  VisibilityIdentifierWithType,
} from '../../useChartVisibilityManager';

/**
 * Walk forward (or backward) from `startIndex` and return the first dataIndex
 * the visibility map flags as visible. Returns `null` if every index in the
 * traversed range is hidden.
 *
 * For series types that key visibility by `seriesId` only (bar, line, scatter,
 * radar) the per-`dataIndex` lookup degrades to the series-level result, so
 * this helper is a no-op there. It only filters out individual data points
 * for series types that store per-`dataIndex` visibility (pie).
 */
export function findVisibleDataIndex({
  type,
  seriesId,
  startIndex,
  dataLength,
  direction,
  allowCycles,
  isItemVisible,
}: {
  type: ChartSeriesType;
  seriesId: SeriesId;
  startIndex: number;
  dataLength: number;
  direction: 1 | -1;
  allowCycles: boolean;
  isItemVisible: IsItemVisibleFunction;
}): number | null {
  if (dataLength <= 0) {
    return null;
  }

  let dataIndex = startIndex;
  for (let attempt = 0; attempt < dataLength; attempt += 1) {
    if (
      dataIndex >= 0 &&
      dataIndex < dataLength &&
      isItemVisible({ type, seriesId, dataIndex } as VisibilityIdentifierWithType)
    ) {
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
