import type { DataGridProcessedProps } from '../models/props/DataGridProps';
import { PinnedColumnPosition } from '../internals/constants';

export const shouldCellShowRightBorder = (
  pinnedPosition: PinnedColumnPosition | undefined,
  indexInSection: number,
  sectionLength: number,
  showCellVerticalBorderRootProp: DataGridProcessedProps['showCellVerticalBorder'],
  gridHasFiller: boolean,
  pinnedColumnsSectionSeparatorRootProp: DataGridProcessedProps['pinnedColumnsSectionSeparator'],
) => {
  const isSectionLastCell = indexInSection === sectionLength - 1;

  if (
    pinnedColumnsSectionSeparatorRootProp?.startsWith('border') &&
    pinnedPosition === PinnedColumnPosition.LEFT &&
    isSectionLastCell
  ) {
    return true;
  }
  if (showCellVerticalBorderRootProp) {
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
  showCellVerticalBorderRootProp: DataGridProcessedProps['showCellVerticalBorder'],
  pinnedColumnsSectionSeparatorRootProp: DataGridProcessedProps['pinnedColumnsSectionSeparator'],
) => {
  if (pinnedColumnsSectionSeparatorRootProp?.startsWith('border')) {
    return pinnedPosition === PinnedColumnPosition.RIGHT && indexInSection === 0;
  }
  return (
    showCellVerticalBorderRootProp &&
    pinnedPosition === PinnedColumnPosition.RIGHT &&
    indexInSection === 0
  );
};
