import type { VisibilityItemIdentifier } from './useChartVisibilityManager.types';

export const isSameIdentifier = (
  id1: VisibilityItemIdentifier,
  id2: VisibilityItemIdentifier,
): boolean => {
  // Entries with and without dataIndex are never the same
  const hasDataIndex1 = 'dataIndex' in id1;
  const hasDataIndex2 = 'dataIndex' in id2;
  if (hasDataIndex1 !== hasDataIndex2) {
    return false;
  }

  if (hasDataIndex1 && hasDataIndex2) {
    return id1.seriesId === id2.seriesId && id1.dataIndex === id2.dataIndex;
  }

  return id1.seriesId === id2.seriesId;
};
