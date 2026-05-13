/**
 * The type of row rendered in the calendar grid.
 */
export type GridRowType = 'header' | 'day-grid' | 'time-grid';

/**
 * The coordinates of a cell in the calendar grid.
 */
export interface GridCellCoordinates {
  readonly rowType: GridRowType;
  readonly rowIndex: number;
  readonly columnIndex: number;
}
