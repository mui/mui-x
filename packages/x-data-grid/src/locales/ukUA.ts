import { ukUA as ukUACore } from '@mui/material/locale';
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

  // Prompt toolbar field
  // toolbarPromptControlPlaceholder: 'Type a prompt…',
  // toolbarPromptControlWithRecordingPlaceholder: 'Type or record a prompt…',
  // toolbarPromptControlRecordingPlaceholder: 'Listening for prompt…',
  // toolbarPromptControlLabel: 'Prompt input',
  // toolbarPromptControlRecordButtonDefaultLabel: 'Record',
  // toolbarPromptControlRecordButtonActiveLabel: 'Stop recording',
  // toolbarPromptControlSendActionLabel: 'Send',
  // toolbarPromptControlSendActionAriaLabel: 'Send prompt',
  // toolbarPromptControlErrorMessage: 'An error occurred while processing the request. Please try again with a different prompt.',

  // Export selector toolbar button text
  toolbarExport: 'Експорт',
  toolbarExportLabel: 'Експорт',
  toolbarExportCSV: 'Завантажити у форматі CSV',
  toolbarExportPrint: 'Друк',
  toolbarExportExcel: 'Завантажити у форматі Excel',

  // Columns management text
  // columnsManagementSearchTitle: 'Search',
  // columnsManagementNoColumns: 'No columns',
  // columnsManagementShowHideAllText: 'Show/Hide All',
  // columnsManagementReset: 'Reset',
  // columnsManagementDeleteIconLabel: 'Clear',

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
  // filterOperatorDoesNotContain: 'does not contain',
  filterOperatorEquals: 'дорівнює',
  // filterOperatorDoesNotEqual: 'does not equal',
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
  // headerFilterOperatorDoesNotContain: 'Does not contain',
  headerFilterOperatorEquals: 'Дорівнює',
  // headerFilterOperatorDoesNotEqual: 'Does not equal',
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

  // Filter values text
  filterValueAny: 'будь-який',
  filterValueTrue: 'так',
  filterValueFalse: 'ні',

  // Column menu text
  columnMenuLabel: 'Меню',
  columnMenuShowColumns: 'Показати стовпці',
  columnMenuManageColumns: 'Керування стовпцями',
  columnMenuFilter: 'Фільтр',
  columnMenuHideColumn: 'Приховати',
  columnMenuUnsort: 'Скасувати сортування',
  columnMenuSortAsc: 'Сортувати за зростанням',
  columnMenuSortDesc: 'Сортувати за спаданням',

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

  // Row reordering text
  rowReorderingHeaderName: 'Порядок рядків',

  // Aggregation
  aggregationMenuItemHeader: 'Агрегація',
  aggregationFunctionLabelSum: 'сума',
  aggregationFunctionLabelAvg: 'сер',
  aggregationFunctionLabelMin: 'мін',
  aggregationFunctionLabelMax: 'макс',
  aggregationFunctionLabelSize: 'кількість',
};

export const ukUA: Localization = getGridLocalization(ukUAGrid, ukUACore);
