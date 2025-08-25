"use strict";
'use client';
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataGridPremium = void 0;
var React = require("react");
var prop_types_1 = require("prop-types");
var x_license_1 = require("@mui/x-license");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var material_1 = require("@mui/x-data-grid/material");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useDataGridPremiumComponent_1 = require("./useDataGridPremiumComponent");
var useDataGridPremiumProps_1 = require("./useDataGridPremiumProps");
var sidebar_1 = require("../components/sidebar");
var useGridAriaAttributes_1 = require("../hooks/utils/useGridAriaAttributes");
var useGridRowAriaAttributes_1 = require("../hooks/features/rows/useGridRowAriaAttributes");
var gridAggregationSelectors_1 = require("../hooks/features/aggregation/gridAggregationSelectors");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var sidebar_2 = require("../hooks/features/sidebar");
var configuration = {
    hooks: {
        useCSSVariables: material_1.useMaterialCSSVariables,
        useGridAriaAttributes: useGridAriaAttributes_1.useGridAriaAttributesPremium,
        useGridRowAriaAttributes: useGridRowAriaAttributes_1.useGridRowAriaAttributesPremium,
        useCellAggregationResult: function (id, field) {
            var apiRef = (0, useGridApiContext_1.useGridApiContext)();
            return (0, x_data_grid_pro_1.useGridSelector)(apiRef, gridAggregationSelectors_1.gridCellAggregationResultSelector, { id: id, field: field });
        },
    },
};
var releaseInfo = '__RELEASE_INFO__';
var watermark = <x_license_1.Watermark packageName="x-data-grid-premium" releaseInfo={releaseInfo}/>;
var dataGridPremiumPropValidators;
if (process.env.NODE_ENV !== 'production') {
    dataGridPremiumPropValidators = __spreadArray(__spreadArray([], internals_1.propValidatorsDataGrid, true), internals_1.propValidatorsDataGridPro, true);
}
var DataGridPremiumRaw = (0, forwardRef_1.forwardRef)(function DataGridPremium(inProps, ref) {
    var _a;
    var initialProps = (0, useDataGridPremiumProps_1.useDataGridPremiumProps)(inProps);
    var privateApiRef = (0, internals_1.useGridApiInitialization)(initialProps.apiRef, initialProps);
    var props = (0, useDataGridPremiumComponent_1.useDataGridPremiumComponent)(privateApiRef, initialProps);
    (0, x_license_1.useLicenseVerifier)('x-data-grid-premium', releaseInfo);
    if (process.env.NODE_ENV !== 'production') {
        (0, internals_1.validateProps)(props, dataGridPremiumPropValidators);
    }
    var sidebarOpen = (0, x_data_grid_pro_1.useGridSelector)(privateApiRef, sidebar_2.gridSidebarOpenSelector);
    var sidePanel = sidebarOpen ? <sidebar_1.Sidebar /> : null;
    return (<x_data_grid_pro_1.GridContextProvider privateApiRef={privateApiRef} configuration={configuration} props={props}>
      <x_data_grid_pro_1.GridRoot className={props.className} style={props.style} sx={props.sx} {...(_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.root} ref={ref} sidePanel={sidePanel}>
        {watermark}
      </x_data_grid_pro_1.GridRoot>
    </x_data_grid_pro_1.GridContextProvider>);
});
DataGridPremiumRaw.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Aggregation functions available on the grid.
     * @default GRID_AGGREGATION_FUNCTIONS when `dataSource` is not provided, `{}` when `dataSource` is provided
     */
    aggregationFunctions: prop_types_1.default.object,
    /**
     * Set the aggregation model of the grid.
     */
    aggregationModel: prop_types_1.default.object,
    /**
     * Rows used to generate the aggregated value.
     * If `filtered`, the aggregated values are generated using only the rows currently passing the filtering process.
     * If `all`, the aggregated values are generated using all the rows.
     * @default "filtered"
     */
    aggregationRowsScope: prop_types_1.default.oneOf(['all', 'filtered']),
    /**
     * If `true`, the AI Assistant is enabled.
     * @default false
     */
    aiAssistant: prop_types_1.default.bool,
    /**
     * The index of the active AI Assistant conversation.
     */
    aiAssistantActiveConversationIndex: prop_types_1.default.number,
    /**
     * The conversations with the AI Assistant.
     */
    aiAssistantConversations: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        id: prop_types_1.default.string,
        prompts: prop_types_1.default.arrayOf(prop_types_1.default.shape({
            createdAt: prop_types_1.default.instanceOf(Date).isRequired,
            helperText: prop_types_1.default.string,
            response: prop_types_1.default.shape({
                aggregation: prop_types_1.default.object.isRequired,
                conversationId: prop_types_1.default.string.isRequired,
                filterOperator: prop_types_1.default.oneOf(['and', 'or']),
                filters: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
                grouping: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
                pivoting: prop_types_1.default.object.isRequired,
                select: prop_types_1.default.number.isRequired,
                sorting: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
            }),
            value: prop_types_1.default.string.isRequired,
            variant: prop_types_1.default.oneOf(['error', 'processing', 'success']),
        })).isRequired,
        title: prop_types_1.default.string,
    })),
    /**
     * The suggestions of the AI Assistant.
     */
    aiAssistantSuggestions: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        value: prop_types_1.default.string.isRequired,
    })),
    /**
     * If `true`, the AI Assistant is allowed to pick up values from random cells from each column to build the prompt context.
     */
    allowAiAssistantDataSampling: prop_types_1.default.bool,
    /**
     * The ref object that allows grid manipulation. Can be instantiated with `useGridApiRef()`.
     */
    apiRef: prop_types_1.default.shape({
        current: prop_types_1.default.object,
    }),
    /**
     * The `aria-label` of the Data Grid.
     */
    'aria-label': prop_types_1.default.string,
    /**
     * The `id` of the element containing a label for the Data Grid.
     */
    'aria-labelledby': prop_types_1.default.string,
    /**
     * If `true`, the Data Grid height is dynamic and follows the number of rows in the Data Grid.
     * @default false
     * @deprecated Use flex parent container instead: https://mui.com/x/react-data-grid/layout/#flex-parent-container
     * @example
     * <div style={{ display: 'flex', flexDirection: 'column' }}>
     *   <DataGrid />
     * </div>
     */
    autoHeight: prop_types_1.default.bool,
    /**
     * If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar.
     * @default false
     */
    autoPageSize: prop_types_1.default.bool,
    /**
     * If `true`, columns are autosized after the datagrid is mounted.
     * @default false
     */
    autosizeOnMount: prop_types_1.default.bool,
    /**
     * The options for autosize when user-initiated.
     */
    autosizeOptions: prop_types_1.default.shape({
        columns: prop_types_1.default.arrayOf(prop_types_1.default.string),
        disableColumnVirtualization: prop_types_1.default.bool,
        expand: prop_types_1.default.bool,
        includeHeaders: prop_types_1.default.bool,
        includeOutliers: prop_types_1.default.bool,
        outliersFactor: prop_types_1.default.number,
    }),
    /**
     * Controls the modes of the cells.
     */
    cellModesModel: prop_types_1.default.object,
    /**
     * If `true`, the cell selection mode is enabled.
     * @default false
     */
    cellSelection: prop_types_1.default.bool,
    /**
     * Set the cell selection model of the grid.
     */
    cellSelectionModel: prop_types_1.default.object,
    /**
     * If `true`, the Data Grid will display an extra column with checkboxes for selecting rows.
     * @default false
     */
    checkboxSelection: prop_types_1.default.bool,
    /**
     * If `true`, the "Select All" header checkbox selects only the rows on the current page. To be used in combination with `checkboxSelection`.
     * It only works if the pagination is enabled.
     * @default false
     */
    checkboxSelectionVisibleOnly: prop_types_1.default.bool,
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    className: prop_types_1.default.string,
    /**
     * The character used to separate cell values when copying to the clipboard.
     * @default '\t'
     */
    clipboardCopyCellDelimiter: prop_types_1.default.string,
    /**
     * Column region in pixels to render before/after the viewport
     * @default 150
     */
    columnBufferPx: prop_types_1.default.number,
    /**
     * The milliseconds delay to wait after a keystroke before triggering filtering in the columns menu.
     * @default 150
     */
    columnFilterDebounceMs: prop_types_1.default.number,
    /**
     * Sets the height in pixels of the column group headers in the Data Grid.
     * Inherits the `columnHeaderHeight` value if not set.
     */
    columnGroupHeaderHeight: prop_types_1.default.number,
    columnGroupingModel: prop_types_1.default.arrayOf(prop_types_1.default.object),
    /**
     * Sets the height in pixel of the column headers in the Data Grid.
     * @default 56
     */
    columnHeaderHeight: prop_types_1.default.number,
    /**
     * Set of columns of type [[GridColDef]][].
     */
    columns: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
    /**
     * Set the column visibility model of the Data Grid.
     * If defined, the Data Grid will ignore the `hide` property in [[GridColDef]].
     */
    columnVisibilityModel: prop_types_1.default.object,
    /**
     * Data source object.
     */
    dataSource: prop_types_1.default.shape({
        getAggregatedValue: prop_types_1.default.func,
        getChildrenCount: prop_types_1.default.func,
        getGroupKey: prop_types_1.default.func,
        getRows: prop_types_1.default.func.isRequired,
        updateRow: prop_types_1.default.func,
    }),
    /**
     * Data source cache object.
     */
    dataSourceCache: prop_types_1.default.shape({
        clear: prop_types_1.default.func.isRequired,
        get: prop_types_1.default.func.isRequired,
        set: prop_types_1.default.func.isRequired,
    }),
    /**
     * If above 0, the row children will be expanded up to this depth.
     * If equal to -1, all the row children will be expanded.
     * @default 0
     */
    defaultGroupingExpansionDepth: prop_types_1.default.number,
    /**
     * Set the density of the Data Grid.
     * @default "standard"
     */
    density: prop_types_1.default.oneOf(['comfortable', 'compact', 'standard']),
    /**
     * The row ids to show the detail panel.
     */
    detailPanelExpandedRowIds: prop_types_1.default /* @typescript-to-proptypes-ignore */.instanceOf(Set),
    /**
     * If `true`, aggregation is disabled.
     * @default false
     */
    disableAggregation: prop_types_1.default.bool,
    /**
     * If `true`, column autosizing on header separator double-click is disabled.
     * @default false
     */
    disableAutosize: prop_types_1.default.bool,
    /**
     * If `true`, the filtering will only be applied to the top level rows when grouping rows with the `treeData` prop.
     * @default false
     */
    disableChildrenFiltering: prop_types_1.default.bool,
    /**
     * If `true`, the sorting will only be applied to the top level rows when grouping rows with the `treeData` prop.
     * @default false
     */
    disableChildrenSorting: prop_types_1.default.bool,
    /**
     * If `true`, the clipboard paste is disabled.
     * @default false
     */
    disableClipboardPaste: prop_types_1.default.bool,
    /**
     * If `true`, column filters are disabled.
     * @default false
     */
    disableColumnFilter: prop_types_1.default.bool,
    /**
     * If `true`, the column menu is disabled.
     * @default false
     */
    disableColumnMenu: prop_types_1.default.bool,
    /**
     * If `true`, the column pinning is disabled.
     * @default false
     */
    disableColumnPinning: prop_types_1.default.bool,
    /**
     * If `true`, reordering columns is disabled.
     * @default false
     */
    disableColumnReorder: prop_types_1.default.bool,
    /**
     * If `true`, resizing columns is disabled.
     * @default false
     */
    disableColumnResize: prop_types_1.default.bool,
    /**
     * If `true`, hiding/showing columns is disabled.
     * @default false
     */
    disableColumnSelector: prop_types_1.default.bool,
    /**
     * If `true`, the column sorting feature will be disabled.
     * @default false
     */
    disableColumnSorting: prop_types_1.default.bool,
    /**
     * If `true`, the density selector is disabled.
     * @default false
     */
    disableDensitySelector: prop_types_1.default.bool,
    /**
     * If `true`, `eval()` is not used for performance optimization.
     * @default false
     */
    disableEval: prop_types_1.default.bool,
    /**
     * If `true`, filtering with multiple columns is disabled.
     * @default false
     */
    disableMultipleColumnsFiltering: prop_types_1.default.bool,
    /**
     * If `true`, the sorting with multiple columns is disabled.
     * @default false
     */
    disableMultipleColumnsSorting: prop_types_1.default.bool,
    /**
     * If `true`, multiple selection using the Ctrl/CMD or Shift key is disabled.
     * The MIT DataGrid will ignore this prop, unless `checkboxSelection` is enabled.
     * @default false (`!props.checkboxSelection` for MIT Data Grid)
     */
    disableMultipleRowSelection: prop_types_1.default.bool,
    /**
     * If `true`, the pivoting feature is disabled.
     * @default false
     */
    disablePivoting: prop_types_1.default.bool,
    /**
     * If `true`, the row grouping is disabled.
     * @default false
     */
    disableRowGrouping: prop_types_1.default.bool,
    /**
     * If `true`, the selection on click on a row or cell is disabled.
     * @default false
     */
    disableRowSelectionOnClick: prop_types_1.default.bool,
    /**
     * If `true`, the virtualization is disabled.
     * @default false
     */
    disableVirtualization: prop_types_1.default.bool,
    /**
     * Controls whether to use the cell or row editing.
     * @default "cell"
     */
    editMode: prop_types_1.default.oneOf(['cell', 'row']),
    /**
     * Use if the actual rowCount is not known upfront, but an estimation is available.
     * If some rows have children (for instance in the tree data), this number represents the amount of top level rows.
     * Applicable only with `paginationMode="server"` and when `rowCount="-1"`
     */
    estimatedRowCount: prop_types_1.default.number,
    /**
     * Unstable features, breaking changes might be introduced.
     * For each feature, if the flag is not explicitly set to `true`, then the feature is fully disabled, and neither property nor method calls will have any effect.
     */
    experimentalFeatures: prop_types_1.default.shape({
        warnIfFocusStateIsNotSynced: prop_types_1.default.bool,
    }),
    /**
     * The milliseconds delay to wait after a keystroke before triggering filtering.
     * @default 150
     */
    filterDebounceMs: prop_types_1.default.number,
    /**
     * Filtering can be processed on the server or client-side.
     * Set it to 'server' if you would like to handle filtering on the server-side.
     * @default "client"
     */
    filterMode: prop_types_1.default.oneOf(['client', 'server']),
    /**
     * Set the filter model of the Data Grid.
     */
    filterModel: prop_types_1.default.shape({
        items: prop_types_1.default.arrayOf(prop_types_1.default.shape({
            field: prop_types_1.default.string.isRequired,
            id: prop_types_1.default.oneOfType([prop_types_1.default.number, prop_types_1.default.string]),
            operator: prop_types_1.default.string.isRequired,
            value: prop_types_1.default.any,
        })).isRequired,
        logicOperator: prop_types_1.default.oneOf(['and', 'or']),
        quickFilterExcludeHiddenColumns: prop_types_1.default.bool,
        quickFilterLogicOperator: prop_types_1.default.oneOf(['and', 'or']),
        quickFilterValues: prop_types_1.default.array,
    }),
    /**
     * Determines the position of an aggregated value.
     * @param {GridGroupNode} groupNode The current group.
     * @returns {GridAggregationPosition | null} Position of the aggregated value (if `null`, the group isn't aggregated).
     * @default (groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline')
     */
    getAggregationPosition: prop_types_1.default.func,
    /**
     * Function that applies CSS classes dynamically on cells.
     * @param {GridCellParams} params With all properties from [[GridCellParams]].
     * @returns {string} The CSS class to apply to the cell.
     */
    getCellClassName: prop_types_1.default.func,
    /**
     * Function that returns the element to render in row detail.
     * @param {GridRowParams} params With all properties from [[GridRowParams]].
     * @returns {React.JSX.Element} The row detail element.
     */
    getDetailPanelContent: prop_types_1.default.func,
    /**
     * Function that returns the height of the row detail panel.
     * @param {GridRowParams} params With all properties from [[GridRowParams]].
     * @returns {number | string} The height in pixels or "auto" to use the content height.
     * @default "() => 500"
     */
    getDetailPanelHeight: prop_types_1.default.func,
    /**
     * Function that returns the estimated height for a row.
     * Only works if dynamic row height is used.
     * Once the row height is measured this value is discarded.
     * @param {GridRowHeightParams} params With all properties from [[GridRowHeightParams]].
     * @returns {number | null} The estimated row height value. If `null` or `undefined` then the default row height, based on the density, is applied.
     */
    getEstimatedRowHeight: prop_types_1.default.func,
    /**
     * Allows to generate derived columns from actual columns that will be used for pivoting.
     * Useful e.g. for date columns to generate year, quarter, month, etc.
     * @param {GridColDef} column The column to generate derived columns for.
     * @param {GridLocaleTextApi['getLocaleText']} getLocaleText The function to get the locale text.
     * @returns {GridColDef[] | undefined} The derived columns.
     * @default {defaultGetPivotDerivedColumns} Creates year and quarter columns for date columns.
     */
    getPivotDerivedColumns: prop_types_1.default.func,
    /**
     * Function that applies CSS classes dynamically on rows.
     * @param {GridRowClassNameParams} params With all properties from [[GridRowClassNameParams]].
     * @returns {string} The CSS class to apply to the row.
     */
    getRowClassName: prop_types_1.default.func,
    /**
     * Function that sets the row height per row.
     * @param {GridRowHeightParams} params With all properties from [[GridRowHeightParams]].
     * @returns {GridRowHeightReturnValue} The row height value. If `null` or `undefined` then the default row height is applied. If "auto" then the row height is calculated based on the content.
     */
    getRowHeight: prop_types_1.default.func,
    /**
     * Return the id of a given [[GridRowModel]].
     * Ensure the reference of this prop is stable to avoid performance implications.
     * It could be done by either defining the prop outside of the component or by memoizing it.
     */
    getRowId: prop_types_1.default.func,
    /**
     * Function that allows to specify the spacing between rows.
     * @param {GridRowSpacingParams} params With all properties from [[GridRowSpacingParams]].
     * @returns {GridRowSpacing} The row spacing values.
     */
    getRowSpacing: prop_types_1.default.func,
    /**
     * Determines the path of a row in the tree data.
     * For instance, a row with the path ["A", "B"] is the child of the row with the path ["A"].
     * Note that all paths must contain at least one element.
     * @template R
     * @param {R} row The row from which we want the path.
     * @returns {string[]} The path to the row.
     */
    getTreeDataPath: prop_types_1.default.func,
    /**
     * The grouping column used by the tree data.
     */
    groupingColDef: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object]),
    /**
     * Override the height of the header filters.
     */
    headerFilterHeight: prop_types_1.default.number,
    /**
     * If `true`, the header filters feature is enabled.
     * @default false
     */
    headerFilters: prop_types_1.default.bool,
    /**
     * If `true`, the footer component is hidden.
     * @default false
     */
    hideFooter: prop_types_1.default.bool,
    /**
     * If `true`, the pagination component in the footer is hidden.
     * @default false
     */
    hideFooterPagination: prop_types_1.default.bool,
    /**
     * If `true`, the row count in the footer is hidden.
     * It has no effect if the pagination is enabled.
     * @default false
     */
    hideFooterRowCount: prop_types_1.default.bool,
    /**
     * If `true`, the selected row count in the footer is hidden.
     * @default false
     */
    hideFooterSelectedRowCount: prop_types_1.default.bool,
    /**
     * If `true`, the diacritics (accents) are ignored when filtering or quick filtering.
     * E.g. when filter value is `cafe`, the rows with `café` will be visible.
     * @default false
     */
    ignoreDiacritics: prop_types_1.default.bool,
    /**
     * If `true`, the Data Grid will not use `valueFormatter` when exporting to CSV or copying to clipboard.
     * If an object is provided, you can choose to ignore the `valueFormatter` for CSV export or clipboard export.
     * @default false
     */
    ignoreValueFormatterDuringExport: prop_types_1.default.oneOfType([
        prop_types_1.default.shape({
            clipboardExport: prop_types_1.default.bool,
            csvExport: prop_types_1.default.bool,
        }),
        prop_types_1.default.bool,
    ]),
    /**
     * The initial state of the DataGridPremium.
     * The data in it is set in the state on initialization but isn't controlled.
     * If one of the data in `initialState` is also being controlled, then the control state wins.
     */
    initialState: prop_types_1.default.object,
    /**
     * Callback fired when a cell is rendered, returns true if the cell is editable.
     * @param {GridCellParams} params With all properties from [[GridCellParams]].
     * @returns {boolean} A boolean indicating if the cell is editable.
     */
    isCellEditable: prop_types_1.default.func,
    /**
     * Determines if a group should be expanded after its creation.
     * This prop takes priority over the `defaultGroupingExpansionDepth` prop.
     * @param {GridGroupNode} node The node of the group to test.
     * @returns {boolean} A boolean indicating if the group is expanded.
     */
    isGroupExpandedByDefault: prop_types_1.default.func,
    /**
     * Determines if a row can be selected.
     * @param {GridRowParams} params With all properties from [[GridRowParams]].
     * @returns {boolean} A boolean indicating if the row is selectable.
     */
    isRowSelectable: prop_types_1.default.func,
    /**
     * If `true`, moving the mouse pointer outside the grid before releasing the mouse button
     * in a column re-order action will not cause the column to jump back to its original position.
     * @default false
     */
    keepColumnPositionIfDraggedOutside: prop_types_1.default.bool,
    /**
     * If `true`, the selection model will retain selected rows that do not exist.
     * Useful when using server side pagination and row selections need to be retained
     * when changing pages.
     * @default false
     */
    keepNonExistentRowsSelected: prop_types_1.default.bool,
    /**
     * The label of the Data Grid.
     * If the `showToolbar` prop is `true`, the label will be displayed in the toolbar and applied to the `aria-label` attribute of the grid.
     * If the `showToolbar` prop is `false`, the label will not be visible but will be applied to the `aria-label` attribute of the grid.
     */
    label: prop_types_1.default.string,
    /**
     * Used together with `dataSource` to enable lazy loading.
     * If enabled, the grid stops adding `paginationModel` to the data requests (`getRows`)
     * and starts sending `start` and `end` values depending on the loading mode and the scroll position.
     * @default false
     */
    lazyLoading: prop_types_1.default.bool,
    /**
     * If positive, the Data Grid will throttle data source requests on rendered rows interval change.
     * @default 500
     */
    lazyLoadingRequestThrottleMs: prop_types_1.default.number,
    /**
     * If `true`, displays the data in a list view.
     * Use in combination with `listViewColumn`.
     */
    listView: prop_types_1.default.bool,
    /**
     * Definition of the column rendered when the `listView` prop is enabled.
     */
    listViewColumn: prop_types_1.default.shape({
        align: prop_types_1.default.oneOf(['center', 'left', 'right']),
        cellClassName: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
        display: prop_types_1.default.oneOf(['flex', 'text']),
        field: prop_types_1.default.string.isRequired,
        renderCell: prop_types_1.default.func,
    }),
    /**
     * If `true`, a loading overlay is displayed.
     * @default false
     */
    loading: prop_types_1.default.bool,
    /**
     * Set the locale text of the Data Grid.
     * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-data-grid/src/constants/localeTextConstants.ts) in the GitHub repository.
     */
    localeText: prop_types_1.default.object,
    /**
     * Pass a custom logger in the components that implements the [[Logger]] interface.
     * @default console
     */
    logger: prop_types_1.default.shape({
        debug: prop_types_1.default.func.isRequired,
        error: prop_types_1.default.func.isRequired,
        info: prop_types_1.default.func.isRequired,
        warn: prop_types_1.default.func.isRequired,
    }),
    /**
     * Allows to pass the logging level or false to turn off logging.
     * @default "error" ("warn" in dev mode)
     */
    logLevel: prop_types_1.default.oneOf(['debug', 'error', 'info', 'warn', false]),
    /**
     * If set to "always", the multi-sorting is applied without modifier key.
     * Otherwise, the modifier key is required for multi-sorting to be applied.
     * @see See https://mui.com/x/react-data-grid/sorting/#multi-sorting
     * @default "withModifierKey"
     */
    multipleColumnsSortingMode: prop_types_1.default.oneOf(['always', 'withModifierKey']),
    /**
     * Nonce of the inline styles for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute).
     */
    nonce: prop_types_1.default.string,
    /**
     * Callback fired when the row grouping model changes.
     * @param {GridAggregationModel} model The aggregated columns.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onAggregationModelChange: prop_types_1.default.func,
    /**
     * Callback fired when the AI Assistant active conversation index changes.
     * @param {number} aiAssistantActiveConversationIndex The new active conversation index.
     */
    onAiAssistantActiveConversationIndexChange: prop_types_1.default.func,
    /**
     * Callback fired when the AI Assistant conversations change.
     * @param {Conversation[]} conversations The new AI Assistant conversations.
     */
    onAiAssistantConversationsChange: prop_types_1.default.func,
    /**
     * Callback fired before the clipboard paste operation starts.
     * Use it to confirm or cancel the paste operation.
     * @param {object} params Params passed to the callback.
     * @param {string[][]} params.data The raw pasted data split by rows and cells.
     * @returns {Promise<any>} A promise that resolves to confirm the paste operation, and rejects to cancel it.
     */
    onBeforeClipboardPasteStart: prop_types_1.default.func,
    /**
     * Callback fired when any cell is clicked.
     * @param {GridCellParams} params With all properties from [[GridCellParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onCellClick: prop_types_1.default.func,
    /**
     * Callback fired when a double click event comes from a cell element.
     * @param {GridCellParams} params With all properties from [[GridCellParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onCellDoubleClick: prop_types_1.default.func,
    /**
     * Callback fired when the cell turns to edit mode.
     * @param {GridCellParams} params With all properties from [[GridCellParams]].
     * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
     */
    onCellEditStart: prop_types_1.default.func,
    /**
     * Callback fired when the cell turns to view mode.
     * @param {GridCellParams} params With all properties from [[GridCellParams]].
     * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
     */
    onCellEditStop: prop_types_1.default.func,
    /**
     * Callback fired when a keydown event comes from a cell element.
     * @param {GridCellParams} params With all properties from [[GridCellParams]].
     * @param {MuiEvent<React.KeyboardEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onCellKeyDown: prop_types_1.default.func,
    /**
     * Callback fired when the `cellModesModel` prop changes.
     * @param {GridCellModesModel} cellModesModel Object containing which cells are in "edit" mode.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onCellModesModelChange: prop_types_1.default.func,
    /**
     * Callback fired when the selection state of one or multiple cells changes.
     * @param {GridCellSelectionModel} cellSelectionModel Object in the shape of [[GridCellSelectionModel]] containing the selected cells.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onCellSelectionModelChange: prop_types_1.default.func,
    /**
     * Callback called when the data is copied to the clipboard.
     * @param {string} data The data copied to the clipboard.
     */
    onClipboardCopy: prop_types_1.default.func,
    /**
     * Callback fired when the clipboard paste operation ends.
     */
    onClipboardPasteEnd: prop_types_1.default.func,
    /**
     * Callback fired when the clipboard paste operation starts.
     */
    onClipboardPasteStart: prop_types_1.default.func,
    /**
     * Callback fired when a click event comes from a column header element.
     * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onColumnHeaderClick: prop_types_1.default.func,
    /**
     * Callback fired when a contextmenu event comes from a column header element.
     * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     */
    onColumnHeaderContextMenu: prop_types_1.default.func,
    /**
     * Callback fired when a double click event comes from a column header element.
     * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onColumnHeaderDoubleClick: prop_types_1.default.func,
    /**
     * Callback fired when a mouse enter event comes from a column header element.
     * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onColumnHeaderEnter: prop_types_1.default.func,
    /**
     * Callback fired when a mouse leave event comes from a column header element.
     * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onColumnHeaderLeave: prop_types_1.default.func,
    /**
     * Callback fired when a mouseout event comes from a column header element.
     * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onColumnHeaderOut: prop_types_1.default.func,
    /**
     * Callback fired when a mouseover event comes from a column header element.
     * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onColumnHeaderOver: prop_types_1.default.func,
    /**
     * Callback fired when a column is reordered.
     * @param {GridColumnOrderChangeParams} params With all properties from [[GridColumnOrderChangeParams]].
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onColumnOrderChange: prop_types_1.default.func,
    /**
     * Callback fired while a column is being resized.
     * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onColumnResize: prop_types_1.default.func,
    /**
     * Callback fired when the column visibility model changes.
     * @param {GridColumnVisibilityModel} model The new model.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onColumnVisibilityModelChange: prop_types_1.default.func,
    /**
     * Callback fired when the width of a column is changed.
     * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onColumnWidthChange: prop_types_1.default.func,
    /**
     * Callback fired when a data source request fails.
     * @param {GridGetRowsError | GridUpdateRowError} error The data source error object.
     */
    onDataSourceError: prop_types_1.default.func,
    /**
     * Callback fired when the density changes.
     * @param {GridDensity} density New density value.
     */
    onDensityChange: prop_types_1.default.func,
    /**
     * Callback fired when the detail panel of a row is opened or closed.
     * @param {GridRowId[]} ids The ids of the rows which have the detail panel open.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onDetailPanelExpandedRowIdsChange: prop_types_1.default.func,
    /**
     * Callback fired when the state of the Excel export changes.
     * @param {string} inProgress Indicates if the task is in progress.
     */
    onExcelExportStateChange: prop_types_1.default.func,
    /**
     * Callback fired when rowCount is set and the next batch of virtualized rows is rendered.
     * @param {GridFetchRowsParams} params With all properties from [[GridFetchRowsParams]].
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     * @deprecated Use the {@link https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#viewport-loading Server-side data-Viewport loading} instead.
     */
    onFetchRows: prop_types_1.default.func,
    /**
     * Callback fired when the Filter model changes before the filters are applied.
     * @param {GridFilterModel} model With all properties from [[GridFilterModel]].
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onFilterModelChange: prop_types_1.default.func,
    /**
     * Callback fired when the menu is closed.
     * @param {GridMenuParams} params With all properties from [[GridMenuParams]].
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onMenuClose: prop_types_1.default.func,
    /**
     * Callback fired when the menu is opened.
     * @param {GridMenuParams} params With all properties from [[GridMenuParams]].
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onMenuOpen: prop_types_1.default.func,
    /**
     * Callback fired when the pagination meta has changed.
     * @param {GridPaginationMeta} paginationMeta Updated pagination meta.
     */
    onPaginationMetaChange: prop_types_1.default.func,
    /**
     * Callback fired when the pagination model has changed.
     * @param {GridPaginationModel} model Updated pagination model.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onPaginationModelChange: prop_types_1.default.func,
    /**
     * Callback fired when the pinned columns have changed.
     * @param {GridPinnedColumnFields} pinnedColumns The changed pinned columns.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onPinnedColumnsChange: prop_types_1.default.func,
    /**
     * Callback fired when the pivot active state changes.
     * @param {boolean} isPivotActive Whether the data grid is in pivot mode.
     */
    onPivotActiveChange: prop_types_1.default.func,
    /**
     * Callback fired when the pivot model changes.
     * @param {GridPivotModel} pivotModel The new pivot model.
     */
    onPivotModelChange: prop_types_1.default.func,
    /**
     * Callback fired when the pivot side panel open state changes.
     * @param {boolean} pivotPanelOpen Whether the pivot side panel is visible.
     * @deprecated Use the `sidebarOpen` and `sidebarClose` events or corresponding event handlers `onSidebarOpen()` and `onSidebarClose()` instead.
     */
    onPivotPanelOpenChange: prop_types_1.default.func,
    /**
     * Callback fired when the preferences panel is closed.
     * @param {GridPreferencePanelParams} params With all properties from [[GridPreferencePanelParams]].
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onPreferencePanelClose: prop_types_1.default.func,
    /**
     * Callback fired when the preferences panel is opened.
     * @param {GridPreferencePanelParams} params With all properties from [[GridPreferencePanelParams]].
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onPreferencePanelOpen: prop_types_1.default.func,
    /**
     * Callback called when `processRowUpdate` throws an error or rejects.
     * @param {any} error The error thrown.
     */
    onProcessRowUpdateError: prop_types_1.default.func,
    /**
     * The function to be used to process the prompt.
     * @param {string} prompt The prompt to be processed.
     * @param {string} promptContext The prompt context.
     * @param {string} conversationId The id of the conversation the prompt is part of. If not passed, prompt response will return a new conversation id that can be used to continue the newly started conversation.
     * @returns {Promise<PromptResponse>} The prompt response.
     */
    onPrompt: prop_types_1.default.func,
    /**
     * Callback fired when the Data Grid is resized.
     * @param {ElementSize} containerSize With all properties from [[ElementSize]].
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onResize: prop_types_1.default.func,
    /**
     * Callback fired when a row is clicked.
     * Not called if the target clicked is an interactive element added by the built-in columns.
     * @param {GridRowParams} params With all properties from [[GridRowParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onRowClick: prop_types_1.default.func,
    /**
     * Callback fired when the row count has changed.
     * @param {number} count Updated row count.
     */
    onRowCountChange: prop_types_1.default.func,
    /**
     * Callback fired when a double click event comes from a row container element.
     * @param {GridRowParams} params With all properties from [[RowParams]].
     * @param {MuiEvent<React.MouseEvent>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onRowDoubleClick: prop_types_1.default.func,
    /**
     * Callback fired when the row turns to edit mode.
     * @param {GridRowParams} params With all properties from [[GridRowParams]].
     * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
     */
    onRowEditStart: prop_types_1.default.func,
    /**
     * Callback fired when the row turns to view mode.
     * @param {GridRowParams} params With all properties from [[GridRowParams]].
     * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
     */
    onRowEditStop: prop_types_1.default.func,
    /**
     * Callback fired when the row grouping model changes.
     * @param {GridRowGroupingModel} model Columns used as grouping criteria.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onRowGroupingModelChange: prop_types_1.default.func,
    /**
     * Callback fired when the `rowModesModel` prop changes.
     * @param {GridRowModesModel} rowModesModel Object containing which rows are in "edit" mode.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onRowModesModelChange: prop_types_1.default.func,
    /**
     * Callback fired when a row is being reordered.
     * @param {GridRowOrderChangeParams} params With all properties from [[GridRowOrderChangeParams]].
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onRowOrderChange: prop_types_1.default.func,
    /**
     * Callback fired when the selection state of one or multiple rows changes.
     * @param {GridRowSelectionModel} rowSelectionModel With all the row ids [[GridSelectionModel]].
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onRowSelectionModelChange: prop_types_1.default.func,
    /**
     * Callback fired when scrolling to the bottom of the grid viewport.
     * @param {GridRowScrollEndParams} params With all properties from [[GridRowScrollEndParams]].
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     * @deprecated Use the {@link https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#infinite-loading Server-side data-Infinite loading} instead.
     */
    onRowsScrollEnd: prop_types_1.default.func,
    /**
     * Callback fired when the sidebar is closed.
     * @param {GridSidebarParams} params With all properties from [[GridSidebarParams]].
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onSidebarClose: prop_types_1.default.func,
    /**
     * Callback fired when the sidebar is opened.
     * @param {GridSidebarParams} params With all properties from [[GridSidebarParams]].
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onSidebarOpen: prop_types_1.default.func,
    /**
     * Callback fired when the sort model changes before a column is sorted.
     * @param {GridSortModel} model With all properties from [[GridSortModel]].
     * @param {GridCallbackDetails} details Additional details for this callback.
     */
    onSortModelChange: prop_types_1.default.func,
    /**
     * Callback fired when the state of the Data Grid is updated.
     * @param {GridState} state The new state.
     * @param {MuiEvent<{}>} event The event object.
     * @param {GridCallbackDetails} details Additional details for this callback.
     * @ignore - do not document.
     */
    onStateChange: prop_types_1.default.func,
    /**
     * Select the pageSize dynamically using the component UI.
     * @default [25, 50, 100]
     */
    pageSizeOptions: prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([
        prop_types_1.default.number,
        prop_types_1.default.shape({
            label: prop_types_1.default.string.isRequired,
            value: prop_types_1.default.number.isRequired,
        }),
    ]).isRequired),
    /**
     * If `true`, pagination is enabled.
     * @default false
     */
    pagination: prop_types_1.default.bool,
    /**
     * The extra information about the pagination state of the Data Grid.
     * Only applicable with `paginationMode="server"`.
     */
    paginationMeta: prop_types_1.default.shape({
        hasNextPage: prop_types_1.default.bool,
    }),
    /**
     * Pagination can be processed on the server or client-side.
     * Set it to 'client' if you would like to handle the pagination on the client-side.
     * Set it to 'server' if you would like to handle the pagination on the server-side.
     * @default "client"
     */
    paginationMode: prop_types_1.default.oneOf(['client', 'server']),
    /**
     * The pagination model of type [[GridPaginationModel]] which refers to current `page` and `pageSize`.
     */
    paginationModel: prop_types_1.default.shape({
        page: prop_types_1.default.number.isRequired,
        pageSize: prop_types_1.default.number.isRequired,
    }),
    /**
     * The column fields to display pinned to left or right.
     */
    pinnedColumns: prop_types_1.default.object,
    /**
     * Rows data to pin on top or bottom.
     */
    pinnedRows: prop_types_1.default.shape({
        bottom: prop_types_1.default.arrayOf(prop_types_1.default.object),
        top: prop_types_1.default.arrayOf(prop_types_1.default.object),
    }),
    /**
     * If `true`, the data grid will show data in pivot mode using the `pivotModel`.
     * @default false
     */
    pivotActive: prop_types_1.default.bool,
    /**
     * The column definition overrides for the columns generated by the pivoting feature.
     * @param {string} originalColumnField The field of the original column.
     * @param {string[]} columnGroupPath The path of the column groups the column belongs to.
     * @returns {Partial<GridPivotingColDefOverrides> | undefined | void} The column definition overrides.
     * @default undefined
     */
    pivotingColDef: prop_types_1.default.oneOfType([
        prop_types_1.default.func,
        prop_types_1.default.shape({
            align: prop_types_1.default.oneOf(['center', 'left', 'right']),
            cellClassName: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
            description: prop_types_1.default.string,
            display: prop_types_1.default.oneOf(['flex', 'text']),
            flex: prop_types_1.default.number,
            headerAlign: prop_types_1.default.oneOf(['center', 'left', 'right']),
            headerClassName: prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.string]),
            headerName: prop_types_1.default.string,
            maxWidth: prop_types_1.default.number,
            minWidth: prop_types_1.default.number,
            resizable: prop_types_1.default.bool,
            sortingOrder: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['asc', 'desc'])),
            width: prop_types_1.default.number,
        }),
    ]),
    /**
     * The pivot model of the grid.
     * Will be used to generate the pivot data.
     * In case of `pivotActive` being `false`, the pivot model is still used to populate the pivot panel.
     */
    pivotModel: prop_types_1.default.shape({
        columns: prop_types_1.default.arrayOf(prop_types_1.default.object).isRequired,
        rows: prop_types_1.default.arrayOf(prop_types_1.default.shape({
            field: prop_types_1.default.string.isRequired,
            hidden: prop_types_1.default.bool,
        })).isRequired,
        values: prop_types_1.default.arrayOf(prop_types_1.default.shape({
            aggFunc: prop_types_1.default.string.isRequired,
            field: prop_types_1.default.string.isRequired,
            hidden: prop_types_1.default.bool,
        })).isRequired,
    }),
    /**
     * If `true`, the pivot side panel is visible.
     * @default false
     * @deprecated Use `initialState.sidebar.open` instead.
     */
    pivotPanelOpen: prop_types_1.default.bool,
    /**
     * Callback called before updating a row with new values in the row and cell editing.
     * @template R
     * @param {R} newRow Row object with the new values.
     * @param {R} oldRow Row object with the old values.
     * @param {{ rowId: GridRowId }} params Additional parameters.
     * @returns {Promise<R> | R} The final values to update the row.
     */
    processRowUpdate: prop_types_1.default.func,
    /**
     * The milliseconds throttle delay for resizing the grid.
     * @default 60
     */
    resizeThrottleMs: prop_types_1.default.number,
    /**
     * Row region in pixels to render before/after the viewport
     * @default 150
     */
    rowBufferPx: prop_types_1.default.number,
    /**
     * Set the total number of rows, if it is different from the length of the value `rows` prop.
     * If some rows have children (for instance in the tree data), this number represents the amount of top level rows.
     * Only works with `paginationMode="server"`, ignored when `paginationMode="client"`.
     */
    rowCount: prop_types_1.default.number,
    /**
     * If `single`, all the columns that are grouped are represented in the same grid column.
     * If `multiple`, each column that is grouped is represented in its own grid column.
     * @default 'single'
     */
    rowGroupingColumnMode: prop_types_1.default.oneOf(['multiple', 'single']),
    /**
     * Set the row grouping model of the grid.
     */
    rowGroupingModel: prop_types_1.default.arrayOf(prop_types_1.default.string),
    /**
     * Sets the height in pixel of a row in the Data Grid.
     * @default 52
     */
    rowHeight: prop_types_1.default.number,
    /**
     * Controls the modes of the rows.
     */
    rowModesModel: prop_types_1.default.object,
    /**
     * If `true`, the reordering of rows is enabled.
     * @default false
     */
    rowReordering: prop_types_1.default.bool,
    /**
     * Set of rows of type [[GridRowsProp]].
     * @default []
     */
    rows: prop_types_1.default.arrayOf(prop_types_1.default.object),
    /**
     * If `false`, the row selection mode is disabled.
     * @default true
     */
    rowSelection: prop_types_1.default.bool,
    /**
     * Sets the row selection model of the Data Grid.
     */
    rowSelectionModel: prop_types_1.default /* @typescript-to-proptypes-ignore */.shape({
        ids: prop_types_1.default.instanceOf(Set).isRequired,
        type: prop_types_1.default.oneOf(['exclude', 'include']).isRequired,
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
    rowSelectionPropagation: prop_types_1.default.shape({
        descendants: prop_types_1.default.bool,
        parents: prop_types_1.default.bool,
    }),
    /**
     * Loading rows can be processed on the server or client-side.
     * Set it to 'client' if you would like enable infnite loading.
     * Set it to 'server' if you would like to enable lazy loading.
     * @default "client"
     * @deprecated Use the {@link https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#viewport-loading Server-side data-Viewport loading} instead.
     */
    rowsLoadingMode: prop_types_1.default.oneOf(['client', 'server']),
    /**
     * Sets the type of space between rows added by `getRowSpacing`.
     * @default "margin"
     */
    rowSpacingType: prop_types_1.default.oneOf(['border', 'margin']),
    /**
     * If `true`, the Data Grid will auto span the cells over the rows having the same value.
     * @default false
     */
    rowSpanning: prop_types_1.default.bool,
    /**
     * Override the height/width of the Data Grid inner scrollbar.
     */
    scrollbarSize: prop_types_1.default.number,
    /**
     * Set the area in `px` at the bottom of the grid viewport where onRowsScrollEnd is called.
     * If combined with `lazyLoading`, it defines the area where the next data request is triggered.
     * @default 80
     */
    scrollEndThreshold: prop_types_1.default.number,
    /**
     * If `true`, vertical borders will be displayed between cells.
     * @default false
     */
    showCellVerticalBorder: prop_types_1.default.bool,
    /**
     * If `true`, vertical borders will be displayed between column header items.
     * @default false
     */
    showColumnVerticalBorder: prop_types_1.default.bool,
    /**
     * If `true`, the toolbar is displayed.
     * @default false
     */
    showToolbar: prop_types_1.default.bool,
    /**
     * Overridable components props dynamically passed to the component at rendering.
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable components.
     */
    slots: prop_types_1.default.object,
    /**
     * Sorting can be processed on the server or client-side.
     * Set it to 'client' if you would like to handle sorting on the client-side.
     * Set it to 'server' if you would like to handle sorting on the server-side.
     * @default "client"
     */
    sortingMode: prop_types_1.default.oneOf(['client', 'server']),
    /**
     * The order of the sorting sequence.
     * @default ['asc', 'desc', null]
     */
    sortingOrder: prop_types_1.default.arrayOf(prop_types_1.default.oneOf(['asc', 'desc'])),
    /**
     * Set the sort model of the Data Grid.
     */
    sortModel: prop_types_1.default.arrayOf(prop_types_1.default.shape({
        field: prop_types_1.default.string.isRequired,
        sort: prop_types_1.default.oneOf(['asc', 'desc']),
    })),
    /**
     * The function is used to split the pasted text into rows and cells.
     * @param {string} text The text pasted from the clipboard.
     * @param {string} delimiter The delimiter used to split the text. Default is the tab character and can be set with the `clipboardCopyCellDelimiter` prop.
     * @returns {string[][] | null} A 2D array of strings. The first dimension is the rows, the second dimension is the columns.
     * @default (pastedText, delimiter = '\t') => { const text = pastedText.replace(/\r?\n$/, ''); return text.split(/\r\n|\n|\r/).map((row) => row.split(delimiter)); }
     */
    splitClipboardPastedText: prop_types_1.default.func,
    style: prop_types_1.default.object,
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
    /**
     * If positive, the Data Grid will throttle updates coming from `apiRef.current.updateRows` and `apiRef.current.setRows`.
     * It can be useful if you have a high update rate but do not want to do heavy work like filtering / sorting or rendering on each  individual update.
     * @default 0
     */
    throttleRowsMs: prop_types_1.default.number,
    /**
     * If `true`, the rows will be gathered in a tree structure according to the `getTreeDataPath` prop.
     * @default false
     */
    treeData: prop_types_1.default.bool,
    /**
     * If `true`, the Data Grid enables column virtualization when `getRowHeight` is set to `() => 'auto'`.
     * By default, column virtualization is disabled when dynamic row height is enabled to measure the row height correctly.
     * For datasets with a large number of columns, this can cause performance issues.
     * The downside of enabling this prop is that the row height will be estimated based the cells that are currently rendered, which can cause row height change when scrolling horizontally.
     * @default false
     */
    virtualizeColumnsWithAutoRowHeight: prop_types_1.default.bool,
};
/**
 * Features:
 * - [DataGridPremium](https://mui.com/x/react-data-grid/features/)
 *
 * API:
 * - [DataGridPremium API](https://mui.com/x/api/data-grid/data-grid-premium/)
 */
exports.DataGridPremium = React.memo(DataGridPremiumRaw);
