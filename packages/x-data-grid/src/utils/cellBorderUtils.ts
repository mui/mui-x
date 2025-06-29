import { PinnedColumnPosition } from '../internals/constants';

export const shouldCellShowRightBorder = (
  pinnedPosition: PinnedColumnPosition | undefined,
  indexInSection: number,
  sectionLength: number,
  showCellVerticalBorderRootProp: boolean,
  gridHasFiller: boolean,
) => {
  if (showCellVerticalBorderRootProp) {
    const isSectionLastCell = indexInSection === sectionLength - 1;
    if (pinnedPosition === PinnedColumnPosition.LEFT) {
      return true;
    }
    if (pinnedPosition === PinnedColumnPosition.RIGHT) {
      return !isSectionLastCell;
    }
    // pinnedPosition === undefined, middle section
    return !isSectionLastCell || gridHasFiller;
  }
  return false;
};

export const shouldCellShowLeftBorder = (
  pinnedPosition: PinnedColumnPosition | undefined,
  indexInSection: number,
  showCellVerticalBorderRootProp: boolean,
) => {
  return (
    showCellVerticalBorderRootProp &&
    pinnedPosition === PinnedColumnPosition.RIGHT &&
    indexInSection === 0
  );
};
