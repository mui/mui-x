import * as React from 'react';
import { SortDirection } from './sortModel';
import { Logger } from '../hooks/utils';
import { ArrowDownward, ArrowUpward, SeparatorIcon } from '../components/icons';
import { ColumnSortedParams } from './params/columnSortedParams';
import { RowSelectedParams } from './params/rowSelectedParams';
import { SelectionChangeParams } from './params/selectionChangeParams';
import { PageChangeParams } from './params/pageChangeParams';
import { ColumnTypesRecord, DEFAULT_COLUMN_TYPES } from './colDef';
import { FeatureMode } from './featureMode';
import { ColParams } from './params/colParams';
import { CellParams, RowParams } from './params/cellParams';

/**
 * Set of icons used in the grid component UI.
 */
export interface IconsOptions {
  /**
   * Icon displayed on the side of the column header title when sorted in Ascending order.
   */
  columnSortedAscending?: React.ElementType;
  /**
   * Icon displayed on the side of the column header title when sorted in Descending order.
   */
  columnSortedDescending?: React.ElementType;
  /**
   * Icon displayed in between 2 column headers that allows to resize the column header.
   */
  columnResize?: React.ElementType<{ className: string }>;
}

// TODO add multiSortKey
/**
 * Grid options react prop, containing all the setting for the grid.
 */
