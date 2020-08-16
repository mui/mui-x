import * as React from 'react';
import { SortDirection, SortModel } from './sortModel';
import { Logger } from '../hooks/utils';
import { ArrowDownwardIcon, ArrowUpwardIcon, SeparatorIcon } from '../components/icons';
import { SortModelParams } from './params/sortModelParams';
import { RowSelectedParams } from './params/rowSelectedParams';
import { SelectionChangeParams } from './params/selectionChangeParams';
import { PageChangeParams } from './params/pageChangeParams';
import { ColumnTypesRecord, DEFAULT_COLUMN_TYPES } from './colDef';
import { FeatureMode, FeatureModeConstant } from './featureMode';
import { ColParams } from './params/colParams';
import { CellParams } from './params/cellParams';
import { RowParams } from './params/rowParams';

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
   * If `true`, the grid height is dynamic and follow the number of rows in the grid.
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
   * If `true`, multiple selection using the CTRL or CMD key is disabled.
   *
   * @default false
   */
  disableMultipleSelection?: boolean;
  /**
   * If `true`, sorting with multiple columns is disabled.
   *
   * @default false
   */
  disableMultipleColumnsSorting?: boolean;
  /**
   * If `true`, the right border of the cells are displayed.
   *
   * @default false
   */
  showCellRightBorder?: boolean;
  /**
   * If `true`, the right border of the column headers are displayed.
   *
   * @default false
   */
  showColumnRightBorder?: boolean;
  /**
   * If `true`, rows will not be extended to fill the full width of the grid container.
   *
   * @default false
   */
  disableExtendRowFullWidth?: boolean;
  /**
   * The order of the sorting sequence.
   *
   * @default ['asc', 'desc', null]
   */
  sortingOrder: SortDirection[];
  /**
   * If `true`, pagination is enabled.
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
   * If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar.
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
   * Set it to 'client' if you would like to handle the pagination on the client-side.
   * Set it to 'server' if you would like to handle the pagination on the server-side.
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
   * Sorting can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle sorting on the client-side.
   * Set it to 'server' if you would like to handle sorting on the server-side.
   */
  sortingMode?: FeatureMode;
  /**
   * If `true`, the footer component is hidden.
   *
   * @default false
   */
  hideFooter?: boolean;
  /**
   * If `true`, the row count in the footer is hidden.
   *
   * @default false
   */
  hideFooterRowCount?: boolean;
  /**
   * If `true`, the selected row count in the footer is hidden.
   *
   * @default false
   */
  hideFooterSelectedRowCount?: boolean;
  /**
   * If `true`, the pagination component in the footer is hidden.
   *
   * @default false
   */
  hideFooterPagination?: boolean;
  /**
   * If `true`, the grid get a first column with a checkbox that allows to select rows.
   *
   * @default false
   */
  checkboxSelection?: boolean;
  /**
   * If `true`, the selection on click on a row or cell is disabled.
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
   * Set the sort model of the grid.
   */
  sortModel?: SortModel;
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
   * @param param With all properties from [[SelectionChangeParams]].
   */
  onSelectionChange?: (param: SelectionChangeParams) => void;
  /**
   * Handler triggered when the click event comes from a column header element.
   *
   * @param param With all properties from [[ColParams]].
   */
  onColumnHeaderClick?: (param: ColParams) => void;
  /**
   * Handler triggered when the sort model change and before a column is sorted.
   *
   * @param param With all properties from [[SortModelParams]].
   */
  onSortModelChange?: (params: SortModelParams) => void;
  /**
   * Handler triggered when the current page has change.
   *
   * @param param With all properties from [[PageChangeParams]].
   */
  onPageChange?: (param: PageChangeParams) => void;
  /**
   * Handler triggered when the page size change.
   *
   * @param param With all properties from [[PageChangeParams]].
   */
  onPageSizeChange?: (param: PageChangeParams) => void;
  /**
   * Handler triggered when an exception is thrown in the grid or when the showError api method is called.
   */
  onError?: (args: any) => void;
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
  rowHeight: 52,
  headerHeight: 56,
  scrollbarSize: 15,
  columnBuffer: 2,
  rowsPerPageOptions: [25, 50, 100],
  pageSize: 100,
  paginationMode: FeatureModeConstant.client,
  sortingMode: FeatureModeConstant.client,
  sortingOrder: ['asc', 'desc', null],
  logLevel: 'warn',
  columnTypes: DEFAULT_COLUMN_TYPES,
  icons: {
    columnSortedAscending: ArrowUpwardIcon,
    columnSortedDescending: ArrowDownwardIcon,
    columnResize: SeparatorIcon,
  },
};
