import * as React from 'react';
import {SortDirection} from './sortModel';
import {Logger} from '../hooks/utils';
import {ArrowDownward, ArrowUpward, SeparatorIcon} from '../components/icons';
import {PaginationProps} from '../hooks/features/usePagination';
import {
  ColumnHeaderClickedParams
} from "./params/columnHeaderClickedParams";
import {ColumnSortedParams} from "./params/columnSortedParams";
import {RowClickedParam} from "./params/rowClickedParams";
import {CellClickedParam} from "./params/cellClickedParams";
import {ComponentParams} from "./params/componentParams";
import {RowSelectedParams} from "./params/rowSelectedParams";
import {SelectionChangedParams} from "./params/selectionChangedParams";
import {PageChangedParams} from "./params/pageChangedParams";

export interface IconsOptions {
  columnSortedAscending?: React.FC<{}>;
  columnSortedDescending?: React.FC<{}>;
  columnResize?: React.FC<{ className: string }>;
}

// Todo add multiSortKey
/**
 * This is the set of options supported by X-Grid
 *
 * @remarks
 * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
 *
 * @param x - The first input number
 * @param y - The second input number
 * @returns The arithmetic mean of `x` and `y`
 *
 */
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

  onCellClicked?: (param: CellClickedParam) => void;
  onRowClicked?: (param: RowClickedParam) => void;
  onRowSelected?: (param: RowSelectedParams) => void;
  onSelectionChanged?: (param: SelectionChangedParams) => void;
  onColumnHeaderClicked?: (param: ColumnHeaderClickedParams) => void;
  onColumnsSorted?: (params: ColumnSortedParams) => void;
  onPageChanged?: (param: PageChangedParams) => void;
  onPageSizeChanged?: (param: PageChangedParams) => void;

  checkboxSelection?: boolean;
  disableSelectionOnClick?: boolean;
  showColumnSeparator?: boolean;
  logger?: Logger;
  logLevel?: string | boolean;
  paginationComponent?: (props: PaginationProps) => React.ReactNode;
  loadingOverlayComponent?: React.ReactNode;
  noRowsOverlayComponent?: React.ReactNode;
  footerComponent?: (params: ComponentParams) => React.ReactNode;
  headerComponent?: (params: ComponentParams) => React.ReactNode;
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
