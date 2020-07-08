import { CellValue, RowData, RowModel } from '../rows';

export interface CellParams {
  value: CellValue;
  getValue: (field: string) => CellValue;
  data: RowData;
  rowModel: RowModel;
  colDef: any;
  rowIndex: number;
  api: any;
}

export type ValueGetterParams = CellParams;
export type ValueFormatterParams = CellParams;
