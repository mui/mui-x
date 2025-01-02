import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { CommonProps } from '@mui/material/OverridableComponent';
import { GridDensity } from '../gridDensity';
import { GridEditMode } from '../gridEditRowModel';
import { GridFeatureMode } from '../gridFeatureMode';
import { Logger } from '../logger';
import { GridSortDirection, GridSortModel } from '../gridSortModel';
import { GridSlotsComponent } from '../gridSlotsComponent';
import { GridRowId, GridRowIdGetter, GridRowsProp, GridValidRowModel } from '../gridRows';
import { GridEventListener } from '../events';
import { GridCallbackDetails, GridLocaleText } from '../api';
import { GridApiCommunity } from '../api/gridApiCommunity';
import type { GridColDef, GridListColDef } from '../colDef/gridColDef';
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
import { GridInputRowSelectionModel, GridRowSelectionModel } from '../gridRowSelectionModel';
import { GridInitialStateCommunity } from '../gridStateCommunity';
import { GridSlotsComponentsProps } from '../gridSlotsComponentsProps';
import { GridColumnVisibilityModel } from '../../hooks/features/columns/gridColumnsInterfaces';
import { GridCellModesModel, GridRowModesModel } from '../api/gridEditingApi';
import { GridColumnGroupingModel } from '../gridColumnGrouping';
import { GridPaginationMeta, GridPaginationModel } from '../gridPaginationProps';
import type { GridAutosizeOptions } from '../../hooks/features/columnResize';
import type { GridDataSource } from '../gridDataSource';
import type { GridRowSelectionPropagation } from '../gridRowSelectionModel';

export interface GridExperimentalFeatures {
  /**
   * Emits a warning if the cell receives focus without also syncing the focus state.
   * Only works if NODE_ENV=test.
   */
  warnIfFocusStateIsNotSynced: boolean;
}

/**
 * The props users can give to the Data Grid component.
 */
export type DataGridProps<R extends GridValidRowModel = any> = Omit<
  Partial<DataGridPropsWithDefaultValues<R>> &
    DataGridPropsWithComplexDefaultValueBeforeProcessing &
    DataGridPropsWithoutDefaultValue<R>,
  DataGridForcedPropsKey
> & {
  pagination?: true;
};

/**
 * The props of the Data Grid component after the pre-processing phase that the user should not be able to override.
 * Those are usually used in feature-hook for which the pro-plan has more advanced features (eg: multi-sorting, multi-filtering, ...).
 */
export type DataGridForcedPropsKey =
  | 'checkboxSelectionVisibleOnly'
  | 'disableMultipleColumnsFiltering'
  | 'disableMultipleColumnsSorting'
  | 'disableColumnReorder'
  | 'keepColumnPositionIfDraggedOutside'
  | 'throttleRowsMs'
  | 'hideFooterRowCount'
  | 'pagination'
  | 'signature'
  | 'unstable_listView';

/**
 * The Data Grid options with a default value that must be merged with the value given through props.
 */
export interface DataGridPropsWithComplexDefaultValueAfterProcessing {
  slots: GridSlotsComponent;
  localeText: GridLocaleText;
}

/**
 * The Data Grid options with a default value that must be merged with the value given through props.
 */
export interface DataGridPropsWithComplexDefaultValueBeforeProcessing {
  /**
   * Overridable components.
   */
  slots?: Partial<GridSlotsComponent>;
  /**
   * Set the locale text of the Data Grid.
   * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-data-grid/src/constants/localeTextConstants.ts) in the GitHub repository.
   */
  localeText?: Partial<GridLocaleText>;
}

/**
 * The Data Grid options with a default value overridable through props
 * None of the entry of this interface should be optional, they all have default values and `DataGridProps` already applies a `Partial<DataGridSimpleOptions>` for the public interface
 * The controlled model do not have a default value at the prop processing level, so they must be defined in `DataGridOtherProps`
 * TODO: add multiSortKey
 */
