import { CellValue, RowData, RowModel } from './rows';
import { ColDef } from './colDef';
import React from 'react';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';

export interface ColumnHeaderClickedParam {
  field: string;
  column: ColDef;
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
//Todo add multiSortKey
//Todo add sortingOrder
export interface GridOptions {
  rowHeight: number;
  headerHeight: number;
  scrollbarSize: number;
  columnBuffer: number;
  enableMultipleSelection: boolean; //ag=> rowSelection : Single | Multiple
  enableMultipleColumnsSorting: boolean;
  showCellRightBorder: boolean;
  extendRowFullWidth: boolean;

  onCellClicked?: (param: CellClickedParam) => void;
  onRowClicked?: (param: RowClickedParam) => void;
  onRowSelected?: (param: RowSelectedParam) => void;
  onSelectionChanged?: (param: SelectionChangedParam) => void;
  onColumnHeaderClicked?: (param: ColumnHeaderClickedParam) => void;

  checkboxSelection?: boolean;
  disableSelectionOnClick?: boolean;
  showColumnSeparator?: boolean;
  icons: {
    sortedColumns: {
      asc: React.ReactElement;
      desc: React.ReactElement;
    };
  };
}

export const DEFAULT_GRID_OPTIONS: GridOptions = {
  rowHeight: 52,
  headerHeight: 56,
  scrollbarSize: 15,
  columnBuffer: 5,
  enableMultipleSelection: true,
  enableMultipleColumnsSorting: true,
  showCellRightBorder: true,
  extendRowFullWidth: true,
  icons: {
    sortedColumns: {
      asc: <ArrowUpIcon className={'icon'} />,
      desc: <ArrowDownIcon className={'icon'} />,
    },
  },
};
