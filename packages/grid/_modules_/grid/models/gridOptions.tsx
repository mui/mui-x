import * as React from 'react';
import { GRID_DEFAULT_LOCALE_TEXT } from '../constants/localeTextConstants';
import { FilterModel } from '../hooks/features/filter/FilterModelState';
import { Logger } from '../hooks/utils/useLogger';
import { GridLocaleText } from './api/gridLocaleTextApi';
import { GridColumnTypesRecord } from './colDef/gridColTypeDef';
import { getGridDefaultColumnTypes } from './colDef/gridDefaultColumnTypes';
import { GridDensity, GridDensityTypes } from './gridDensity';
import { GridEditRowsModel } from './gridEditRowModel';
import { GridFeatureMode, GridFeatureModeConstant } from './gridFeatureMode';
import { GridCellParams } from './params/gridCellParams';
import { GridColParams } from './params/gridColParams';
import { GridFilterModelParams } from './params/gridFilterModelParams';
import { GridPageChangeParams } from './params/gridPageChangeParams';
import { GridRowParams } from './params/gridRowParams';
import { GridRowSelectedParams } from './params/gridRowSelectedParams';
import { GridSelectionModelChangeParams } from './params/gridSelectionModelChangeParams';
import { GridSortModelParams } from './params/gridSortModelParams';
import { GridSelectionModel } from './gridSelectionModel';
import { GridSortDirection, GridSortModel } from './gridSortModel';
import {
  GridCellModeChangeParams,
  GridEditCellPropsParams,
  GridEditCellValueParams,
  GridEditRowModelParams,
} from './params/gridEditCellParams';
import { GridRowScrollEndParams } from './params/gridRowScrollEndParams';

// TODO add multiSortKey
/**
 * Grid options react prop, containing all the setting for the grid.
 */
export interface GridOptions {
  /**
   * If `true`, the grid height is dynamic and follow the number of rows in the grid.
   * @default false
   */
  autoHeight?: boolean;
  /**
   * If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar.
   * @default false
   */
  autoPageSize?: boolean;
  /**
   * If `true`, the grid get a first column with a checkbox that allows to select rows.
   * @default false
   */
  checkboxSelection?: boolean;
  /**
   * Number of columns rendered outside the grid viewport.
   * @default 2
   */
  columnBuffer: number;
  /**
   * Extend native column types with your new column types.
   */
  columnTypes: GridColumnTypesRecord;
  /**
   * Set the density of the grid.
   */
  density: GridDensity;
  /**
   * If `true`, rows will not be extended to fill the full width of the grid container.
   * @default false
   */
  disableExtendRowFullWidth?: boolean;
  /**
   * If `true`, column filters are disabled.
   * @default false
   */
  disableColumnFilter?: boolean;
  /**
   * If `true`, the column menu is disabled.
   * @default false
   */
  disableColumnMenu?: boolean;
  /**
   * If `true`, reordering columns is disabled.
   * @default false
   */
  disableColumnReorder?: boolean;
  /**
   * If `true`, resizing columns is disabled.
   * @default false
   */
  disableColumnResize?: boolean;
  /**
   * If `true`, hiding/showing columns is disabled.
   * @default false
   */
  disableColumnSelector?: boolean;
  /**
   * If `true`, density selection is disabled.
   * @default false
   */
  disableDensitySelector?: boolean;
  /**
   * If `true`, filtering with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsFiltering?: boolean;
  /**
   * If `true`, multiple selection using the CTRL or CMD key is disabled.
   * @default false
   */
  disableMultipleSelection?: boolean;
  /**
   * If `true`, sorting with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsSorting?: boolean;
  /**
   * If `true`, the selection on click on a row or cell is disabled.
   * @default false
   */
  disableSelectionOnClick?: boolean;
  /**
   * Edit cell or rows can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle editing on the client-side.
   * Set it to 'server' if you would like to handle editing on the server-side.
   */
  editMode?: GridFeatureMode;
  /**
   * Set the edit rows model of the grid.
   */
  editRowsModel?: GridEditRowsModel;
  /**
   * Filtering can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle filtering on the client-side.
   * Set it to 'server' if you would like to handle filtering on the server-side.
   */
  filterMode?: GridFeatureMode;
  /**
   * Set the filter model of the grid.
   */
  filterModel?: FilterModel;
  /**
   * Set the height in pixel of the column headers in the grid.
   * @default 56
   */
  headerHeight: number;
  /**
   * If `true`, the footer component is hidden.
   * @default false
   */
  hideFooter?: boolean;
  /**
   * If `true`, the pagination component in the footer is hidden.
   * @default false
   */
  hideFooterPagination?: boolean;
  /**
   * If `true`, the row count in the footer is hidden.
   * @default false
   */
  hideFooterRowCount?: boolean;
  /**
   * If `true`, the selected row count in the footer is hidden.
   * @default false
   */
  hideFooterSelectedRowCount?: boolean;
  /**
   * Callback fired when a cell is rendered, returns true if the cell is editable.
   */
  isCellEditable?: (params: GridCellParams) => boolean;
  /**
   * Set the locale text of the grid.
   * You can find all the translation keys supported in [the source](https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts) in the GitHub repository.
   */
  localeText: Partial<GridLocaleText>;
  /**
   * Pass a custom logger in the components that implements the [[Logger]] interface.
   * @default null
   */
  logger?: Logger;
  /**
   * Allows to pass the logging level or false to turn off logging.
   * @default debug
   */
  logLevel?: string | false;

