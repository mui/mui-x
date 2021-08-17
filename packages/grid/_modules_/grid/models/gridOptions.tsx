import * as React from 'react';
import { GRID_DEFAULT_LOCALE_TEXT } from '../constants/localeTextConstants';
import { GridFilterModel } from './gridFilterModel';
import { GridLocaleText } from './api/gridLocaleTextApi';
import { GridColumnTypesRecord } from './colDef/gridColTypeDef';
import { GridDensity, GridDensityTypes } from './gridDensity';
import { GridEditRowsModel, GridEditMode } from './gridEditRowModel';
import { GridFeatureMode, GridFeatureModeConstant } from './gridFeatureMode';
import { Logger } from './logger';
import { GridCellParams } from './params/gridCellParams';
import { GridColumnHeaderParams } from './params/gridColumnHeaderParams';
import { GridRowParams } from './params/gridRowParams';
import { GridInputSelectionModel, GridSelectionModel } from './gridSelectionModel';
import { GridSortDirection, GridSortModel } from './gridSortModel';
import {
  GridEditCellPropsParams,
  GridEditCellValueParams,
  GridCellEditCommitParams,
} from './params/gridEditCellParams';
import { GridRowScrollEndParams } from './params/gridRowScrollEndParams';
import { GridColumnOrderChangeParams } from './params/gridColumnOrderChangeParams';
import { GridColumnResizeParams } from './params/gridColumnResizeParams';
import { GridColumnVisibilityChangeParams } from './params/gridColumnVisibilityChangeParams';
import { GridRowId } from './gridRows';
import { GridClasses } from './gridClasses';
import { ElementSize } from './elementSize';
import { GridViewportRowsChangeParams } from './params/gridViewportRowsChangeParams';

