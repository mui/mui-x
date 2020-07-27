export type RowsProp = RowData[];
export type Rows = RowModel[];

/**
 * The key value object representing the data of a row.
 */
export interface RowData extends ObjectWithId {
  [key: string]: any;
}

/**
 * The type of Id supported by the grid.
 */
export type RowId = string | number;

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
export interface ObjectWithId {
  id: RowId;
}

/**
 * The internal model of a row containing its state and data.
 */
export interface RowModel {
  id: RowId;
  data: RowData;
  selected: boolean;
}

/**
 * An helper function allowing to create [[RowModel]] from [[RowData]].
 *
 * @param rowData Row as [[RowData]].
 * @returns A row as [[RowModel]].
 */
export function createRow(rowData: RowData): RowModel {
  const row: RowModel = {
    id: rowData.id,
    data: rowData,
    selected: false,
  };
  return row;
}
