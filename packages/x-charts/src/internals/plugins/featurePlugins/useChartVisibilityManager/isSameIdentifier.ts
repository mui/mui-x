import type { SeriesItemIdentifier } from '../../../../models/seriesType';

export const isSameIdentifier = (id1: SeriesItemIdentifier, id2: SeriesItemIdentifier): boolean => {
  // Entries with and without dataIndex are never the same
  const hasDataIndex1 = 'dataIndex' in id1;
  const hasDataIndex2 = 'dataIndex' in id2;
  if (hasDataIndex1 !== hasDataIndex2) {
    return false;
  }

  if (hasDataIndex1 && hasDataIndex2) {
    return (
      id1.type === id2.type && id1.seriesId === id2.seriesId && id1.dataIndex === id2.dataIndex
    );
  }

  return id1.type === id2.type && id1.seriesId === id2.seriesId;
};
