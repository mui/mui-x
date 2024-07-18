import { ruRU as ruRUCore } from '@mui/material/locale';
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

const ruRUGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Нет строк',
  noResultsOverlayLabel: 'Данные не найдены.',

  // Density selector toolbar button text
  toolbarDensity: 'Высота строки',
  toolbarDensityLabel: 'Высота строки',
  toolbarDensityCompact: 'Компактная',
  toolbarDensityStandard: 'Стандартная',
  toolbarDensityComfortable: 'Комфортная',

  // Columns selector toolbar button text
  toolbarColumns: 'Столбцы',
  toolbarColumnsLabel: 'Выделите столбцы',

  // Filters toolbar button text
  toolbarFilters: 'Фильтры',
  toolbarFiltersLabel: 'Показать фильтры',
  toolbarFiltersTooltipHide: 'Скрыть фильтры',
  toolbarFiltersTooltipShow: 'Показать фильтры',
  toolbarFiltersTooltipActive: (count) =>
    getPluralForm(count, {
      one: 'активный фильтр',
      few: 'активных фильтра',
      many: 'активных фильтров',
    }),

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Поиск…',
  toolbarQuickFilterLabel: 'Поиск',
  toolbarQuickFilterDeleteIconLabel: 'Очистить',

  // Export selector toolbar button text
  toolbarExport: 'Экспорт',
  toolbarExportLabel: 'Экспорт',
  toolbarExportCSV: 'Скачать в формате CSV',
  toolbarExportPrint: 'Печать',
  toolbarExportExcel: 'Скачать в формате Excel',

  // Columns management text
  columnsManagementSearchTitle: 'Поиск',
  columnsManagementNoColumns: 'Нет столбцов',
  columnsManagementShowHideAllText: 'Показать/Скрыть Всё',
  columnsManagementReset: 'Сбросить',

  // Filter panel text
  filterPanelAddFilter: 'Добавить фильтр',
  filterPanelRemoveAll: 'Очистить фильтр',
  filterPanelDeleteIconLabel: 'Удалить',
  filterPanelLogicOperator: 'Логические операторы',
  filterPanelOperator: 'Операторы',
  filterPanelOperatorAnd: 'И',
  filterPanelOperatorOr: 'Или',
  filterPanelColumns: 'Столбцы',
  filterPanelInputLabel: 'Значение',
  filterPanelInputPlaceholder: 'Значение фильтра',

  // Filter operators text
  filterOperatorContains: 'содержит',
  filterOperatorEquals: 'равен',
  filterOperatorStartsWith: 'начинается с',
  filterOperatorEndsWith: 'заканчивается на',
  filterOperatorIs: 'равен',
  filterOperatorNot: 'не равен',
  filterOperatorAfter: 'больше чем',
  filterOperatorOnOrAfter: 'больше или равно',
  filterOperatorBefore: 'меньше чем',
  filterOperatorOnOrBefore: 'меньше или равно',
  filterOperatorIsEmpty: 'пустой',
  filterOperatorIsNotEmpty: 'не пустой',
  filterOperatorIsAnyOf: 'любой из',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'содержит',
  headerFilterOperatorEquals: 'равен',
  headerFilterOperatorStartsWith: 'начинается с',
  headerFilterOperatorEndsWith: 'заканчивается на',
  headerFilterOperatorIs: 'равен',
  headerFilterOperatorNot: 'не равен',
  headerFilterOperatorAfter: 'больше чем',
  headerFilterOperatorOnOrAfter: 'больше или равно',
  headerFilterOperatorBefore: 'меньше чем',
  headerFilterOperatorOnOrBefore: 'меньше или равно',
  headerFilterOperatorIsEmpty: 'пустой',
  headerFilterOperatorIsNotEmpty: 'не пустой',
  headerFilterOperatorIsAnyOf: 'любой из',
  'headerFilterOperator=': 'содержит',
  'headerFilterOperator!=': 'не содержит',
  'headerFilterOperator>': 'больше чем',
  'headerFilterOperator>=': 'больше или равно',
  'headerFilterOperator<': 'меньше чем',
  'headerFilterOperator<=': 'меньше или равно',

  // Filter values text
  filterValueAny: 'любой',
  filterValueTrue: 'истина',
  filterValueFalse: 'ложь',

  // Column menu text
  columnMenuLabel: 'Меню',
  columnMenuShowColumns: 'Показать столбцы',
  columnMenuManageColumns: 'Управление колонками',
  columnMenuFilter: 'Фильтр',
  columnMenuHideColumn: 'Скрыть',
  columnMenuUnsort: 'Отменить сортировку',
  columnMenuSortAsc: 'Сортировать по возрастанию',
  columnMenuSortDesc: 'Сортировать по убыванию',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    getPluralForm(count, {
      one: 'активный фильтр',
      few: 'активных фильтра',
      many: 'активных фильтров',
    }),
  columnHeaderFiltersLabel: 'Показать фильтры',
  columnHeaderSortIconLabel: 'Сортировать',

  // Rows selected footer text
  footerRowSelected: (count) =>
    getPluralForm(count, {
      one: 'строка выбрана',
      few: 'строки выбраны',
      many: 'строк выбрано',
    }),

  // Total row amount footer text
  footerTotalRows: 'Всего строк:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} из ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Выбор флажка',
  checkboxSelectionSelectAllRows: 'Выбрать все строки',
  checkboxSelectionUnselectAllRows: 'Отменить выбор всех строк',
  checkboxSelectionSelectRow: 'Выбрать строку',
  checkboxSelectionUnselectRow: 'Отменить выбор строки',

  // Boolean cell text
  booleanCellTrueLabel: 'истина',
  booleanCellFalseLabel: 'ложь',

  // Actions cell more text
  actionsCellMore: 'ещё',

  // Column pinning text
  pinToLeft: 'Закрепить слева',
  pinToRight: 'Закрепить справа',
  unpin: 'Открепить',

  // Tree Data
  treeDataGroupingHeaderName: 'Группа',
  treeDataExpand: 'показать дочерние элементы',
  treeDataCollapse: 'скрыть дочерние элементы',

  // Grouping columns
  groupingColumnHeaderName: 'Группа',
  groupColumn: (name) => `Сгруппировать по ${name}`,
  unGroupColumn: (name) => `Разгруппировать по ${name}`,

  // Master/detail
  detailPanelToggle: 'Детали',
  expandDetailPanel: 'Развернуть',
  collapseDetailPanel: 'Свернуть',

  // Row reordering text
  rowReorderingHeaderName: 'Изменение порядка строк',

  // Aggregation
  aggregationMenuItemHeader: 'Объединение данных',
  aggregationFunctionLabelSum: 'сумм',
  aggregationFunctionLabelAvg: 'срзнач',
  aggregationFunctionLabelMin: 'мин',
  aggregationFunctionLabelMax: 'макс',
  aggregationFunctionLabelSize: 'счет',
};

export const ruRU: Localization = getGridLocalization(ruRUGrid, ruRUCore);
