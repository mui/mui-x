import * as React from 'react';
import PropTypes from 'prop-types';
import { LicenseInfo } from '@mui/x-license-pro';
import { chainPropTypes, ponyfillGlobal } from '@mui/utils';
import {
  GridBody,
  GridErrorHandler,
  GridFooterPlaceholder,
  GridHeaderPlaceholder,
  GridRoot,
  useGridApiRef,
} from '../../_modules_/grid';
import { GridContextProvider } from '../../_modules_/grid/context/GridContextProvider';
import { useDataGridProComponent } from './useDataGridProComponent';
import { Watermark } from '../../_modules_/grid/components/Watermark';
import { DataGridProProps } from './DataGridProProps';
import { useDataGridProProps } from './useDataGridProProps';

// This is the package release date. Each package version should update this const
// automatically when a new version is published on npm.
let RELEASE_INFO = '__RELEASE_INFO__';

// eslint-disable-next-line no-useless-concat
if (process.env.NODE_ENV !== 'production' && RELEASE_INFO === '__RELEASE' + '_INFO__') {
  // eslint-disable-next-line no-underscore-dangle
  RELEASE_INFO = ponyfillGlobal.__MUI_RELEASE_INFO__;
}

LicenseInfo.setReleaseInfo(RELEASE_INFO);

const DataGridProRaw = React.forwardRef<HTMLDivElement, DataGridProProps>(function DataGridPro(
  inProps,
  ref,
) {
  const apiRef = useGridApiRef(inProps.apiRef);
  const props = useDataGridProProps(inProps);
  useDataGridProComponent(apiRef, props);

  return (
    <GridContextProvider apiRef={apiRef} props={props}>
      <GridRoot ref={ref}>
        <GridErrorHandler>
          <GridHeaderPlaceholder />
          <GridBody>
            <Watermark />
          </GridBody>
          <GridFooterPlaceholder />
        </GridErrorHandler>
      </GridRoot>
    </GridContextProvider>
  );
});

export const DataGridPro = React.memo(DataGridProRaw);

DataGridProRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows grid manipulation. Can be instantiated with [[useGridApiRef()]].
   */
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }),
  /**
   * The label of the grid.
   */
  'aria-label': PropTypes.string,
  /**
   * The id of the element containing a label for the grid.
   */
  'aria-labelledby': PropTypes.string,
  /**
   * If `true`, the grid height is dynamic and follow the number of rows in the grid.
   * @default false
   */
  autoHeight: PropTypes.bool,
  /**
   * If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar.
   * @default false
   */
  autoPageSize: PropTypes.bool,
  /**
   * If `true`, the grid get a first column with a checkbox that allows to select rows.
   * @default false
   */
  checkboxSelection: PropTypes.bool,
  /**
   * If `true`, the "Select All" header checkbox selects only the rows on the current page. To be used in combination with `checkboxSelection`.
   * It only works if the pagination is enabled.
   * @default false
   */
  checkboxSelectionVisibleOnly: chainPropTypes(PropTypes.bool, (props: any) => {
    if (!props.pagination && props.checkboxSelectionVisibleOnly) {
      return new Error(
        'MUI: The `checkboxSelectionVisibleOnly` prop has no effect when the pagination is not enabled.',
      );
    }
    return null;
  }),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore - do not document
   */
  className: PropTypes.string,
  /**
   * Number of extra columns to be rendered before/after the visible slice.
   * @default 3
   */
  columnBuffer: PropTypes.number,
  /**
   * Set of columns of type [[GridColumns]].
   */
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Number of rows from the `columnBuffer` that can be visible before a new slice is rendered.
   * @default 3
   */
  columnThreshold: PropTypes.number,
  /**
   * Extend native column types with your new column types.
   */
  columnTypes: PropTypes.object,
  /**
   * Overrideable components.
   */
  components: PropTypes.object,
  /**
   * Overrideable components props dynamically passed to the component at rendering.
   */
  componentsProps: PropTypes.object,
  /**
   * If above 0, the row children will be expanded up to this depth.
   * If equal to -1, all the row children will be expanded.
   * @default 0
   */
  defaultGroupingExpansionDepth: PropTypes.number,
  /**
   * Set the density of the grid.
   * @default "standard"
   */
  density: PropTypes.oneOf(['comfortable', 'compact', 'standard']),
  /**
   * If `true`, the filtering will only be applied to the top level rows.
   * @default false
   */
  disableChildrenFiltering: PropTypes.bool,
  /**
   * If `true`, the sorting will only be applied to the top level rows.
   * @default false
   */
  disableChildrenSorting: PropTypes.bool,
  /**
   * If `true`, column filters are disabled.
   * @default false
   */
  disableColumnFilter: PropTypes.bool,
  /**
   * If `true`, the column menu is disabled.
   * @default false
   */
  disableColumnMenu: PropTypes.bool,
  /**
   * If `true`, reordering columns is disabled.
   * @default false
   */
  disableColumnReorder: PropTypes.bool,
  /**
   * If `true`, resizing columns is disabled.
   * @default false
   */
  disableColumnResize: PropTypes.bool,
  /**
   * If `true`, hiding/showing columns is disabled.
   * @default false
   */
  disableColumnSelector: PropTypes.bool,
  /**
   * If `true`, the density selector is disabled.
   * @default false
   */
  disableDensitySelector: PropTypes.bool,
  /**
   * If `true`, rows will not be extended to fill the full width of the grid container.
   * @default false
   */
  disableExtendRowFullWidth: PropTypes.bool,
  /**
   * If `true`, filtering with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsFiltering: PropTypes.bool,
  /**
   * If `true`, sorting with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsSorting: PropTypes.bool,
  /**
   * If `true`, multiple selection using the CTRL or CMD key is disabled.
   * @default false
   */
  disableMultipleSelection: PropTypes.bool,
  /**
   * If `true`, the selection on click on a row or cell is disabled.
   * @default false
   */
  disableSelectionOnClick: PropTypes.bool,
  /**
   * If `true`, the virtualization is disabled.
   * @default false
   */
  disableVirtualization: PropTypes.bool,
  /**
   * Controls whether to use the cell or row editing.
   * @default "cell"
   */
  editMode: PropTypes.oneOf(['cell', 'row']),
  /**
   * Set the edit rows model of the grid.
   */
  editRowsModel: PropTypes.object,
  /**
   * An error that will turn the grid into its error state and display the error component.
   */
  error: PropTypes.any,
  /**
   * Filtering can be processed on the server or client-side.
   * Set it to 'server' if you would like to handle filtering on the server-side.
   * @default "client"
   */
  filterMode: chainPropTypes(PropTypes.oneOf(['client', 'server']), (props: any) => {
    if (props.treeData && props.filterMode === 'server') {
      return new Error(
        'MUI: The `filterMode="server"` prop is not available when the `treeData` is enabled.',
      );
    }
    return null;
  }),
  /**
   * Set the filter model of the grid.
   */
  filterModel: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        columnField: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        operatorValue: PropTypes.string,
        value: PropTypes.any,
      }),
    ).isRequired,
    linkOperator: PropTypes.oneOf(['and', 'or']),
  }),
  /**
   * Function that applies CSS classes dynamically on cells.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @returns {string} The CSS class to apply to the cell.
   */
  getCellClassName: PropTypes.func,
  /**
   * Function that applies CSS classes dynamically on rows.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {string} The CSS class to apply to the row.
   */
  getRowClassName: PropTypes.func,
  /**
   * Return the id of a given [[GridRowModel]].
   */
  getRowId: PropTypes.func,
  /**
   * Determines the path of a row in the tree data.
   * For instance, a row with the path ["A", "B"] is the child of the row with the path ["A"].
   * Note than all paths must contain at least one element.
   * @param {GridRowModel} row The row from which we want the path.
   * @returns {string[]} the path to the row.
   */
  getTreeDataPath: PropTypes.func,
  /**
   * The grouping column used by the tree data.
   */
  groupingColDef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  /**
   * Set the height in pixel of the column headers in the grid.
   * @default 56
   */
  headerHeight: PropTypes.number,
  /**
   * If `true`, the footer component is hidden.
   * @default false
   */
  hideFooter: PropTypes.bool,
  /**
   * If `true`, the pagination component in the footer is hidden.
   * @default false
   */
  hideFooterPagination: PropTypes.bool,
  /**
   * If `true`, the row count in the footer is hidden.
   * It has no effect if the pagination is enabled.
   * @default false
   */
  hideFooterRowCount: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.pagination && props.hideFooterRowCount) {
      return new Error(
        'MUI: The `hideFooterRowCount` prop has no effect when the pagination is enabled.',
      );
    }
    return null;
  }),
  /**
   * If `true`, the selected row count in the footer is hidden.
   * @default false
   */
  hideFooterSelectedRowCount: PropTypes.bool,
  /**
   * The initial state of the DataGrid.
   * The data in it will be set in the state on initialization but will not be controlled.
   * If one of the data in `initialState` is also being controlled, then the control state wins.
   */
  initialState: PropTypes.object,
  /**
   * Callback fired when a cell is rendered, returns true if the cell is editable.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @returns {boolean} A boolean indicating if the cell is editable.
   */
  isCellEditable: PropTypes.func,
  /**
   * Determines if a row can be selected.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {boolean} A boolean indicating if the cell is selectable.
   */
  isRowSelectable: PropTypes.func,
  /**
   * If `true`, a  loading overlay is displayed.
   */
  loading: PropTypes.bool,
  /**
   * Set the locale text of the grid.
   * You can find all the translation keys supported in [the source](https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts) in the GitHub repository.
   */
  localeText: PropTypes.object,
  /**
   * Pass a custom logger in the components that implements the [[Logger]] interface.
   * @default console
   */
  logger: PropTypes.shape({
    debug: PropTypes.func.isRequired,
    error: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
    warn: PropTypes.func.isRequired,
  }),
  /**
   * Allows to pass the logging level or false to turn off logging.
   * @default "debug"
   */
  logLevel: PropTypes.oneOf(['debug', 'error', 'info', 'warn', false]),
  /**
   * Nonce of the inline styles for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute).
   */
  nonce: PropTypes.string,
  /**
   * Callback fired when a click event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellClick: PropTypes.func,
  /**
   * Callback fired when a double click event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellDoubleClick: PropTypes.func,
  /**
   * Callback fired when the cell changes are committed.
   * @param {GridCellEditCommitParams} params With all properties from [[GridCellEditCommitParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellEditCommit: PropTypes.func,
  /**
   * Callback fired when the cell turns to edit mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   */
  onCellEditStart: PropTypes.func,
  /**
   * Callback fired when the cell turns to view mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   */
  onCellEditStop: PropTypes.func,
  /**
   * Callback fired when a cell loses focus.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.SyntheticEvent | DocumentEventMap['click']>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellFocusOut: PropTypes.func,
  /**
   * Callback fired when a keydown event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.KeyboardEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellKeyDown: PropTypes.func,
  /**
   * Callback fired when the cell value changed.
   * @param {GridEditCellValueParams} params With all properties from [[GridEditCellValueParams]].
   * @param {MuiEvent} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellValueChange: PropTypes.func,
  /**
   * Callback fired when a click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderClick: PropTypes.func,
  /**
   * Callback fired when a double click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderDoubleClick: PropTypes.func,
  /**
   * Callback fired when a mouse enter event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderEnter: PropTypes.func,
  /**
   * Callback fired when a mouse leave event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderLeave: PropTypes.func,
  /**
   * Callback fired when a mouseout event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOut: PropTypes.func,
  /**
   * Callback fired when a mouseover event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOver: PropTypes.func,
  /**
   * Callback fired when a column is reordered.
   * @param {GridColumnOrderChangeParams} params With all properties from [[GridColumnOrderChangeParams]].
   * @param {MuiEvent} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnOrderChange: PropTypes.func,
  /**
   * Callback fired while a column is being resized.
   * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnResize: PropTypes.func,
  /**
   * Callback fired when a column visibility changes.
   * @param {GridColumnVisibilityChangeParams} params With all properties from [[GridColumnVisibilityChangeParams]].
   * @param {MuiEvent} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnVisibilityChange: PropTypes.func,
  /**
   * Callback fired when the width of a column is changed.
   * @param {GridCallbackDetails} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnWidthChange: PropTypes.func,
  /**
   * Callback fired when the edit cell value changes.
   * @param {GridEditCellPropsParams} params With all properties from [[GridEditCellPropsParams]].
   * @param {MuiEvent} event The event that caused this prop to be called.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onEditCellPropsChange: PropTypes.func,
  /**
   * Callback fired when the `editRowsModel` changes.
   * @param {GridEditRowsModel} editRowsModel With all properties from [[GridEditRowsModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onEditRowsModelChange: PropTypes.func,
  /**
   * Callback fired when an exception is thrown in the grid.
   * @param {any} args The arguments passed to the `showError` call.
   * @param {MuiEvent} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onError: PropTypes.func,
  /**
   * Callback fired when the Filter model changes before the filters are applied.
   * @param {GridFilterModel} model With all properties from [[GridFilterModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onFilterModelChange: PropTypes.func,
  /**
   * Callback fired when the current page has changed.
   * @param {number} page Index of the page displayed on the Grid.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPageChange: PropTypes.func,
  /**
   * Callback fired when the page size has changed.
   * @param {number} pageSize Size of the page displayed on the Grid.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPageSizeChange: PropTypes.func,
  /**
   * Callback fired when the grid is resized.
   * @param {ElementSize} containerSize With all properties from [[ElementSize]].
   * @param {MuiEvent} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onResize: PropTypes.func,
  /**
   * Callback fired when a click event comes from a row container element.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowClick: PropTypes.func,
  /**
   * Callback fired when a double click event comes from a row container element.
   * @param {GridRowParams} params With all properties from [[RowParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowDoubleClick: PropTypes.func,
  /**
   * Callback fired when the row changes are committed.
   * @param {GridRowId} id The row id.
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   */
  onRowEditCommit: PropTypes.func,
  /**
   * Callback fired when the row turns to edit mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   */
  onRowEditStart: PropTypes.func,
  /**
   * Callback fired when the row turns to view mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.SyntheticEvent>} event The event that caused this prop to be called.
   */
  onRowEditStop: PropTypes.func,
  /**
   * Callback fired when scrolling to the bottom of the grid viewport.
   * @param {GridRowScrollEndParams} params With all properties from [[GridRowScrollEndParams]].
   * @param {MuiEvent} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowsScrollEnd: PropTypes.func,
  /**
   * Callback fired when the selection state of one or multiple rows changes.
   * @param {GridSelectionModel} selectionModel With all the row ids [[GridSelectionModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSelectionModelChange: PropTypes.func,
  /**
   * Callback fired when the sort model changes before a column is sorted.
   * @param {GridSortModel} model With all properties from [[GridSortModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSortModelChange: PropTypes.func,
  /**
   * Callback fired when the state of the grid is updated.
   * @param {GridState} state The new state.
   * @param {MuiEvent} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @internal
   */
  onStateChange: PropTypes.func,
  /**
   * The zero-based index of the current page.
   * @default 0
   */
  page: PropTypes.number,
  /**
   * Set the number of rows in one page.
   * If some of the rows have children (for instance in the tree data), this number represents the amount of top level rows wanted on each page.
   * @default 100
   */
  pageSize: PropTypes.number,
  /**
   * If `true`, pagination is enabled.
   * @default false
   */
  pagination: PropTypes.bool,
  /**
   * Pagination can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle the pagination on the client-side.
   * Set it to 'server' if you would like to handle the pagination on the server-side.
   * @default "client"
   */
  paginationMode: PropTypes.oneOf(['client', 'server']),
  /**
   * Number of extra rows to be rendered before/after the visible slice.
   * @default 3
   */
  rowBuffer: PropTypes.number,
  /**
   * Set the total number of rows, if it is different than the length of the value `rows` prop.
   * If some of the rows have children (for instance in the tree data), this number represents the amount of top level rows.
   */
  rowCount: PropTypes.number,
  /**
   * Set the height in pixel of a row in the grid.
   * @default 52
   */
  rowHeight: PropTypes.number,
  /**
   * Set of rows of type [[GridRowsProp]].
   */
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Select the pageSize dynamically using the component UI.
   * @default [25, 50, 100]
   */
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  /**
   * Number of rows from the `rowBuffer` that can be visible before a new slice is rendered.
   * @default 3
   */
  rowThreshold: PropTypes.number,
  /**
   * Override the height/width of the grid inner scrollbar.
   */
  scrollbarSize: PropTypes.number,
  /**
   * Set the area in `px` at the bottom of the grid viewport where onRowsScrollEnd is called.
   * @default 80
   */
  scrollEndThreshold: PropTypes.number,
  /**
   * Set the selection model of the grid.
   */
  selectionModel: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired),
    PropTypes.number,
    PropTypes.string,
  ]),
  /**
   * If `true`, the right border of the cells are displayed.
   * @default false
   */
  showCellRightBorder: PropTypes.bool,
  /**
   * If `true`, the right border of the column headers are displayed.
   * @default false
   */
  showColumnRightBorder: PropTypes.bool,
  /**
   * Sorting can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle sorting on the client-side.
   * Set it to 'server' if you would like to handle sorting on the server-side.
   * @default "client"
   */
  sortingMode: PropTypes.oneOf(['client', 'server']),
  /**
   * The order of the sorting sequence.
   * @default ['asc', 'desc', null]
   */
  sortingOrder: PropTypes.arrayOf(PropTypes.oneOf(['asc', 'desc'])),
  /**
   * Set the sort model of the grid.
   */
  sortModel: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      sort: PropTypes.oneOf(['asc', 'desc']),
    }),
  ),
  /**
   * @ignore - do not document
   */
  style: PropTypes.object,
  /**
   * If positive, the Grid will throttle updates coming from `apiRef.current.updateRows` and `apiRef.current.setRows`.
   * It can be useful if you have a high update rate but do not want to do heavy work like filtering / sorting or rendering on each  individual update.
   * @default 0
   */
  throttleRowsMs: PropTypes.number,
  /**
   * If `true`, the rows will be gathered in a tree structure according to the `getTreeDataPath` prop.
   * @default false
   */
  treeData: PropTypes.bool,
} as any;
