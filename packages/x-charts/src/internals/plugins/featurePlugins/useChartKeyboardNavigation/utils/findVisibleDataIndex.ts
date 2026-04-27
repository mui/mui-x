import type { SeriesId } from '../../../../../models/seriesType/common';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { IsItemVisibleFunction } from '../../useChartVisibilityManager';

/**
 * Walk forward (or backward) from `startIndex` and return the first dataIndex
 * the visibility map flags as visible. Returns `null` if every index in the
 * traversed range is hidden.
 */
export function findVisibleDataIndex<SeriesType extends ChartSeriesType>({
  type,
  seriesId,
  startIndex,
  dataLength,
  direction,
  allowCycles,
  isItemVisible,
}: {
  type: SeriesType;
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

  // Early return if the entire series is hidden.
  if (!isItemVisible({ type, seriesId })) {
    return null;
  }

  let dataIndex = startIndex;
  for (let attempt = 0; attempt < dataLength; attempt += 1) {
    if (
      dataIndex >= 0 &&
      dataIndex < dataLength &&
      isItemVisible({ type, seriesId, dataIndex })
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
