"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bgBG = void 0;
var getGridLocalization_1 = require("../utils/getGridLocalization");
var bgBGGrid = {
    // Root
    noRowsLabel: 'Няма редове',
    noResultsOverlayLabel: 'Няма намерени резултати.',
    // noColumnsOverlayLabel: 'No columns',
    // noColumnsOverlayManageColumns: 'Manage columns',
    // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',
    // Density selector toolbar button text
    toolbarDensity: 'Гъстота',
    toolbarDensityLabel: 'Гъстота',
    toolbarDensityCompact: 'Компактна',
    toolbarDensityStandard: 'Стандартна',
    toolbarDensityComfortable: 'Комфортна',
    // Columns selector toolbar button text
    toolbarColumns: 'Колони',
    toolbarColumnsLabel: 'Покажи селектора на колони',
    // Filters toolbar button text
    toolbarFilters: 'Филтри',
    toolbarFiltersLabel: 'Покажи Филтрите',
    toolbarFiltersTooltipHide: 'Скрий Филтрите',
    toolbarFiltersTooltipShow: 'Покажи Филтрите',
    toolbarFiltersTooltipActive: function (count) { return "".concat(count, " \u0430\u043A\u0442\u0438\u0432\u043D\u0438 \u0444\u0438\u043B\u0442\u0440\u0438"); },
    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'Търси…',
    toolbarQuickFilterLabel: 'Търсене',
    toolbarQuickFilterDeleteIconLabel: 'Изчисти',
    // Export selector toolbar button text
    toolbarExport: 'Изтегли',
    toolbarExportLabel: 'Изтегли',
    toolbarExportCSV: 'Изтегли като CSV',
    toolbarExportPrint: 'Принтиране',
    toolbarExportExcel: 'Изтегли като Excel',
    // Toolbar pivot button
    // toolbarPivot: 'Pivot',
    // Toolbar AI Assistant button
    // toolbarAssistant: 'AI Assistant',
    // Columns management text
    columnsManagementSearchTitle: 'Търсене',
    columnsManagementNoColumns: 'Няма колони',
    columnsManagementShowHideAllText: 'Покажи/Скрий Всичко',
    columnsManagementReset: 'Нулирай',
    // columnsManagementDeleteIconLabel: 'Clear',
    // Filter panel text
    filterPanelAddFilter: 'Добави Филтър',
    filterPanelRemoveAll: 'Премахни всички',
    filterPanelDeleteIconLabel: 'Изтрий',
    filterPanelLogicOperator: 'Логически оператор',
    filterPanelOperator: 'Оператори',
    filterPanelOperatorAnd: 'И',
    filterPanelOperatorOr: 'Или',
    filterPanelColumns: 'Колони',
    filterPanelInputLabel: 'Стойност',
    filterPanelInputPlaceholder: 'Стойност на филтъра',
    // Filter operators text
    filterOperatorContains: 'съдържа',
    filterOperatorDoesNotContain: 'не съдържа',
    filterOperatorEquals: 'равно',
    filterOperatorDoesNotEqual: 'не е равно',
    filterOperatorStartsWith: 'започва с',
    filterOperatorEndsWith: 'завършва с',
    filterOperatorIs: 'е',
    filterOperatorNot: 'не е',
    filterOperatorAfter: 'е след',
    filterOperatorOnOrAfter: 'е на или след',
    filterOperatorBefore: 'е преди',
    filterOperatorOnOrBefore: 'е на или преди',
    filterOperatorIsEmpty: 'е празен',
    filterOperatorIsNotEmpty: 'не е празен',
    filterOperatorIsAnyOf: 'е някой от',
    'filterOperator=': '=',
    'filterOperator!=': '!=',
    'filterOperator>': '>',
    'filterOperator>=': '>=',
    'filterOperator<': '<',
    'filterOperator<=': '<=',
    // Header filter operators text
    headerFilterOperatorContains: 'Съдържа',
    headerFilterOperatorDoesNotContain: 'Не съдържа',
    headerFilterOperatorEquals: 'Равнo',
    headerFilterOperatorDoesNotEqual: 'Не е равно',
    headerFilterOperatorStartsWith: 'Започва с',
    headerFilterOperatorEndsWith: 'Завършва с',
    headerFilterOperatorIs: 'Равно е на',
    headerFilterOperatorNot: 'Не се равнява на',
    headerFilterOperatorAfter: 'След',
    headerFilterOperatorOnOrAfter: 'След (включително)',
    headerFilterOperatorBefore: 'Преди',
    headerFilterOperatorOnOrBefore: 'Преди (включително)',
    headerFilterOperatorIsEmpty: 'Празен',
    headerFilterOperatorIsNotEmpty: 'Не е празен',
    headerFilterOperatorIsAnyOf: 'Всичко от',
    'headerFilterOperator=': 'Равно',
    'headerFilterOperator!=': 'Различно',
    'headerFilterOperator>': 'По-голямо от',
    'headerFilterOperator>=': 'По-голямо или равно на',
    'headerFilterOperator<': 'По-малко от',
    'headerFilterOperator<=': 'По-малко или равно на',
    // headerFilterClear: 'Clear filter',
    // Filter values text
    filterValueAny: 'всякакви',
    filterValueTrue: 'вярно',
    filterValueFalse: 'невярно',
    // Column menu text
    columnMenuLabel: 'Меню',
    // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
    columnMenuShowColumns: 'Покажи колоните',
    columnMenuManageColumns: 'Управление на колони',
    columnMenuFilter: 'Филтри',
    columnMenuHideColumn: 'Скрий',
    columnMenuUnsort: 'Отмени сортирането',
    columnMenuSortAsc: 'Сортирай по възходящ ред',
    columnMenuSortDesc: 'Сортирай по низходящ ред',
    // columnMenuManagePivot: 'Manage pivot',
    // Column header text
    columnHeaderFiltersTooltipActive: function (count) { return "".concat(count, " \u0430\u043A\u0442\u0438\u0432\u043D\u0438 \u0444\u0438\u043B\u0442\u0440\u0438"); },
    columnHeaderFiltersLabel: 'Покажи Филтрите',
    columnHeaderSortIconLabel: 'Сортирай',
    // Rows selected footer text
    footerRowSelected: function (count) {
        return count !== 1
            ? "".concat(count.toLocaleString(), " \u0438\u0437\u0431\u0440\u0430\u043D\u0438 \u0440\u0435\u0434\u043E\u0432\u0435")
            : "".concat(count.toLocaleString(), " \u0438\u0437\u0431\u0440\u0430\u043D \u0440\u0435\u0434");
    },
    // Total row amount footer text
    footerTotalRows: 'Общо Редове:',
    // Total visible row amount footer text
    footerTotalVisibleRows: function (visibleCount, totalCount) {
        return "".concat(visibleCount.toLocaleString(), " \u043E\u0442 ").concat(totalCount.toLocaleString());
    },
    // Checkbox selection text
    checkboxSelectionHeaderName: 'Избор на квадратче',
    checkboxSelectionSelectAllRows: 'Избери всички редове',
    checkboxSelectionUnselectAllRows: 'Отмени избора на всички редове',
    checkboxSelectionSelectRow: 'Избери ред',
    checkboxSelectionUnselectRow: 'Отмени избора на ред',
    // Boolean cell text
    booleanCellTrueLabel: 'да',
    booleanCellFalseLabel: 'не',
    // Actions cell more text
    actionsCellMore: 'още',
    // Column pinning text
    pinToLeft: 'Закачи в ляво',
    pinToRight: 'Закачи в дясно',
    unpin: 'Откачи',
    // Tree Data
    treeDataGroupingHeaderName: 'Група',
    treeDataExpand: 'виж деца',
    treeDataCollapse: 'скрий децата',
    // Grouping columns
    groupingColumnHeaderName: 'Група',
    groupColumn: function (name) { return "\u0413\u0440\u0443\u043F\u0438\u0440\u0430\u0439 \u043F\u043E ".concat(name); },
    unGroupColumn: function (name) { return "\u0421\u043F\u0440\u0438 \u0433\u0440\u0443\u043F\u0438\u0440\u0430\u043D\u0435 \u043F\u043E ".concat(name); },
    // Master/detail
    detailPanelToggle: 'Превключване на панела с детайли',
    expandDetailPanel: 'Разгъване',
    collapseDetailPanel: 'Свиване',
    // Pagination
    paginationRowsPerPage: 'Редове на страница:',
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
            return 'Отиди на първата страница';
        }
        if (type === 'last') {
            return 'Отиди на последната страница';
        }
        if (type === 'next') {
            return 'Отиди на следващата страница';
        }
        // if (type === 'previous') {
        return 'Отиди на предишната страница';
    },
    // Row reordering text
    rowReorderingHeaderName: 'Подредба на редове',
    // Aggregation
    aggregationMenuItemHeader: 'Агрегиране',
    aggregationFunctionLabelSum: 'сума',
    aggregationFunctionLabelAvg: 'срст',
    aggregationFunctionLabelMin: 'мин',
    aggregationFunctionLabelMax: 'макс',
    aggregationFunctionLabelSize: 'размер',
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
exports.bgBG = (0, getGridLocalization_1.getGridLocalization)(bgBGGrid);