  /**
   * Callback fired when the edit cell value changed.
   * @param handler
   */
  onEditCellChange?: (params: GridEditCellPropsParams, event?: React.SyntheticEvent) => void;
  /**
   * Callback fired when the cell changes are committed.
   * @param handler
   */
  onEditCellChangeCommitted?: (
    params: GridEditCellPropsParams,
    event?: React.SyntheticEvent,
  ) => void;
  /**
   * Callback fired when the EditRowModel changed.
   * @param handler
   */
  onEditRowModelChange?: (params: GridEditRowModelParams) => void;
  /**
   * Callback fired when an exception is thrown in the grid, or when the `showError` API method is called.
   */
  onError?: (args: any) => void;
  /**
   * Callback fired when the active element leaves a cell.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellBlur?: (param: GridCellParams, event: React.SyntheticEvent) => void;
  /**
   * Callback fired when a click event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellClick?: (param: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a double click event comes from a cell element.
   * @param param With all properties from [[CellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellDoubleClick?: (param: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a keydown event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.KeyboardEvent]].
   */
  onCellKeyDown?: (param: GridCellParams, event: React.KeyboardEvent) => void;
  /**
   * Callback fired when a mouseover event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellOver?: (param: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouseout event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellOut?: (param: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse enter event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellEnter?: (param: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse leave event comes from a cell element.
   * @param param With all properties from [[GridCellParams]].
   * @param event [[React.MouseEvent]].
   */
  onCellLeave?: (param: GridCellParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when the cell mode changed.
   * @param handler
   */
  onCellModeChange?: (params: GridCellModeChangeParams) => void;
  /**
   * Callback fired when the cell value changed.
   * @param handler
   */
  onCellValueChange?: (params: GridEditCellValueParams) => void;
  /**
   * Callback fired when a click event comes from a column header element.
   * @param param With all properties from [[GridColParams]].
   */
  onColumnHeaderClick?: (param: GridColParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a double click event comes from a column header element.
   * @param param With all properties from [[GridColParams]].
   */
  onColumnHeaderDoubleClick?: (param: GridColParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouseover event comes from a column header element.
   * @param param With all properties from [[GridColParams]].
   */
  onColumnHeaderOver?: (param: GridColParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouseout event comes from a column header element.
   * @param param With all properties from [[GridColParams]].
   */
  onColumnHeaderOut?: (param: GridColParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse enter event comes from a column header element.
   * @param param With all properties from [[GridColParams]].
   */
  onColumnHeaderEnter?: (param: GridColParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse leave event comes from a column header element.
   * @param param With all properties from [[GridColParams]].
   */
  onColumnHeaderLeave?: (param: GridColParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when the Filter model changes before the filters are applied.
   * @param param With all properties from [[GridFilterModelParams]].
   */
  onFilterModelChange?: (params: GridFilterModelParams) => void;
  /**
   * Callback fired when the current page has changed.
   * @param param With all properties from [[GridPageChangeParams]].
   */
  onPageChange?: (param: GridPageChangeParams) => void;
  /**
   * Callback fired when the page size has changed.
   * @param param With all properties from [[GridPageChangeParams]].
   */
  onPageSizeChange?: (param: GridPageChangeParams) => void;
  /**
   * Callback fired when a click event comes from a row container element.
   * @param param With all properties from [[GridRowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowClick?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when scrolling to the bottom of the grid viewport.
   * @param param
   */
  onRowsScrollEnd?: (params: GridRowScrollEndParams) => void;
  /**
   * Callback fired when a double click event comes from a row container element.
   * @param param With all properties from [[RowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowDoubleClick?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouseover event comes from a row container element.
   * @param param With all properties from [[GridRowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowOver?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouseout event comes from a row container element.
   * @param param With all properties from [[GridRowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowOut?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse enter event comes from a row container element.
   * @param param With all properties from [[GridRowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowEnter?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when a mouse leave event comes from a row container element.
   * @param param With all properties from [[GridRowParams]].
   * @param event [[React.MouseEvent]].
   */
  onRowLeave?: (param: GridRowParams, event: React.MouseEvent) => void;
  /**
   * Callback fired when one row is selected.
   * @param param With all properties from [[GridRowSelectedParams]].
   */
  onRowSelected?: (param: GridRowSelectedParams) => void;
  /**
   * Callback fired when the selection state of one or multiple rows changes.
   * @param param With all properties from [[SelectionChangeParams]].
   */
  onSelectionModelChange?: (param: GridSelectionModelChangeParams) => void;
  /**
   * Callback fired when the sort model changes before a column is sorted.
   * @param param With all properties from [[GridSortModelParams]].
   */
  onSortModelChange?: (params: GridSortModelParams) => void;
  /**
   * Callback fired when the state of the grid is updated.
   */
  onStateChange?: (params: any) => void;
  /**
   * Set the current page.
   * @default 1
   */
  page?: number;
  /**
   * Set the number of rows in one page.
   * @default 100
   */
  pageSize?: number;
  /**
   * If `true`, pagination is enabled.
   * @default false
   */
  pagination?: boolean;
  /**
   * Pagination can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle the pagination on the client-side.
   * Set it to 'server' if you would like to handle the pagination on the server-side.
   */
  paginationMode?: GridFeatureMode;
  /**
   * Set the height in pixel of a row in the grid.
   * @default 52
   */
  rowHeight: number;
  /**
   * Select the pageSize dynamically using the component UI.
   * @default [25, 50, 100]
   */
  rowsPerPageOptions?: number[];
  /**
   * Set the total number of rows, if it is different than the length of the value `rows` prop.
   */
  rowCount?: number;
  /**
   * Override the height/width of the grid inner scrollbar.
   */
  scrollbarSize?: number;
  /**
   * Set the area at the bottom of the grid viewport where onRowsScrollEnd is called.
   */
  scrollEndThreshold: number;
  /**
   * Set the selection model of the grid.
   */
  selectionModel?: GridSelectionModel;
  /**
   * If `true`, the right border of the cells are displayed.
   * @default false
   */
  showCellRightBorder?: boolean;
  /**
   * If `true`, the right border of the column headers are displayed.
   * @default false
   */
  showColumnRightBorder?: boolean;
  /**
   * The order of the sorting sequence.
   * @default ['asc', 'desc', null]
   */
  sortingOrder: GridSortDirection[];
  /**
   * Sorting can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle sorting on the client-side.
   * Set it to 'server' if you would like to handle sorting on the server-side.
   */
  sortingMode?: GridFeatureMode;
  /**
   * Set the sort model of the grid.
   */
  sortModel?: GridSortModel;
}

/**
 * The default [[GridOptions]] object that will be used to merge with the 'options' passed in the react component prop.
 */
export const DEFAULT_GRID_OPTIONS: GridOptions = {
  columnBuffer: 2,
  columnTypes: getGridDefaultColumnTypes(),
  density: GridDensityTypes.Standard,
  filterMode: GridFeatureModeConstant.client,
  headerHeight: 56,
  localeText: GRID_DEFAULT_LOCALE_TEXT,
  pageSize: 100,
  paginationMode: GridFeatureModeConstant.client,
  rowHeight: 52,
  rowsPerPageOptions: [25, 50, 100],
  scrollEndThreshold: 80,
  sortingMode: GridFeatureModeConstant.client,
  sortingOrder: ['asc', 'desc', null],
};
