import { PinnedPosition } from '../components/cell/GridCell';

export const shouldCellShowRightBorder = (
  pinnedPosition: PinnedPosition | undefined,
  indexInSection: number,
  sectionLength: number,
  showCellVerticalBorderRootProp: boolean,
  gridHasFiller: boolean,
) => {
  const isSectionLastCell = indexInSection === sectionLength - 1;

  if (pinnedPosition === PinnedPosition.LEFT && isSectionLastCell) {
    return true;
  }
  if (showCellVerticalBorderRootProp) {
    if (pinnedPosition === PinnedPosition.LEFT) {
      return true;
    }
    if (pinnedPosition === PinnedPosition.RIGHT) {
      return !isSectionLastCell;
    }
    // pinnedPosition === undefined, middle section
    return !isSectionLastCell || gridHasFiller;
  }
  return false;
};

export const shouldCellShowLeftBorder = (
  pinnedPosition: PinnedPosition | undefined,
  indexInSection: number,
) => {
  return pinnedPosition === PinnedPosition.RIGHT && indexInSection === 0;
};
