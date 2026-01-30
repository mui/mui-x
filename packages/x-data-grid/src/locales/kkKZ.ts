import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, type Localization } from '../utils/getGridLocalization';

type PluralForm = {
  one: string;
  few: string;
  many: string;
};

// Казахский тілінде сандардан кейін көпше түрі жоқ, бірақ үйлесімділік үшін сақтаймыз
function getPluralForm(count: number, options: PluralForm) {
  // В казахском языке после числительных существительные обычно стоят в единственном числе
  return `${count} ${options.one}`;
}

const kkKZGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Жолдар жоқ',
  noResultsOverlayLabel: 'Деректер табылмады.',
  noColumnsOverlayLabel: 'Бағандар жоқ',
  noColumnsOverlayManageColumns: 'Бағандарды басқару',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Жол биіктігі',
  toolbarDensityLabel: 'Жол биіктігі',
  toolbarDensityCompact: 'Ықшам',
  toolbarDensityStandard: 'Стандартты',
  toolbarDensityComfortable: 'Ыңғайлы',

  // Undo/redo toolbar button text
  toolbarUndo: 'Болдырмау',
  toolbarRedo: 'Қайталау',

  // Columns selector toolbar button text
  toolbarColumns: 'Бағандар',
  toolbarColumnsLabel: 'Бағандарды таңдаңыз',

  // Filters toolbar button text
  toolbarFilters: 'Сүзгілер',
  toolbarFiltersLabel: 'Сүзгілерді көрсету',
  toolbarFiltersTooltipHide: 'Сүзгілерді жасыру',
  toolbarFiltersTooltipShow: 'Сүзгілерді көрсету',
  toolbarFiltersTooltipActive: (count) =>
    getPluralForm(count, {
      one: 'белсенді сүзгі',
      few: 'белсенді сүзгі',
      many: 'белсенді сүзгі',
    }),

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Іздеу…',
  toolbarQuickFilterLabel: 'Іздеу',
  toolbarQuickFilterDeleteIconLabel: 'Тазалау',

  // Export selector toolbar button text
  toolbarExport: 'Экспорттау',
  toolbarExportLabel: 'Экспорттау',
  toolbarExportCSV: 'CSV форматында жүктеу',
  toolbarExportPrint: 'Басып шығару',
  toolbarExportExcel: 'Excel форматында жүктеу',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar charts button
  // toolbarCharts: 'Charts',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'Іздеу',
  columnsManagementNoColumns: 'Бағандар жоқ',
  columnsManagementShowHideAllText: 'Барлығын көрсету/жасыру',
  columnsManagementReset: 'Қалпына келтіру',
  columnsManagementDeleteIconLabel: 'Тазалау',

  // Filter panel text
  filterPanelAddFilter: 'Сүзгі қосу',
  filterPanelRemoveAll: 'Сүзгіні тазалау',
  filterPanelDeleteIconLabel: 'Жою',
  filterPanelLogicOperator: 'Логикалық операторлар',
  filterPanelOperator: 'Операторлар',
  filterPanelOperatorAnd: 'Және',
  filterPanelOperatorOr: 'Немесе',
  filterPanelColumns: 'Бағандар',
  filterPanelInputLabel: 'Мән',
  filterPanelInputPlaceholder: 'Сүзгі мәні',

  // Filter operators text
  filterOperatorContains: 'құрамында бар',
  filterOperatorDoesNotContain: 'құрамында жоқ',
  filterOperatorEquals: 'тең',
  filterOperatorDoesNotEqual: 'тең емес',
  filterOperatorStartsWith: 'басталады',
  filterOperatorEndsWith: 'аяқталады',
  filterOperatorIs: 'тең',
  filterOperatorNot: 'тең емес',
  filterOperatorAfter: 'көп',
  filterOperatorOnOrAfter: 'көп немесе тең',
  filterOperatorBefore: 'аз',
  filterOperatorOnOrBefore: 'аз немесе тең',
  filterOperatorIsEmpty: 'бос',
  filterOperatorIsNotEmpty: 'бос емес',
  filterOperatorIsAnyOf: 'кез келгені',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'құрамында бар',
  headerFilterOperatorDoesNotContain: 'құрамында жоқ',
  headerFilterOperatorEquals: 'тең',
  headerFilterOperatorDoesNotEqual: 'тең емес',
  headerFilterOperatorStartsWith: 'басталады',
  headerFilterOperatorEndsWith: 'аяқталады',
  headerFilterOperatorIs: 'тең',
  headerFilterOperatorNot: 'тең емес',
  headerFilterOperatorAfter: 'көп',
  headerFilterOperatorOnOrAfter: 'көп немесе тең',
  headerFilterOperatorBefore: 'аз',
  headerFilterOperatorOnOrBefore: 'аз немесе тең',
  headerFilterOperatorIsEmpty: 'бос',
  headerFilterOperatorIsNotEmpty: 'бос емес',
  headerFilterOperatorIsAnyOf: 'кез келгені',
  'headerFilterOperator=': 'құрамында бар',
  'headerFilterOperator!=': 'құрамында жоқ',
  'headerFilterOperator>': 'көп',
  'headerFilterOperator>=': 'көп немесе тең',
  'headerFilterOperator<': 'аз',
  'headerFilterOperator<=': 'аз немесе тең',
  headerFilterClear: 'Сүзгіні тазалау',

  // Filter values text
  filterValueAny: 'кез келген',
  filterValueTrue: 'ақиқат',
  filterValueFalse: 'жалған',

  // Column menu text
  columnMenuLabel: 'Мәзір',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} баған мәзірі`,
  columnMenuShowColumns: 'Бағандарды көрсету',
  columnMenuManageColumns: 'Бағандарды басқару',
  columnMenuFilter: 'Сүзгі',
  columnMenuHideColumn: 'Жасыру',
  columnMenuUnsort: 'Сұрыптауды болдырмау',
  columnMenuSortAsc: 'Өсу бойынша сұрыптау',
  columnMenuSortDesc: 'Кему бойынша сұрыптау',
  // columnMenuManagePivot: 'Manage pivot',
  // columnMenuManageCharts: 'Manage charts',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    getPluralForm(count, {
      one: 'белсенді сүзгі',
      few: 'белсенді сүзгі',
      many: 'белсенді сүзгі',
    }),
  columnHeaderFiltersLabel: 'Сүзгілерді көрсету',
  columnHeaderSortIconLabel: 'Сұрыптау',

  // Rows selected footer text
  footerRowSelected: (count) =>
    getPluralForm(count, {
      one: 'жол таңдалды',
      few: 'жол таңдалды',
      many: 'жол таңдалды',
    }),

  // Total row amount footer text
  footerTotalRows: 'Барлық жолдар:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Құсбелгі таңдау',
  checkboxSelectionSelectAllRows: 'Барлық жолдарды таңдау',
  checkboxSelectionUnselectAllRows: 'Барлық жолдардың таңдауын алу',
  checkboxSelectionSelectRow: 'Жолды таңдау',
  checkboxSelectionUnselectRow: 'Жолдың таңдауын алу',

  // Boolean cell text
  booleanCellTrueLabel: 'ақиқат',
  booleanCellFalseLabel: 'жалған',

  // Long text cell
  longTextCellExpandLabel: 'Жаю',
  longTextCellCollapseLabel: 'Жию',

  // Actions cell more text
  actionsCellMore: 'тағы',

  // Column pinning text
  pinToLeft: 'Сол жаққа бекіту',
  pinToRight: 'Оң жаққа бекіту',
  unpin: 'Бекітуді алу',

  // Tree Data
  treeDataGroupingHeaderName: 'Топ',
  treeDataExpand: 'еншілес элементтерді көрсету',
  treeDataCollapse: 'еншілес элементтерді жасыру',

  // Grouping columns
  groupingColumnHeaderName: 'Топ',
  groupColumn: (name) => `${name} бойынша топтау`,
  unGroupColumn: (name) => `${name} бойынша топтауды алу`,

  // Master/detail
  detailPanelToggle: 'Толық ақпарат',
  expandDetailPanel: 'Жаю',
  collapseDetailPanel: 'Жию',

  // Pagination
  paginationRowsPerPage: 'Беттегі жолдар:',
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
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Бірінші бетке өту';
    }
    if (type === 'last') {
      return 'Соңғы бетке өту';
    }
    if (type === 'next') {
      return 'Келесі бетке өту';
    }
    // if (type === 'previous') {
    return 'Алдыңғы бетке өту';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Жолдар ретін өзгерту',

  // Aggregation
  aggregationMenuItemHeader: 'Деректерді біріктіру',
  // aggregationFunctionLabelNone: 'жоқ',
  aggregationFunctionLabelSum: 'сома',
  aggregationFunctionLabelAvg: 'орташа',
  aggregationFunctionLabelMin: 'мин',
  aggregationFunctionLabelMax: 'макс',
  aggregationFunctionLabelSize: 'сан',

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

  // Charts configuration panel
  // chartsNoCharts: 'There are no charts available',
  // chartsChartNotSelected: 'Select a chart type to configure its options',
  // chartsTabChart: 'Chart',
  // chartsTabFields: 'Fields',
  // chartsTabCustomize: 'Customize',
  // chartsCloseButton: 'Close charts configuration',
  // chartsSyncButtonLabel: 'Sync chart',
  // chartsSearchPlaceholder: 'Search fields',
  // chartsSearchLabel: 'Search fields',
  // chartsSearchClear: 'Clear search',
  // chartsNoFields: 'No fields',
  // chartsFieldBlocked: 'This field cannot be added to any section',
  // chartsCategories: 'Categories',
  // chartsSeries: 'Series',
  // chartsMenuAddToDimensions: (dimensionLabel: string) => `Add to ${dimensionLabel}`,
  // chartsMenuAddToValues: (valuesLabel: string) => `Add to ${valuesLabel}`,
  // chartsMenuMoveUp: 'Move up',
  // chartsMenuMoveDown: 'Move down',
  // chartsMenuMoveToTop: 'Move to top',
  // chartsMenuMoveToBottom: 'Move to bottom',
  // chartsMenuOptions: 'Field options',
  // chartsMenuRemove: 'Remove',
  // chartsDragToDimensions: (dimensionLabel: string) => `Drag here to use column as ${dimensionLabel}`,
  // chartsDragToValues: (valuesLabel: string) => `Drag here to use column as ${valuesLabel}`,

  // AI Assistant panel
  // aiAssistantPanelTitle: 'AI Assistant',
  // aiAssistantPanelClose: 'Close AI Assistant',
  // aiAssistantPanelNewConversation: 'New conversation',
  // aiAssistantPanelConversationHistory: 'Conversation history',
  // aiAssistantPanelEmptyConversation: 'No prompt history',
  // aiAssistantSuggestions: 'Suggestions',

  // Prompt field
  promptFieldLabel: 'Сұрауды енгізу',
  promptFieldPlaceholder: 'Сұрауды енгізіңіз…',
  promptFieldPlaceholderWithRecording: 'Сұрауды енгізіңіз немесе жазыңыз…',
  promptFieldPlaceholderListening: 'Сұрауды тыңдау…',
  // promptFieldSpeechRecognitionNotSupported: 'Бұл браузерде сөйлеуді тану қолдау көрсетілмейді',
  promptFieldSend: 'Жіберу',
  promptFieldRecord: 'Жазу',
  promptFieldStopRecording: 'Жазуды тоқтату',

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
  // promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) => `Dimensions (${dimensionsCount}), Values (${valuesCount})`,
};

export const kkKZ: Localization = getGridLocalization(kkKZGrid);