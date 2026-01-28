import { PinnedColumnPosition } from '../constants';
import type { gridColumnPositionsSelector } from '../../hooks/features/columns';

export const getPinnedCellOffset = (
  pinnedPosition: PinnedColumnPosition | undefined,
  computedWidth: number,
  columnIndex: number,
  columnPositions: ReturnType<typeof gridColumnPositionsSelector>,
  columnsTotalWidth: number,
  scrollbarWidth: number,
) => {
  let pinnedOffset: number | undefined;
  switch (pinnedPosition) {
    case PinnedColumnPosition.LEFT:
      pinnedOffset = columnPositions[columnIndex];
      break;
    case PinnedColumnPosition.RIGHT:
      pinnedOffset =
        columnsTotalWidth - columnPositions[columnIndex] - computedWidth + scrollbarWidth;
      break;
    default:
      pinnedOffset = undefined;
      break;
  }

  // XXX: fix this properly
  if (Number.isNaN(pinnedOffset)) {
    pinnedOffset = undefined;
  }

  return pinnedOffset;
};
