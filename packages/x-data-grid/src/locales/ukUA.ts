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
  noColumnsOverlayLabel: 'Немає стовпців',
  noColumnsOverlayManageColumns: 'Керування стовпцями',

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
  toolbarPromptControlPlaceholder: 'Введіть запит…',
  toolbarPromptControlWithRecordingPlaceholder: 'Введіть або запишіть запит…',
  toolbarPromptControlRecordingPlaceholder: 'Прослуховування запиту…',
  toolbarPromptControlLabel: 'Введення запиту',
  toolbarPromptControlRecordButtonDefaultLabel: 'Запис',
  toolbarPromptControlRecordButtonActiveLabel: 'Зупинити запис',
  toolbarPromptControlSendActionLabel: 'Надіслати',
  toolbarPromptControlSendActionAriaLabel: 'Надіслати запит',
  toolbarPromptControlErrorMessage:
    'Сталася помилка під час обробки запиту. Будь ласка, спробуйте ще раз із іншим запитом.',

  // Export selector toolbar button text
  toolbarExport: 'Експорт',
  toolbarExportLabel: 'Експорт',
  toolbarExportCSV: 'Завантажити у форматі CSV',
  toolbarExportPrint: 'Друк',
  toolbarExportExcel: 'Завантажити у форматі Excel',

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
