import type { GridCellCoordinates } from '@mui/x-data-grid';

export interface GridKeyboardReorderState {
  /**
   * The cell that describes the reorder keys to screen readers:
   * - `'tabStop'`: the cell with the tab stop, until the focus lands on a cell.
   * - A cell: the first cell that got the focus, while it keeps it.
   * - `null`: no cell, until the focus leaves the grid.
   */
  describedCell: 'tabStop' | GridCellCoordinates | null;
}
