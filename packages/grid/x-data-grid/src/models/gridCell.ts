/**
 * The mode of the cell.
 */
export type GridCellMode = 'edit' | 'view';

/**
 * The mode of the row.
 */
export type GridRowMode = 'edit' | 'view';

/**
 * The cell value type.
 */
export type GridCellValue = string | number | boolean | Date | null | undefined | object;

/**
 * The coordinates of cell represented by their row and column indexes.
 */
export interface GridCellIndexCoordinates {
  colIndex: number;
  rowIndex: number;
}

/**
 * The coordinates of column header represented by their row and column indexes.
 */
export interface GridColumnHeaderIndexCoordinates {
  colIndex: number;
}
