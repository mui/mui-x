import { CommonProps } from '@mui/material/OverridableComponent';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { GridInitialState } from './models/gridState';
import { GridApiRef } from './models/api/gridApiRef';
import {
  GridGroupingColDefOverrideParams,
  GridColumns,
  GridGroupingColDefOverride,
} from './models/colDef/gridColDef';
import {
  GridSimpleOptions,
  GridProcessedMergedOptions,
  GridMergedOptions,
} from './models/gridOptions';
import { GridRowIdGetter, GridRowModel, GridRowsProp } from './models/gridRows';
import { GridColumnTypesRecord } from './models/colDef/gridColumnTypesRecord';
import { GridSortModel } from './models/gridSortModel';
import { GridFilterModel } from './models/gridFilterModel';
import { GridCellParams } from './models/params/gridCellParams';
import { GridEditRowsModel } from './models/gridEditRowModel';
import { GridSelectionModel, GridInputSelectionModel } from './models/gridSelectionModel';
import { GridRowParams } from './models/params/gridRowParams';
import { GridSlotsComponentsProps } from './models/gridSlotsComponentsProps';
import { GridClasses } from './gridClasses';
import { GridCallbackDetails } from './models/api/gridCallbackDetails';
import { GridEventListener, GridEvents } from './models/events';

/**
 * The grid component react props before applying the default values.
 */
export interface GridInputComponentProps
  extends Partial<GridSimpleOptions>,
    Partial<GridMergedOptions>,
    GridComponentOtherProps {}

/**
 * The grid component react props after applying the default values.
 */
export interface GridComponentProps
  extends GridSimpleOptions,
    GridProcessedMergedOptions,
    GridComponentOtherProps {}