export interface DataGridPropsWithDefaultValues<R extends GridValidRowModel = any> {
  /**
   * If `true`, the Data Grid height is dynamic and follows the number of rows in the Data Grid.
   * @default false
   * @deprecated Use flex parent container instead: https://mui.com/x/react-data-grid/layout/#flex-parent-container
   * @example
   * <div style={{ display: 'flex', flexDirection: 'column' }}>
   *   <DataGrid />
   * </div>
   */
  autoHeight: boolean;
  /**
   * If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar.
   * @default false
   */
  autoPageSize: boolean;
  /**
   * If `true`, the Data Grid will display an extra column with checkboxes for selecting rows.
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
   * Column region in pixels to render before/after the viewport
   * @default 150
   */
  columnBufferPx: number;
  /**
   * Row region in pixels to render before/after the viewport
   * @default 150
   */
  rowBufferPx: number;
  /**
   * If `false`, the row selection mode is disabled.
   * @default true
   */
  rowSelection: boolean;
  /**
   * The milliseconds throttle delay for resizing the grid.
   * @default 60
   */
  resizeThrottleMs: number;
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
   * If `true`, `eval()` is not used for performance optimization.
   * @default false
   */
  disableEval: boolean;
  /**
   * If `true`, filtering with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsFiltering: boolean;
  /**
   * If `true`, multiple selection using the Ctrl/CMD or Shift key is disabled.
   * The MIT DataGrid will ignore this prop, unless `checkboxSelection` is enabled.
   * @default false (`!props.checkboxSelection` for MIT Data Grid)
   */
  disableMultipleRowSelection: boolean;
  /**
   * If `true`, the column sorting feature will be disabled.
   * @default false
   */
  disableColumnSorting: boolean;
  /**
   * If `true`, the sorting with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsSorting: boolean;
  /**
   * If `true`, the selection on click on a row or cell is disabled.
   * @default false
   */
  disableRowSelectionOnClick: boolean;
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
   * The milliseconds delay to wait after a keystroke before triggering filtering.
   * @default 150
   */
  filterDebounceMs: number;
  /**
   * Sets the height in pixel of the column headers in the Data Grid.
   * @default 56
   */
  columnHeaderHeight: number;
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
   * If `true`, the diacritics (accents) are ignored when filtering or quick filtering.
   * E.g. when filter value is `cafe`, the rows with `café` will be visible.
   * @default false
   */
  ignoreDiacritics: boolean;
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
   * @default "error" ("warn" in dev mode)
   */
  logLevel: keyof Logger | false;
  /**
   * If `true`, a loading overlay is displayed.
   * @default false
   */
  loading: boolean;
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
   * Set of rows of type [[GridRowsProp]].
   * @default []
   */
  rows: GridRowsProp<R>;
  /**
   * Sets the height in pixel of a row in the Data Grid.
   * @default 52
   */
  rowHeight: number;
  /**
   * Select the pageSize dynamically using the component UI.
   * @default [25, 50, 100]
   */
  pageSizeOptions: ReadonlyArray<number | { value: number; label: string }>;
  /**
   * Sets the type of space between rows added by `getRowSpacing`.
   * @default "margin"
   */
  rowSpacingType: 'margin' | 'border';
  /**
   * If `true`, vertical borders will be displayed between cells.
   * @default false
   */
  showCellVerticalBorder: boolean;
  /**
   * If `true`, vertical borders will be displayed between column header items.
   * @default false
   */
  showColumnVerticalBorder: boolean;
  /**
   * The order of the sorting sequence.
   * @default ['asc', 'desc', null]
   */
  sortingOrder: readonly GridSortDirection[];
  /**
   * Sorting can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle sorting on the client-side.
   * Set it to 'server' if you would like to handle sorting on the server-side.
   * @default "client"
   */
  sortingMode: GridFeatureMode;
  /**
   * If positive, the Data Grid will throttle updates coming from `apiRef.current.updateRows` and `apiRef.current.setRows`.
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
  /**
   * If `true`, moving the mouse pointer outside the Data Grid before releasing the mouse button
   * in a column re-order action will not cause the column to jump back to its original position.
   * @default false
   */
  keepColumnPositionIfDraggedOutside: boolean;
  /**
   * If `true`, the Data Grid will not use `valueFormatter` when exporting to CSV or copying to clipboard.
   * If an object is provided, you can choose to ignore the `valueFormatter` for CSV export or clipboard export.
   * @default false
   */
  ignoreValueFormatterDuringExport:
    | boolean
    | {
        csvExport?: boolean;
        clipboardExport?: boolean;
      };
  /**
   * The character used to separate cell values when copying to the clipboard.
   * @default '\t'
   */
  clipboardCopyCellDelimiter: string;
  /**
   * If `true`, columns are autosized after the datagrid is mounted.
   * @default false
   */
  autosizeOnMount: boolean;
  /**
   * If `true`, column autosizing on header separator double-click is disabled.
   * @default false
   */
  disableAutosize: boolean;
  /**
   * If `true`, the Data Grid will auto span the cells over the rows having the same value.
   * @default false
   */
  rowSpanning: boolean;
  /**
   * If `true`, the Data Grid enables column virtualization when `getRowHeight` is set to `() => 'auto'`.
   * By default, column virtualization is disabled when dynamic row height is enabled to measure the row height correctly.
   * For datasets with a large number of columns, this can cause performance issues.
   * The downside of enabling this prop is that the row height will be estimated based the cells that are currently rendered, which can cause row height change when scrolling horizontally.
   * @default false
   */
  virtualizeColumnsWithAutoRowHeight: boolean;
}

