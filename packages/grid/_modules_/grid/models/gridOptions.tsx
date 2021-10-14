import { GridLocaleText } from './api/gridLocaleTextApi';
import { GridDensity, GridDensityTypes } from './gridDensity';
import { GridEditMode, GridEditModes } from './gridEditRowModel';
import { GridFeatureMode, GridFeatureModeConstant } from './gridFeatureMode';
import { Logger } from './logger';
import { GridSortDirection } from './gridSortModel';
import { GridSlotsComponent } from './gridSlotsComponent';

export type GridMergedOptions = {
  [key in keyof GridProcessedMergedOptions]: Partial<GridProcessedMergedOptions[key]>;
};

/**
 * The grid options with a default in value which is merged with the the value given through props
 */
export interface GridProcessedMergedOptions {
  /**
   * Overrideable components.
   */
  components: GridSlotsComponent;
  /**
   * Set the locale text of the grid.
   * You can find all the translation keys supported in [the source](https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts) in the GitHub repository.
   */
  localeText: GridLocaleText;
}

/**
 * The grid options with a default in value overridable through props
 * None of the entry of this interface should be optional, they all have default values and `GridInputComponentProps` already applies a `Partial<GridSimpleOptions>` for the public interface
 * The controlled model do not have a default value at the prop processing level so they must be defined in `GridComponentOtherProps`
 * TODO: add multiSortKey
 */
export interface GridSimpleOptions {
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
   * If `true`, the filtering will only be applied to the top level rows
   * @default false
   */
  disableChildrenFiltering: boolean;
  /**
   * If `true`, multiple selection using the CTRL or CMD key is disabled.
   * @default false
   */
  disableMultipleSelection: boolean;
  /**
   * If `true`, sorting with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsSorting: boolean;
  /**
   * If `true`, the sorting will only be applied to the top level rows
   * @default false
   */
  disableChildrenSorting: boolean;
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
   * If `true`, the rows will be gathered in a tree structure, following the `getTreeDataPath` prop
   * @default false
   */
  treeData: boolean;
  /**
   * If defined, the row children will be automatically expanded up to this depth
   * @default 0
   */
  defaultGroupingExpansionDepth: number;
  /**
   * Set the area at the bottom of the grid viewport where onRowsScrollEnd is called.
   */
  scrollEndThreshold: number;
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
}

/**
 * The default options to inject in the props of DataGrid or DataGridPro.
 */
export const GRID_DEFAULT_SIMPLE_OPTIONS: GridSimpleOptions = {
  autoHeight: false,
  autoPageSize: false,
  checkboxSelection: false,
  checkboxSelectionVisibleOnly: false,
  columnBuffer: 3,
  rowBuffer: 3,
  columnThreshold: 3,
  rowThreshold: 3,
  density: GridDensityTypes.Standard,
  disableExtendRowFullWidth: false,
  disableColumnFilter: false,
  disableColumnMenu: false,
  disableColumnReorder: false,
  disableColumnResize: false,
  disableColumnSelector: false,
  disableDensitySelector: false,
  disableMultipleColumnsFiltering: false,
  disableChildrenFiltering: false,
  disableMultipleSelection: false,
  disableMultipleColumnsSorting: false,
  disableChildrenSorting: false,
  disableSelectionOnClick: false,
  disableVirtualization: false,
  editMode: GridEditModes.Cell,
  filterMode: GridFeatureModeConstant.client,
  headerHeight: 56,
  hideFooter: false,
  hideFooterPagination: false,
  hideFooterRowCount: false,
  hideFooterSelectedRowCount: false,
  logger: console,
  logLevel: process.env.NODE_ENV === 'production' ? ('error' as const) : ('warn' as const),
  pagination: false,
  paginationMode: GridFeatureModeConstant.client,
  rowHeight: 52,
  rowsPerPageOptions: [25, 50, 100],
  treeData: false,
  defaultGroupingExpansionDepth: 0,
  scrollEndThreshold: 80,
  showCellRightBorder: false,
  showColumnRightBorder: false,
  sortingOrder: ['asc' as const, 'desc' as const, null],
  sortingMode: GridFeatureModeConstant.client,
  throttleRowsMs: 0,
};
