"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bnBD = void 0;
var getGridLocalization_1 = require("../utils/getGridLocalization");
var bnBDGrid = {
    // Root
    noRowsLabel: 'কোনো সারি নেই',
    noResultsOverlayLabel: 'কোনো ফলাফল পাওয়া যায়নি।',
    noColumnsOverlayLabel: 'কোনো কলাম নেই',
    noColumnsOverlayManageColumns: 'কলাম পরিচালনা করুন',
    // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',
    // Density selector toolbar button text
    toolbarDensity: 'ঘনত্ব',
    toolbarDensityLabel: 'ঘনত্ব',
    toolbarDensityCompact: 'সংকুচিত',
    toolbarDensityStandard: 'মানক',
    toolbarDensityComfortable: 'স্বাচ্ছন্দ্যদায়ক',
    // Columns selector toolbar button text
    toolbarColumns: 'কলাম',
    toolbarColumnsLabel: 'কলাম নির্বাচন করুন',
    // Filters toolbar button text
    toolbarFilters: 'ফিল্টার',
    toolbarFiltersLabel: 'ফিল্টার দেখান',
    toolbarFiltersTooltipHide: 'ফিল্টার লুকান',
    toolbarFiltersTooltipShow: 'ফিল্টার দেখান',
    toolbarFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " \u099F\u09BF \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AB\u09BF\u09B2\u09CD\u099F\u09BE\u09B0") : "".concat(count, " \u099F\u09BF \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AB\u09BF\u09B2\u09CD\u099F\u09BE\u09B0");
    },
    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'অনুসন্ধান করুন…',
    toolbarQuickFilterLabel: 'অনুসন্ধান',
    toolbarQuickFilterDeleteIconLabel: 'পরিষ্কার করুন',
    // Export selector toolbar button text
    toolbarExport: 'এক্সপোর্ট',
    toolbarExportLabel: 'এক্সপোর্ট',
    toolbarExportCSV: 'CSV হিসাবে ডাউনলোড করুন',
    toolbarExportPrint: 'প্রিন্ট করুন',
    toolbarExportExcel: 'Excel হিসাবে ডাউনলোড করুন',
    // Toolbar pivot button
    // toolbarPivot: 'Pivot',
    // Toolbar AI Assistant button
    // toolbarAssistant: 'AI Assistant',
    // Columns management text
    columnsManagementSearchTitle: 'অনুসন্ধান',
    columnsManagementNoColumns: 'কোনো কলাম নেই',
    columnsManagementShowHideAllText: 'সব দেখান/লুকান',
    columnsManagementReset: 'রিসেট',
    columnsManagementDeleteIconLabel: 'পরিষ্কার',
    // Filter panel text
    filterPanelAddFilter: 'ফিল্টার যোগ করুন',
    filterPanelRemoveAll: 'সব সরান',
    filterPanelDeleteIconLabel: 'মুছুন',
    filterPanelLogicOperator: 'লজিক অপারেটর',
    filterPanelOperator: 'অপারেটর',
    filterPanelOperatorAnd: 'এবং',
    filterPanelOperatorOr: 'অথবা',
    filterPanelColumns: 'কলাম',
    filterPanelInputLabel: 'মান',
    filterPanelInputPlaceholder: 'ফিল্টার মান',
    // Filter operators text
    filterOperatorContains: 'অন্তর্ভুক্ত',
    filterOperatorDoesNotContain: 'অন্তর্ভুক্ত নয়',
    filterOperatorEquals: 'সমান',
    filterOperatorDoesNotEqual: 'সমান নয়',
    filterOperatorStartsWith: 'দিয়ে শুরু হয়',
    filterOperatorEndsWith: 'দিয়ে শেষ হয়',
    filterOperatorIs: 'হচ্ছে',
    filterOperatorNot: 'হচ্ছে না',
    filterOperatorAfter: 'পরবর্তী',
    filterOperatorOnOrAfter: 'এই তারিখ বা পরবর্তী',
    filterOperatorBefore: 'পূর্ববর্তী',
    filterOperatorOnOrBefore: 'এই তারিখ বা পূর্ববর্তী',
    filterOperatorIsEmpty: 'খালি',
    filterOperatorIsNotEmpty: 'খালি নয়',
    filterOperatorIsAnyOf: 'এর যেকোনো একটি',
    'filterOperator=': '=',
    'filterOperator!=': '!=',
    'filterOperator>': '>',
    'filterOperator>=': '>=',
    'filterOperator<': '<',
    'filterOperator<=': '<=',
    // Header filter operators text
    headerFilterOperatorContains: 'অন্তর্ভুক্ত',
    headerFilterOperatorDoesNotContain: 'অন্তর্ভুক্ত নয়',
    headerFilterOperatorEquals: 'সমান',
    headerFilterOperatorDoesNotEqual: 'সমান নয়',
    headerFilterOperatorStartsWith: 'দিয়ে শুরু হয়',
    headerFilterOperatorEndsWith: 'দিয়ে শেষ হয়',
    headerFilterOperatorIs: 'হচ্ছে',
    headerFilterOperatorNot: 'হচ্ছে না',
    headerFilterOperatorAfter: 'পরবর্তী',
    headerFilterOperatorOnOrAfter: 'এই তারিখ বা পরবর্তী',
    headerFilterOperatorBefore: 'পূর্ববর্তী',
    headerFilterOperatorOnOrBefore: 'এই তারিখ বা পূর্ববর্তী',
    headerFilterOperatorIsEmpty: 'খালি',
    headerFilterOperatorIsNotEmpty: 'খালি নয়',
    headerFilterOperatorIsAnyOf: 'এর যেকোনো একটি',
    'headerFilterOperator=': 'সমান',
    'headerFilterOperator!=': 'সমান নয়',
    'headerFilterOperator>': 'বড়',
    'headerFilterOperator>=': 'বড় বা সমান',
    'headerFilterOperator<': 'ছোট',
    'headerFilterOperator<=': 'ছোট বা সমান',
    headerFilterClear: 'ফিল্টার মুছুন',
    // Filter values text
    filterValueAny: 'যেকোনো',
    filterValueTrue: 'সত্য',
    filterValueFalse: 'মিথ্যা',
    // Column menu text
    columnMenuLabel: 'মেনু',
    // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
    columnMenuShowColumns: 'কলাম দেখান',
    columnMenuManageColumns: 'কলাম পরিচালনা করুন',
    columnMenuFilter: 'ফিল্টার',
    columnMenuHideColumn: 'কলাম লুকান',
    columnMenuUnsort: 'সাজানো বাতিল করুন',
    columnMenuSortAsc: 'ASC অনুযায়ী সাজান',
    columnMenuSortDesc: 'DESC অনুযায়ী সাজান',
    // columnMenuManagePivot: 'Manage pivot',
    // Column header text
    columnHeaderFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " \u099F\u09BF \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AB\u09BF\u09B2\u09CD\u099F\u09BE\u09B0") : "".concat(count, " \u099F\u09BF \u09B8\u0995\u09CD\u09B0\u09BF\u09AF\u09BC \u09AB\u09BF\u09B2\u09CD\u099F\u09BE\u09B0");
    },
    columnHeaderFiltersLabel: 'ফিল্টার দেখান',
    columnHeaderSortIconLabel: 'সাজান',
    // Rows selected footer text
    footerRowSelected: function (count) {
        return count !== 1
            ? "".concat(count.toLocaleString(), " \u099F\u09BF \u09B8\u09BE\u09B0\u09BF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4")
            : "".concat(count.toLocaleString(), " \u099F\u09BF \u09B8\u09BE\u09B0\u09BF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4");
    },
    // Total row amount footer text
    footerTotalRows: 'মোট সারি:',
    // Total visible row amount footer text
    footerTotalVisibleRows: function (visibleCount, totalCount) {
        return "".concat(visibleCount.toLocaleString(), " of ").concat(totalCount.toLocaleString());
    },
    // Checkbox selection text
    checkboxSelectionHeaderName: 'চেকবক্স নির্বাচন',
    checkboxSelectionSelectAllRows: 'সব সারি নির্বাচন করুন',
    checkboxSelectionUnselectAllRows: 'সব সারি নির্বাচন বাতিল করুন',
    checkboxSelectionSelectRow: 'সারি নির্বাচন করুন',
    checkboxSelectionUnselectRow: 'সারি নির্বাচন বাতিল করুন',
    // Boolean cell text
    booleanCellTrueLabel: 'হ্যাঁ',
    booleanCellFalseLabel: 'না',
    // Actions cell more text
    actionsCellMore: 'আরও',
    // Column pinning text
    pinToLeft: 'বাঁ দিকে পিন করুন',
    pinToRight: 'ডান দিকে পিন করুন',
    unpin: 'আনপিন করুন',
    // Tree Data
    treeDataGroupingHeaderName: 'গ্রুপ',
    // treeDataExpand: 'see children',
    // treeDataCollapse: 'hide children',
    // Grouping columns
    groupingColumnHeaderName: 'গ্রুপ',
    groupColumn: function (name) { return "".concat(name, " \u0985\u09A8\u09C1\u09B8\u09BE\u09B0\u09C7 \u0997\u09CD\u09B0\u09C1\u09AA \u0995\u09B0\u09C1\u09A8"); },
    unGroupColumn: function (name) { return "".concat(name, " \u0985\u09A8\u09C1\u09B8\u09BE\u09B0\u09C7 \u0997\u09CD\u09B0\u09C1\u09AA \u09AC\u09A8\u09CD\u09A7 \u0995\u09B0\u09C1\u09A8"); },
    // Master/detail
    detailPanelToggle: 'বিস্তারিত প্যানেল টগল করুন',
    expandDetailPanel: 'সম্প্রসারিত করুন',
    collapseDetailPanel: 'সংকুচিত করুন',
    // Pagination
    paginationRowsPerPage: 'প্রতি পৃষ্ঠায় সারি:',
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
            return 'প্রথম পৃষ্ঠায় যান';
        }
        if (type === 'last') {
            return 'শেষ পৃষ্ঠায় যান';
        }
        if (type === 'next') {
            return 'পরবর্তী পৃষ্ঠায় যান';
        }
        // if (type === 'previous') {
        return 'আগের পৃষ্ঠায় যান';
    },
    // Row reordering text
    rowReorderingHeaderName: 'সারি পুনর্বিন্যাস',
    // Aggregation
    aggregationMenuItemHeader: 'সংকলন',
    aggregationFunctionLabelSum: 'যোগফল',
    aggregationFunctionLabelAvg: 'গড়',
    aggregationFunctionLabelMin: 'সর্বনিম্ন',
    aggregationFunctionLabelMax: 'সর্বোচ্চ',
    aggregationFunctionLabelSize: 'মাপ',
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
    promptFieldLabel: 'প্রম্পট ইনপুট',
    promptFieldPlaceholder: 'একটি প্রম্পট লিখুন…',
    promptFieldPlaceholderWithRecording: 'লিখুন বা রেকর্ড করুন…',
    promptFieldPlaceholderListening: 'শুনছে…',
    // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
    promptFieldSend: 'পাঠান',
    promptFieldRecord: 'রেকর্ড',
    promptFieldStopRecording: 'রেকর্ড বন্ধ করুন',
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
exports.bnBD = (0, getGridLocalization_1.getGridLocalization)(bnBDGrid);