interface GridComponentOtherProps extends CommonProps {
  /**
   * The ref object that allows grid manipulation. Can be instantiated with [[useGridApiRef()]].
   */
  apiRef?: GridApiRef;
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
   * Set the total number of rows, if it is different than the length of the value `rows` prop.
   * If some of the rows have children (for instance in the tree data), this number represents the amount of top level rows.
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
  getCellClassName?: (params: GridCellParams) => string;
  /**
   * Function that applies CSS classes dynamically on rows.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {string} The CSS class to apply to the row.
   */
  getRowClassName?: (params: GridRowParams) => string;
  /**
   * Callback fired when a cell is rendered, returns true if the cell is editable.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @returns {boolean} A boolean indicating if the cell is editable.
   */
  isCellEditable?: (params: GridCellParams) => boolean;
  /**
   * Determines if a row can be selected.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {boolean} A boolean indicating if the cell is selectable.
   */
  isRowSelectable?: (params: GridRowParams) => boolean;
  /**
   * Determines the path of a row in the tree data.
   * For instance, a row with the path ["A", "B"] is the child of the row with the path ["A"].
   * Note that all paths must contain at least one element.
   * @param {GridRowModel} row The row from which we want the path.
   * @returns {string[]} The path to the row.
   */
  getTreeDataPath?: (row: GridRowModel) => string[];
  /**
   * Callback fired when the edit cell value changes.
   * @param {GridEditCellPropsParams} params With all properties from [[GridEditCellPropsParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @deprecated use `preProcessEditCellProps` from the [`GridColDef`](/api/data-grid/grid-col-def/)
   */
  onEditCellPropsChange?: GridEventListener<GridEvents.editCellPropsChange>;
  /**
   * Callback fired when the cell changes are committed.
   * @param {GridCellEditCommitParams} params With all properties from [[GridCellEditCommitParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellEditCommit?: GridEventListener<GridEvents.cellEditCommit>;
  /**
   * Callback fired when the cell turns to edit mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
   */
  onCellEditStart?: GridEventListener<GridEvents.cellEditStart>;
  /**
   * Callback fired when the cell turns to view mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onCellEditStop?: GridEventListener<GridEvents.cellEditStop>;
  /**
   * Callback fired when the row changes are committed.
   * @param {GridRowId} id The row id.
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onRowEditCommit?: GridEventListener<GridEvents.rowEditCommit>;
  /**
   * Callback fired when the row turns to edit mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
   */
  onRowEditStart?: GridEventListener<GridEvents.rowEditStart>;
  /**
   * Callback fired when the row turns to view mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onRowEditStop?: GridEventListener<GridEvents.rowEditStop>;
  /**
   * Callback fired when an exception is thrown in the grid.
   * @param {any} args The arguments passed to the `showError` call.
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onError?: GridEventListener<GridEvents.componentError>;
  /**
   * Callback fired when a click event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellClick?: GridEventListener<GridEvents.cellClick>;
  /**
   * Callback fired when a double click event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellDoubleClick?: GridEventListener<GridEvents.cellDoubleClick>;
  /**
   * Callback fired when a cell loses focus.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellFocusOut?: GridEventListener<GridEvents.cellFocusOut>;
  /**
   * Callback fired when a keydown event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.KeyboardEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellKeyDown?: GridEventListener<GridEvents.cellKeyDown>;
  /**
   * Callback fired when a click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderClick?: GridEventListener<GridEvents.columnHeaderClick>;
  /**
   * Callback fired when a double click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderDoubleClick?: GridEventListener<GridEvents.columnHeaderDoubleClick>;
  /**
   * Callback fired when a mouseover event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOver?: GridEventListener<GridEvents.columnHeaderOver>;
  /**
   * Callback fired when a mouseout event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOut?: GridEventListener<GridEvents.columnHeaderOut>;
  /**
   * Callback fired when a mouse enter event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderEnter?: GridEventListener<GridEvents.columnHeaderEnter>;
  /**
   * Callback fired when a mouse leave event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderLeave?: GridEventListener<GridEvents.columnHeaderLeave>;
  /**
   * Callback fired when a column is reordered.
   * @param {GridColumnOrderChangeParams} params With all properties from [[GridColumnOrderChangeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnOrderChange?: GridEventListener<GridEvents.columnOrderChange>;
  /**
   * Callback fired while a column is being resized.
   * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnResize?: GridEventListener<GridEvents.columnResize>;
  /**
   * Callback fired when the width of a column is changed.
   * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnWidthChange?: GridEventListener<GridEvents.columnWidthChange>;
  /**
   * Callback fired when a column visibility changes.
   * @param {GridColumnVisibilityChangeParams} params With all properties from [[GridColumnVisibilityChangeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnVisibilityChange?: GridEventListener<GridEvents.columnVisibilityChange>;
  /**
   * Callback fired when a click event comes from a row container element.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowClick?: GridEventListener<GridEvents.rowClick>;
  /**
   * Callback fired when scrolling to the bottom of the grid viewport.
   * @param {GridRowScrollEndParams} params With all properties from [[GridRowScrollEndParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowsScrollEnd?: GridEventListener<GridEvents.rowsScrollEnd>;
  /**
   * Callback fired when a double click event comes from a row container element.
   * @param {GridRowParams} params With all properties from [[RowParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowDoubleClick?: GridEventListener<GridEvents.rowDoubleClick>;
  /**
   * Callback fired when the grid is resized.
   * @param {ElementSize} containerSize With all properties from [[ElementSize]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onResize?: GridEventListener<GridEvents.debouncedResize>;
  /**
   * Callback fired when the state of the grid is updated.
   * @param {GridState} state The new state.
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @internal
   */
  onStateChange?: GridEventListener<GridEvents.stateChange>;
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
   * Set the filter model of the grid.
   */
  filterModel?: GridFilterModel;
  /**
   * Callback fired when the Filter model changes before the filters are applied.
   * @param {GridFilterModel} model With all properties from [[GridFilterModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onFilterModelChange?: (model: GridFilterModel, details: GridCallbackDetails) => void;
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
  columns: GridColumns;
  /**
   * An error that will turn the grid into its error state and display the error component.
   */
  error?: any;
  /**
   * Return the id of a given [[GridRowModel]].
   */
  getRowId?: GridRowIdGetter;
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
  rows: GridRowsProp;
  /**
   * The initial state of the DataGrid.
   * The data in it will be set in the state on initialization but will not be controlled.
   * If one of the data in `initialState` is also being controlled, then the control state wins.
   */
  initialState?: GridInitialState;
  /**
   * Overrideable components props dynamically passed to the component at rendering.
   */
  componentsProps?: GridSlotsComponentsProps;
  /**
   * The grouping column used by the tree data.
   */
  groupingColDef?:
    | GridGroupingColDefOverride
    | ((params: GridGroupingColDefOverrideParams) => GridGroupingColDefOverride);
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
