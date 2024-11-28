import { PinnedPosition } from '../../hooks/features/columns/gridColumnsInterfaces';
import { gridColumnPositionsSelector } from '../../hooks/features/columns';
import type { GridDimensions } from '../../hooks/features/dimensions';

export const getPinnedCellOffset = (
  pinnedPosition: PinnedPosition | undefined,
  computedWidth: number,
  columnIndex: number,
  columnPositions: ReturnType<typeof gridColumnPositionsSelector>,
  dimensions: GridDimensions,
) => {
  const scrollbarWidth = dimensions.hasScrollY ? dimensions.scrollbarSize : 0;

  let pinnedOffset: number | undefined;
  switch (pinnedPosition) {
    case PinnedPosition.LEFT:
      pinnedOffset = columnPositions[columnIndex];
      break;
    case PinnedPosition.RIGHT:
      pinnedOffset =
        dimensions.columnsTotalWidth -
        columnPositions[columnIndex] -
        computedWidth +
        scrollbarWidth;
      break;
    default:
      pinnedOffset = undefined;
      break;
  }

  return pinnedOffset;
};
