import { CellValue, RowData } from '../rows';
import { ColDef } from '../colDef';

export interface CellClickedParam {
  element: HTMLElement;
  value: CellValue;
  field: string;
  data: RowData;
  rowIndex: number;
  colDef: ColDef;
}
