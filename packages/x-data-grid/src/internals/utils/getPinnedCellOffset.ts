import {
  GridPinnedColumnPosition,
  gridColumnPositionsSelector,
} from '../../hooks/features/columns';
import type { GridDimensions } from '../../hooks/features/dimensions';

export const getPinnedCellOffset = ({
  pinnedPosition,
  computedWidth,
  columnIndex,
  columnPositions,
  dimensions,
}: {
  pinnedPosition: GridPinnedColumnPosition | undefined;
  computedWidth: number;
  columnIndex: number;
  columnPositions: ReturnType<typeof gridColumnPositionsSelector>;
  dimensions: GridDimensions;
}) => {
  const scrollbarWidth = dimensions.hasScrollY ? dimensions.scrollbarSize : 0;

  let pinnedOffset: number;
  // FIXME: Why is the switch check exhaustiveness not validated with typescript-eslint?
  // eslint-disable-next-line default-case
  switch (pinnedPosition) {
    case GridPinnedColumnPosition.LEFT:
      pinnedOffset = columnPositions[columnIndex];
      break;
    case GridPinnedColumnPosition.RIGHT:
      pinnedOffset =
        dimensions.columnsTotalWidth -
        columnPositions[columnIndex] -
        computedWidth +
        scrollbarWidth;
      break;
    default:
      pinnedOffset = 0;
      break;
  }

  return pinnedOffset;
};
