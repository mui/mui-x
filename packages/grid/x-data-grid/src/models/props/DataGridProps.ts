import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { CommonProps } from '@mui/material/OverridableComponent';
import { GridDensity } from '../gridDensity';
import { GridEditMode, GridEditRowsModel } from '../gridEditRowModel';
import { GridFeatureMode } from '../gridFeatureMode';
import { Logger } from '../logger';
import { GridSortDirection, GridSortModel } from '../gridSortModel';
import { GridSlotsComponent } from '../gridSlotsComponent';
import { GridRowIdGetter, GridRowsProp, GridValidRowModel } from '../gridRows';
import { GridEventListener } from '../events';
import { GridCallbackDetails, GridLocaleText } from '../api';
import { GridApiCommunity } from '../api/gridApiCommunity';
import type { GridColumnTypesRecord } from '../colDef';
import type { GridColumns } from '../colDef/gridColDef';
import { GridClasses } from '../../constants/gridClasses';
import {
  GridRowHeightParams,
  GridRowHeightReturnValue,
  GridRowParams,
  GridRowSpacing,
  GridRowSpacingParams,
  GridRowClassNameParams,
} from '../params';
import { GridCellParams } from '../params/gridCellParams';
import { GridFilterModel } from '../gridFilterModel';
import { GridInputSelectionModel, GridSelectionModel } from '../gridSelectionModel';
import { GridInitialStateCommunity } from '../gridStateCommunity';
import { GridSlotsComponentsProps } from '../gridSlotsComponentsProps';
import { GridColumnVisibilityModel } from '../../hooks/features/columns/gridColumnsInterfaces';
import { GridCellModesModel, GridRowModesModel } from '../api/gridEditingApi';

export interface GridExperimentalFeatures {
  /**
   * Will be part of the premium-plan when fully ready.
   */
  preventCommitWhileValidating: boolean;
  /**
   * Enables the new API for cell editing and row editing.
   */
  newEditingApi: boolean;
  /**
   * Emits a warning if the cell receives focus without also syncing the focus state.
   * Only works if NODE_ENV=test.
   */
  warnIfFocusStateIsNotSynced: boolean;
}

/**
 * The props users can give to the `DataGrid` component.
 */
export type DataGridProps<R extends GridValidRowModel = any> = Omit<
  Partial<DataGridPropsWithDefaultValues> &
    DataGridPropsWithComplexDefaultValueBeforeProcessing &
    DataGridPropsWithoutDefaultValue<R>,
  DataGridForcedPropsKey
> & {
  pagination?: true;
};

/**
 * The props of the `DataGrid` component after the pre-processing phase.
 */
export interface DataGridProcessedProps<R extends GridValidRowModel = any>
  extends DataGridPropsWithDefaultValues,
    DataGridPropsWithComplexDefaultValueAfterProcessing,
    DataGridPropsWithoutDefaultValue<R> {}

/**
 * The props of the `DataGrid` component after the pre-processing phase that the user should not be able to override.
 * Those are usually used in feature-hook for which the pro-plan has more advanced features (eg: multi-sorting, multi-filtering, ...).
 */
export type DataGridForcedPropsKey =
  | 'apiRef'
  | 'checkboxSelectionVisibleOnly'
  | 'disableMultipleColumnsFiltering'
  | 'disableMultipleColumnsSorting'
  | 'disableMultipleSelection'
  | 'disableColumnReorder'
  | 'disableColumnResize'
  | 'throttleRowsMs'
  | 'hideFooterRowCount'
  | 'pagination'
  | 'signature';

/**
 * The `DataGrid` options with a default value that must be merged with the value given through props.
 */
export interface DataGridPropsWithComplexDefaultValueAfterProcessing {
  components: GridSlotsComponent;
  localeText: GridLocaleText;
}

/**
 * The `DataGrid` options with a default value that must be merged with the value given through props.
 */