/**
 * The Data Grid props with no default value.
 */
export interface DataGridPropsWithoutDefaultValue<R extends GridValidRowModel = any>
  extends CommonProps {
  /**
   * The ref object that allows Data Grid manipulation. Can be instantiated with `useGridApiRef()`.
   */
  apiRef?: React.RefObject<GridApiCommunity>;
  /**
   * Signal to the underlying logic what version of the public component API
   * of the Data Grid is exposed [[GridSignature]].
   * @ignore - do not document.
   */
  signature?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<GridClasses>;
  /**
   * Set the density of the Data Grid.
   * @default "standard"
   */
  density?: GridDensity;
  /**
   * Set the total number of rows, if it is different from the length of the value `rows` prop.
   * If some rows have children (for instance in the tree data), this number represents the amount of top level rows.
   * Only works with `paginationMode="server"`, ignored when `paginationMode="client"`.
   */
  rowCount?: number;
  /**
   * Use if the actual rowCount is not known upfront, but an estimation is available.
   * If some rows have children (for instance in the tree data), this number represents the amount of top level rows.
   * Applicable only with `paginationMode="server"` and when `rowCount="-1"`
   */
  estimatedRowCount?: number;
  /**
   * Override the height/width of the Data Grid inner scrollbar.
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
   * @returns {React.JSX.Element} The row detail element.
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
   * @returns {boolean} A boolean indicating if the row is selectable.
   */
  isRowSelectable?: (params: GridRowParams<R>) => boolean;
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
   * Callback fired when a contextmenu event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   */
  onColumnHeaderContextMenu?: GridEventListener<'columnHeaderContextMenu'>;
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
   * Callback fired when the density changes.
   * @param {GridDensity} density New density value.
   */
  onDensityChange?: (density: GridDensity) => void;
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
   * Callback fired when the Data Grid is resized.
   * @param {ElementSize} containerSize With all properties from [[ElementSize]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onResize?: GridEventListener<'debouncedResize'>;
  /**
   * Callback fired when the state of the Data Grid is updated.
   * @param {GridState} state The new state.
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @ignore - do not document.
   */
  onStateChange?: GridEventListener<'stateChange'>;
  /**
   * The pagination model of type [[GridPaginationModel]] which refers to current `page` and `pageSize`.
   */
  paginationModel?: GridPaginationModel;
  /**
   * The extra information about the pagination state of the Data Grid.
   * Only applicable with `paginationMode="server"`.
   */
  paginationMeta?: GridPaginationMeta;
  /**
   * Callback fired when the pagination model has changed.
   * @param {GridPaginationModel} model Updated pagination model.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPaginationModelChange?: (
    model: GridPaginationModel,
    details: GridCallbackDetails<'pagination'>,
  ) => void;
  /**
   * Callback fired when the row count has changed.
   * @param {number} count Updated row count.
   */
  onRowCountChange?: (count: number) => void;
  /**
   * Callback fired when the pagination meta has changed.
   * @param {GridPaginationMeta} paginationMeta Updated pagination meta.
   */
  onPaginationMetaChange?: (paginationMeta: GridPaginationMeta) => void;
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
   * Controls the modes of the cells.
   */
  cellModesModel?: GridCellModesModel;
  /**
   * Callback fired when the `cellModesModel` prop changes.
   * @param {GridCellModesModel} cellModesModel Object containing which cells are in "edit" mode.
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
   * @param {GridRowModesModel} rowModesModel Object containing which rows are in "edit" mode.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowModesModelChange?: (rowModesModel: GridRowModesModel, details: GridCallbackDetails) => void;
  /**
   * Set the filter model of the Data Grid.
   */
  filterModel?: GridFilterModel;
  /**
   * Callback fired when the Filter model changes before the filters are applied.
   * @param {GridFilterModel} model With all properties from [[GridFilterModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onFilterModelChange?: (model: GridFilterModel, details: GridCallbackDetails<'filter'>) => void;
  /**
   * Sets the row selection model of the Data Grid.
   */
  rowSelectionModel?: GridInputRowSelectionModel;
  /**
   * Callback fired when the selection state of one or multiple rows changes.
   * @param {GridRowSelectionModel} rowSelectionModel With all the row ids [[GridSelectionModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowSelectionModelChange?: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Set the column visibility model of the Data Grid.
   * If defined, the Data Grid will ignore the `hide` property in [[GridColDef]].
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
   * Set the sort model of the Data Grid.
   */
  sortModel?: GridSortModel;
  /**
   * Callback fired when the sort model changes before a column is sorted.
   * @param {GridSortModel} model With all properties from [[GridSortModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSortModelChange?: (model: GridSortModel, details: GridCallbackDetails) => void;
  /**
   * The label of the Data Grid.
   */
  'aria-label'?: string;
  /**
   * The id of the element containing a label for the Data Grid.
   */
  'aria-labelledby'?: string;
  /**
   * Set of columns of type [[GridColDef]][].
   */
  columns: readonly GridColDef<R>[];
  /**
   * Return the id of a given [[GridRowModel]].
   */
  getRowId?: GridRowIdGetter<R>;
  /**
   * Nonce of the inline styles for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute).
   */
  nonce?: string;
  /**
   * The initial state of the DataGrid.
   * The data in it will be set in the state on initialization but will not be controlled.
   * If one of the data in `initialState` is also being controlled, then the control state wins.
   */
  initialState?: GridInitialStateCommunity;
  /**
   * Overridable components props dynamically passed to the component at rendering.
   */
  slotProps?: GridSlotsComponentsProps;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`, the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures?: Partial<GridExperimentalFeatures>;
  // eslint-disable-next-line jsdoc/require-param
  /**
   * Callback called before updating a row with new values in the row and cell editing.
   * @template R
   * @param {R} newRow Row object with the new values.
   * @param {R} oldRow Row object with the old values.
   * @param {{ rowId: GridRowId }} params Additional parameters.
   * @returns {Promise<R> | R} The final values to update the row.
   */
  processRowUpdate?: (newRow: R, oldRow: R, params: { rowId: GridRowId }) => Promise<R> | R;
  /**
   * Callback called when `processRowUpdate` throws an error or rejects.
   * @param {any} error The error thrown.
   */
  onProcessRowUpdateError?: (error: any) => void;
  columnGroupingModel?: GridColumnGroupingModel;
  /**
   * Sets the height in pixels of the column group headers in the Data Grid.
   * Inherits the `columnHeaderHeight` value if not set.
   */
  columnGroupHeaderHeight?: number;
  /**
   * Callback called when the data is copied to the clipboard.
   * @param {string} data The data copied to the clipboard.
   */
  onClipboardCopy?: GridEventListener<'clipboardCopy'>;
  /**
   * The options for autosize when user-initiated.
   */
  autosizeOptions?: GridAutosizeOptions;
  /**
   * Callback fired while a column is being resized.
   * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnResize?: GridEventListener<'columnResize'>;
  /**
   * Callback fired when the width of a column is changed.
   * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnWidthChange?: GridEventListener<'columnWidthChange'>;
}

export interface DataGridProSharedPropsWithDefaultValue {
  /**
   * If `true`, the header filters feature is enabled.
   * @default false
   */
  headerFilters: boolean;
  /**
   * When `rowSelectionPropagation.descendants` is set to `true`.
   * - Selecting a parent selects all its filtered descendants automatically.
   * - Deselecting a parent row deselects all its filtered descendants automatically.
   *
   * When `rowSelectionPropagation.parents` is set to `true`
   * - Selecting all the filtered descendants of a parent selects the parent automatically.
   * - Deselecting a descendant of a selected parent deselects the parent automatically.
   *
   * Works with tree data and row grouping on the client-side only.
   * @default { parents: true, descendants: true }
   */
  rowSelectionPropagation: GridRowSelectionPropagation;
  /**
   * If `true`, displays the data in a list view.
   * Use in combination with `unstable_listColumn`.
   * @default false
   */
  unstable_listView: boolean;
}

export interface DataGridProSharedPropsWithoutDefaultValue<R extends GridValidRowModel = any> {
  /**
   * Override the height of the header filters.
   */
  headerFilterHeight?: number;
  unstable_dataSource?: GridDataSource;
  /**
   * Definition of the column rendered when the `unstable_listView` prop is enabled.
   */
  unstable_listColumn?: GridListColDef<R>;
}

export interface DataGridPremiumSharedPropsWithDefaultValue {
  /**
   * If `true`, the cell selection mode is enabled.
   * @default false
   */
  cellSelection: boolean;
}

/**
 * The props of the Data Grid component after the pre-processing phase.
 */
export interface DataGridProcessedProps<R extends GridValidRowModel = any>
  extends DataGridPropsWithDefaultValues,
    DataGridPropsWithComplexDefaultValueAfterProcessing,
    DataGridPropsWithoutDefaultValue<R>,
    DataGridProSharedPropsWithoutDefaultValue,
    Partial<DataGridProSharedPropsWithDefaultValue>,
    Partial<DataGridPremiumSharedPropsWithDefaultValue> {}
