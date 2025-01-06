import { beBYCore } from './coreLocales';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

type PluralForm = {
  one: string;
  few: string;
  many: string;
};

const getPluralForm = (count: number, options: PluralForm) => {
  let pluralForm = options.many;
  const lastDigit = count % 10;

  if (lastDigit > 1 && lastDigit < 5 && (count < 10 || count > 20)) {
    pluralForm = options.few;
  } else if (lastDigit === 1 && count % 100 !== 11) {
    pluralForm = options.one;
  }

  return `${count} ${pluralForm}`;
};

const beBYGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Няма радкоў',
  noResultsOverlayLabel: 'Дадзеныя не знойдзены.',

  // Density selector toolbar button text
  toolbarDensity: 'Вышыня радка',
  toolbarDensityLabel: 'Вышыня радка',
  toolbarDensityCompact: 'Кампактны',
  toolbarDensityStandard: 'Стандартны',
  toolbarDensityComfortable: 'Камфортны',

  // Columns selector toolbar button text
  toolbarColumns: 'Слупкі',
  toolbarColumnsLabel: 'Выберыце слупкі',

  // Filters toolbar button text
  toolbarFilters: 'Фільтры',
  toolbarFiltersLabel: 'Паказаць фільтры',
  toolbarFiltersTooltipHide: 'Схаваць фільтры',
  toolbarFiltersTooltipShow: 'Паказаць фільтры',
  toolbarFiltersTooltipActive: (count) =>
    getPluralForm(count, {
      one: 'актыўны фільтр',
      few: 'актыўных фільтра',
      many: 'актыўных фільтраў',
    }),

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Пошук…',
  toolbarQuickFilterLabel: 'Пошук',
  toolbarQuickFilterDeleteIconLabel: 'Ачысціць',

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
  toolbarExport: 'Экспарт',
  toolbarExportLabel: 'Экспарт',
  toolbarExportCSV: 'Спампаваць у фармаце CSV',
  toolbarExportPrint: 'Друк',
  toolbarExportExcel: 'Спампаваць у фармаце Excel',

  // Columns management text
  // columnsManagementSearchTitle: 'Search',
  // columnsManagementNoColumns: 'No columns',
  // columnsManagementShowHideAllText: 'Show/Hide All',
  // columnsManagementReset: 'Reset',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Дадаць фільтр',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'Выдаліць',
  filterPanelLogicOperator: 'Лагічныя аператары',
  filterPanelOperator: 'Аператары',
  filterPanelOperatorAnd: 'І',
  filterPanelOperatorOr: 'Або',
  filterPanelColumns: 'Слупкі',
  filterPanelInputLabel: 'Значэнне',
  filterPanelInputPlaceholder: 'Значэнне фільтра',

  // Filter operators text
  filterOperatorContains: 'змяшчае',
  // filterOperatorDoesNotContain: 'does not contain',
  filterOperatorEquals: 'роўны',
  // filterOperatorDoesNotEqual: 'does not equal',
  filterOperatorStartsWith: 'пачынаецца з',
  filterOperatorEndsWith: 'скончваецца на',
  filterOperatorIs: 'роўны',
  filterOperatorNot: 'не роўны',
  filterOperatorAfter: 'больш чым',
  filterOperatorOnOrAfter: 'больш ці роўны',
  filterOperatorBefore: 'меньш чым',
  filterOperatorOnOrBefore: 'меньш ці роўны',
  filterOperatorIsEmpty: 'пусты',
  filterOperatorIsNotEmpty: 'не пусты',
  filterOperatorIsAnyOf: 'усякі з',
  // 'filterOperator=': '=',
  // 'filterOperator!=': '!=',
  // 'filterOperator>': '>',
  // 'filterOperator>=': '>=',
  // 'filterOperator<': '<',
  // 'filterOperator<=': '<=',

  // Header filter operators text
  // headerFilterOperatorContains: 'Contains',
  // headerFilterOperatorDoesNotContain: 'Does not contain',
  // headerFilterOperatorEquals: 'Equals',
  // headerFilterOperatorDoesNotEqual: 'Does not equal',
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
  filterValueAny: 'усякі',
  filterValueTrue: 'праўда',
  filterValueFalse: 'няпраўда',

  // Column menu text
  columnMenuLabel: 'Меню',
  columnMenuShowColumns: 'Паказаць слупкі',
  columnMenuManageColumns: 'Кіраваць слупкамі',
  columnMenuFilter: 'Фільтр',
  columnMenuHideColumn: 'Схаваць',
  columnMenuUnsort: 'Скасаваць сартыроўку',
  columnMenuSortAsc: 'Сартыраваць па нарастанню',
  columnMenuSortDesc: 'Сартыраваць па спаданню',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    getPluralForm(count, {
      one: 'актыўны фільтр',
      few: 'актыўных фільтра',
      many: 'актыўных фільтраў',
    }),
  columnHeaderFiltersLabel: 'Паказаць фільтры',
  columnHeaderSortIconLabel: 'Сартыраваць',

  // Rows selected footer text
  footerRowSelected: (count) =>
    getPluralForm(count, {
      one: 'абраны радок',
      few: 'абраных радка',
      many: 'абраных радкоў',
    }),

  // Total row amount footer text
  footerTotalRows: 'Усяго радкоў:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} з ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Выбар сцяжка',
  checkboxSelectionSelectAllRows: 'Абраць усе радкі',
  checkboxSelectionUnselectAllRows: 'Скасаваць выбар усіх радкоў',
  checkboxSelectionSelectRow: 'Абраць радок',
  checkboxSelectionUnselectRow: 'Скасаваць выбар радка',

  // Boolean cell text
  booleanCellTrueLabel: 'праўда',
  booleanCellFalseLabel: 'няпраўда',

  // Actions cell more text
  actionsCellMore: 'больш',

  // Column pinning text
  pinToLeft: 'Замацаваць злева',
  pinToRight: 'Замацаваць справа',
  unpin: 'Адмацаваць',

  // Tree Data
  treeDataGroupingHeaderName: 'Група',
  treeDataExpand: 'паказаць даччыныя элементы',
  treeDataCollapse: 'схаваць даччыныя элементы',

  // Grouping columns
  groupingColumnHeaderName: 'Група',
  groupColumn: (name) => `Групаваць па ${name}`,
  unGroupColumn: (name) => `Разгрупаваць па ${name}`,

  // Master/detail
  detailPanelToggle: 'Дэталі',
  expandDetailPanel: 'Разгарнуць',
  collapseDetailPanel: 'Згарнуць',

  // Row reordering text
  rowReorderingHeaderName: 'Змяненне чарговасці радкоў',

  // Aggregation
  aggregationMenuItemHeader: "Аб'яднанне дадзеных",
  aggregationFunctionLabelSum: 'сума',
  aggregationFunctionLabelAvg: 'сярэдняе',
  aggregationFunctionLabelMin: 'мінімум',
  aggregationFunctionLabelMax: 'максімум',
  aggregationFunctionLabelSize: 'памер',
};

export const beBY: Localization = getGridLocalization(beBYGrid, beBYCore);
