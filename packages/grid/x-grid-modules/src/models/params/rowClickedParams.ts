import { RowData, RowModel } from '../rows';
import { ColDef } from '../colDef/colDef';

export interface RowClickedParam {
  element: HTMLElement;
  rowModel: RowModel;
  data: RowData;
  rowIndex: number;
  colDef: ColDef;
}
