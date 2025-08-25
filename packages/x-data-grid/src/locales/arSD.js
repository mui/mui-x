"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arSD = void 0;
var getGridLocalization_1 = require("../utils/getGridLocalization");
var arSDGrid = {
    // Root
    noRowsLabel: 'لا توجد صفوف',
    noResultsOverlayLabel: 'لم يتم العثور على نتائج.',
    // noColumnsOverlayLabel: 'No columns',
    // noColumnsOverlayManageColumns: 'Manage columns',
    // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',
    // Density selector toolbar button text
    toolbarDensity: 'الكثافة',
    toolbarDensityLabel: 'الكثافة',
    toolbarDensityCompact: 'مضغوط',
    toolbarDensityStandard: 'قياسي',
    toolbarDensityComfortable: 'مريح',
    // Columns selector toolbar button text
    toolbarColumns: 'الأعمدة',
    toolbarColumnsLabel: 'حدد أعمدة',
    // Filters toolbar button text
    toolbarFilters: 'المُرشِحات',
    toolbarFiltersLabel: 'إظهار المرشِحات',
    toolbarFiltersTooltipHide: 'إخفاء المرشِحات',
    toolbarFiltersTooltipShow: 'اظهر المرشِحات',
    toolbarFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " \u0645\u0646 \u0627\u0644\u0645\u0631\u0634\u0650\u062D\u0627\u062A \u0627\u0644\u0646\u0634\u0637\u0629") : "\u0645\u0631\u0634\u0650\u062D \u0646\u0634\u0637";
    },
    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'بحث...',
    toolbarQuickFilterLabel: 'بحث',
    toolbarQuickFilterDeleteIconLabel: 'أزال',
    // Export selector toolbar button text
    toolbarExport: 'تصدير',
    toolbarExportLabel: 'تصدير',
    toolbarExportCSV: 'تنزيل كملف CSV',
    toolbarExportPrint: 'طباعة',
    toolbarExportExcel: 'تحميل كملف الإكسل',
    // Toolbar pivot button
    // toolbarPivot: 'Pivot',
    // Toolbar AI Assistant button
    // toolbarAssistant: 'AI Assistant',
    // Columns management text
    columnsManagementSearchTitle: 'بحث',
    columnsManagementNoColumns: 'لا يوجد أعمدة',
    columnsManagementShowHideAllText: 'عرض/إخفاء الكل',
    columnsManagementReset: 'إعادة ضبط',
    columnsManagementDeleteIconLabel: 'مسح',
    // Filter panel text
    filterPanelAddFilter: 'إضافة مرشِح',
    filterPanelRemoveAll: 'حذف الكل',
    filterPanelDeleteIconLabel: 'حذف',
    filterPanelLogicOperator: 'عامل منطقي',
    filterPanelOperator: 'عامل',
    filterPanelOperatorAnd: 'و',
    filterPanelOperatorOr: 'أو',
    filterPanelColumns: 'الأعمدة',
    filterPanelInputLabel: 'القيمة',
    filterPanelInputPlaceholder: 'ترشِيح قيمة',
    // Filter operators text
    filterOperatorContains: 'يحتوي',
    // filterOperatorDoesNotContain: 'does not contain',
    filterOperatorEquals: 'يساوي',
    // filterOperatorDoesNotEqual: 'does not equal',
    filterOperatorStartsWith: 'يبدأ بـ',
    filterOperatorEndsWith: 'ينتهي بـ',
    filterOperatorIs: 'يكون',
    filterOperatorNot: 'ليس',
    filterOperatorAfter: 'بعد',
    filterOperatorOnOrAfter: 'عند أو بعد',
    filterOperatorBefore: 'قبل',
    filterOperatorOnOrBefore: 'عند أو قبل',
    filterOperatorIsEmpty: 'خالي',
    filterOperatorIsNotEmpty: 'غير خالي',
    filterOperatorIsAnyOf: 'أي من',
    'filterOperator=': '=',
    'filterOperator!=': '!=',
    'filterOperator>': '>',
    'filterOperator>=': '>=',
    'filterOperator<': '<',
    'filterOperator<=': '<=',
    // Header filter operators text
    headerFilterOperatorContains: 'يحتوي على',
    // headerFilterOperatorDoesNotContain: 'Does not contain',
    headerFilterOperatorEquals: 'يساوي',
    // headerFilterOperatorDoesNotEqual: 'Does not equal',
    headerFilterOperatorStartsWith: 'يبدأ ب',
    headerFilterOperatorEndsWith: 'ينتهي ب',
    headerFilterOperatorIs: 'هو',
    headerFilterOperatorNot: 'هو ليس',
    headerFilterOperatorAfter: 'يقع بعد',
    headerFilterOperatorOnOrAfter: 'هو على او بعد',
    headerFilterOperatorBefore: 'يقع قبل',
    headerFilterOperatorOnOrBefore: 'هو على او بعد',
    headerFilterOperatorIsEmpty: 'هو فارغ',
    headerFilterOperatorIsNotEmpty: 'هو ليس فارغ',
    headerFilterOperatorIsAnyOf: 'هو أي من',
    'headerFilterOperator=': 'يساوي',
    'headerFilterOperator!=': 'لا يساوي',
    'headerFilterOperator>': 'أكبر من',
    'headerFilterOperator>=': 'أكبر من او يساوي',
    'headerFilterOperator<': 'اصغر من',
    'headerFilterOperator<=': 'اصغر من او يساوي',
    // headerFilterClear: 'Clear filter',
    // Filter values text
    filterValueAny: 'أي',
    filterValueTrue: 'صائب',
    filterValueFalse: 'خاطئ',
    // Column menu text
    columnMenuLabel: 'القائمة',
    // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
    columnMenuShowColumns: 'إظهار الأعمدة',
    columnMenuManageColumns: 'إدارة الأعمدة',
    columnMenuFilter: 'المرشِح',
    columnMenuHideColumn: 'إخفاء',
    columnMenuUnsort: 'الغاء الفرز',
    columnMenuSortAsc: 'الفرز تصاعدياً',
    columnMenuSortDesc: 'الفرز تنازلياً',
    // columnMenuManagePivot: 'Manage pivot',
    // Column header text
    columnHeaderFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " \u0645\u0646 \u0627\u0644\u0645\u0631\u0634\u0650\u062D\u0627\u062A \u0627\u0644\u0646\u0634\u0637\u0629") : "\u0645\u0631\u0634\u0650\u062D \u0646\u0634\u0637";
    },
    columnHeaderFiltersLabel: 'إظهار المرشحات',
    columnHeaderSortIconLabel: 'فرز',
    // Rows selected footer text
    footerRowSelected: function (count) {
        return count !== 1 ? "\u062A\u0645 \u062A\u062D\u062F\u064A\u062F ".concat(count.toLocaleString(), " \u0645\u0646 \u0627\u0644\u0635\u0641\u0648\u0641") : "\u062A\u0645 \u062A\u062D\u062F\u064A\u062F \u0635\u0641 \u0648\u0627\u062D\u062F";
    },
    // Total row amount footer text
    footerTotalRows: 'إجمالي الصفوف:',
    // Total visible row amount footer text
    footerTotalVisibleRows: function (visibleCount, totalCount) {
        return "".concat(visibleCount.toLocaleString(), " \u0645\u0646 ").concat(totalCount.toLocaleString());
    },
    // Checkbox selection text
    checkboxSelectionHeaderName: 'تحديد خانة الاختيار',
    checkboxSelectionSelectAllRows: 'تحديد كل الصفوف',
    checkboxSelectionUnselectAllRows: 'الغاء تحديد كل الصفوف',
    checkboxSelectionSelectRow: 'تحديد صف',
    checkboxSelectionUnselectRow: 'الغاء تحديد الصف',
    // Boolean cell text
    booleanCellTrueLabel: 'نعم',
    booleanCellFalseLabel: 'لا',
    // Actions cell more text
    actionsCellMore: 'المزيد',
    // Column pinning text
    pinToLeft: 'التدبيس يميناً',
    pinToRight: 'التدبيس يساراً',
    unpin: 'الغاء التدبيس',
    // Tree Data
    treeDataGroupingHeaderName: 'تجميع',
    treeDataExpand: 'رؤية الأبناء',
    treeDataCollapse: 'إخفاء الأبناء',
    // Grouping columns
    groupingColumnHeaderName: 'تجميع',
    groupColumn: function (name) { return "\u062A\u062C\u0645\u064A\u0639 \u062D\u0633\u0628 ".concat(name); },
    unGroupColumn: function (name) { return "\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062A\u062C\u0645\u064A\u0639 \u062D\u0633\u0628 ".concat(name); },
    // Master/detail
    detailPanelToggle: 'اظهار/اخفاء لوحة التفاصيل',
    expandDetailPanel: 'توسيع',
    collapseDetailPanel: 'طوي',
    // Pagination
    paginationRowsPerPage: 'عدد الصفوف في الصفحة:',
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
            return 'انتقل إلى الصفحة الأولى';
        }
        if (type === 'last') {
            return 'انتقل إلى الصفحة الأخيرة';
        }
        if (type === 'next') {
            return 'انتقل إلى الصفحة التالية';
        }
        // if (type === 'previous') {
        return 'انتقل إلى الصفحة السابقة';
    },
    // Row reordering text
    rowReorderingHeaderName: 'أعادة ترتيب الصفوف',
    // Aggregation
    aggregationMenuItemHeader: 'الدلالات الحسابية',
    aggregationFunctionLabelSum: 'مجموع',
    aggregationFunctionLabelAvg: 'معدل',
    aggregationFunctionLabelMin: 'الحد الادنى',
    aggregationFunctionLabelMax: 'الحد الاقصى',
    aggregationFunctionLabelSize: 'الحجم',
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
exports.arSD = (0, getGridLocalization_1.getGridLocalization)(arSDGrid);
