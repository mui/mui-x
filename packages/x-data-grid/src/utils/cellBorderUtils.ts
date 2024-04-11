import { GridDimensions } from '../hooks/features/dimensions';
import { GridPinnedColumnPosition } from '../hooks/features/columns/gridColumnsInterfaces';

export const shouldCellShowRightBorder = (
  pinnedPosition: GridPinnedColumnPosition | undefined,
  indexInSection: number,
  sectionLength: number,
  showCellVerticalBorderRootProp: boolean,
  dimensions: GridDimensions,
) => {
  const isSectionLastCell = indexInSection === sectionLength - 1;

  if (pinnedPosition === GridPinnedColumnPosition.LEFT && isSectionLastCell) {
    return true;
  }
  if (showCellVerticalBorderRootProp) {
    if (pinnedPosition === GridPinnedColumnPosition.LEFT) {
      return true;
    }
    if (pinnedPosition === GridPinnedColumnPosition.RIGHT) {
      return !isSectionLastCell;
    }
    // pinnedPosition === undefined, middle section
    return !isSectionLastCell || dimensions.columnsTotalWidth < dimensions.viewportOuterSize.width;
  }
  return false;
};

export const shouldCellShowLeftBorder = (
  pinnedPosition: GridPinnedColumnPosition | undefined,
  indexInSection: number,
) => {
  return pinnedPosition === GridPinnedColumnPosition.RIGHT && indexInSection === 0;
};
