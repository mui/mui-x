"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urPK = void 0;
var getGridLocalization_1 = require("../utils/getGridLocalization");
var urPKGrid = {
    // Root
    noRowsLabel: 'کوئی قطاریں نہیں',
    noResultsOverlayLabel: 'کوئی نتائج نہیں',
    // noColumnsOverlayLabel: 'No columns',
    // noColumnsOverlayManageColumns: 'Manage columns',
    // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',
    // Density selector toolbar button text
    toolbarDensity: 'کثافت',
    toolbarDensityLabel: 'کثافت',
    toolbarDensityCompact: 'تنگ',
    toolbarDensityStandard: 'درمیانہ',
    toolbarDensityComfortable: 'مناسب',
    // Columns selector toolbar button text
    toolbarColumns: 'کالمز',
    toolbarColumnsLabel: 'کالمز کو منتخب کریں',
    // Filters toolbar button text
    toolbarFilters: 'فلٹرز',
    toolbarFiltersLabel: 'فلٹرز دکھائیں',
    toolbarFiltersTooltipHide: 'فلٹرز چھپائیں',
    toolbarFiltersTooltipShow: 'فلٹرز دکھائیں',
    toolbarFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " \u0641\u0639\u0627\u0644 \u0641\u0644\u0679\u0631\u0632") : "".concat(count, " \u0641\u0644\u0679\u0631\u0632 \u0641\u0639\u0627\u0644");
    },
    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'تلاش کریں۔۔۔',
    toolbarQuickFilterLabel: 'تلاش کریں',
    toolbarQuickFilterDeleteIconLabel: 'کلئیر کریں',
    // Export selector toolbar button text
    toolbarExport: 'ایکسپورٹ',
    toolbarExportLabel: 'ایکسپورٹ',
    toolbarExportCSV: 'CSV کے طور پر ڈاوٴنلوڈ کریں',
    toolbarExportPrint: 'پرنٹ کریں',
    toolbarExportExcel: 'ایکسل کے طور پر ڈاوٴنلوڈ کریں',
    // Toolbar pivot button
    // toolbarPivot: 'Pivot',
    // Toolbar AI Assistant button
    // toolbarAssistant: 'AI Assistant',
    // Columns management text
    columnsManagementSearchTitle: 'تلاش',
    columnsManagementNoColumns: 'کوئی کالم نہیں',
    columnsManagementShowHideAllText: 'تمام دکھائیں/چھپائیں',
    columnsManagementReset: 'ریسیٹ',
    columnsManagementDeleteIconLabel: 'کلئیر',
    // Filter panel text
    filterPanelAddFilter: 'نیا فلٹر',
    filterPanelRemoveAll: 'سارے ختم کریں',
    filterPanelDeleteIconLabel: 'ختم کریں',
    filterPanelLogicOperator: 'لاجک آپریٹر',
    filterPanelOperator: 'آپریٹر',
    filterPanelOperatorAnd: 'اور',
    filterPanelOperatorOr: 'یا',
    filterPanelColumns: 'کالمز',
    filterPanelInputLabel: 'ویلیو',
    filterPanelInputPlaceholder: 'ویلیو کو فلٹر کریں',
    // Filter operators text
    filterOperatorContains: 'شامل ہے',
    filterOperatorDoesNotContain: 'موجود نہیں ہے',
    filterOperatorEquals: 'برابر ہے',
    filterOperatorDoesNotEqual: 'برابر نہیں ہے',
    filterOperatorStartsWith: 'شروع ہوتا ہے',
    filterOperatorEndsWith: 'ختم ہوتا ہے',
    filterOperatorIs: 'ہے',
    filterOperatorNot: 'نہیں',
    filterOperatorAfter: 'بعد میں ہے',
    filterOperatorOnOrAfter: 'پر یا بعد میں ہے',
    filterOperatorBefore: 'پہلے ہے',
    filterOperatorOnOrBefore: 'پر یا پہلے ہے',
    filterOperatorIsEmpty: 'خالی ہے',
    filterOperatorIsNotEmpty: 'خالی نہیں ہے',
    filterOperatorIsAnyOf: 'ان میں سے کوئی ہے',
    'filterOperator=': '=',
    'filterOperator!=': '!=',
    'filterOperator>': '>',
    'filterOperator>=': '>=',
    'filterOperator<': '<',
    'filterOperator<=': '<=',
    // Header filter operators text
    headerFilterOperatorContains: 'شامل ہے',
    headerFilterOperatorDoesNotContain: 'موجود نہیں ہے',
    headerFilterOperatorEquals: 'برابر ہے',
    headerFilterOperatorDoesNotEqual: 'برابر نہیں ہے',
    headerFilterOperatorStartsWith: 'شروع ہوتا ہے',
    headerFilterOperatorEndsWith: 'ختم ہوتا ہے',
    headerFilterOperatorIs: 'ہے',
    headerFilterOperatorNot: 'نہیں ہے',
    headerFilterOperatorAfter: 'بعد میں ہے',
    headerFilterOperatorOnOrAfter: 'پر یا بعد میں ہے',
    headerFilterOperatorBefore: 'پہلے ہے',
    headerFilterOperatorOnOrBefore: 'پر یا پہلے ہے',
    headerFilterOperatorIsEmpty: 'خالی ہے',
    headerFilterOperatorIsNotEmpty: 'خالی نہیں ہے',
    headerFilterOperatorIsAnyOf: 'ان میں سے کوئی ہے',
    'headerFilterOperator=': 'برابر ہے',
    'headerFilterOperator!=': 'برابر نہیں ہے',
    'headerFilterOperator>': 'ذیادہ ہے',
    'headerFilterOperator>=': 'ذیادہ یا برابر ہے',
    'headerFilterOperator<': 'کم ہے',
    'headerFilterOperator<=': 'کم یا برابر ہے',
    // headerFilterClear: 'Clear filter',
    // Filter values text
    filterValueAny: 'کوئی بھی',
    filterValueTrue: 'صحیح',
    filterValueFalse: 'غلط',
    // Column menu text
    columnMenuLabel: 'مینیو',
    // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
    columnMenuShowColumns: 'کالم دکھائیں',
    columnMenuManageColumns: 'کالم مینج کریں',
    columnMenuFilter: 'فلٹر',
    columnMenuHideColumn: 'چھپائیں',
    columnMenuUnsort: 'sort ختم کریں',
    columnMenuSortAsc: 'ترتیب صعودی',
    columnMenuSortDesc: 'ترتیب نزولی',
    // columnMenuManagePivot: 'Manage pivot',
    // Column header text
    columnHeaderFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " \u0641\u0639\u0627\u0644 \u0641\u0644\u0679\u0631\u0632") : "".concat(count, " \u0641\u0644\u0679\u0631\u0632 \u0641\u0639\u0627\u0644");
    },
    columnHeaderFiltersLabel: 'فلٹرز دکھائیں',
    columnHeaderSortIconLabel: 'Sort',
    // Rows selected footer text
    footerRowSelected: function (count) {
        return count !== 1 ? "".concat(count.toLocaleString(), " \u0645\u0646\u062A\u062E\u0628 \u0642\u0637\u0627\u0631\u06CC\u06BA") : "".concat(count.toLocaleString(), " \u0645\u0646\u062A\u062E\u0628 \u0642\u0637\u0627\u0631");
    },
    // Total row amount footer text
    footerTotalRows: 'کل قطاریں:',
    // Total visible row amount footer text
    footerTotalVisibleRows: function (visibleCount, totalCount) {
        return "".concat(totalCount.toLocaleString(), " \u0645\u06CC\u06BA \u0633\u06D2 ").concat(visibleCount.toLocaleString());
    },
    // Checkbox selection text
    checkboxSelectionHeaderName: 'چیک باکس منتخب کریں',
    checkboxSelectionSelectAllRows: 'تمام قطاریں منتخب کریں',
    checkboxSelectionUnselectAllRows: 'تمام قطاریں نامنتخب کریں ',
    checkboxSelectionSelectRow: 'قطار منتخب کریں',
    checkboxSelectionUnselectRow: 'قطار نامنتخب کریں',
    // Boolean cell text
    booleanCellTrueLabel: 'ہاں',
    booleanCellFalseLabel: 'نہیں',
    // Actions cell more text
    actionsCellMore: 'ذیادہ',
    // Column pinning text
    pinToLeft: 'بائیں جانب pin کریں',
    pinToRight: 'دائیں جانب pin کریں',
    unpin: 'pin ختم کریں',
    // Tree Data
    treeDataGroupingHeaderName: 'گروپ',
    treeDataExpand: 'شاخیں دیکھیں',
    treeDataCollapse: 'شاخیں چھپائیں',
    // Grouping columns
    groupingColumnHeaderName: 'گروپ',
    groupColumn: function (name) { return "".concat(name, " \u0633\u06D2 \u06AF\u0631\u0648\u067E \u06A9\u0631\u06CC\u06BA"); },
    unGroupColumn: function (name) { return "".concat(name, " \u0633\u06D2 \u06AF\u0631\u0648\u067E \u062E\u062A\u0645 \u06A9\u0631\u06CC\u06BA"); },
    // Master/detail
    detailPanelToggle: 'ڈیٹیل پینل کھولیں / بند کریں',
    expandDetailPanel: 'پھیلائیں',
    collapseDetailPanel: 'تنگ کریں',
    // Pagination
    paginationRowsPerPage: 'ایک صفحے پر قطاریں:',
    // paginationDisplayedRows: ({
    //   from,
    //   to,
    //   count,
    //   estimated
    // }) => {
    //   if (!estimated) {
    //     return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
    //   }
    //   const estimatedLabel = estimated && estimated > to ? `around ${estimated}` : `more than ${to}`;
    //   return `${from}–${to} of ${count !== -1 ? count : estimatedLabel}`;
    // },
    paginationItemAriaLabel: function (type) {
        if (type === 'first') {
            return 'پہلے صفحے پر جائیں';
        }
        if (type === 'last') {
            return 'آخری صفحے پر جائیں';
        }
        if (type === 'next') {
            return 'اگلے صفحے پر جائیں';
        }
        // if (type === 'previous') {
        return 'پچھلے صفحے پر جائیں';
    },
    // Row reordering text
    // rowReorderingHeaderName: 'Row reordering',
    // Aggregation
    aggregationMenuItemHeader: 'ایگریگیشن',
    aggregationFunctionLabelSum: 'کل',
    aggregationFunctionLabelAvg: 'اوسط',
    aggregationFunctionLabelMin: 'کم از کم',
    aggregationFunctionLabelMax: 'زیادہ سے زیادہ',
    aggregationFunctionLabelSize: 'سائز',
    // Pivot panel
    // pivotToggleLabel: 'Pivot',
    // pivotRows: 'Rows',
    // pivotColumns: 'Columns',
    // pivotValues: 'Values',
    // pivotCloseButton: 'Close pivot settings',
    // pivotSearchButton: 'Search fields',
    // pivotSearchControlPlaceholder: 'Search fields',
    // pivotSearchControlLabel: 'Search fields',
    // pivotSearchControlClear: 'Clear search',
    // pivotNoFields: 'No fields',
    // pivotMenuMoveUp: 'Move up',
    // pivotMenuMoveDown: 'Move down',
    // pivotMenuMoveToTop: 'Move to top',
    // pivotMenuMoveToBottom: 'Move to bottom',
    // pivotMenuRows: 'Rows',
    // pivotMenuColumns: 'Columns',
    // pivotMenuValues: 'Values',
    // pivotMenuOptions: 'Field options',
    // pivotMenuAddToRows: 'Add to Rows',
    // pivotMenuAddToColumns: 'Add to Columns',
    // pivotMenuAddToValues: 'Add to Values',
    // pivotMenuRemove: 'Remove',
    // pivotDragToRows: 'Drag here to create rows',
    // pivotDragToColumns: 'Drag here to create columns',
    // pivotDragToValues: 'Drag here to create values',
    // pivotYearColumnHeaderName: '(Year)',
    // pivotQuarterColumnHeaderName: '(Quarter)',
    // AI Assistant panel
    // aiAssistantPanelTitle: 'AI Assistant',
    // aiAssistantPanelClose: 'Close AI Assistant',
    // aiAssistantPanelNewConversation: 'New conversation',
    // aiAssistantPanelConversationHistory: 'Conversation history',
    // aiAssistantPanelEmptyConversation: 'No prompt history',
    // aiAssistantSuggestions: 'Suggestions',
    // Prompt field
    // promptFieldLabel: 'Prompt',
    // promptFieldPlaceholder: 'Type a prompt…',
    // promptFieldPlaceholderWithRecording: 'Type or record a prompt…',
    // promptFieldPlaceholderListening: 'Listening for prompt…',
    // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
    // promptFieldSend: 'Send',
    // promptFieldRecord: 'Record',
    // promptFieldStopRecording: 'Stop recording',
    // Prompt
    // promptRerun: 'Run again',
    // promptProcessing: 'Processing…',
    // promptAppliedChanges: 'Applied changes',
    // Prompt changes
    // promptChangeGroupDescription: (column: string) => `Group by ${column}`,
    // promptChangeAggregationLabel: (column: string, aggregation: string) => `${column} (${aggregation})`,
    // promptChangeAggregationDescription: (column: string, aggregation: string) => `Aggregate ${column} (${aggregation})`,
    // promptChangeFilterLabel: (column: string, operator: string, value: string) => {
    //   if (operator === 'is any of') {
    //     return `${column} is any of: ${value}`;
    //   }
    //   return `${column} ${operator} ${value}`;
    // },
    // promptChangeFilterDescription: (column: string, operator: string, value: string) => {
    //   if (operator === 'is any of') {
    //     return `Filter where ${column} is any of: ${value}`;
    //   }
    //   return `Filter where ${column} ${operator} ${value}`;
    // },
    // promptChangeSortDescription: (column: string, direction: string) => `Sort by ${column} (${direction})`,
    // promptChangePivotEnableLabel: 'Pivot',
    // promptChangePivotEnableDescription: 'Enable pivot',
    // promptChangePivotColumnsLabel: (count: number) => `Columns (${count})`,
    // promptChangePivotColumnsDescription: (column: string, direction: string) => `${column}${direction ? ` (${direction})` : ''}`,
    // promptChangePivotRowsLabel: (count: number) => `Rows (${count})`,
    // promptChangePivotValuesLabel: (count: number) => `Values (${count})`,
    // promptChangePivotValuesDescription: (column: string, aggregation: string) => `${column} (${aggregation})`,
};
exports.urPK = (0, getGridLocalization_1.getGridLocalization)(urPKGrid);