export interface DataGridPropsWithComplexDefaultValueBeforeProcessing {
  /**
   * Overrideable components.
   */
  components?: Partial<GridSlotsComponent>;
  /**
   * Set the locale text of the grid.
   * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/grid/x-data-grid/src/constants/localeTextConstants.ts) in the GitHub repository.
   */
  localeText?: Partial<GridLocaleText>;
}

/**
 * The `DataGrid` options with a default value overridable through props
 * None of the entry of this interface should be optional, they all have default values and `DataGridProps` already applies a `Partial<DataGridSimpleOptions>` for the public interface
 * The controlled model do not have a default value at the prop processing level, so they must be defined in `DataGridOtherProps`
 * TODO: add multiSortKey
 */
export interface DataGridPropsWithDefaultValues {
  /**
   * If `true`, the grid height is dynamic and follow the number of rows in the grid.
   * @default false
   */
  autoHeight: boolean;
  /**
   * If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar.
   * @default false
   */
  autoPageSize: boolean;
  /**
   * If `true`, the grid get a first column with a checkbox that allows to select rows.
   * @default false
   */
  checkboxSelection: boolean;
  /**
   * If `true`, the "Select All" header checkbox selects only the rows on the current page. To be used in combination with `checkboxSelection`.
   * It only works if the pagination is enabled.
   * @default false
   */
  checkboxSelectionVisibleOnly: boolean;
  /**
   * Number of extra columns to be rendered before/after the visible slice.
   * @default 3
   */
  columnBuffer: number;
  /**
   * Number of extra rows to be rendered before/after the visible slice.
   * @default 3
   */
  rowBuffer: number;
  /**
   * Number of rows from the `rowBuffer` that can be visible before a new slice is rendered.
   * @default 3
   */
  rowThreshold: number;
  /**
   * Number of rows from the `columnBuffer` that can be visible before a new slice is rendered.
   * @default 3
   */
  columnThreshold: number;
  /**
   * Set the density of the grid.
   * @default "standard"
   */
  density: GridDensity;
  /**
   * If `true`, rows will not be extended to fill the full width of the grid container.
   * @default false
   */
  disableExtendRowFullWidth: boolean;
  /**
   * If `true`, column filters are disabled.
   * @default false
   */
  disableColumnFilter: boolean;
  /**
   * If `true`, the column menu is disabled.
   * @default false
   */
  disableColumnMenu: boolean;
  /**
   * If `true`, hiding/showing columns is disabled.
   * @default false
   */
  disableColumnSelector: boolean;
  /**
   * If `true`, the density selector is disabled.
   * @default false
   */
  disableDensitySelector: boolean;
  /**
   * If `true`, filtering with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsFiltering: boolean;
  /**
   * If `true`, multiple selection using the Ctrl or CMD key is disabled.
   * @default false
   */
  disableMultipleSelection: boolean;
  /**
   * If `true`, sorting with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsSorting: boolean;
  /**
   * If `true`, the selection on click on a row or cell is disabled.
   * @default false
   */
  disableSelectionOnClick: boolean;
  /**
   * If `true`, the virtualization is disabled.
   * @default false
   */
  disableVirtualization: boolean;
  /**
   * Controls whether to use the cell or row editing.
   * @default "cell"
   */
  editMode: GridEditMode;
  /**
   * Filtering can be processed on the server or client-side.
   * Set it to 'server' if you would like to handle filtering on the server-side.
   * @default "client"
   */
  filterMode: GridFeatureMode;
  /**
   * Set the height in pixel of the column headers in the grid.
   * @default 56
   */
  headerHeight: number;
  /**
   * If `true`, the footer component is hidden.
   * @default false
   */
  hideFooter: boolean;
  /**
   * If `true`, the pagination component in the footer is hidden.
   * @default false
   */
  hideFooterPagination: boolean;
  /**
   * If `true`, the row count in the footer is hidden.
   * It has no effect if the pagination is enabled.
   * @default false
   */
  hideFooterRowCount: boolean;
  /**
   * If `true`, the selected row count in the footer is hidden.
   * @default false
   */
  hideFooterSelectedRowCount: boolean;
  /**
   * If `true`, the selection model will retain selected rows that do not exist.
   * Useful when using server side pagination and row selections need to be retained
   * when changing pages.
   * @default false
   */
  keepNonExistentRowsSelected: boolean;
  /**
   * Pass a custom logger in the components that implements the [[Logger]] interface.
   * @default console
   */
  logger: Logger;
  /**
   * Allows to pass the logging level or false to turn off logging.
   * @default "debug"
   */
  logLevel: keyof Logger | false;
  /**
   * If `true`, pagination is enabled.
   * @default false
   */
  pagination: boolean;
  /**
   * Pagination can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle the pagination on the client-side.
   * Set it to 'server' if you would like to handle the pagination on the server-side.
   * @default "client"
   */
  paginationMode: GridFeatureMode;
  /**
   * Set the height in pixel of a row in the grid.
   * @default 52
   */
  rowHeight: number;
  /**
   * Select the pageSize dynamically using the component UI.
   * @default [25, 50, 100]
   */
  rowsPerPageOptions: number[];
  /**
   * Sets the type of space between rows added by `getRowSpacing`.
   * @default "margin"
   */
  rowSpacingType: 'margin' | 'border';
  /**
   * If `true`, the right border of the cells are displayed.
   * @default false
   */
  showCellRightBorder: boolean;
  /**
   * If `true`, the right border of the column headers are displayed.
   * @default false
   */
  showColumnRightBorder: boolean;
  /**
   * The order of the sorting sequence.
   * @default ['asc', 'desc', null]
   */
  sortingOrder: GridSortDirection[];
  /**
   * Sorting can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle sorting on the client-side.
   * Set it to 'server' if you would like to handle sorting on the server-side.
   * @default "client"
   */
  sortingMode: GridFeatureMode;
  /**
   * If positive, the Grid will throttle updates coming from `apiRef.current.updateRows` and `apiRef.current.setRows`.
   * It can be useful if you have a high update rate but do not want to do heavy work like filtering / sorting or rendering on each  individual update.
   * @default 0
   */
  throttleRowsMs: number;
  /**
   * If `true`, reordering columns is disabled.
   * @default false
   */
  disableColumnReorder: boolean;
  /**
   * If `true`, resizing columns is disabled.
   * @default false
   */
  disableColumnResize: boolean;
}

