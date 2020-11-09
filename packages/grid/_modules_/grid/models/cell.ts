/**
 * The cell value type.
 */
export type CellValue = string | number | boolean | Date | null | undefined | object;

/**
 * The coordinates of cell represented by their row and column indexes.
 */
export interface CellIndexCoordinates {
  colIndex: number;
  rowIndex: number;
}
