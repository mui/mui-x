import type {
  GridCellRowType,
  GridCellCoordinates,
} from '../../calendar-grid/root/CalendarGridRootContext';

export const DEFAULT_ROW_TYPES: GridCellRowType[] = ['header', 'day-grid', 'time-grid'];

export interface NavigationOptions {
  /** The total number of columns in the current row. */
  columnCount: number;
  /** The ordered list of row types that are rendered in the grid. */
  rowTypes: GridCellRowType[];
  /** The number of rows for each row type. Defaults to 1 for unspecified types. */
  rowCounts: Partial<Record<GridCellRowType, number>>;
}

function getRowCount(
  rowCounts: Partial<Record<GridCellRowType, number>>,
  rowType: GridCellRowType,
): number {
  return rowCounts[rowType] ?? 1;
}

/**
 * Computes the target cell coordinates for a given arrow key press.
 * Returns `null` if navigation is not possible (e.g., ArrowUp on the header row).
 */
export function getNavigationTarget(
  key: string,
  rowType: GridCellRowType,
  rowIndex: number,
  columnIndex: number,
  options: NavigationOptions,
): GridCellCoordinates | null {
  const { columnCount, rowTypes, rowCounts } = options;

  switch (key) {
    case 'ArrowLeft':
      return columnIndex > 0 ? { rowType, rowIndex, columnIndex: columnIndex - 1 } : null;
    case 'ArrowRight':
      return columnIndex < columnCount - 1
        ? { rowType, rowIndex, columnIndex: columnIndex + 1 }
        : null;
    case 'ArrowDown': {
      // First, try to move to the next row within the same row type
      if (rowIndex < getRowCount(rowCounts, rowType) - 1) {
        return { rowType, rowIndex: rowIndex + 1, columnIndex };
      }
      // Otherwise, move to the first row of the next row type
      const typeIndex = rowTypes.indexOf(rowType);
      if (typeIndex >= 0 && typeIndex < rowTypes.length - 1) {
        return { rowType: rowTypes[typeIndex + 1], rowIndex: 0, columnIndex };
      }
      return null;
    }
    case 'ArrowUp': {
      // First, try to move to the previous row within the same row type
      if (rowIndex > 0) {
        return { rowType, rowIndex: rowIndex - 1, columnIndex };
      }
      // Otherwise, move to the last row of the previous row type
      const typeIndex = rowTypes.indexOf(rowType);
      if (typeIndex > 0) {
        const prevRowType = rowTypes[typeIndex - 1];
        return {
          rowType: prevRowType,
          rowIndex: getRowCount(rowCounts, prevRowType) - 1,
          columnIndex,
        };
      }
      return null;
    }
    default:
      return null;
  }
}
