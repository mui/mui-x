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
