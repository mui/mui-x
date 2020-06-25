import { ComparatorFn, SortDirection } from '../sortModel';
import { CellValue, RowData, RowModel } from '../rows';
import { GridApi } from '../gridApi';
import { ColType } from './colType';

export type Alignement = 'left' | 'right' | 'center';

export type CellClassFn = (params: CellClassParams) => string | string[];
export type CellClassPropType = string | string[] | CellClassFn;
export interface ColParams {
  colDef: ColDef;
  colIndex: number;
  api: GridApi;
}
export interface CellParams {
  value: CellValue;
  getValue: (field: string) => CellValue;
  data: RowData;
  rowModel: RowModel;
  colDef: ColDef;
  rowIndex: number;
  api: GridApi;
}
export type CellClassParams = CellParams;
export type ValueGetterParams = CellParams;
export type ValueFormatterParams = CellParams;
export type CellClassRules = { [cssClass: string]: (params: CellClassParams) => boolean };

export interface ColDef {
  field: string;
  headerName?: string;
  description?: string;
  width?: number;
  hide?: boolean;
  sortable?: boolean;
  resizable?: boolean;
  sortComparator?: ComparatorFn;
  sortDirection?: SortDirection;
  sortIndex?: number;
  type?: ColType;
  align?: Alignement;
  valueGetter?: (params: ValueGetterParams) => CellValue;
  valueFormatter?: (params: ValueFormatterParams) => CellValue;
  cellClass?: CellClassPropType;
  cellClassRules?: CellClassRules;
  cellRenderer?: (params: CellParams) => React.ReactElement;
  headerClass?: string | string[];
  headerComponent?: (params: ColParams) => React.ReactElement;
  headerAlign?: Alignement;
  hideSortIcons?: boolean;
  disableClickEventBubbling?: boolean;
}
export type Columns = ColDef[];
export type ColTypeDef = Omit<ColDef, 'field'>;

export interface ColumnsMeta {
  totalWidth: number;
  positions: number[];
}

export type ColumnLookup = { [field: string]: ColDef };

export interface InternalColumns {
  all: Columns;
  visible: Columns;
  meta: ColumnsMeta;
  hasColumns: boolean;
  hasVisibleColumns: boolean;
  lookup: ColumnLookup;
}
