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

/**
 * Set of icons used in the grid component UI
 */
export interface IconsOptions {
  /**
   * icon displayed on the side of the column header title when sorted in Ascending order
   */
  columnSortedAscending?: React.ElementType;
  /**
   * icon displayed on the side of the column header title when sorted in Descending order
   */
  columnSortedDescending?: React.ElementType;
  /**
   * icon displayed in between 2 column headers that allows to resize the column header
   */
  columnResize?: React.ElementType<{ className: string }>;
}

// TODO add multiSortKey
/**
 * Grid options react prop, containing all the setting for the grid
 */
export interface GridOptions {
  /**
   * turn grid height dynamic and follow the number of rows in the grid
   * @default false
   */
  autoHeight?: boolean;
  /**
   * set the height in pixel of a row in the grid.
   * @default 52
   */
  rowHeight: number;
  /**
   * set the height in pixel of the column headers in the grid.
   * @default 56
   */
  headerHeight: number;
  /**
   * set the height/width of the grid inner scrollbar
   * @default 15
   */
  scrollbarSize: number;
  /**
   * Number of columns rendered outside the grid viewport
   * @default 2
   */
  columnBuffer: number;
  /**
   * enable multiple selection using the CTRL or CMD key
   * @default true
   */
  enableMultipleSelection: boolean; // ag=> rowSelection : Single | Multiple
  /**
   * enable sorting the grid rows with one or more columns
   * @default true
   */
  enableMultipleColumnsSorting: boolean;
  /**
   * display the right border of the cells
   * @default false
   */
  showCellRightBorder: boolean;
  /**
   * extend rows to fill the grid container width
   * @default true
   */
  extendRowFullWidth: boolean;
  /**
   * the order of the sorting sequence.
   * @default ['asc', 'desc', null]
   */
  sortingOrder: SortDirection[];
  /**
   * activate pagination
   * @default false
   */
  pagination?: boolean;
  /**
   * set the number of rows in one page
   * @default 100
   */
  paginationPageSize?: number;
  /**
   * auto-scale the pageSize with the container size to the max number of rows to avoid rendering a vertical scroll bar
   * @default false
   */
  paginationAutoPageSize?: boolean;
  /**
   * select the paginationPageSize dynamically using the component UI
   * @default [25, 50, 100]
   */
  paginationRowsPerPageOptions?: number[];
  /**
   * toggle footer component visibility
   * @default false
   */
  hideFooter?: boolean;
  /**
   * toggle footer row count element visibility
   * @default false
   */
  hideFooterRowCount?: boolean;
  /**
   * toggle footer selected row count element visibility
   * @default false
   */
  hideFooterSelectedRowCount?: boolean;
  /**
   * toggle footer pagination component visibility
   * @default false
   */
  hideFooterPagination?: boolean;
  /**
   * add a first column with checkbox that allows to select rows
   * @default false
   */
  checkboxSelection?: boolean;
  /**
   * disable selection on click on a row or cell
   * @default false
   */
  disableSelectionOnClick?: boolean;
  /**
   * display the column header right border
   * @default false
   */
  showColumnSeparator?: boolean;
  /**
   * Pass a custom logger in the components that implements the [[Logger]] interface
   * @default null
   */
  logger?: Logger;
  /**
   * allows to pass the logging level or false to turn off logging
   * @default debug
   */
  logLevel?: string | false;

  /**
   * handler triggered when the click event comes from a cell element
   * @param param with all properties from [[CellClickedParam]]
   */
  onCellClicked?: (param: CellClickedParam) => void;
  /**
   * handler triggered when the click event comes from a row container element
   * @param param with all properties from [[RowClickedParam]]
   */
  onRowClicked?: (param: RowClickedParam) => void;
  /**
   * handler triggered when one row get selected
   * @param param with all properties from [[RowSelectedParams]]
   */
  onRowSelected?: (param: RowSelectedParams) => void;
  /**
   * handler triggered when one or multiple rows get their selection state changed
   * @param param with all properties from [[SelectionChangedParams]]
   */
  onSelectionChanged?: (param: SelectionChangedParams) => void;
  /**
   * handler triggered when the click event comes from a column header element
   * @param param with all properties from [[ColumnHeaderClickedParams]]
   */
  onColumnHeaderClicked?: (param: ColumnHeaderClickedParams) => void;
  /**
   * handler triggered when grid resorted its rows
   * @param param with all properties from [[ColumnSortedParams]]
   */
  onColumnsSorted?: (params: ColumnSortedParams) => void;
  /**
   * handler triggered when the current page has changed
   * @param param with all properties from [[PageChangedParams]]
   */
  onPageChanged?: (param: PageChangedParams) => void;
  /**
   * handler triggered when the page size changed
   * @param param with all properties from [[PageChangedParams]]
   */
  onPageSizeChanged?: (param: PageChangedParams) => void;

  /**
   * Set of icons used in the grid
   */
  icons: IconsOptions;
}

/**
 * the default [[GridOptions]] object that will be used to merge with the 'options' passed in the react component prop.
 */
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
