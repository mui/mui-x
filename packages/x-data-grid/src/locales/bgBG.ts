import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, type Localization } from '../utils/getGridLocalization';

const bgBGGrid: Partial<GridLocaleText> = {
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

  // Undo/redo toolbar button text
  toolbarUndo: 'Отмяна',
  toolbarRedo: 'Повтори',

  // Columns selector toolbar button text
  toolbarColumns: 'Колони',
  toolbarColumnsLabel: 'Покажи селектора на колони',

  // Filters toolbar button text
  toolbarFilters: 'Филтри',
  toolbarFiltersLabel: 'Покажи Филтрите',
  toolbarFiltersTooltipHide: 'Скрий Филтрите',
  toolbarFiltersTooltipShow: 'Покажи Филтрите',
  toolbarFiltersTooltipActive: (count) => `${count} активни филтри`,

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

  // Toolbar charts button
  // toolbarCharts: 'Charts',

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
  // columnMenuManageCharts: 'Manage charts',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} активни филтри`,
  columnHeaderFiltersLabel: 'Покажи Филтрите',
  columnHeaderSortIconLabel: 'Сортирай',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} избрани редове`
      : `${count.toLocaleString()} избран ред`,

  // Total row amount footer text
  footerTotalRows: 'Общо Редове:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} от ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Избор на квадратче',
  checkboxSelectionSelectAllRows: 'Избери всички редове',
  checkboxSelectionUnselectAllRows: 'Отмени избора на всички редове',
  checkboxSelectionSelectRow: 'Избери ред',
  checkboxSelectionUnselectRow: 'Отмени избора на ред',

  // Boolean cell text
  booleanCellTrueLabel: 'да',
  booleanCellFalseLabel: 'не',

  // Long text cell
  longTextCellExpandLabel: 'Разгъване',
  longTextCellCollapseLabel: 'Свиване',

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
  groupColumn: (name) => `Групирай по ${name}`,
  unGroupColumn: (name) => `Спри групиране по ${name}`,

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
  //   const unknownRowCount = count == null || count === -1;
  //   if (!estimated) {
  //     return `${formatNumber(from)}–${formatNumber(to)} of ${!unknownRowCount ? formatNumber(count) : `more than ${formatNumber(to)}`}`;
  //   }
  //   const estimatedLabel = estimated && estimated > to ? `around ${formatNumber(estimated)}` : `more than ${formatNumber(to)}`;
  //   return `${formatNumber(from)}–${formatNumber(to)} of ${!unknownRowCount ? formatNumber(count) : estimatedLabel}`;
  // },
  paginationItemAriaLabel: (type) => {
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
  // aggregationFunctionLabelNone: 'none',
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
  // promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) => `Dimensions (${dimensionsCount}), Values (${valuesCount})`,
};

export const bgBG: Localization = getGridLocalization(bgBGGrid);