/**
 * The `DataGrid` props with no default value.
 */
export interface DataGridPropsWithoutDefaultValue<R extends GridValidRowModel = any>
  extends CommonProps {
  /**
   * The ref object that allows grid manipulation. Can be instantiated with [[useGridApiRef()]].
   * TODO: Remove `@internal` when opening `apiRef` to Community plan
   * @internal
   */
  apiRef?: React.MutableRefObject<GridApiCommunity>;
  /**
   * Signal to the underlying logic what version of the public component API
   * of the data grid is exposed [[GridSignature]].
   * @internal
   */
  signature?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<GridClasses>;
  /**
   * Extend native column types with your new column types.
   */
  columnTypes?: GridColumnTypesRecord;
  /**
   * Set the total number of rows, if it is different from the length of the value `rows` prop.
   * If some rows have children (for instance in the tree data), this number represents the amount of top level rows.
   */
  rowCount?: number;
  /**
   * Override the height/width of the grid inner scrollbar.
   */
  scrollbarSize?: number;
  /**
   * Function that applies CSS classes dynamically on cells.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @returns {string} The CSS class to apply to the cell.
   */
  getCellClassName?: (params: GridCellParams<any, R>) => string;
  /**
   * Function that applies CSS classes dynamically on rows.
   * @param {GridRowClassNameParams} params With all properties from [[GridRowClassNameParams]].
   * @returns {string} The CSS class to apply to the row.
   */
  getRowClassName?: (params: GridRowClassNameParams<R>) => string;
  /**
   * Function that sets the row height per row.
   * @param {GridRowHeightParams} params With all properties from [[GridRowHeightParams]].
   * @returns {GridRowHeightReturnValue} The row height value. If `null` or `undefined` then the default row height is applied. If "auto" then the row height is calculated based on the content.
   */
  getRowHeight?: (params: GridRowHeightParams) => GridRowHeightReturnValue;
  /**
   * Function that returns the estimated height for a row.
   * Only works if dynamic row height is used.
   * Once the row height is measured this value is discarded.
   * @param {GridRowHeightParams} params With all properties from [[GridRowHeightParams]].
   * @returns {number | null} The estimated row height value. If `null` or `undefined` then the default row height, based on the density, is applied.
   */
  getEstimatedRowHeight?: (params: GridRowHeightParams) => number | null;
  /**
   * Function that allows to specify the spacing between rows.
   * @param {GridRowSpacingParams} params With all properties from [[GridRowSpacingParams]].
   * @returns {GridRowSpacing} The row spacing values.
   */
  getRowSpacing?: (params: GridRowSpacingParams) => GridRowSpacing;
  /**
   * Function that returns the element to render in row detail.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {JSX.Element} The row detail element.
   */
  getDetailPanelContent?: (params: GridRowParams<R>) => React.ReactNode;
  /**
   * Callback fired when a cell is rendered, returns true if the cell is editable.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @returns {boolean} A boolean indicating if the cell is editable.
   */
  isCellEditable?: (params: GridCellParams<any, R>) => boolean;
  /**
   * Determines if a row can be selected.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {boolean} A boolean indicating if the cell is selectable.
   */
  isRowSelectable?: (params: GridRowParams<R>) => boolean;
  /**
   * Callback fired when the edit cell value changes.
   * @param {GridEditCellPropsParams} params With all properties from [[GridEditCellPropsParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @deprecated use `preProcessEditCellProps` from the [`GridColDef`](/x/api/data-grid/grid-col-def/)
   */
  onEditCellPropsChange?: GridEventListener<'editCellPropsChange'>;
  /**
   * Callback fired when the cell changes are committed.
   * @param {GridCellEditCommitParams} params With all properties from [[GridCellEditCommitParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellEditCommit?: GridEventListener<'cellEditCommit'>;
  /**
   * Callback fired when the cell turns to edit mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
   */
  onCellEditStart?: GridEventListener<'cellEditStart'>;
  /**
   * Callback fired when the cell turns to view mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onCellEditStop?: GridEventListener<'cellEditStop'>;
  /**
   * Callback fired when the row changes are committed.
   * @param {GridRowId} id The row id.
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onRowEditCommit?: GridEventListener<'rowEditCommit'>;
  /**
   * Callback fired when the row turns to edit mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
   */
  onRowEditStart?: GridEventListener<'rowEditStart'>;
  /**
   * Callback fired when the row turns to view mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onRowEditStop?: GridEventListener<'rowEditStop'>;
  /**
   * Callback fired when an exception is thrown in the grid.
   * @param {any} args The arguments passed to the `showError` call.
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onError?: GridEventListener<'componentError'>;
  /**
   * Callback fired when any cell is clicked.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellClick?: GridEventListener<'cellClick'>;
  /**
   * Callback fired when a double click event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellDoubleClick?: GridEventListener<'cellDoubleClick'>;
  /**
   * Callback fired when a cell loses focus.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellFocusOut?: GridEventListener<'cellFocusOut'>;
  /**
   * Callback fired when a keydown event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.KeyboardEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellKeyDown?: GridEventListener<'cellKeyDown'>;
  /**
   * Callback fired when a click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderClick?: GridEventListener<'columnHeaderClick'>;
  /**
   * Callback fired when a double click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderDoubleClick?: GridEventListener<'columnHeaderDoubleClick'>;
  /**
   * Callback fired when a mouseover event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOver?: GridEventListener<'columnHeaderOver'>;
  /**
   * Callback fired when a mouseout event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOut?: GridEventListener<'columnHeaderOut'>;
  /**
   * Callback fired when a mouse enter event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderEnter?: GridEventListener<'columnHeaderEnter'>;
  /**
   * Callback fired when a mouse leave event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderLeave?: GridEventListener<'columnHeaderLeave'>;
  /**
   * Callback fired when a column is reordered.
   * @param {GridColumnOrderChangeParams} params With all properties from [[GridColumnOrderChangeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnOrderChange?: GridEventListener<'columnOrderChange'>;
  /**
   * Callback fired when a column visibility changes.
   * Only works when no `columnVisibilityModel` is provided and if we change the visibility of a single column at a time.
   * @param {GridColumnVisibilityChangeParams} params With all properties from [[GridColumnVisibilityChangeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @deprecated Use `onColumnVisibilityModelChange` instead.
   */
  onColumnVisibilityChange?: GridEventListener<'columnVisibilityChange'>;
  /**
   * Callback fired when a row is clicked.
   * Not called if the target clicked is an interactive element added by the built-in columns.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowClick?: GridEventListener<'rowClick'>;
  /**
   * Callback fired when a double click event comes from a row container element.
   * @param {GridRowParams} params With all properties from [[RowParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowDoubleClick?: GridEventListener<'rowDoubleClick'>;
  /**
   * Callback fired when the grid is resized.
   * @param {ElementSize} containerSize With all properties from [[ElementSize]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onResize?: GridEventListener<'debouncedResize'>;
  /**
   * Callback fired when the state of the grid is updated.
   * @param {GridState} state The new state.
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @internal
   */
  onStateChange?: GridEventListener<'stateChange'>;
  /**
   * The zero-based index of the current page.
   * @default 0
   */
  page?: number;
  /**
   * Callback fired when the current page has changed.
   * @param {number} page Index of the page displayed on the Grid.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPageChange?: (page: number, details: GridCallbackDetails) => void;
  /**
   * Set the number of rows in one page.
   * If some of the rows have children (for instance in the tree data), this number represents the amount of top level rows wanted on each page.
   * @default 100
   */
  pageSize?: number;
  /**
   * Callback fired when the page size has changed.
   * @param {number} pageSize Size of the page displayed on the Grid.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPageSizeChange?: (pageSize: number, details: GridCallbackDetails) => void;
  /**
   * Callback fired when the preferences panel is closed.
   * @param {GridPreferencePanelParams} params With all properties from [[GridPreferencePanelParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPreferencePanelClose?: GridEventListener<'preferencePanelClose'>;
  /**
   * Callback fired when the preferences panel is opened.
   * @param {GridPreferencePanelParams} params With all properties from [[GridPreferencePanelParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPreferencePanelOpen?: GridEventListener<'preferencePanelOpen'>;
  /**
   * Callback fired when the menu is opened.
   * @param {GridMenuParams} params With all properties from [[GridMenuParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onMenuOpen?: GridEventListener<'menuOpen'>;
  /**
   * Callback fired when the menu is closed.
   * @param {GridMenuParams} params With all properties from [[GridMenuParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onMenuClose?: GridEventListener<'menuClose'>;
  /**
   * Set the edit rows model of the grid.
   */
  editRowsModel?: GridEditRowsModel;
  /**
   * Callback fired when the `editRowsModel` changes.
   * @param {GridEditRowsModel} editRowsModel With all properties from [[GridEditRowsModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onEditRowsModelChange?: (editRowsModel: GridEditRowsModel, details: GridCallbackDetails) => void;
  /**
   * Controls the modes of the cells.
   */
  cellModesModel?: GridCellModesModel;
  /**
   * Callback fired when the `cellModesModel` prop changes.
   * @param {GridCellModesModel} cellModesModel Object containig which cells are in "edit" mode.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellModesModelChange?: (
    cellModesModel: GridCellModesModel,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Controls the modes of the rows.
   */
  rowModesModel?: GridRowModesModel;
  /**
   * Callback fired when the `rowModesModel` prop changes.
   * @param {GridRowModesModel} rowModesModel Object containig which rows are in "edit" mode.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowModesModelChange?: (rowModesModel: GridRowModesModel, details: GridCallbackDetails) => void;
  /**
   * Set the filter model of the grid.
   */
  filterModel?: GridFilterModel;
  /**
   * Callback fired when the Filter model changes before the filters are applied.
   * @param {GridFilterModel} model With all properties from [[GridFilterModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onFilterModelChange?: (model: GridFilterModel, details: GridCallbackDetails<'filter'>) => void;
  /**
   * Set the selection model of the grid.
   */
  selectionModel?: GridInputSelectionModel;
  /**
   * Callback fired when the selection state of one or multiple rows changes.
   * @param {GridSelectionModel} selectionModel With all the row ids [[GridSelectionModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSelectionModelChange?: (
    selectionModel: GridSelectionModel,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Set the column visibility model of the grid.
   * If defined, the grid will ignore the `hide` property in [[GridColDef]].
   */
  columnVisibilityModel?: GridColumnVisibilityModel;
  /**
   * Callback fired when the column visibility model changes.
   * @param {GridColumnVisibilityModel} model The new model.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnVisibilityModelChange?: (
    model: GridColumnVisibilityModel,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Set the sort model of the grid.
   */
  sortModel?: GridSortModel;
  /**
   * Callback fired when the sort model changes before a column is sorted.
   * @param {GridSortModel} model With all properties from [[GridSortModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSortModelChange?: (model: GridSortModel, details: GridCallbackDetails) => void;
  /**
   * The label of the grid.
   */
  'aria-label'?: string;
  /**
   * The id of the element containing a label for the grid.
   */
  'aria-labelledby'?: string;
  /**
   * Set of columns of type [[GridColumns]].
   */
  columns: GridColumns<R>;
  /**
   * An error that will turn the grid into its error state and display the error component.
   */
  error?: any;
  /**
   * Return the id of a given [[GridRowModel]].
   */
  getRowId?: GridRowIdGetter<R>;
  /**
   * If `true`, a  loading overlay is displayed.
   */
  loading?: boolean;
  /**
   * Nonce of the inline styles for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute).
   */
  nonce?: string;
  /**
   * Set of rows of type [[GridRowsProp]].
   */
  rows: GridRowsProp<R>;
  /**
   * The initial state of the DataGrid.
   * The data in it will be set in the state on initialization but will not be controlled.
   * If one of the data in `initialState` is also being controlled, then the control state wins.
   */
  initialState?: GridInitialStateCommunity;
  /**
   * Overrideable components props dynamically passed to the component at rendering.
   */
  componentsProps?: GridSlotsComponentsProps;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Features under development.
   * For each feature, if the flag is not explicitly set to `true`, the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures?: Partial<GridExperimentalFeatures>;
  /**
   * Callback called before updating a row with new values in the row and cell editing.
   * Only applied if `props.experimentalFeatures.newEditingApi: true`.
   * @template R
   * @param {R} newRow Row object with the new values.
   * @param {R} oldRow Row object with the old values.
   * @returns {Promise<R> | R} The final values to update the row.
   */
  processRowUpdate?: (newRow: R, oldRow: R) => Promise<R> | R;
  /**
   * Callback called when `processRowUpdate` throws an error or rejects.
   * @param {any} error The error thrown.
   */
  onProcessRowUpdateError?: (error: any) => void;
}
