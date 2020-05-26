import { EventEmitter } from 'events';
import { CellIndexCoordinates, RowData, RowId, RowModel, Rows } from './rows';
import { ColDef, Columns, ColumnsMeta } from './colDef';
import { SortModel } from './sortModel';
import { ColumnSortedParams, RowSelectedParam, SelectionChangedParam } from './gridOptions';
import { ScrollParams } from '../hooks/utils';
import { ContainerProps } from './containerProps';

export interface RowApi {
  getRowModels: () => Rows;
  getRowsCount: () => number;
  getAllRowIds: () => RowId[];
  setRowModels: (rows: Rows) => void;
  updateRowModels: (updates: Partial<RowModel>[]) => void;
  updateRowData: (updates: RowData[]) => void;
  getRowIdFromRowIndex: (index: number) => RowId;
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
  selectRows: (ids: RowId[], isSelected?: boolean, deselectOtherRows?: boolean) => void;
  getSelectedRows: () => RowModel[];
  onSelectedRow: (handler: (param: RowSelectedParam) => void) => () => void;
  onSelectionChanged: (handler: (param: SelectionChangedParam) => void) => () => void;
}

export interface SortApi {
  getSortModel: () => SortModel;
  setSortModel: (model: SortModel) => void;
  onColumnsSorted: (handler: (param: ColumnSortedParams) => void) => () => void;
}
export interface VirtualizationApi {
  scroll: (params: Partial<ScrollParams>) => void;
  scrollToIndexes: (params: CellIndexCoordinates) => void;
  isColumnVisibleInWindow: (colIndex: number) => boolean;
  getContainerPropsState: () => ContainerProps | null;
}
export interface CoreApi extends EventEmitter {
  isInitialised: boolean;
  registerEvent: (event: string, handler: (param: any) => void) => () => void;
}

export type GridApi = RowApi & ColumnApi & SelectionApi & SortApi & VirtualizationApi & CoreApi;
