import { EventEmitter } from 'events';
import { RowData, RowId, RowModel, Rows } from './rows';
import { ColDef, Columns, ColumnsMeta } from './colDef';
import { SortModel } from './sortModel';
import { RowSelectedParam, SelectionChangedParam } from './gridOptions';
import { ScrollParams } from '../hooks/utils';

export interface RowApi {
  getRowModels: () => Rows;
  getRowsCount: () => number;
  getAllRowIds: () => RowId[];
  setRowModels: (rows: Rows) => void;
  updateRowModels: (updates: Partial<RowModel>[]) => void;
  updateRowData: (updates: RowData[]) => void;
  getRowIndexFromId: (id: RowId) => number;
  getRowFromId: (id: RowId) => RowModel;
}

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

export interface SelectionApi {
  selectRow: (id: RowId, allowMultiple?: boolean, isSelected?: boolean) => void;
  selectRows: (ids: RowId[], isSelected?: boolean) => void;
  getSelectedRows: () => void;
  onSelectedRow: (handler: (param: RowSelectedParam) => void) => () => void;
  onSelectionChanged: (handler: (param: SelectionChangedParam) => void) => () => void;
}

export interface SortApi {
  getSortModel: () => SortModel;
  setSortModel: (model: SortModel) => void;
}
export interface VirtualizationApi {
  scroll: (params: Partial<ScrollParams>) => void;
}
export interface CoreApi extends EventEmitter {
  isInitialised: boolean;
  registerEvent: (event: string, handler: (param: any) => void) => () => void;
}

export type GridApi = RowApi & ColumnApi & SelectionApi & SortApi & VirtualizationApi & CoreApi;
