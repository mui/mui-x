import * as React from 'react';
import { SortDirection } from './sortModel';
import { Logger } from '../hooks/utils';
import { ArrowDownward, ArrowUpward, SeparatorIcon } from '../components/icons';
import { ColumnHeaderClickedParams } from './params/columnHeaderClickedParams';
import { ColumnSortedParams } from './params/columnSortedParams';
import { RowClickedParam } from './params/rowClickedParams';
import { CellClickedParam } from './params/cellClickedParams';
import { RowSelectedParams } from './params/rowSelectedParams';
import { SelectionChangedParams } from './params/selectionChangedParams';
import { PageChangedParams } from './params/pageChangedParams';

export interface IconsOptions {
  columnSortedAscending?: React.ElementType;
  columnSortedDescending?: React.ElementType;
  columnResize?: React.ElementType<{ className: string }>;
}

// TODO add multiSortKey
export interface GridOptions {
  autoHeight?: boolean;
  rowHeight: number;
  headerHeight: number;
  scrollbarSize: number;
  columnBuffer: number;
  enableMultipleSelection: boolean; // ag=> rowSelection : Single | Multiple
  enableMultipleColumnsSorting: boolean;
  showCellRightBorder: boolean;
  extendRowFullWidth: boolean;
  sortingOrder: SortDirection[];
  pagination?: boolean;
  paginationPageSize?: number;
  paginationAutoPageSize?: boolean;
  paginationRowsPerPageOptions?: number[];
  hideFooter?: boolean;
  hideFooterRowCount?: boolean;
  hideFooterSelectedRowCount?: boolean;
  hideFooterPagination?: boolean;
  checkboxSelection?: boolean;
  disableSelectionOnClick?: boolean;
  showColumnSeparator?: boolean;
  logger?: Logger;
  logLevel?: string | boolean;

  onCellClicked?: (param: CellClickedParam) => void;
  onRowClicked?: (param: RowClickedParam) => void;
  onRowSelected?: (param: RowSelectedParams) => void;
  onSelectionChanged?: (param: SelectionChangedParams) => void;
  onColumnHeaderClicked?: (param: ColumnHeaderClickedParams) => void;
  onColumnsSorted?: (params: ColumnSortedParams) => void;
  onPageChanged?: (param: PageChangedParams) => void;
  onPageSizeChanged?: (param: PageChangedParams) => void;

  icons: IconsOptions;
}

export const DEFAULT_GRID_OPTIONS: GridOptions = {
  autoHeight: false,
  rowHeight: 52,
  headerHeight: 56,
  scrollbarSize: 15,
  columnBuffer: 2,
  enableMultipleSelection: true,
  enableMultipleColumnsSorting: true,
  paginationRowsPerPageOptions: [25, 50, 100],
  paginationPageSize: 100,
  showCellRightBorder: false,
  extendRowFullWidth: true,
  sortingOrder: ['asc', 'desc', null],
  icons: {
    columnSortedAscending: () => <ArrowUpward className={'icon'} />,
    columnSortedDescending: () => <ArrowDownward className={'icon'} />,
    columnResize: SeparatorIcon,
  },
};
