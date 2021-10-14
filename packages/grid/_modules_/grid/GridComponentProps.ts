import * as React from 'react';
import { GridState } from './models/gridState';
import { GridApiRef } from './models/api/gridApiRef';
import { GridColDef, GridColumns } from './models/colDef/gridColDef';
import {
  GridSimpleOptions,
  GridProcessedMergedOptions,
  GridMergedOptions,
} from './models/gridOptions';
import { MuiEvent } from './models/muiEvent';
import { GridRowId, GridRowIdGetter, GridRowModel, GridRowsProp } from './models/gridRows';
import { ElementSize } from './models/elementSize';
import { GridColumnTypesRecord } from './models/colDef/gridColumnTypesRecord';
import { GridSortModel } from './models/gridSortModel';
import { GridFilterModel } from './models/gridFilterModel';
import { GridCellParams } from './models/params/gridCellParams';
import { GridColumnHeaderParams } from './models/params/gridColumnHeaderParams';
import { GridEditRowsModel } from './models/gridEditRowModel';
import { GridSelectionModel, GridInputSelectionModel } from './models/gridSelectionModel';
import {
  GridEditCellPropsParams,
  GridEditCellValueParams,
  GridCellEditCommitParams,
} from './models/params/gridEditCellParams';
import { GridRowScrollEndParams } from './models/params/gridRowScrollEndParams';
import { GridRowParams } from './models/params/gridRowParams';
import { GridColumnOrderChangeParams } from './models/params/gridColumnOrderChangeParams';
import { GridColumnResizeParams } from './models/params/gridColumnResizeParams';
import { GridColumnVisibilityChangeParams } from './models/params/gridColumnVisibilityChangeParams';
import { GridViewportRowsChangeParams } from './models/params/gridViewportRowsChangeParams';
import { GridSlotsComponentsProps } from './models/gridSlotsComponentsProps';
import { GridClasses } from './gridClasses';
import { GridCallbackDetails } from './models/api/gridCallbackDetails';

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

interface GridComponentOtherProps {
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
   * Determines the path of a row in the tree data
   * @param {GridRowModel} row The row from which we want the path.
   * @returns {string[]} the path to the row
   */
  getTreeDataPath?: (row: GridRowModel) => string[];
  /**
   * Callback fired when the edit cell value changes.
   * @param {GridEditCellPropsParams} params With all properties from [[GridEditCellPropsParams]].
   * @param {MuiEvent} event The event that caused this prop to be called.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onEditCellPropsChange?: (
    params: GridEditCellPropsParams,
    event: MuiEvent<React.SyntheticEvent>,
    details: GridCallbackDetails,
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
    details: GridCallbackDetails,
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
   * Callback fired when an exception is thrown in the grid.
   * @param {any} args The arguments passed to the `showError` call.
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onError?: (args: any, event: MuiEvent<{}>, details: GridCallbackDetails) => void;
  /**
   * Callback fired when a click event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellClick?: (
    params: GridCellParams,
    event: MuiEvent<React.MouseEvent>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a double click event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellDoubleClick?: (
    params: GridCellParams,
    event: MuiEvent<React.MouseEvent>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a cell loses focus.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.SyntheticEvent | DocumentEventMap['click']>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellFocusOut?: (
    params: GridCellParams,
    event: MuiEvent<React.SyntheticEvent | DocumentEventMap['click']>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a keydown event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.KeyboardEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellKeyDown?: (
    params: GridCellParams,
    event: MuiEvent<React.KeyboardEvent>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when the cell value changed.
   * @param {GridEditCellValueParams} params With all properties from [[GridEditCellValueParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellValueChange?: (
    params: GridEditCellValueParams,
    event: MuiEvent<{}>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderClick?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a double click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderDoubleClick?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a mouseover event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOver?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a mouseout event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOut?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a mouse enter event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderEnter?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a mouse leave event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderLeave?: (
    params: GridColumnHeaderParams,
    event: MuiEvent<React.SyntheticEvent>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a column is reordered.
   * @param {GridColumnOrderChangeParams} params With all properties from [[GridColumnOrderChangeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnOrderChange?: (
    params: GridColumnOrderChangeParams,
    event: MuiEvent<{}>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired while a column is being resized.
   * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnResize?: (
    params: GridColumnResizeParams,
    event: MuiEvent<{}>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when the width of a column is changed.
   * @param {GridCallbackDetails} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnWidthChange?: (
    params: GridColumnResizeParams,
    event: MuiEvent<{}>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a column visibility changes.
   * @param {GridColumnVisibilityChangeParams} params With all properties from [[GridColumnVisibilityChangeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnVisibilityChange?: (
    params: GridColumnVisibilityChangeParams,
    event: MuiEvent<{}>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a click event comes from a row container element.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowClick?: (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when scrolling to the bottom of the grid viewport.
   * @param {GridRowScrollEndParams} params With all properties from [[GridRowScrollEndParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowsScrollEnd?: (
    params: GridRowScrollEndParams,
    event: MuiEvent<{}>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when a double click event comes from a row container element.
   * @param {GridRowParams} params With all properties from [[RowParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowDoubleClick?: (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when the grid is resized.
   * @param {ElementSize} containerSize With all properties from [[ElementSize]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onResize?: (
    containerSize: ElementSize,
    event: MuiEvent<{}>,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when the state of the grid is updated.
   * @param {GridState} state The new state.
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @internal
   */
  onStateChange?: (state: GridState, event: MuiEvent<{}>, details: GridCallbackDetails) => void;
  /**
   * Callback fired when the rows in the viewport change.
   * @param {GridViewportRowsChangeParams} params The viewport params.
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onViewportRowsChange?: (
    params: GridViewportRowsChangeParams,
    event: MuiEvent<{}>,
    details: GridCallbackDetails,
  ) => void;
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
   * If some of the rows have children (for instance in the tree data), this number represents the amount of top level rows.
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
   * @ignore
   */
  className?: string;
  /**
   * Set of columns of type [[GridColumns]].
   */
  columns: GridColumns;
  /**
   * An error that will turn the grid into its error state and display the error component.
   */
  error?: any;
  /**
   * Return the id of a given [[GridRowData]].
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
   * Set the whole state of the grid.
   */
  state?: Partial<GridState>;
  /**
   * @ignore
   */
  style?: React.CSSProperties;
  /**
   * Overrideable components props dynamically passed to the component at rendering.
   */
  componentsProps?: GridSlotsComponentsProps;
  /**
   * The grouping column used by the tree data
   */
  groupingColDef?: Partial<GridColDef>;
}
