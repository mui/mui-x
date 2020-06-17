export type RowsProp = RowData[];
export type Rows = RowModel[];

export interface RowData extends ObjectWithId {
  [key: string]: any;
}

export type RowId = string | number;
export type CellValue = string | number | boolean | Date | null | undefined | object;

export interface CellIndexCoordinates {
  colIndex: number;
  rowIndex: number;
}
export interface ObjectWithId {
  id: RowId;
}

export interface RowModel {
  id: RowId;
  data: RowData;
  selected: boolean;
}

export function createRow(r: RowData): RowModel {
  const row: RowModel = {
    id: r.id,
    data: r,
    selected: false,
  };
  return row;
}
