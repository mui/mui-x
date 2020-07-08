import { ColDef, Columns, ColumnsMeta } from '../colDef/colDef';

export interface ColumnApi {
  getColumnFromField: (field: string) => ColDef;
  getAllColumns: () => Columns;
  getVisibleColumns: () => Columns;
  getColumnsMeta: () => ColumnsMeta;
  getColumnIndex: (field: string) => number;
  getColumnPosition: (field: string) => number;
  updateColumn: (col: ColDef) => void;
  updateColumns: (cols: ColDef[]) => void;
}
