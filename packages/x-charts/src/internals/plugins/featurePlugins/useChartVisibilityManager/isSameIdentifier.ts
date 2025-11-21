import type { VisibilityItemIdentifier } from './useChartVisibilityManager.types';

export const isSameIdentifier = (
  id1: VisibilityItemIdentifier,
  id2: VisibilityItemIdentifier,
): boolean => {
  return id1.seriesId === id2.seriesId && id1.itemId === id2.itemId;
};
