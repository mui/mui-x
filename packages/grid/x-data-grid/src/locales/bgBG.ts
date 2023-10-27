import { bgBG as bgBGCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const bgBGGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Няма редове',
  noResultsOverlayLabel: 'Няма намерени резултати.',

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

  // Columns panel text
  columnsPanelTextFieldLabel: 'Намери колона',
  columnsPanelTextFieldPlaceholder: 'Заглавие на колона',
  columnsPanelDragIconLabel: 'Пренареди на колона',
  columnsPanelShowAllButton: 'Покажи Всички',
  columnsPanelHideAllButton: 'Скрий Всички',

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
  filterOperatorEquals: 'равно',
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
  // 'filterOperator=': '=',
  // 'filterOperator!=': '!=',
  // 'filterOperator>': '>',
  // 'filterOperator>=': '>=',
  // 'filterOperator<': '<',
  // 'filterOperator<=': '<=',

  // Header filter operators text
  // headerFilterOperatorContains: 'Contains',
  // headerFilterOperatorEquals: 'Equals',
  // headerFilterOperatorStartsWith: 'Starts with',
  // headerFilterOperatorEndsWith: 'Ends with',
  // headerFilterOperatorIs: 'Is',
  // headerFilterOperatorNot: 'Is not',
  // headerFilterOperatorAfter: 'Is after',
  // headerFilterOperatorOnOrAfter: 'Is on or after',
  // headerFilterOperatorBefore: 'Is before',
  // headerFilterOperatorOnOrBefore: 'Is on or before',
  // headerFilterOperatorIsEmpty: 'Is empty',
  // headerFilterOperatorIsNotEmpty: 'Is not empty',
  // headerFilterOperatorIsAnyOf: 'Is any of',
  // 'headerFilterOperator=': 'Equals',
  // 'headerFilterOperator!=': 'Not equals',
  // 'headerFilterOperator>': 'Greater than',
  // 'headerFilterOperator>=': 'Greater than or equal to',
  // 'headerFilterOperator<': 'Less than',
  // 'headerFilterOperator<=': 'Less than or equal to',

  // Filter values text
  filterValueAny: 'всякакви',
  filterValueTrue: 'вярно',
  filterValueFalse: 'невярно',

  // Column menu text
  columnMenuLabel: 'Меню',
  columnMenuShowColumns: 'Покажи колоните',
  columnMenuManageColumns: 'Управление на колони',
  columnMenuFilter: 'Филтри',
  columnMenuHideColumn: 'Скрий',
  columnMenuUnsort: 'Отмени сортирането',
  columnMenuSortAsc: 'Сортирай по възходящ ред',
  columnMenuSortDesc: 'Сортирай по низходящ ред',

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
  // detailPanelToggle: 'Detail panel toggle',
  expandDetailPanel: 'Разгъване',
  collapseDetailPanel: 'Свиване',

  // Row reordering text
  rowReorderingHeaderName: 'Подредба на редове',

  // Aggregation
  // aggregationMenuItemHeader: 'Aggregation',
  // aggregationFunctionLabelSum: 'sum',
  // aggregationFunctionLabelAvg: 'avg',
  // aggregationFunctionLabelMin: 'min',
  // aggregationFunctionLabelMax: 'max',
  // aggregationFunctionLabelSize: 'size',
};

export const bgBG: Localization = getGridLocalization(bgBGGrid, bgBGCore);
