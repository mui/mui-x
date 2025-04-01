import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

type PluralForm = {
  one: string;
  few: string;
  many: string;
};

function getPluralForm(count: number, options: PluralForm) {
  const penultimateDigit = Math.floor(count / 10) % 10;
  const lastDigit = count % 10;

  let pluralForm = options.many;
  if (penultimateDigit !== 1 && lastDigit > 1 && lastDigit < 5) {
    pluralForm = options.few;
  } else if (penultimateDigit !== 1 && lastDigit === 1) {
    pluralForm = options.one;
  }

  return `${count} ${pluralForm}`;
}

const ukUAGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Немає рядків',
  noResultsOverlayLabel: 'Дані не знайдено.',
  noColumnsOverlayLabel: 'Немає стовпців',
  noColumnsOverlayManageColumns: 'Керування стовпцями',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Висота рядка',
  toolbarDensityLabel: 'Висота рядка',
  toolbarDensityCompact: 'Компактний',
  toolbarDensityStandard: 'Стандартний',
  toolbarDensityComfortable: 'Комфортний',

  // Columns selector toolbar button text
  toolbarColumns: 'Стовпці',
  toolbarColumnsLabel: 'Виділіть стовпці',

  // Filters toolbar button text
  toolbarFilters: 'Фільтри',
  toolbarFiltersLabel: 'Показати фільтри',
  toolbarFiltersTooltipHide: 'Приховати фільтри',
  toolbarFiltersTooltipShow: 'Показати фільтри',
  toolbarFiltersTooltipActive: (count) =>
    getPluralForm(count, {
      one: 'активний фільтр',
      few: 'активні фільтри',
      many: 'активних фільтрів',
    }),

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Пошук…',
  toolbarQuickFilterLabel: 'Пошук',
  toolbarQuickFilterDeleteIconLabel: 'Очистити',

  // Export selector toolbar button text
  toolbarExport: 'Експорт',
  toolbarExportLabel: 'Експорт',
  toolbarExportCSV: 'Завантажити у форматі CSV',
  toolbarExportPrint: 'Друк',
  toolbarExportExcel: 'Завантажити у форматі Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'Пошук',
  columnsManagementNoColumns: 'Немає стовпців',
  columnsManagementShowHideAllText: 'Показати/Приховати всі',
  columnsManagementReset: 'Скинути',
  columnsManagementDeleteIconLabel: 'Очистити',

  // Filter panel text
  filterPanelAddFilter: 'Додати фільтр',
  filterPanelRemoveAll: 'Видалити всі',
  filterPanelDeleteIconLabel: 'Видалити',
  filterPanelLogicOperator: 'Логічна функція',
  filterPanelOperator: 'Оператори',
  filterPanelOperatorAnd: 'І',
  filterPanelOperatorOr: 'Або',
  filterPanelColumns: 'Стовпці',
  filterPanelInputLabel: 'Значення',
  filterPanelInputPlaceholder: 'Значення фільтра',

  // Filter operators text
  filterOperatorContains: 'містить',
  filterOperatorDoesNotContain: 'не містить',
  filterOperatorEquals: 'дорівнює',
  filterOperatorDoesNotEqual: 'не дорівнює',
  filterOperatorStartsWith: 'починається з',
  filterOperatorEndsWith: 'закінчується на',
  filterOperatorIs: 'дорівнює',
  filterOperatorNot: 'не дорівнює',
  filterOperatorAfter: 'більше ніж',
  filterOperatorOnOrAfter: 'більше або дорівнює',
  filterOperatorBefore: 'менше ніж',
  filterOperatorOnOrBefore: 'менше або дорівнює',
  filterOperatorIsEmpty: 'порожній',
  filterOperatorIsNotEmpty: 'не порожній',
  filterOperatorIsAnyOf: 'будь-що із',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Містить',
  headerFilterOperatorDoesNotContain: 'Не містить',
  headerFilterOperatorEquals: 'Дорівнює',
  headerFilterOperatorDoesNotEqual: 'Не дорівнює',
  headerFilterOperatorStartsWith: 'Починається з',
  headerFilterOperatorEndsWith: 'Закінчується на',
  headerFilterOperatorIs: 'Дорівнює',
  headerFilterOperatorNot: 'Не дорівнює',
  headerFilterOperatorAfter: 'Після',
  headerFilterOperatorOnOrAfter: 'Після (включаючи)',
  headerFilterOperatorBefore: 'Раніше',
  headerFilterOperatorOnOrBefore: 'Раніше (включаючи)',
  headerFilterOperatorIsEmpty: 'Порожнє',
  headerFilterOperatorIsNotEmpty: 'Не порожнє',
  headerFilterOperatorIsAnyOf: 'Будь-що із',
  'headerFilterOperator=': 'Дорівнює',
  'headerFilterOperator!=': 'Не дорівнює',
  'headerFilterOperator>': 'Більше ніж',
  'headerFilterOperator>=': 'Більше або дорівнює',
  'headerFilterOperator<': 'Менше ніж',
  'headerFilterOperator<=': 'Менше або дорівнює',
  headerFilterClear: 'Очистити фільтр',

  // Filter values text
  filterValueAny: 'будь-який',
  filterValueTrue: 'так',
  filterValueFalse: 'ні',

  // Column menu text
  columnMenuLabel: 'Меню',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Показати стовпці',
  columnMenuManageColumns: 'Керування стовпцями',
  columnMenuFilter: 'Фільтр',
  columnMenuHideColumn: 'Приховати',
  columnMenuUnsort: 'Скасувати сортування',
  columnMenuSortAsc: 'Сортувати за зростанням',
  columnMenuSortDesc: 'Сортувати за спаданням',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    getPluralForm(count, {
      one: 'активний фільтр',
      few: 'активні фільтри',
      many: 'активних фільтрів',
    }),
  columnHeaderFiltersLabel: 'Показати фільтри',
  columnHeaderSortIconLabel: 'Сортувати',

  // Rows selected footer text
  footerRowSelected: (count) =>
    getPluralForm(count, {
      one: 'вибраний рядок',
      few: 'вибрані рядки',
      many: 'вибраних рядків',
    }),

  // Total row amount footer text
  footerTotalRows: 'Усього рядків:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} з ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Вибір прапорця',
  checkboxSelectionSelectAllRows: 'Вибрати всі рядки',
  checkboxSelectionUnselectAllRows: 'Скасувати вибір всіх рядків',
  checkboxSelectionSelectRow: 'Вибрати рядок',
  checkboxSelectionUnselectRow: 'Скасувати вибір рядка',

  // Boolean cell text
  booleanCellTrueLabel: 'так',
  booleanCellFalseLabel: 'ні',

  // Actions cell more text
  actionsCellMore: 'більше',

  // Column pinning text
  pinToLeft: 'Закріпити ліворуч',
  pinToRight: 'Закріпити праворуч',
  unpin: 'Відкріпити',

  // Tree Data
  treeDataGroupingHeaderName: 'Група',
  treeDataExpand: 'показати дочірні елементи',
  treeDataCollapse: 'приховати дочірні елементи',

  // Grouping columns
  groupingColumnHeaderName: 'Група',
  groupColumn: (name) => `Групувати за ${name}`,
  unGroupColumn: (name) => `Відмінити групування за ${name}`,

  // Master/detail
  detailPanelToggle: 'Перемикач панелі деталей',
  expandDetailPanel: 'Показати',
  collapseDetailPanel: 'Приховати',

  // Pagination
  paginationRowsPerPage: 'Рядків на сторінці:',
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
      return 'Перейти на першу сторінку';
    }
    if (type === 'last') {
      return 'Перейти на останню сторінку';
    }
    if (type === 'next') {
      return 'Перейти на наступну сторінку';
    }
    // if (type === 'previous') {
    return 'Перейти на попередню сторінку';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Порядок рядків',

  // Aggregation
  aggregationMenuItemHeader: 'Агрегація',
  aggregationFunctionLabelSum: 'сума',
  aggregationFunctionLabelAvg: 'сер',
  aggregationFunctionLabelMin: 'мін',
  aggregationFunctionLabelMax: 'макс',
  aggregationFunctionLabelSize: 'кількість',

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
  // aiAssistantPanelNoHistory: 'No prompt history',
  // aiAssistantSuggestions: 'Suggestions',

  // Prompt field
  promptFieldLabel: 'Введення запиту',
  promptFieldPlaceholder: 'Введіть запит…',
  promptFieldPlaceholderWithRecording: 'Введіть або запишіть запит…',
  promptFieldPlaceholderListening: 'Прослуховування запиту…',
  // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  promptFieldSend: 'Надіслати',
  promptFieldRecord: 'Запис',
  promptFieldStopRecording: 'Зупинити запис',

  // Prompt
  // promptRerun: 'Run again',
  // promptProcessing: 'Processing…',
  // promptAppliedChanges: 'Applied changes',
};

export const ukUA: Localization = getGridLocalization(ukUAGrid);
