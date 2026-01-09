import type { SeriesId } from '../models';

export const identifierCompareSeriesIdDataIndex = <
  T extends { seriesId: SeriesId; dataIndex?: number },
>(
  id1: T,
  id2: T,
): boolean => {
  return id1.seriesId === id2.seriesId && id1.dataIndex === id2.dataIndex;
};
