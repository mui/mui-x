import * as React from 'react';
import PropTypes from 'prop-types';
import { chainPropTypes } from '@mui/utils';
import { GridBody, GridFooterPlaceholder, GridHeader, GridRoot } from '../components';
import { DataGridProps } from '../models/props/DataGridProps';
import { GridContextProvider } from '../context/GridContextProvider';
import { useDataGridComponent } from './useDataGridComponent';
import { useDataGridProps, DATA_GRID_PROPS_DEFAULT_VALUES } from './useDataGridProps';
import { DataGridVirtualScroller } from '../components/DataGridVirtualScroller';
import { GridValidRowModel } from '../models/gridRows';

const DataGridRaw = React.forwardRef(function DataGrid<R extends GridValidRowModel>(
  inProps: DataGridProps<R>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useDataGridProps(inProps);
  const privateApiRef = useDataGridComponent(props.apiRef, props);

  return (
    <GridContextProvider privateApiRef={privateApiRef} props={props}>
      <GridRoot
        className={props.className}
        style={props.style}
        sx={props.sx}
        ref={ref}
        {...props.forwardedProps}
      >
        <GridHeader />
        <GridBody VirtualScrollerComponent={DataGridVirtualScroller} />
        <GridFooterPlaceholder />
      </GridRoot>
    </GridContextProvider>
  );
});

interface DataGridComponent {
  <R extends GridValidRowModel = any>(
    props: DataGridProps<R> & React.RefAttributes<HTMLDivElement>,
  ): React.JSX.Element;
  propTypes?: any;
}

export const DataGrid = React.memo(DataGridRaw) as DataGridComponent;

/**
 * Remove at v7
 * @deprecated
 */
export const SUBMIT_FILTER_STROKE_TIME = DATA_GRID_PROPS_DEFAULT_VALUES.filterDebounceMs;

/**
 * Remove at v7
 * @deprecated
 */
export const SUBMIT_FILTER_DATE_STROKE_TIME = DATA_GRID_PROPS_DEFAULT_VALUES.filterDebounceMs;

DataGridRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The ref object that allows grid manipulation. Can be instantiated with `useGridApiRef()`.
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
   * Controls the modes of the cells.
   */
  cellModesModel: PropTypes.object,
  /**
   * If `true`, the grid get a first column with a checkbox that allows to select rows.
   * @default false
   */
  checkboxSelection: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The character used to separate cell values when copying to the clipboard.
   * @default '\t'
   */
  clipboardCopyCellDelimiter: PropTypes.string,
  /**
   * Number of extra columns to be rendered before/after the visible slice.
   * @default 3
   */
  columnBuffer: PropTypes.number,
  columnGroupingModel: PropTypes.arrayOf(PropTypes.object),
  /**
   * Sets the height in pixel of the column headers in the grid.
   * @default 56
   */
  columnHeaderHeight: PropTypes.number,
  /**
   * Set of columns of type [[GridColDef[]]].
   */
  columns: chainPropTypes(PropTypes.array.isRequired, (props) => {
    // @ts-ignore because otherwise `build:api` doesn't work
    if (props.columns && props.columns.some((column) => column.resizable)) {
      return new Error(
        [
          `MUI: \`column.resizable = true\` is not a valid prop.`,
          'Column resizing is not available in the MIT version.',
          '',
          'You need to upgrade to DataGridPro or DataGridPremium component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  /**
   * Number of rows from the `columnBuffer` that can be visible before a new slice is rendered.
   * @default 3
   */
  columnThreshold: PropTypes.number,
  /**
   * Set the column visibility model of the grid.
   * If defined, the grid will ignore the `hide` property in [[GridColDef]].
   */
  columnVisibilityModel: PropTypes.object,
  /**
   * Overridable components.
   * @deprecated Use `slots` instead.
   */
  components: PropTypes.object,
  /**
   * Overridable components props dynamically passed to the component at rendering.
   * @deprecated Use the `slotProps` prop instead.
   */
  componentsProps: PropTypes.object,
  /**
   * Set the density of the grid.
   * @default "standard"
   */
  density: PropTypes.oneOf(['comfortable', 'compact', 'standard']),
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
   * If `true`, `eval()` is not used for performance optimization.
   * @default false
   * @ignore - do not document
   */
  disableEval: PropTypes.bool,
  /**
   * If `true`, the selection on click on a row or cell is disabled.
   * @default false
   */
  disableRowSelectionOnClick: PropTypes.bool,
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
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`, the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures: PropTypes.shape({
    ariaV7: PropTypes.bool,
    columnGrouping: PropTypes.bool,
    warnIfFocusStateIsNotSynced: PropTypes.bool,
  }),
  /**
   * The milliseconds delay to wait after a keystroke before triggering filtering.
   * @default 150
   */
  filterDebounceMs: PropTypes.number,
  /**
   * Filtering can be processed on the server or client-side.
   * Set it to 'server' if you would like to handle filtering on the server-side.
   * @default "client"
   */
  filterMode: PropTypes.oneOf(['client', 'server']),
  /**
   * Set the filter model of the grid.
   */
  filterModel: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.string.isRequired,
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        operator: PropTypes.string.isRequired,
        value: PropTypes.any,
      }),
    ).isRequired,
    logicOperator: PropTypes.oneOf(['and', 'or']),
    quickFilterExcludeHiddenColumns: PropTypes.bool,
    quickFilterLogicOperator: PropTypes.oneOf(['and', 'or']),
    quickFilterValues: PropTypes.array,
  }),
  /**
   * Forwarded props for the grid root element.
   * @ignore - do not document.
   */
  forwardedProps: PropTypes.object,
  /**
   * Function that applies CSS classes dynamically on cells.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @returns {string} The CSS class to apply to the cell.
   */
  getCellClassName: PropTypes.func,
  /**
   * Function that returns the element to render in row detail.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {React.JSX.Element} The row detail element.
   */
  getDetailPanelContent: PropTypes.func,
  /**
   * Function that returns the estimated height for a row.
   * Only works if dynamic row height is used.
   * Once the row height is measured this value is discarded.
   * @param {GridRowHeightParams} params With all properties from [[GridRowHeightParams]].
   * @returns {number | null} The estimated row height value. If `null` or `undefined` then the default row height, based on the density, is applied.
   */
  getEstimatedRowHeight: PropTypes.func,
  /**
   * Function that applies CSS classes dynamically on rows.
   * @param {GridRowClassNameParams} params With all properties from [[GridRowClassNameParams]].
   * @returns {string} The CSS class to apply to the row.
   */
  getRowClassName: PropTypes.func,
  /**
   * Function that sets the row height per row.
   * @param {GridRowHeightParams} params With all properties from [[GridRowHeightParams]].
   * @returns {GridRowHeightReturnValue} The row height value. If `null` or `undefined` then the default row height is applied. If "auto" then the row height is calculated based on the content.
   */
  getRowHeight: PropTypes.func,
  /**
   * Return the id of a given [[GridRowModel]].
   */
  getRowId: PropTypes.func,
  /**
   * Function that allows to specify the spacing between rows.
   * @param {GridRowSpacingParams} params With all properties from [[GridRowSpacingParams]].
   * @returns {GridRowSpacing} The row spacing values.
   */
  getRowSpacing: PropTypes.func,
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
   * If `true`, the selection model will retain selected rows that do not exist.
   * Useful when using server side pagination and row selections need to be retained
   * when changing pages.
   * @default false
   */
  keepNonExistentRowsSelected: PropTypes.bool,
  /**
   * If `true`, a  loading overlay is displayed.
   */
  loading: PropTypes.bool,
  /**
   * Set the locale text of the grid.
   * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/grid/x-data-grid/src/constants/localeTextConstants.ts) in the GitHub repository.
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
   * @default "error" ("warn" in dev mode)
   */
  logLevel: PropTypes.oneOf(['debug', 'error', 'info', 'warn', false]),
  /**
   * Nonce of the inline styles for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute).
   */
  nonce: PropTypes.string,
  /**
   * Callback fired when any cell is clicked.
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
   * Callback fired when the cell turns to edit mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
   */
  onCellEditStart: PropTypes.func,
  /**
   * Callback fired when the cell turns to view mode.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onCellEditStop: PropTypes.func,
  /**
   * Callback fired when a keydown event comes from a cell element.
   * @param {GridCellParams} params With all properties from [[GridCellParams]].
   * @param {MuiEvent<React.KeyboardEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellKeyDown: PropTypes.func,
  /**
   * Callback fired when the `cellModesModel` prop changes.
   * @param {GridCellModesModel} cellModesModel Object containing which cells are in "edit" mode.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellModesModelChange: PropTypes.func,
  /**
   * Callback called when the data is copied to the clipboard.
   * @param {string} data The data copied to the clipboard.
   */
  onClipboardCopy: PropTypes.func,
  /**
   * Callback fired when a click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderClick: PropTypes.func,
  /**
   * Callback fired when a double click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderDoubleClick: PropTypes.func,
  /**
   * Callback fired when a mouse enter event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderEnter: PropTypes.func,
  /**
   * Callback fired when a mouse leave event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderLeave: PropTypes.func,
  /**
   * Callback fired when a mouseout event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOut: PropTypes.func,
  /**
   * Callback fired when a mouseover event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderOver: PropTypes.func,
  /**
   * Callback fired when a column is reordered.
   * @param {GridColumnOrderChangeParams} params With all properties from [[GridColumnOrderChangeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnOrderChange: PropTypes.func,
  /**
   * Callback fired when the column visibility model changes.
   * @param {GridColumnVisibilityModel} model The new model.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnVisibilityModelChange: PropTypes.func,
  /**
   * Callback fired when the Filter model changes before the filters are applied.
   * @param {GridFilterModel} model With all properties from [[GridFilterModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onFilterModelChange: PropTypes.func,
  /**
   * Callback fired when the menu is closed.
   * @param {GridMenuParams} params With all properties from [[GridMenuParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onMenuClose: PropTypes.func,
  /**
   * Callback fired when the menu is opened.
   * @param {GridMenuParams} params With all properties from [[GridMenuParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onMenuOpen: PropTypes.func,
  /**
   * Callback fired when the pagination model has changed.
   * @param {GridPaginationModel} model Updated pagination model.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPaginationModelChange: PropTypes.func,
  /**
   * Callback fired when the preferences panel is closed.
   * @param {GridPreferencePanelParams} params With all properties from [[GridPreferencePanelParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPreferencePanelClose: PropTypes.func,
  /**
   * Callback fired when the preferences panel is opened.
   * @param {GridPreferencePanelParams} params With all properties from [[GridPreferencePanelParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPreferencePanelOpen: PropTypes.func,
  /**
   * Callback called when `processRowUpdate` throws an error or rejects.
   * @param {any} error The error thrown.
   */
  onProcessRowUpdateError: PropTypes.func,
  /**
   * Callback fired when the grid is resized.
   * @param {ElementSize} containerSize With all properties from [[ElementSize]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onResize: PropTypes.func,
  /**
   * Callback fired when a row is clicked.
   * Not called if the target clicked is an interactive element added by the built-in columns.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowClick: PropTypes.func,
  /**
   * Callback fired when a double click event comes from a row container element.
   * @param {GridRowParams} params With all properties from [[RowParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowDoubleClick: PropTypes.func,
  /**
   * Callback fired when the row changes are committed.
   * @param {GridRowId} id The row id.
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onRowEditCommit: PropTypes.func,
  /**
   * Callback fired when the row turns to edit mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
   */
  onRowEditStart: PropTypes.func,
  /**
   * Callback fired when the row turns to view mode.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
   */
  onRowEditStop: PropTypes.func,
  /**
   * Callback fired when the `rowModesModel` prop changes.
   * @param {GridRowModesModel} rowModesModel Object containing which rows are in "edit" mode.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowModesModelChange: PropTypes.func,
  /**
   * Callback fired when the selection state of one or multiple rows changes.
   * @param {GridRowSelectionModel} rowSelectionModel With all the row ids [[GridSelectionModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowSelectionModelChange: PropTypes.func,
  /**
   * Callback fired when the sort model changes before a column is sorted.
   * @param {GridSortModel} model With all properties from [[GridSortModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSortModelChange: PropTypes.func,
  /**
   * Callback fired when the state of the grid is updated.
   * @param {GridState} state The new state.
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @ignore - do not document.
   */
  onStateChange: PropTypes.func,
  /**
   * Select the pageSize dynamically using the component UI.
   * @default [25, 50, 100]
   */
  pageSizeOptions: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      }),
    ]).isRequired,
  ),
  pagination: (props: any) => {
    if (props.pagination === false) {
      return new Error(
        [
          'MUI: `<DataGrid pagination={false} />` is not a valid prop.',
          'Infinite scrolling is not available in the MIT version.',
          '',
          'You need to upgrade to DataGridPro or DataGridPremium component to disable the pagination.',
        ].join('\n'),
      );
    }
    return null;
  },
  /**
   * Pagination can be processed on the server or client-side.
   * Set it to 'client' if you would like to handle the pagination on the client-side.
   * Set it to 'server' if you would like to handle the pagination on the server-side.
   * @default "client"
   */
  paginationMode: PropTypes.oneOf(['client', 'server']),
  /**
   * The pagination model of type [[GridPaginationModel]] which refers to current `page` and `pageSize`.
   */
  paginationModel: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
  }),
  /**
   * Callback called before updating a row with new values in the row and cell editing.
   * @template R
   * @param {R} newRow Row object with the new values.
   * @param {R} oldRow Row object with the old values.
   * @returns {Promise<R> | R} The final values to update the row.
   */
  processRowUpdate: PropTypes.func,
  /**
   * Number of extra rows to be rendered before/after the visible slice.
   * @default 3
   */
  rowBuffer: PropTypes.number,
  /**
   * Set the total number of rows, if it is different from the length of the value `rows` prop.
   * If some rows have children (for instance in the tree data), this number represents the amount of top level rows.
   */
  rowCount: PropTypes.number,
  /**
   * Sets the height in pixel of a row in the grid.
   * @default 52
   */
  rowHeight: PropTypes.number,
  /**
   * Controls the modes of the rows.
   */
  rowModesModel: PropTypes.object,
  /**
   * Set of rows of type [[GridRowsProp]].
   */
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * If `false`, the row selection mode is disabled.
   * @default true
   */
  rowSelection: PropTypes.bool,
  /**
   * Sets the row selection model of the grid.
   */
  rowSelectionModel: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired),
    PropTypes.number,
    PropTypes.string,
  ]),
  /**
   * Sets the type of space between rows added by `getRowSpacing`.
   * @default "margin"
   */
  rowSpacingType: PropTypes.oneOf(['border', 'margin']),
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
   * If `true`, the vertical borders of the cells are displayed.
   * @default false
   */
  showCellVerticalBorder: PropTypes.bool,
  /**
   * If `true`, the right border of the column headers are displayed.
   * @default false
   */
  showColumnVerticalBorder: PropTypes.bool,
  /**
   * Overridable components props dynamically passed to the component at rendering.
   */
  slotProps: PropTypes.object,
  /**
   * Overridable components.
   */
  slots: PropTypes.object,
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
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * If `true`, the grid will not use `valueFormatter` when exporting to CSV or copying to clipboard.
   * If an object is provided, you can choose to ignore the `valueFormatter` for CSV export or clipboard export.
   * @default: false
   */
  unstable_ignoreValueFormatterDuringExport: PropTypes.oneOfType([
    PropTypes.shape({
      clipboardExport: PropTypes.bool,
      csvExport: PropTypes.bool,
    }),
    PropTypes.bool,
  ]),
} as any;