export type MuiEvent<E> = E & {
  defaultMuiPrevented?: boolean;
};

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
   * If `true`, the "Select All" header checkbox selects only the rows on the current page. To be used in combination with `checkboxSelection`.
   * @default false
   */
  checkboxSelectionVisibleOnly?: boolean;
  /**
   * Number of columns rendered outside the grid viewport.
   * @default 2
   */
  columnBuffer: number;
  /**
   * Extend native column types with your new column types.
   */
  columnTypes?: GridColumnTypesRecord;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: GridClasses;
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
   * If `true`, the density selector is disabled.
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
   * Controls whether to use the cell or row editing.
   * @default "cell"
   */
  editMode?: GridEditMode;
  /**
   * Set the edit rows model of the grid.
   */
  editRowsModel?: GridEditRowsModel;
  /**
   * Callback fired when the EditRowModel changes.
   * @param {GridEditRowsModel} editRowsModel With all properties from [[GridEditRowsModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onEditRowsModelChange?: (editRowsModel: GridEditRowsModel, details?: any) => void;
  /**
   * Filtering can be processed on the server or client-side.
   * Set it to 'server' if you would like to handle filtering on the server-side.
   * @default "client"
   */
  filterMode?: GridFeatureMode;
  /**
   * Set the filter model of the grid.
   */
  filterModel?: GridFilterModel;
  /**
   * Function that applies CSS classes dynamically on cells.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  getCellClassName?: (params: GridCellParams, details?: any) => string;
  /**
   * Function that applies CSS classes dynamically on rows.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  getRowClassName?: (params: GridRowParams, details?: any) => string;
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
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  isCellEditable?: (params: GridCellParams, details?: any) => boolean;
  /**
   * Determines if a row can be selected.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  isRowSelectable?: (params: GridRowParams, details?: any) => boolean;
  /**
   * Set the locale text of the grid.
   * You can find all the translation keys supported in [the source](https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts) in the GitHub repository.
   */
  localeText: Partial<GridLocaleText>;
  /**
   * Pass a custom logger in the components that implements the [[Logger]] interface.
   * @default null
   */
  logger: Logger;
  /**
   * Allows to pass the logging level or false to turn off logging.
   * @default debug
   */
  logLevel?: string | false;
  /**
   * Callback fired when the edit cell value changes.
   * @param {GridEditCellPropsParams} params With all properties from [[GridEditCellPropsParams]].
   * @param {MuiEvent} event The event that caused this prop to be called.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onEditCellPropsChange?: (
    params: GridEditCellPropsParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when the cell changes are committed.
   * @param {GridCellEditCommitParams} params With all properties from [[GridCellEditCommitParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellEditCommit?: (
    params: GridCellEditCommitParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when the cell turns to edit mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   */
  onCellEditStart?: (params: GridCellParams, event: MuiEvent<React.SyntheticEvent>) => void;
  /**
   * Callback fired when the cell turns to view mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   */
  onCellEditStop?: (params: GridCellParams, event: MuiEvent<React.SyntheticEvent>) => void;
  /**
   * Callback fired when the row changes are committed.
   * @param {GridRowId} id The row id.
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   */
  onRowEditCommit?: (id: GridRowId, event: MuiEvent<React.SyntheticEvent>) => void;
  /**
   * Callback fired when the row turns to edit mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   */
  onRowEditStart?: (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => void;
  /**
   * Callback fired when the row turns to view mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   */
  onRowEditStop?: (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => void;
  /**
   * Callback fired when an exception is thrown in the grid, or when the `showError` API method is called.
   * @param args
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onError?: (args: any, details?: any) => void;
  /**
   * Callback fired when the active element leaves a cell.
   * @param params With all properties from [[GridCellParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellBlur?: (
    params: GridCellParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a click event comes from a cell element.
   * @param params With all properties from [[GridCellParams]].
   * @param event [[MuiEvent<React.MouseEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellClick?: (params: GridCellParams, event: MuiEvent<React.MouseEvent>, details?: any) => void;
  /**
   * Callback fired when a double click event comes from a cell element.
   * @param params With all properties from [[GridCellParams]].
   * @param event [[MuiEvent<React.MouseEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellDoubleClick?: (
    params: GridCellParams,
    event: MuiEvent<React.MouseEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a cell loses focus.
   * @param params With all properties from [[GridCellParams]].
   * @param event [[MuiEvent<React.SyntheticEvent | DocumentEventMap['click']>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellFocusOut?: (
    params: GridCellParams,
    event: MuiEvent<React.SyntheticEvent | DocumentEventMap['click']>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a keydown event comes from a cell element.
   * @param params With all properties from [[GridCellParams]].
   * @param event [[MuiEvent<React.KeyboardEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellKeyDown?: (
    params: GridCellParams,
    event: MuiEvent<React.KeyboardEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a mouseover event comes from a cell element.
   * @param params With all properties from [[GridCellParams]].
   * @param event [[MuiEvent<React.MouseEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellOver?: (params: GridCellParams, event: MuiEvent<React.MouseEvent>, details?: any) => void;
  /**
   * Callback fired when a mouseout event comes from a cell element.
   * @param params With all properties from [[GridCellParams]].
   * @param event [[MuiEvent<React.MouseEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellOut?: (params: GridCellParams, event: MuiEvent<React.MouseEvent>, details?: any) => void;
  /**
   * Callback fired when a mouse enter event comes from a cell element.
   * @param params With all properties from [[GridCellParams]].
   * @param event [[MuiEvent<React.MouseEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellEnter?: (params: GridCellParams, event: MuiEvent<React.MouseEvent>, details?: any) => void;
  /**
   * Callback fired when a mouse leave event comes from a cell element.
   * @param params With all properties from [[GridCellParams]].
   * @param event [[MuiEvent<React.MouseEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellLeave?: (params: GridCellParams, event: MuiEvent<React.MouseEvent>, details?: any) => void;
  /**
   * Callback fired when the cell value changed.
   * @param params With all properties from [[GridEditCellValueParams]].
   * @param event [[MuiEvent<{}>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellValueChange?: (params: GridEditCellValueParams, event: MuiEvent<{}>, details?: any) => void;
  /**
   * Callback fired when a click event comes from a column header element.
   * @param params With all properties from [[GridColumnHeaderParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderClick?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a double click event comes from a column header element.
   * @param params With all properties from [[GridColumnHeaderParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderDoubleClick?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a mouseover event comes from a column header element.
   * @param params With all properties from [[GridColumnHeaderParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOver?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a mouseout event comes from a column header element.
   * @param params With all properties from [[GridColumnHeaderParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOut?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a mouse enter event comes from a column header element.
   * @param params With all properties from [[GridColumnHeaderParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderEnter?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a mouse leave event comes from a column header element.
   * @param params With all properties from [[GridColumnHeaderParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderLeave?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a column is reordered.
   * @param params With all properties from [[GridColumnOrderChangeParams]].
   * @param event [[MuiEvent<{}>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnOrderChange?: (
    params: GridColumnOrderChangeParams,
    event: MuiEvent<{}>,
    details?: any,
  ) => void;
  /**
   * Callback fired while a column is being resized.
   * @param params With all properties from [[GridColumnResizeParams]].
   * @param event [[MuiEvent<{}>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnResize?: (params: GridColumnResizeParams, event: MuiEvent<{}>, details?: any) => void;
  /**
   * Callback fired when the width of a column is changed.
   * @param params With all properties from [[GridColumnResizeParams]].
   * @param event [[MuiEvent<{}>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnWidthChange?: (
    params: GridColumnResizeParams,
    event: MuiEvent<{}>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a column visibility changes.
   * @param params With all properties from [[GridColumnVisibilityChangeParams]].
   * @param event [[MuiEvent<{}>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnVisibilityChange?: (
    params: GridColumnVisibilityChangeParams,
    event: MuiEvent<{}>,
    details?: any,
  ) => void;
  /**
   * Callback fired when the Filter model changes before the filters are applied.
   * @param model With all properties from [[GridFilterModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onFilterModelChange?: (model: GridFilterModel, details?: any) => void;
  /**
   * Callback fired when the current page has changed.
   * @param page Index of the page displayed on the Grid.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPageChange?: (page: number, details?: any) => void;
  /**
   * Callback fired when the page size has changed.
   * @param pageSize Size of the page displayed on the Grid.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPageSizeChange?: (pageSize: number, details?: any) => void;
  /**
   * Callback fired when a click event comes from a row container element.
   * @param params With all properties from [[GridRowParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowClick?: (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when scrolling to the bottom of the grid viewport.
   * @param params With all properties from [[GridRowScrollEndParams]].
   * @param event [[MuiEvent<{}>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowsScrollEnd?: (params: GridRowScrollEndParams, event: MuiEvent<{}>, details?: any) => void;
  /**
   * Callback fired when a double click event comes from a row container element.
   * @param params With all properties from [[RowParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowDoubleClick?: (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a mouseover event comes from a row container element.
   * @param params With all properties from [[GridRowParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowOver?: (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>, details?: any) => void;
  /**
   * Callback fired when a mouseout event comes from a row container element.
   * @param params With all properties from [[GridRowParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowOut?: (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>, details?: any) => void;
  /**
   * Callback fired when a mouse enter event comes from a row container element.
   * @param params With all properties from [[GridRowParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowEnter?: (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when a mouse leave event comes from a row container element.
   * @param params With all properties from [[GridRowParams]].
   * @param event [[MuiEvent<React.SyntheticEvent>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowLeave?: (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
    details?: any,
  ) => void;
  /**
   * Callback fired when the grid is resized.
   * @param containerSize With all properties from [[ElementSize]].
   * @param event [[MuiEvent<{}>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onResize?: (containerSize: ElementSize, event: MuiEvent<{}>, details?: any) => void;
  /**
   * Callback fired when the selection state of one or multiple rows changes.
   * @param selectionModel With all the row ids [[GridSelectionModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSelectionModelChange?: (selectionModel: GridSelectionModel, details?: any) => void;
  /**
   * Callback fired when the sort model changes before a column is sorted.
   * @param model With all properties from [[GridSortModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSortModelChange?: (model: GridSortModel, details?: any) => void;
  /**
   * Callback fired when the state of the grid is updated.
   * @param state The new state.
   * @param event [[MuiEvent<{}>]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @internal
   */
  onStateChange?: (state: any, event: MuiEvent<{}>, details?: any) => void;
  /**
   * Callback fired when the rows in the viewport change.
   */
  onViewportRowsChange?: (
    params: GridViewportRowsChangeParams,
    event: MuiEvent<{}>,
    details?: any,
  ) => void;
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
  selectionModel?: GridInputSelectionModel;
  /**
   * Signal to the underlying logic what version of the public component API
   * of the data grid is exposed [[GridSignature]].
   * @internal
   */
  signature?: string;
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
 * The default options to inject in the props of DataGrid or XGrid.
 */
export const DEFAULT_GRID_PROPS_FROM_OPTIONS = {
  columnBuffer: 2,
  density: GridDensityTypes.Standard,
  filterMode: GridFeatureModeConstant.client,
  headerHeight: 56,
  paginationMode: GridFeatureModeConstant.client,
  rowHeight: 52,
  rowsPerPageOptions: [25, 50, 100],
  scrollEndThreshold: 80,
  sortingMode: GridFeatureModeConstant.client,
  sortingOrder: ['asc' as const, 'desc' as const, null],
  logger: console,
  logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  editMode: 'cell' as const,
};

/**
 * The default [[GridOptions]] object that will be used to merge with the 'options' passed in the react component prop.
 */
export const DEFAULT_GRID_OPTIONS = {
  ...DEFAULT_GRID_PROPS_FROM_OPTIONS,
  localeText: GRID_DEFAULT_LOCALE_TEXT,
};
