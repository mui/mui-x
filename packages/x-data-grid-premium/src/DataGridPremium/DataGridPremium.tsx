'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useLicenseVerifier, Watermark } from '@mui/x-license';
import {
  GridRoot,
  GridContextProvider,
  type GridValidRowModel,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import {
  propValidatorsDataGrid,
  propValidatorsDataGridPro,
  type PropValidator,
  validateProps,
  type GridConfiguration,
  useGridApiInitialization,
  getRowValue,
} from '@mui/x-data-grid-pro/internals';
import { useMaterialCSSVariables } from '@mui/x-data-grid/material';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { useDataGridPremiumComponent } from './useDataGridPremiumComponent';
import type {
  DataGridPremiumProcessedProps,
  DataGridPremiumProps,
} from '../models/dataGridPremiumProps';
import { useDataGridPremiumProps } from './useDataGridPremiumProps';
import { Sidebar } from '../components/sidebar';
import { useGridAriaAttributesPremium } from '../hooks/utils/useGridAriaAttributes';
import { useGridRowAriaAttributesPremium } from '../hooks/features/rows/useGridRowAriaAttributes';
import { gridCellAggregationResultSelector } from '../hooks/features/aggregation/gridAggregationSelectors';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import type { GridApiPremium, GridPrivateApiPremium } from '../models/gridApiPremium';
import { useGridRowsOverridableMethods } from '../hooks/features/rows/useGridRowsOverridableMethods';
import { useGridParamsOverridableMethods } from '../hooks/features/rows/useGridParamsOverridableMethods';
import { gridSidebarOpenSelector } from '../hooks/features/sidebar';
import { useIsCellEditable } from '../hooks/features/editing/useGridCellEditable';

export type { GridPremiumSlotsComponent as GridSlots } from '../models';

const configuration: GridConfiguration<GridPrivateApiPremium, DataGridPremiumProcessedProps> = {
  hooks: {
    useCSSVariables: useMaterialCSSVariables,
    useGridAriaAttributes: useGridAriaAttributesPremium,
    useGridRowAriaAttributes: useGridRowAriaAttributesPremium,
    useCellAggregationResult: (id, field) => {
      const apiRef = useGridApiContext();
      return useGridSelector(apiRef, gridCellAggregationResultSelector, { id, field });
    },
    useFilterValueGetter: (apiRef, props) => (row, column) => {
      if (props.aggregationRowsScope === 'all') {
        return apiRef.current.getRowValue(row, column);
      }

      return getRowValue(row, column, apiRef);
    },
    useIsCellEditable,
    useGridRowsOverridableMethods,
    useGridParamsOverridableMethods,
  },
};
const releaseInfo = '__RELEASE_INFO__';
const watermark = <Watermark packageName="x-data-grid-premium" releaseInfo={releaseInfo} />;

let dataGridPremiumPropValidators: PropValidator<DataGridPremiumProcessedProps>[];

if (process.env.NODE_ENV !== 'production') {
  dataGridPremiumPropValidators = [...propValidatorsDataGrid, ...propValidatorsDataGridPro];
}

const DataGridPremiumRaw = forwardRef(function DataGridPremium<R extends GridValidRowModel>(
  inProps: DataGridPremiumProps<R>,
  ref: React.Ref<HTMLDivElement>,
) {
  const initialProps = useDataGridPremiumProps(inProps);
  const privateApiRef = useGridApiInitialization<GridPrivateApiPremium, GridApiPremium>(
    initialProps.apiRef,
    initialProps,
  );

  const props = useDataGridPremiumComponent(
    privateApiRef,
    initialProps,
    configuration as GridConfiguration,
  );
  useLicenseVerifier('x-data-grid-premium', releaseInfo);

  if (process.env.NODE_ENV !== 'production') {
    validateProps(props, dataGridPremiumPropValidators);
  }

  const sidebarOpen = useGridSelector(privateApiRef, gridSidebarOpenSelector);
  const sidePanel = sidebarOpen ? <Sidebar /> : null;

  return (
    <GridContextProvider
      privateApiRef={privateApiRef}
      configuration={configuration as GridConfiguration}
      props={props}
    >
      <GridRoot
        className={props.className}
        style={props.style}
        sx={props.sx}
        {...props.slotProps?.root}
        ref={ref}
        sidePanel={sidePanel}
      >
        {watermark}
      </GridRoot>
    </GridContextProvider>
  );
});

DataGridPremiumRaw.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the active chart.
   */
  activeChartId: PropTypes.string,
  /**
   * Aggregation functions available on the grid.
   * @default GRID_AGGREGATION_FUNCTIONS when `dataSource` is not provided, `{}` when `dataSource` is provided
   */
  aggregationFunctions: PropTypes.object,
  /**
   * Set the aggregation model of the grid.
   */
  aggregationModel: PropTypes.object,
  /**
   * Rows used to generate the aggregated value.
   * If `filtered`, the aggregated values are generated using only the rows currently passing the filtering process.
   * If `all`, the aggregated values are generated using all the rows.
   * @default "filtered"
   */
  aggregationRowsScope: PropTypes.oneOf(['all', 'filtered']),
  /**
   * If `true`, the AI Assistant is enabled.
   * @default false
   */
  aiAssistant: PropTypes.bool,
  /**
   * The index of the active AI Assistant conversation.
   */
  aiAssistantActiveConversationIndex: PropTypes.number,
  /**
   * The conversations with the AI Assistant.
   */
  aiAssistantConversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      prompts: PropTypes.arrayOf(
        PropTypes.shape({
          createdAt: PropTypes.instanceOf(Date).isRequired,
          helperText: PropTypes.string,
          response: PropTypes.shape({
            aggregation: PropTypes.object.isRequired,
            chart: PropTypes.object,
            conversationId: PropTypes.string.isRequired,
            filterOperator: PropTypes.oneOf(['and', 'or']),
            filters: PropTypes.arrayOf(PropTypes.object).isRequired,
            grouping: PropTypes.arrayOf(PropTypes.object).isRequired,
            pivoting: PropTypes.object.isRequired,
            select: PropTypes.number.isRequired,
            sorting: PropTypes.arrayOf(PropTypes.object).isRequired,
          }),
          value: PropTypes.string.isRequired,
          variant: PropTypes.oneOf(['error', 'processing', 'success']),
        }),
      ).isRequired,
      title: PropTypes.string,
    }),
  ),
  /**
   * The suggestions of the AI Assistant.
   */
  aiAssistantSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
    }),
  ),
  /**
   * If `true`, the AI Assistant is allowed to pick up values from random cells from each column to build the prompt context.
   */
  allowAiAssistantDataSampling: PropTypes.bool,
  /**
   * The ref object that allows grid manipulation. Can be instantiated with `useGridApiRef()`.
   */
  apiRef: PropTypes.shape({
    current: PropTypes.object,
  }),
  /**
   * The `aria-label` of the Data Grid.
   */
  'aria-label': PropTypes.string,
  /**
   * The `id` of the element containing a label for the Data Grid.
   */
  'aria-labelledby': PropTypes.string,
  /**
   * If `true`, the Data Grid height is dynamic and takes as much space as it needs to display all rows.
   * Use it instead of a flex parent container approach, if:
   * - you don't need to set a minimum or maximum height for the Data Grid
   * - you want to avoid the scrollbar flickering when the content changes
   * @default false
   */
  autoHeight: PropTypes.bool,
  /**
   * If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar.
   * @default false
   */
  autoPageSize: PropTypes.bool,
  /**
   * If `true`, columns are autosized after the datagrid is mounted.
   * @default false
   */
  autosizeOnMount: PropTypes.bool,
  /**
   * The options for autosize when user-initiated.
   */
  autosizeOptions: PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.string),
    disableColumnVirtualization: PropTypes.bool,
    expand: PropTypes.bool,
    includeHeaderFilters: PropTypes.bool,
    includeHeaders: PropTypes.bool,
    includeOutliers: PropTypes.bool,
    outliersFactor: PropTypes.number,
  }),
  /**
   * Controls the modes of the cells.
   */
  cellModesModel: PropTypes.object,
  /**
   * If `true`, the cell selection mode is enabled.
   * @default false
   */
  cellSelection: PropTypes.bool,
  /**
   * Set the cell selection model of the grid.
   */
  cellSelectionModel: PropTypes.object,
  /**
   * If `true`, the charts integration feature is enabled.
   * @default false
   */
  chartsIntegration: PropTypes.bool,
  /**
   * If `true`, the Data Grid will display an extra column with checkboxes for selecting rows.
   * @default false
   */
  checkboxSelection: PropTypes.bool,
  /**
   * If `true`, the "Select All" header checkbox selects only the rows on the current page. To be used in combination with `checkboxSelection`.
   * It only works if the pagination is enabled.
   * @default false
   */
  checkboxSelectionVisibleOnly: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * The character used to separate cell values when copying to the clipboard.
   * @default '\t'
   */
  clipboardCopyCellDelimiter: PropTypes.string,
  /**
   * Column region in pixels to render before/after the viewport
   * @default 150
   */
  columnBufferPx: PropTypes.number,
  /**
   * The milliseconds delay to wait after a keystroke before triggering filtering in the columns menu.
   * @default 150
   */
  columnFilterDebounceMs: PropTypes.number,
  /**
   * Sets the height in pixels of the column group headers in the Data Grid.
   * Inherits the `columnHeaderHeight` value if not set.
   */
  columnGroupHeaderHeight: PropTypes.number,
  columnGroupingModel: PropTypes.arrayOf(PropTypes.object),
  /**
   * Sets the height in pixel of the column headers in the Data Grid.
   * @default 56
   */
  columnHeaderHeight: PropTypes.number,
  /**
   * Set of columns of type [[GridColDef]][].
   */
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Set the column visibility model of the Data Grid.
   * If defined, the Data Grid will ignore the `hide` property in [[GridColDef]].
   */
  columnVisibilityModel: PropTypes.object,
  /**
   * Data source object.
   */
  dataSource: PropTypes.shape({
    getAggregatedValue: PropTypes.func,
    getChildrenCount: PropTypes.func,
    getGroupKey: PropTypes.func,
    getRows: PropTypes.func.isRequired,
    updateRow: PropTypes.func,
  }),
  /**
   * Data source cache object.
   */
  dataSourceCache: PropTypes.shape({
    clear: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
  }),
  /**
   * If positive, the Data Grid will periodically revalidate data source rows by re-fetching them from the server when the cache entry has expired.
   * If the refetched rows are different from the current rows, the grid will update the rows.
   * Set to `0` to disable polling.
   * @default 0
   */
  dataSourceRevalidateMs: PropTypes.number,
  /**
   * If above 0, the row children will be expanded up to this depth.
   * If equal to -1, all the row children will be expanded.
   * @default 0
   */
  defaultGroupingExpansionDepth: PropTypes.number,
  /**
   * Set the density of the Data Grid.
   * @default "standard"
   */
  density: PropTypes.oneOf(['comfortable', 'compact', 'standard']),
  /**
   * The row ids to show the detail panel.
   */
  detailPanelExpandedRowIds: PropTypes /* @typescript-to-proptypes-ignore */.instanceOf(Set),
  /**
   * If `true`, aggregation is disabled.
   * @default false
   */
  disableAggregation: PropTypes.bool,
  /**
   * If `true`, column autosizing on header separator double-click is disabled.
   * @default false
   */
  disableAutosize: PropTypes.bool,
  /**
   * If `true`, the filtering will only be applied to the top level rows when grouping rows with the `treeData` prop.
   * @default false
   */
  disableChildrenFiltering: PropTypes.bool,
  /**
   * If `true`, the sorting will only be applied to the top level rows when grouping rows with the `treeData` prop.
   * @default false
   */
  disableChildrenSorting: PropTypes.bool,
  /**
   * If `true`, the clipboard paste is disabled.
   * @default false
   */
  disableClipboardPaste: PropTypes.bool,
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
   * If `true`, the column pinning is disabled.
   * @default false
   */
  disableColumnPinning: PropTypes.bool,
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
   * If `true`, the column sorting feature will be disabled.
   * @default false
   */
  disableColumnSorting: PropTypes.bool,
  /**
   * If `true`, the density selector is disabled.
   * @default false
   */
  disableDensitySelector: PropTypes.bool,
  /**
   * If `true`, `eval()` is not used for performance optimization.
   * @default false
   */
  disableEval: PropTypes.bool,
  /**
   * If `true`, filtering with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsFiltering: PropTypes.bool,
  /**
   * If `true`, the sorting with multiple columns is disabled.
   * @default false
   */
  disableMultipleColumnsSorting: PropTypes.bool,
  /**
   * If `true`, multiple selection using the Ctrl/CMD or Shift key is disabled.
   * The MIT DataGrid will ignore this prop, unless `checkboxSelection` is enabled.
   * @default false (`!props.checkboxSelection` for MIT Data Grid)
   */
  disableMultipleRowSelection: PropTypes.bool,
  /**
   * If `true`, the pivoting feature is disabled.
   * @default false
   */
  disablePivoting: PropTypes.bool,
  /**
   * If `true`, the row grouping is disabled.
   * @default false
   */
  disableRowGrouping: PropTypes.bool,
  /**
   * If `true`, the Data Grid will not use the exclude model optimization when selecting all rows.
   * @default false
   */
  disableRowSelectionExcludeModel: PropTypes.bool,
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
   * Use if the actual rowCount is not known upfront, but an estimation is available.
   * If some rows have children (for instance in the tree data), this number represents the amount of top level rows.
   * Applicable only with `paginationMode="server"` and when `rowCount="-1"`
   */
  estimatedRowCount: PropTypes.number,
  /**
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`, then the feature is fully disabled, and neither property nor method calls will have any effect.
   */
  experimentalFeatures: PropTypes.shape({
    charts: PropTypes.bool,
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
   * Set the filter model of the Data Grid.
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
   * Determines the position of an aggregated value.
   * @param {GridGroupNode} groupNode The current group.
   * @returns {GridAggregationPosition | null} Position of the aggregated value (if `null`, the group isn't aggregated).
   * @default (groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline')
   */
  getAggregationPosition: PropTypes.func,
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
   * Function that returns the height of the row detail panel.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {number | string} The height in pixels or "auto" to use the content height.
   * @default "() => 500"
   */
  getDetailPanelHeight: PropTypes.func,
  /**
   * Function that returns the estimated height for a row.
   * Only works if dynamic row height is used.
   * Once the row height is measured this value is discarded.
   * @param {GridRowHeightParams} params With all properties from [[GridRowHeightParams]].
   * @returns {number | null} The estimated row height value. If `null` or `undefined` then the default row height, based on the density, is applied.
   */
  getEstimatedRowHeight: PropTypes.func,
  /**
   * Allows to generate derived columns from actual columns that will be used for pivoting.
   * Useful e.g. for date columns to generate year, quarter, month, etc.
   * @param {GridColDef} column The column to generate derived columns for.
   * @param {GridLocaleTextApi['getLocaleText']} getLocaleText The function to get the locale text.
   * @returns {GridColDef[] | undefined} The derived columns.
   * @default {defaultGetPivotDerivedColumns | undefined} Creates year and quarter columns for date columns if not in server side mode.
   */
  getPivotDerivedColumns: PropTypes.func,
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
   * Ensure the reference of this prop is stable to avoid performance implications.
   * It could be done by either defining the prop outside of the component or by memoizing it.
   */
  getRowId: PropTypes.func,
  /**
   * Function that allows to specify the spacing between rows.
   * @param {GridRowSpacingParams} params With all properties from [[GridRowSpacingParams]].
   * @returns {GridRowSpacing} The row spacing values.
   */
  getRowSpacing: PropTypes.func,
  /**
   * Determines the path of a row in the tree data.
   * For instance, a row with the path ["A", "B"] is the child of the row with the path ["A"].
   * Note that all paths must contain at least one element.
   * @template R
   * @param {R} row The row from which we want the path.
   * @returns {string[]} The path to the row.
   */
  getTreeDataPath: PropTypes.func,
  /**
   * The grouping column used by the tree data.
   */
  groupingColDef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  /**
   * Override the height of the header filters.
   */
  headerFilterHeight: PropTypes.number,
  /**
   * If `true`, the header filters feature is enabled.
   * @default false
   */
  headerFilters: PropTypes.bool,
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
  hideFooterRowCount: PropTypes.bool,
  /**
   * If `true`, the selected row count in the footer is hidden.
   * @default false
   */
  hideFooterSelectedRowCount: PropTypes.bool,
  /**
   * Map of grid events to their undo/redo handlers.
   * @default Handlers for `rowEditStop`, `cellEditStop` and `clipboardPasteEnd` events
   */
  historyEventHandlers: PropTypes.object,
  /**
   * The maximum size of the history stack.
   * Set to 0 to disable the undo/redo feature.
   * @default 30
   */
  historyStackSize: PropTypes.number,
  /**
   * List of grid events after which the history stack items should be re-validated.
   * @default ['columnsChange', 'rowsSet', 'sortedRowsSet', 'filteredRowsSet', 'paginationModelChange']
   */
  historyValidationEvents: PropTypes.arrayOf(
    PropTypes.oneOf([
      'activeChartIdChange',
      'activeStrategyProcessorChange',
      'aggregationLookupSet',
      'aggregationModelChange',
      'aiAssistantActiveConversationIndexChange',
      'aiAssistantConversationsChange',
      'cellClick',
      'cellDoubleClick',
      'cellDragEnter',
      'cellDragOver',
      'cellEditStart',
      'cellEditStop',
      'cellFocusIn',
      'cellFocusOut',
      'cellKeyDown',
      'cellKeyUp',
      'cellModeChange',
      'cellModesModelChange',
      'cellMouseDown',
      'cellMouseOver',
      'cellMouseUp',
      'cellSelectionChange',
      'chartSynchronizationStateChange',
      'clipboardCopy',
      'clipboardPasteEnd',
      'clipboardPasteStart',
      'columnGroupHeaderBlur',
      'columnGroupHeaderFocus',
      'columnGroupHeaderKeyDown',
      'columnHeaderBlur',
      'columnHeaderClick',
      'columnHeaderContextMenu',
      'columnHeaderDoubleClick',
      'columnHeaderDragEnd',
      'columnHeaderDragEndNative',
      'columnHeaderDragEnter',
      'columnHeaderDragOver',
      'columnHeaderDragStart',
      'columnHeaderEnter',
      'columnHeaderFocus',
      'columnHeaderKeyDown',
      'columnHeaderLeave',
      'columnHeaderOut',
      'columnHeaderOver',
      'columnIndexChange',
      'columnOrderChange',
      'columnResize',
      'columnResizeStart',
      'columnResizeStop',
      'columnsChange',
      'columnSeparatorDoubleClick',
      'columnSeparatorMouseDown',
      'columnVisibilityModelChange',
      'columnWidthChange',
      'debouncedResize',
      'densityChange',
      'detailPanelsExpandedRowIdsChange',
      'excelExportStateChange',
      'fetchRows',
      'filteredRowsSet',
      'filterModelChange',
      'headerFilterBlur',
      'headerFilterClick',
      'headerFilterKeyDown',
      'headerFilterMouseDown',
      'headerSelectionCheckboxChange',
      'menuClose',
      'menuOpen',
      'paginationMetaChange',
      'paginationModelChange',
      'pinnedColumnsChange',
      'pivotModeChange',
      'pivotModelChange',
      'pivotPanelOpenChange',
      'preferencePanelClose',
      'preferencePanelOpen',
      'redo',
      'renderedRowsIntervalChange',
      'resize',
      'rootMount',
      'rowClick',
      'rowCountChange',
      'rowDoubleClick',
      'rowDragEnd',
      'rowDragOver',
      'rowDragStart',
      'rowEditStart',
      'rowEditStop',
      'rowExpansionChange',
      'rowGroupingModelChange',
      'rowModesModelChange',
      'rowMouseEnter',
      'rowMouseLeave',
      'rowMouseOut',
      'rowMouseOver',
      'rowOrderChange',
      'rowSelectionChange',
      'rowSelectionCheckboxChange',
      'rowsScrollEnd',
      'rowsScrollEndIntersection',
      'rowsSet',
      'scrollPositionChange',
      'sidebarClose',
      'sidebarOpen',
      'sortedRowsSet',
      'sortModelChange',
      'stateChange',
      'strategyAvailabilityChange',
      'undo',
      'unmount',
      'viewportInnerSizeChange',
      'virtualScrollerContentSizeChange',
      'virtualScrollerTouchMove',
      'virtualScrollerWheel',
    ]).isRequired,
  ),
  /**
   * If `true`, the diacritics (accents) are ignored when filtering or quick filtering.
   * E.g. when filter value is `cafe`, the rows with `café` will be visible.
   * @default false
   */
  ignoreDiacritics: PropTypes.bool,
  /**
   * If `true`, the Data Grid will not use `valueFormatter` when exporting to CSV or copying to clipboard.
   * If an object is provided, you can choose to ignore the `valueFormatter` for CSV export or clipboard export.
   * @default false
   */
  ignoreValueFormatterDuringExport: PropTypes.oneOfType([
    PropTypes.shape({
      clipboardExport: PropTypes.bool,
      csvExport: PropTypes.bool,
    }),
    PropTypes.bool,
  ]),
  /**
   * The initial state of the DataGridPremium.
   * The data in it is set in the state on initialization but isn't controlled.
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
   * Determines if a group should be expanded after its creation.
   * This prop takes priority over the `defaultGroupingExpansionDepth` prop.
   * @param {GridGroupNode} node The node of the group to test.
   * @returns {boolean} A boolean indicating if the group is expanded.
   */
  isGroupExpandedByDefault: PropTypes.func,
  /**
   * Indicates whether a row is reorderable.
   * @param {object} params With all properties from the row.
   * @param {R} params.row The row model of the row that the current cell belongs to.
   * @param {GridTreeNode} params.rowNode The node of the row that the current cell belongs to.
   * @returns {boolean} A boolean indicating if the row is reorderable.
   */
  isRowReorderable: PropTypes.func,
  /**
   * Determines if a row can be selected.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {boolean} A boolean indicating if the row is selectable.
   */
  isRowSelectable: PropTypes.func,
  /**
   * Indicates if a row reorder attempt is valid.
   * Can be used to disable certain row reorder operations based on the context.
   * The internal validation is still applied, preventing unsupported use-cases.
   * Use `isValidRowReorder()` to add additional validation rules to the default ones.
   * @param {ReorderValidationContext} context The context object containing all information about the reorder operation.
   * @returns {boolean} A boolean indicating if the reorder operation should go through.
   */
  isValidRowReorder: PropTypes.func,
  /**
   * If `true`, moving the mouse pointer outside the grid before releasing the mouse button
   * in a column re-order action will not cause the column to jump back to its original position.
   * @default false
   */
  keepColumnPositionIfDraggedOutside: PropTypes.bool,
  /**
   * If `true`, the selection model will retain selected rows that do not exist.
   * Useful when using server side pagination and row selections need to be retained
   * when changing pages.
   * @default false
   */
  keepNonExistentRowsSelected: PropTypes.bool,
  /**
   * The label of the Data Grid.
   * If the `showToolbar` prop is `true`, the label will be displayed in the toolbar and applied to the `aria-label` attribute of the grid.
   * If the `showToolbar` prop is `false`, the label will not be visible but will be applied to the `aria-label` attribute of the grid.
   */
  label: PropTypes.string,
  /**
   * Used together with `dataSource` to enable lazy loading.
   * If enabled, the grid stops adding `paginationModel` to the data requests (`getRows`)
   * and starts sending `start` and `end` values depending on the loading mode and the scroll position.
   * @default false
   */
  lazyLoading: PropTypes.bool,
  /**
   * If positive, the Data Grid will throttle data source requests on rendered rows interval change.
   * @default 500
   */
  lazyLoadingRequestThrottleMs: PropTypes.number,
  /**
   * If `true`, displays the data in a list view.
   * Use in combination with `listViewColumn`.
   */
  listView: PropTypes.bool,
  /**
   * Definition of the column rendered when the `listView` prop is enabled.
   */
  listViewColumn: PropTypes.shape({
    align: PropTypes.oneOf(['center', 'left', 'right']),
    cellClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    display: PropTypes.oneOf(['flex', 'text']),
    field: PropTypes.string.isRequired,
    renderCell: PropTypes.func,
  }),
  /**
   * If `true`, a loading overlay is displayed.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Set the locale text of the Data Grid.
   * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-data-grid/src/constants/localeTextConstants.ts) in the GitHub repository.
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
   * If set to "always", the multi-sorting is applied without modifier key.
   * Otherwise, the modifier key is required for multi-sorting to be applied.
   * @see See https://mui.com/x/react-data-grid/sorting/#multi-sorting
   * @default "withModifierKey"
   */
  multipleColumnsSortingMode: PropTypes.oneOf(['always', 'withModifierKey']),
  /**
   * Nonce of the inline styles for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute).
   */
  nonce: PropTypes.string,
  /**
   * Callback fired when the active chart changes.
   * @param {string} activeChartId The new active chart id.
   */
  onActiveChartIdChange: PropTypes.func,
  /**
   * Callback fired when the row grouping model changes.
   * @param {GridAggregationModel} model The aggregated columns.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onAggregationModelChange: PropTypes.func,
  /**
   * Callback fired when the AI Assistant active conversation index changes.
   * @param {number} aiAssistantActiveConversationIndex The new active conversation index.
   */
  onAiAssistantActiveConversationIndexChange: PropTypes.func,
  /**
   * Callback fired when the AI Assistant conversations change.
   * @param {Conversation[]} conversations The new AI Assistant conversations.
   */
  onAiAssistantConversationsChange: PropTypes.func,
  /**
   * Callback fired before the clipboard paste operation starts.
   * Use it to confirm or cancel the paste operation.
   * @param {object} params Params passed to the callback.
   * @param {string[][]} params.data The raw pasted data split by rows and cells.
   * @returns {Promise<any>} A promise that resolves to confirm the paste operation, and rejects to cancel it.
   */
  onBeforeClipboardPasteStart: PropTypes.func,
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
   * Callback fired when the selection state of one or multiple cells changes.
   * @param {GridCellSelectionModel} cellSelectionModel Object in the shape of [[GridCellSelectionModel]] containing the selected cells.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellSelectionModelChange: PropTypes.func,
  /**
   * Callback called when the data is copied to the clipboard.
   * @param {string} data The data copied to the clipboard.
   */
  onClipboardCopy: PropTypes.func,
  /**
   * Callback fired when the clipboard paste operation ends.
   */
  onClipboardPasteEnd: PropTypes.func,
  /**
   * Callback fired when the clipboard paste operation starts.
   */
  onClipboardPasteStart: PropTypes.func,
  /**
   * Callback fired when a click event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnHeaderClick: PropTypes.func,
  /**
   * Callback fired when a contextmenu event comes from a column header element.
   * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   */
  onColumnHeaderContextMenu: PropTypes.func,
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
   * Callback fired while a column is being resized.
   * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnResize: PropTypes.func,
  /**
   * Callback fired when the column visibility model changes.
   * @param {GridColumnVisibilityModel} model The new model.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnVisibilityModelChange: PropTypes.func,
  /**
   * Callback fired when the width of a column is changed.
   * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnWidthChange: PropTypes.func,
  /**
   * Callback fired when a data source request fails.
   * @param {GridGetRowsError | GridUpdateRowError} error The data source error object.
   */
  onDataSourceError: PropTypes.func,
  /**
   * Callback fired when the density changes.
   * @param {GridDensity} density New density value.
   */
  onDensityChange: PropTypes.func,
  /**
   * Callback fired when the detail panel of a row is opened or closed.
   * @param {GridRowId[]} ids The ids of the rows which have the detail panel open.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onDetailPanelExpandedRowIdsChange: PropTypes.func,
  /**
   * Callback fired when the state of the Excel export changes.
   * @param {string} inProgress Indicates if the task is in progress.
   */
  onExcelExportStateChange: PropTypes.func,
  /**
   * Callback fired when rowCount is set and the next batch of virtualized rows is rendered.
   * @param {GridFetchRowsParams} params With all properties from [[GridFetchRowsParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @deprecated Use the {@link https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#viewport-loading Server-side data-Viewport loading} instead.
   */
  onFetchRows: PropTypes.func,
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
   * Callback fired when the pagination meta has changed.
   * @param {GridPaginationMeta} paginationMeta Updated pagination meta.
   */
  onPaginationMetaChange: PropTypes.func,
  /**
   * Callback fired when the pagination model has changed.
   * @param {GridPaginationModel} model Updated pagination model.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPaginationModelChange: PropTypes.func,
  /**
   * Callback fired when the pinned columns have changed.
   * @param {GridPinnedColumnFields} pinnedColumns The changed pinned columns.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPinnedColumnsChange: PropTypes.func,
  /**
   * Callback fired when the pivot active state changes.
   * @param {boolean} isPivotActive Whether the data grid is in pivot mode.
   */
  onPivotActiveChange: PropTypes.func,
  /**
   * Callback fired when the pivot model changes.
   * @param {GridPivotModel} pivotModel The new pivot model.
   */
  onPivotModelChange: PropTypes.func,
  /**
   * Callback fired when the pivot side panel open state changes.
   * @param {boolean} pivotPanelOpen Whether the pivot side panel is visible.
   * @deprecated Use the `sidebarOpen` and `sidebarClose` events or corresponding event handlers `onSidebarOpen()` and `onSidebarClose()` instead.
   */
  onPivotPanelOpenChange: PropTypes.func,
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
   * Callback called when `processRowUpdate()` throws an error or rejects.
   * @param {any} error The error thrown.
   */
  onProcessRowUpdateError: PropTypes.func,
  /**
   * The function to be used to process the prompt.
   * @param {string} prompt The prompt to be processed.
   * @param {string} promptContext The prompt context.
   * @param {string} conversationId The id of the conversation the prompt is part of. If not passed, prompt response will return a new conversation id that can be used to continue the newly started conversation.
   * @returns {Promise<PromptResponse>} The prompt response.
   */
  onPrompt: PropTypes.func,
  /**
   * Callback fired when a redo operation is executed.
   */
  onRedo: PropTypes.func,
  /**
   * Callback fired when the Data Grid is resized.
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
   * Callback fired when the row count has changed.
   * @param {number} count Updated row count.
   */
  onRowCountChange: PropTypes.func,
  /**
   * Callback fired when a double click event comes from a row container element.
   * @param {GridRowParams} params With all properties from [[RowParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowDoubleClick: PropTypes.func,
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
   * Callback fired when the row grouping model changes.
   * @param {GridRowGroupingModel} model Columns used as grouping criteria.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowGroupingModelChange: PropTypes.func,
  /**
   * Callback fired when the `rowModesModel` prop changes.
   * @param {GridRowModesModel} rowModesModel Object containing which rows are in "edit" mode.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowModesModelChange: PropTypes.func,
  /**
   * Callback fired when a row is being reordered.
   * @param {GridRowOrderChangeParams} params With all properties from [[GridRowOrderChangeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowOrderChange: PropTypes.func,
  /**
   * Callback fired when the selection state of one or multiple rows changes.
   * @param {GridRowSelectionModel} rowSelectionModel With all the row ids [[GridSelectionModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowSelectionModelChange: PropTypes.func,
  /**
   * Callback fired when scrolling to the bottom of the grid viewport.
   * @param {GridRowScrollEndParams} params With all properties from [[GridRowScrollEndParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @deprecated Use the {@link https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#infinite-loading Server-side data-Infinite loading} instead.
   */
  onRowsScrollEnd: PropTypes.func,
  /**
   * Callback fired when the sidebar is closed.
   * @param {GridSidebarParams} params With all properties from [[GridSidebarParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSidebarClose: PropTypes.func,
  /**
   * Callback fired when the sidebar is opened.
   * @param {GridSidebarParams} params With all properties from [[GridSidebarParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSidebarOpen: PropTypes.func,
  /**
   * Callback fired when the sort model changes before a column is sorted.
   * @param {GridSortModel} model With all properties from [[GridSortModel]].
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onSortModelChange: PropTypes.func,
  /**
   * Callback fired when the state of the Data Grid is updated.
   * @param {GridState} state The new state.
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   * @ignore - do not document.
   */
  onStateChange: PropTypes.func,
  /**
   * Callback fired when an undo operation is executed.
   */
  onUndo: PropTypes.func,
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
  /**
   * If `true`, pagination is enabled.
   * @default false
   */
  pagination: PropTypes.bool,
  /**
   * The extra information about the pagination state of the Data Grid.
   * Only applicable with `paginationMode="server"`.
   */
  paginationMeta: PropTypes.shape({
    hasNextPage: PropTypes.bool,
  }),
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
   * The column fields to display pinned to left or right.
   */
  pinnedColumns: PropTypes.object,
  /**
   * Sets the type of separator between pinned columns and non-pinned columns.
   * @default 'border-and-shadow'
   */
  pinnedColumnsSectionSeparator: PropTypes.oneOf(['border-and-shadow', 'border', 'shadow']),
  /**
   * Rows data to pin on top or bottom.
   */
  pinnedRows: PropTypes.shape({
    bottom: PropTypes.arrayOf(PropTypes.object),
    top: PropTypes.arrayOf(PropTypes.object),
  }),
  /**
   * Sets the type of separator between pinned rows and non-pinned rows.
   * @default 'border-and-shadow'
   */
  pinnedRowsSectionSeparator: PropTypes.oneOf(['border-and-shadow', 'border']),
  /**
   * If `true`, the data grid will show data in pivot mode using the `pivotModel`.
   * @default false
   */
  pivotActive: PropTypes.bool,
  /**
   * The column definition overrides for the columns generated by the pivoting feature.
   * Pass either a partial column definition to apply the same overrides to all pivot columns, or a callback to apply different overrides to each pivot column.
   * For server-side pivoting, only the `PivotingColDefCallback` signature is supported, and the prop is required.
   * @type {Partial<GridPivotingColDefOverrides> | PivotingColDefCallback}
   * @default undefined
   * @throws {Error} If `undefined` and `dataSource` is provided.
   */
  pivotingColDef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      align: PropTypes.oneOf(['center', 'left', 'right']),
      cellClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      description: PropTypes.string,
      display: PropTypes.oneOf(['flex', 'text']),
      field: PropTypes.string,
      flex: PropTypes.number,
      headerAlign: PropTypes.oneOf(['center', 'left', 'right']),
      headerClassName: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      headerName: PropTypes.string,
      maxWidth: PropTypes.number,
      minWidth: PropTypes.number,
      resizable: PropTypes.bool,
      sortingOrder: PropTypes.arrayOf(PropTypes.oneOf(['asc', 'desc'])),
      width: PropTypes.number,
    }),
  ]),
  /**
   * The pivot model of the grid.
   * Will be used to generate the pivot data.
   * In case of `pivotActive` being `false`, the pivot model is still used to populate the pivot panel.
   */
  pivotModel: PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.string.isRequired,
        hidden: PropTypes.bool,
      }),
    ).isRequired,
    values: PropTypes.arrayOf(
      PropTypes.shape({
        aggFunc: PropTypes.string.isRequired,
        field: PropTypes.string.isRequired,
        hidden: PropTypes.bool,
      }),
    ).isRequired,
  }),
  /**
   * If `true`, the pivot side panel is visible.
   * @default false
   * @deprecated Use `initialState.sidebar.open` instead.
   */
  pivotPanelOpen: PropTypes.bool,
  /**
   * Callback called before updating a row with new values in the row and cell editing.
   * @template R
   * @param {R} newRow Row object with the new values.
   * @param {R} oldRow Row object with the old values.
   * @param {{ rowId: GridRowId }} params Additional parameters.
   * @returns {Promise<R> | R} The final values to update the row.
   */
  processRowUpdate: PropTypes.func,
  /**
   * The milliseconds throttle delay for resizing the grid.
   * @default 60
   */
  resizeThrottleMs: PropTypes.number,
  /**
   * Row region in pixels to render before/after the viewport
   * @default 150
   */
  rowBufferPx: PropTypes.number,
  /**
   * Set the total number of rows, if it is different from the length of the value `rows` prop.
   * If some rows have children (for instance in the tree data), this number represents the amount of top level rows.
   * Only works with `paginationMode="server"`, ignored when `paginationMode="client"`.
   */
  rowCount: PropTypes.number,
  /**
   * If `single`, all the columns that are grouped are represented in the same grid column.
   * If `multiple`, each column that is grouped is represented in its own grid column.
   * @default 'single'
   */
  rowGroupingColumnMode: PropTypes.oneOf(['multiple', 'single']),
  /**
   * Set the row grouping model of the grid.
   */
  rowGroupingModel: PropTypes.arrayOf(PropTypes.string),
  /**
   * Sets the height in pixel of a row in the Data Grid.
   * @default 52
   */
  rowHeight: PropTypes.number,
  /**
   * Controls the modes of the rows.
   */
  rowModesModel: PropTypes.object,
  /**
   * If `true`, the reordering of rows is enabled.
   * @default false
   */
  rowReordering: PropTypes.bool,
  /**
   * Set of rows of type [[GridRowsProp]].
   * @default []
   */
  rows: PropTypes.arrayOf(PropTypes.object),
  /**
   * If `false`, the row selection mode is disabled.
   * @default true
   */
  rowSelection: PropTypes.bool,
  /**
   * Sets the row selection model of the Data Grid.
   */
  rowSelectionModel: PropTypes /* @typescript-to-proptypes-ignore */.shape({
    ids: PropTypes.instanceOf(Set).isRequired,
    type: PropTypes.oneOf(['exclude', 'include']).isRequired,
  }),
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
  rowSelectionPropagation: PropTypes.shape({
    descendants: PropTypes.bool,
    parents: PropTypes.bool,
  }),
  /**
   * Loading rows can be processed on the server or client-side.
   * Set it to 'client' if you would like enable infnite loading.
   * Set it to 'server' if you would like to enable lazy loading.
   * @default "client"
   * @deprecated Use the {@link https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#viewport-loading Server-side data-Viewport loading} instead.
   */
  rowsLoadingMode: PropTypes.oneOf(['client', 'server']),
  /**
   * Sets the type of space between rows added by `getRowSpacing`.
   * @default "margin"
   */
  rowSpacingType: PropTypes.oneOf(['border', 'margin']),
  /**
   * If `true`, the Data Grid will auto span the cells over the rows having the same value.
   * @default false
   */
  rowSpanning: PropTypes.bool,
  /**
   * Override the height/width of the Data Grid inner scrollbar.
   */
  scrollbarSize: PropTypes.number,
  /**
   * Set the area in `px` at the bottom of the grid viewport where onRowsScrollEnd is called.
   * If combined with `lazyLoading`, it defines the area where the next data request is triggered.
   * @default 80
   */
  scrollEndThreshold: PropTypes.number,
  /**
   * Updates the tree path in a row model.
   * Used when reordering rows across different parents in tree data.
   * @template R
   * @param {string[]} path The new path for the row.
   * @param {R} row The row model to update.
   * @returns {R} The updated row model with the new path.
   */
  setTreeDataPath: PropTypes.func,
  /**
   * If `true`, vertical borders will be displayed between cells.
   * @default false
   */
  showCellVerticalBorder: PropTypes.bool,
  /**
   * If `true`, vertical borders will be displayed between column header items.
   * @default false
   */
  showColumnVerticalBorder: PropTypes.bool,
  /**
   * If `true`, the toolbar is displayed.
   * @default false
   */
  showToolbar: PropTypes.bool,
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
   * Set the sort model of the Data Grid.
   */
  sortModel: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      sort: PropTypes.oneOf(['asc', 'desc']),
    }),
  ),
  /**
   * The function is used to split the pasted text into rows and cells.
   * @param {string} text The text pasted from the clipboard.
   * @param {string} delimiter The delimiter used to split the text. Default is the tab character and can be set with the `clipboardCopyCellDelimiter` prop.
   * @returns {string[][] | null} A 2D array of strings. The first dimension is the rows, the second dimension is the columns.
   * @default (pastedText, delimiter = '\t') => { const text = pastedText.replace(/\r?\n$/, ''); return text.split(/\r\n|\n|\r/).map((row) => row.split(delimiter)); }
   */
  splitClipboardPastedText: PropTypes.func,
  style: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Sets the tab navigation behavior for the Data Grid.
   * - "none": No Data Grid specific tab navigation. Pressing the tab key will move the focus to the next element in the tab sequence.
   * - "content": Pressing the tab key will move the focus to the next cell in the same row or the first cell in the next row. Shift+Tab will move the focus to the previous cell in the same row or the last cell in the previous row. Tab navigation is not enabled for the header.
   * - "header": Pressing the tab key will move the focus to the next column group, column header or header filter. Shift+Tab will move the focus to the previous column group, column header or header filter. Tab navigation is not enabled for the content.
   * - "all": Combines the "content" and "header" behavior.
   * @default "none"
   */
  tabNavigation: PropTypes.oneOf(['all', 'content', 'header', 'none']),
  /**
   * If positive, the Data Grid will throttle updates coming from `apiRef.current.updateRows` and `apiRef.current.setRows`.
   * It can be useful if you have a high update rate but do not want to do heavy work like filtering / sorting or rendering on each  individual update.
   * @default 0
   */
  throttleRowsMs: PropTypes.number,
  /**
   * If `true`, the rows will be gathered in a tree structure according to the `getTreeDataPath` prop.
   * @default false
   */
  treeData: PropTypes.bool,
  /**
   * If `true`, the Data Grid enables column virtualization when `getRowHeight` is set to `() => 'auto'`.
   * By default, column virtualization is disabled when dynamic row height is enabled to measure the row height correctly.
   * For datasets with a large number of columns, this can cause performance issues.
   * The downside of enabling this prop is that the row height will be estimated based the cells that are currently rendered, which can cause row height change when scrolling horizontally.
   * @default false
   */
  virtualizeColumnsWithAutoRowHeight: PropTypes.bool,
} as any;

interface DataGridPremiumComponent {
  <R extends GridValidRowModel = any>(
    props: DataGridPremiumProps<R> & React.RefAttributes<HTMLDivElement>,
  ): React.JSX.Element;
  propTypes?: any;
}

/**
 * Features:
 * - [DataGridPremium](https://mui.com/x/react-data-grid/features/)
 *
 * API:
 * - [DataGridPremium API](https://mui.com/x/api/data-grid/data-grid-premium/)
 */
export const DataGridPremium = React.memo(DataGridPremiumRaw) as DataGridPremiumComponent;