export interface GridOptions {
  /**
   * Turn grid height dynamic and follow the number of rows in the grid.
   *
   * @default false
   */
  autoHeight?: boolean;
  /**
   * Set the height in pixel of a row in the grid.
   *
   * @default 52
   */
  rowHeight: number;
  /**
   * Set the height in pixel of the column headers in the grid.
   *
   * @default 56
   */
  headerHeight: number;
  /**
   * Set the height/width of the grid inner scrollbar.
   *
   * @default 15
   */
  scrollbarSize: number;
  /**
   * Number of columns rendered outside the grid viewport.
   *
   * @default 2
   */
  columnBuffer: number;
  /**
   * Enable multiple selection using the CTRL or CMD key.
   *
   * @default true
   */
  enableMultipleSelection: boolean;
  /**
   * Enable sorting the grid rows with one or more columns.
   *
   * @default true
   */
  enableMultipleColumnsSorting: boolean;
  /**
   * Display the right border of the cells.
   *
   * @default false
   */
  showCellRightBorder?: boolean;
  /**
   * Display the column header right border.
   *
   * @default false
   */
  showColumnRightBorder?: boolean;
  /**
   * Extend rows to fill the grid container width.
   *
   * @default true
   */
  extendRowFullWidth?: boolean;
  /**
   * The order of the sorting sequence.
   *
   * @default ['asc', 'desc', null]
   */
  sortingOrder: SortDirection[];
  /**
   * Activate pagination.
   *
   * @default false
   */
  pagination?: boolean;
  /**
   * Set the number of rows in one page.
   *
   * @default 100
   */
  pageSize?: number;
  /**
   * Auto-scale the pageSize with the container size to the max number of rows to avoid rendering a vertical scroll bar.
   *
   * @default false
   */
  autoPageSize?: boolean;
  /**
   * Select the pageSize dynamically using the component UI.
   *
   * @default [25, 50, 100]
   */
  rowsPerPageOptions?: number[];
  /**
   * Pagination can be processed on the server or client-side.
   * Set it to FeatureMode.client or `client` if you would like to handle the pagination on the client-side.
   * Set it to FeatureMode.server or `server` if you would like to handle the pagination on the server-side.
   */
  paginationMode?: FeatureMode;
  /**
   * Set the total number of rows, if it is different than the length of the value `rows` prop.
   */
  rowCount?: number;
  /**
   * Set the current page.
   * @default 1
   */
  page?: number;
  /**
   * Toggle footer component visibility.
   *
   * @default false
   */
  hideFooter?: boolean;
  /**
   * Toggle footer row count element visibility.
   *
   * @default false
   */
  hideFooterRowCount?: boolean;
  /**
   * Toggle footer selected row count element visibility.
   *
   * @default false
   */
  hideFooterSelectedRowCount?: boolean;
  /**
   * Toggle footer pagination component visibility.
   *
   * @default false
   */
  hideFooterPagination?: boolean;
  /**
   * Add a first column with checkbox that allows to select rows.
   *
   * @default false
   */
  checkboxSelection?: boolean;
  /**
   * Disable selection on click on a row or cell.
   *
   * @default false
   */
  disableSelectionOnClick?: boolean;
  /**
   * Pass a custom logger in the components that implements the [[Logger]] interface.
   *
   * @default null
   */
  logger?: Logger;
  /**
   * Allows to pass the logging level or false to turn off logging.
   *
   * @default debug
   */
  logLevel?: string | false;
  /**
   * Handler triggered when the click event comes from a cell element.
   *
   * @param param With all properties from [[CellParams]].
   */
  onCellClick?: (param: CellParams) => void;
  /**
   * Handler triggered when the hover event comes from a cell element.
   *
   * @param param With all properties from [[CellParams]].
   */
  onCellHover?: (param: CellParams) => void;
  /**
   * Handler triggered when the click event comes from a row container element.
   *
   * @param param With all properties from [[RowParams]].
   */
  onRowClick?: (param: RowParams) => void;
  /**
   * Handler triggered when the hover event comes from a row container element.
   *
   * @param param With all properties from [[RowParams]].
   */
  onRowHover?: (param: RowParams) => void;
  /**
   * Handler triggered when one row get selected.
   *
   * @param param With all properties from [[RowSelectedParams]].
   */
  onRowSelected?: (param: RowSelectedParams) => void;
  /**
   * Handler triggered when one or multiple rows get their selection state change.
   *
   *
   * @param param With all properties from [[SelectionChangeParams]]
   */
  onSelectionChange?: (param: SelectionChangeParams) => void;
  /**
   * Handler triggered when the click event comes from a column header element.
   *
   * @param param With all properties from [[ColParams]].
   */
  onColumnHeaderClick?: (param: ColParams) => void;
  /**
   * Handler triggered when grid resorted its rows.
   *
   * @param param With all properties from [[ColumnSortedParams]].
   */
  onSortedColumns?: (params: ColumnSortedParams) => void;
  /**
   * Handler triggered when the current page has change.
   *
   *
   * @param param With all properties from [[PageChangeParams]].
   */
  onPageChange?: (param: PageChangeParams) => void;
  /**
   * Handler triggered when the page size change.
   *
   *
   * @param param With all properties from [[PageChangeParams]].
   */
  onPageSizeChange?: (param: PageChangeParams) => void;
  /**
   * Set of icons used in the grid.
   */
  icons: IconsOptions;
  /**
   * Extend native column types with your new column types.
   */
  columnTypes: ColumnTypesRecord;
}

/**
 * The default [[GridOptions]] object that will be used to merge with the 'options' passed in the react component prop.
 */
export const DEFAULT_GRID_OPTIONS: GridOptions = {
  autoHeight: false,
  rowHeight: 52,
  headerHeight: 56,
  scrollbarSize: 15,
  columnBuffer: 2,
  enableMultipleSelection: true,
  enableMultipleColumnsSorting: true,
  rowsPerPageOptions: [25, 50, 100],
  pageSize: 100,
  paginationMode: FeatureMode.client,
  extendRowFullWidth: true,
  sortingOrder: ['asc', 'desc', null],
  logLevel: 'warn',
  columnTypes: DEFAULT_COLUMN_TYPES,
  icons: {
    columnSortedAscending: () => <ArrowUpward className="icon" />,
    columnSortedDescending: () => <ArrowDownward className="icon" />,
    columnResize: SeparatorIcon,
  },
};
