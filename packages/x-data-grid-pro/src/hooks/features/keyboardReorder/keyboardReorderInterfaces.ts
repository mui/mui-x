import type { GridCellCoordinates } from '@mui/x-data-grid';

export interface GridKeyboardReorderState {
  /**
   * The cell that describes the reorder keys to screen readers:
   * - `'tabStop'`: the cell with the tab stop, until the focus lands on a cell.
   * - A cell: the focused cell, while it keeps the focus.
   * - `null`: no cell, until the focus leaves the grid.
   */
  describedCell: 'tabStop' | GridCellCoordinates | null;
  /**
   * Whether the description of the row keys and the column keys is still unread during the visit.
   * A cell reads the descriptions it has when the focus leaves it, and a key press reads the one of its keys.
   */
  unreadDescriptions: { row: boolean; column: boolean };
}
