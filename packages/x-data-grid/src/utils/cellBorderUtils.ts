import { GridPinnedColumnPosition } from '../hooks/features/columns/gridColumnsInterfaces';

export const shouldCellShowRightBorder = (
  pinnedPosition: GridPinnedColumnPosition | undefined,
  indexInSection: number,
  sectionLength: number,
  showCellVerticalBorderRootProp: boolean,
) => {
  const isSectionLastCell = indexInSection === sectionLength - 1;

  return (
    (showCellVerticalBorderRootProp &&
      (pinnedPosition !== GridPinnedColumnPosition.LEFT ? !isSectionLastCell : true)) ||
    (pinnedPosition === GridPinnedColumnPosition.LEFT && isSectionLastCell)
  );
};

export const shouldCellShowLeftBorder = (
  pinnedPosition: GridPinnedColumnPosition | undefined,
  indexInSection: number,
) => {
  return pinnedPosition === GridPinnedColumnPosition.RIGHT && indexInSection === 0;
};
