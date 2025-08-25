"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRID_DEFAULT_LOCALE_TEXT = void 0;
exports.GRID_DEFAULT_LOCALE_TEXT = {
    // Root
    noRowsLabel: 'No rows',
    noResultsOverlayLabel: 'No results found.',
    noColumnsOverlayLabel: 'No columns',
    noColumnsOverlayManageColumns: 'Manage columns',
    emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',
    // Density selector toolbar button text
    toolbarDensity: 'Density',
    toolbarDensityLabel: 'Density',
    toolbarDensityCompact: 'Compact',
    toolbarDensityStandard: 'Standard',
    toolbarDensityComfortable: 'Comfortable',
    // Columns selector toolbar button text
    toolbarColumns: 'Columns',
    toolbarColumnsLabel: 'Select columns',
    // Filters toolbar button text
    toolbarFilters: 'Filters',
    toolbarFiltersLabel: 'Show filters',
    toolbarFiltersTooltipHide: 'Hide filters',
    toolbarFiltersTooltipShow: 'Show filters',
    toolbarFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " active filters") : "".concat(count, " active filter");
    },
    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'Search…',
    toolbarQuickFilterLabel: 'Search',
    toolbarQuickFilterDeleteIconLabel: 'Clear',
    // Export selector toolbar button text
    toolbarExport: 'Export',
    toolbarExportLabel: 'Export',
    toolbarExportCSV: 'Download as CSV',
    toolbarExportPrint: 'Print',
    toolbarExportExcel: 'Download as Excel',
    // Toolbar pivot button
    toolbarPivot: 'Pivot',
    // Toolbar AI Assistant button
    toolbarAssistant: 'AI Assistant',
    // Columns management text
    columnsManagementSearchTitle: 'Search',
    columnsManagementNoColumns: 'No columns',
    columnsManagementShowHideAllText: 'Show/Hide All',
    columnsManagementReset: 'Reset',
    columnsManagementDeleteIconLabel: 'Clear',
    // Filter panel text
    filterPanelAddFilter: 'Add filter',
    filterPanelRemoveAll: 'Remove all',
    filterPanelDeleteIconLabel: 'Delete',
    filterPanelLogicOperator: 'Logic operator',
    filterPanelOperator: 'Operator',
    filterPanelOperatorAnd: 'And',
    filterPanelOperatorOr: 'Or',
    filterPanelColumns: 'Columns',
    filterPanelInputLabel: 'Value',
    filterPanelInputPlaceholder: 'Filter value',
    // Filter operators text
    filterOperatorContains: 'contains',
    filterOperatorDoesNotContain: 'does not contain',
    filterOperatorEquals: 'equals',
    filterOperatorDoesNotEqual: 'does not equal',
    filterOperatorStartsWith: 'starts with',
    filterOperatorEndsWith: 'ends with',
    filterOperatorIs: 'is',
    filterOperatorNot: 'is not',
    filterOperatorAfter: 'is after',
    filterOperatorOnOrAfter: 'is on or after',
    filterOperatorBefore: 'is before',
    filterOperatorOnOrBefore: 'is on or before',
    filterOperatorIsEmpty: 'is empty',
    filterOperatorIsNotEmpty: 'is not empty',
    filterOperatorIsAnyOf: 'is any of',
    'filterOperator=': '=',
    'filterOperator!=': '!=',
    'filterOperator>': '>',
    'filterOperator>=': '>=',
    'filterOperator<': '<',
    'filterOperator<=': '<=',
    // Header filter operators text
    headerFilterOperatorContains: 'Contains',
    headerFilterOperatorDoesNotContain: 'Does not contain',
    headerFilterOperatorEquals: 'Equals',
    headerFilterOperatorDoesNotEqual: 'Does not equal',
    headerFilterOperatorStartsWith: 'Starts with',
    headerFilterOperatorEndsWith: 'Ends with',
    headerFilterOperatorIs: 'Is',
    headerFilterOperatorNot: 'Is not',
    headerFilterOperatorAfter: 'Is after',
    headerFilterOperatorOnOrAfter: 'Is on or after',
    headerFilterOperatorBefore: 'Is before',
    headerFilterOperatorOnOrBefore: 'Is on or before',
    headerFilterOperatorIsEmpty: 'Is empty',
    headerFilterOperatorIsNotEmpty: 'Is not empty',
    headerFilterOperatorIsAnyOf: 'Is any of',
    'headerFilterOperator=': 'Equals',
    'headerFilterOperator!=': 'Not equals',
    'headerFilterOperator>': 'Greater than',
    'headerFilterOperator>=': 'Greater than or equal to',
    'headerFilterOperator<': 'Less than',
    'headerFilterOperator<=': 'Less than or equal to',
    headerFilterClear: 'Clear filter',
    // Filter values text
    filterValueAny: 'any',
    filterValueTrue: 'true',
    filterValueFalse: 'false',
    // Column menu text
    columnMenuLabel: 'Menu',
    columnMenuAriaLabel: function (columnName) { return "".concat(columnName, " column menu"); },
    columnMenuShowColumns: 'Show columns',
    columnMenuManageColumns: 'Manage columns',
    columnMenuFilter: 'Filter',
    columnMenuHideColumn: 'Hide column',
    columnMenuUnsort: 'Unsort',
    columnMenuSortAsc: 'Sort by ASC',
    columnMenuSortDesc: 'Sort by DESC',
    columnMenuManagePivot: 'Manage pivot',
    // Column header text
    columnHeaderFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " active filters") : "".concat(count, " active filter");
    },
    columnHeaderFiltersLabel: 'Show filters',
    columnHeaderSortIconLabel: 'Sort',
    // Rows selected footer text
    footerRowSelected: function (count) {
        return count !== 1
            ? "".concat(count.toLocaleString(), " rows selected")
            : "".concat(count.toLocaleString(), " row selected");
    },
    // Total row amount footer text
    footerTotalRows: 'Total Rows:',
    // Total visible row amount footer text
    footerTotalVisibleRows: function (visibleCount, totalCount) {
        return "".concat(visibleCount.toLocaleString(), " of ").concat(totalCount.toLocaleString());
    },
    // Checkbox selection text
    checkboxSelectionHeaderName: 'Checkbox selection',
    checkboxSelectionSelectAllRows: 'Select all rows',
    checkboxSelectionUnselectAllRows: 'Unselect all rows',
    checkboxSelectionSelectRow: 'Select row',
    checkboxSelectionUnselectRow: 'Unselect row',
    // Boolean cell text
    booleanCellTrueLabel: 'yes',
    booleanCellFalseLabel: 'no',
    // Actions cell more text
    actionsCellMore: 'more',
    // Column pinning text
    pinToLeft: 'Pin to left',
    pinToRight: 'Pin to right',
    unpin: 'Unpin',
    // Tree Data
    treeDataGroupingHeaderName: 'Group',
    treeDataExpand: 'see children',
    treeDataCollapse: 'hide children',
    // Grouping columns
    groupingColumnHeaderName: 'Group',
    groupColumn: function (name) { return "Group by ".concat(name); },
    unGroupColumn: function (name) { return "Stop grouping by ".concat(name); },
    // Master/detail
    detailPanelToggle: 'Detail panel toggle',
    expandDetailPanel: 'Expand',
    collapseDetailPanel: 'Collapse',
    // Pagination
    paginationRowsPerPage: 'Rows per page:',
    paginationDisplayedRows: function (_a) {
        var from = _a.from, to = _a.to, count = _a.count, estimated = _a.estimated;
        if (!estimated) {
            return "".concat(from, "\u2013").concat(to, " of ").concat(count !== -1 ? count : "more than ".concat(to));
        }
        var estimatedLabel = estimated && estimated > to ? "around ".concat(estimated) : "more than ".concat(to);
        return "".concat(from, "\u2013").concat(to, " of ").concat(count !== -1 ? count : estimatedLabel);
    },
    paginationItemAriaLabel: function (type) {
        if (type === 'first') {
            return 'Go to first page';
        }
        if (type === 'last') {
            return 'Go to last page';
        }
        if (type === 'next') {
            return 'Go to next page';
        }
        // if (type === 'previous') {
        return 'Go to previous page';
    },
    // Row reordering text
    rowReorderingHeaderName: 'Row reordering',
    // Aggregation
    aggregationMenuItemHeader: 'Aggregation',
    aggregationFunctionLabelSum: 'sum',
    aggregationFunctionLabelAvg: 'avg',
    aggregationFunctionLabelMin: 'min',
    aggregationFunctionLabelMax: 'max',
    aggregationFunctionLabelSize: 'size',
    // Pivot panel
    pivotToggleLabel: 'Pivot',
    pivotRows: 'Rows',
    pivotColumns: 'Columns',
    pivotValues: 'Values',
    pivotCloseButton: 'Close pivot settings',
    pivotSearchButton: 'Search fields',
    pivotSearchControlPlaceholder: 'Search fields',
    pivotSearchControlLabel: 'Search fields',
    pivotSearchControlClear: 'Clear search',
    pivotNoFields: 'No fields',
    pivotMenuMoveUp: 'Move up',
    pivotMenuMoveDown: 'Move down',
    pivotMenuMoveToTop: 'Move to top',
    pivotMenuMoveToBottom: 'Move to bottom',
    pivotMenuRows: 'Rows',
    pivotMenuColumns: 'Columns',
    pivotMenuValues: 'Values',
    pivotMenuOptions: 'Field options',
    pivotMenuAddToRows: 'Add to Rows',
    pivotMenuAddToColumns: 'Add to Columns',
    pivotMenuAddToValues: 'Add to Values',
    pivotMenuRemove: 'Remove',
    pivotDragToRows: 'Drag here to create rows',
    pivotDragToColumns: 'Drag here to create columns',
    pivotDragToValues: 'Drag here to create values',
    pivotYearColumnHeaderName: '(Year)',
    pivotQuarterColumnHeaderName: '(Quarter)',
    // AI Assistant panel
    aiAssistantPanelTitle: 'AI Assistant',
    aiAssistantPanelClose: 'Close AI Assistant',
    aiAssistantPanelNewConversation: 'New conversation',
    aiAssistantPanelConversationHistory: 'Conversation history',
    aiAssistantPanelEmptyConversation: 'No prompt history',
    aiAssistantSuggestions: 'Suggestions',
    // Prompt field
    promptFieldLabel: 'Prompt',
    promptFieldPlaceholder: 'Type a prompt…',
    promptFieldPlaceholderWithRecording: 'Type or record a prompt…',
    promptFieldPlaceholderListening: 'Listening for prompt…',
    promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
    promptFieldSend: 'Send',
    promptFieldRecord: 'Record',
    promptFieldStopRecording: 'Stop recording',
    // Prompt
    promptRerun: 'Run again',
    promptProcessing: 'Processing…',
    promptAppliedChanges: 'Applied changes',
    // Prompt changes
    promptChangeGroupDescription: function (column) { return "Group by ".concat(column); },
    promptChangeAggregationLabel: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeAggregationDescription: function (column, aggregation) {
        return "Aggregate ".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeFilterLabel: function (column, operator, value) {
        if (operator === 'is any of') {
            return "".concat(column, " is any of: ").concat(value);
        }
        return "".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeFilterDescription: function (column, operator, value) {
        if (operator === 'is any of') {
            return "Filter where ".concat(column, " is any of: ").concat(value);
        }
        return "Filter where ".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeSortDescription: function (column, direction) {
        return "Sort by ".concat(column, " (").concat(direction, ")");
    },
    promptChangePivotEnableLabel: 'Pivot',
    promptChangePivotEnableDescription: 'Enable pivot',
    promptChangePivotColumnsLabel: function (count) { return "Columns (".concat(count, ")"); },
    promptChangePivotColumnsDescription: function (column, direction) {
        return "".concat(column).concat(direction ? " (".concat(direction, ")") : '');
    },
    promptChangePivotRowsLabel: function (count) { return "Rows (".concat(count, ")"); },
    promptChangePivotValuesLabel: function (count) { return "Values (".concat(count, ")"); },
    promptChangePivotValuesDescription: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
};
