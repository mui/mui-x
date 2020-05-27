import { CellValue, RowData, RowModel } from './rows';
import { ColDef } from './colDef';
import React from 'react';
import { SortDirection, SortModel } from './sortModel';
import { Logger } from '../hooks/utils';
import { ArrowDownward, ArrowUpward, SeparatorIcon } from '../components/icons';

export interface ColumnHeaderClickedParam {
  field: string;
  column: ColDef;
}
export interface ColumnSortedParams {
  sortedColumns: ColDef[];
  sortModel: SortModel;
}
export interface RowClickedParam {
  element: HTMLElement;
  rowModel: RowModel;
  data: RowData;
  rowIndex: number;
  colDef: ColDef;
}

export interface CellClickedParam {
  element: HTMLElement;
  value: CellValue;
  field: string;
  data: RowData;
  rowIndex: number;
  colDef: ColDef;
}

export interface RowSelectedParam {
  data: RowData;
  rowIndex: number;
  isSelected: boolean;
}
export interface SelectionChangedParam {
  rows: RowData[];
}

export interface IconsOptions {
  columnSortedAscending?: React.FC<{}>;
  columnSortedDescending?: React.FC<{}>;
  columnResize?: React.FC<{ className: string }>;
}

//Todo add multiSortKey
export interface GridOptions {
  rowHeight: number;
  headerHeight: number;
  scrollbarSize: number;
  columnBuffer: number;
  enableMultipleSelection: boolean; //ag=> rowSelection : Single | Multiple
  enableMultipleColumnsSorting: boolean;
  showCellRightBorder: boolean;
  extendRowFullWidth: boolean;
  sortingOrder: SortDirection[];

  onCellClicked?: (param: CellClickedParam) => void;
  onRowClicked?: (param: RowClickedParam) => void;
  onRowSelected?: (param: RowSelectedParam) => void;
  onSelectionChanged?: (param: SelectionChangedParam) => void;
  onColumnHeaderClicked?: (param: ColumnHeaderClickedParam) => void;
  onColumnsSorted?: (params: ColumnSortedParams) => void;

  checkboxSelection?: boolean;
  disableSelectionOnClick?: boolean;
  showColumnSeparator?: boolean;
  logger?: Logger;
  logLevel?: string | boolean;
  loadingOverlayComponent?: React.ReactNode;
  noRowsOverlayComponent?: React.ReactNode;
  icons: IconsOptions;
}

export const DEFAULT_GRID_OPTIONS: GridOptions = {
  rowHeight: 52,
  headerHeight: 56,
  scrollbarSize: 15,
  columnBuffer: 2,
  enableMultipleSelection: true,
  enableMultipleColumnsSorting: true,
  showCellRightBorder: false,
  extendRowFullWidth: true,
  sortingOrder: ['asc', 'desc', null],
  icons: {
    // eslint-disable-next-line react/display-name
    columnSortedAscending: () => <ArrowUpward className={'icon'} />,
    // eslint-disable-next-line react/display-name
    columnSortedDescending: () => <ArrowDownward className={'icon'} />,
    columnResize: SeparatorIcon,
  },
};
