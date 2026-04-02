import type {
  GridCellRowType,
  GridCellCoordinates,
} from '../../calendar-grid/root/CalendarGridRootContext';

const ROW_ORDER: GridCellRowType[] = ['header', 'day-grid', 'time-grid'];

/**
 * Computes the target cell coordinates for a given arrow key press.
 * Returns `null` if navigation is not possible (e.g., ArrowUp on the header row).
 *
 * This is a pure function with no DOM side effects.
 * Focus application is handled by each cell via React state + effect.
 */
export function getNavigationTarget(
  key: string,
  rowType: GridCellRowType,
  columnIndex: number,
): GridCellCoordinates | null {
  switch (key) {
    case 'ArrowLeft':
      return columnIndex > 0 ? { rowType, columnIndex: columnIndex - 1 } : null;
    case 'ArrowRight':
      return { rowType, columnIndex: columnIndex + 1 };
    case 'ArrowDown': {
      const currentIndex = ROW_ORDER.indexOf(rowType);
      if (currentIndex < ROW_ORDER.length - 1) {
        return { rowType: ROW_ORDER[currentIndex + 1], columnIndex };
      }
      return null;
    }
    case 'ArrowUp': {
      const currentIndex = ROW_ORDER.indexOf(rowType);
      if (currentIndex > 0) {
        return { rowType: ROW_ORDER[currentIndex - 1], columnIndex };
      }
      return null;
    }
    default:
      return null;
  }
}
