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
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

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

  // Export selector toolbar button text
  toolbarExport: 'Экспарт',
  toolbarExportLabel: 'Экспарт',
  toolbarExportCSV: 'Спампаваць у фармаце CSV',
  toolbarExportPrint: 'Друк',
  toolbarExportExcel: 'Спампаваць у фармаце Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

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
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'усякі',
  filterValueTrue: 'праўда',
  filterValueFalse: 'няпраўда',

  // Column menu text
  columnMenuLabel: 'Меню',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Паказаць слупкі',
  columnMenuManageColumns: 'Кіраваць слупкамі',
  columnMenuFilter: 'Фільтр',
  columnMenuHideColumn: 'Схаваць',
  columnMenuUnsort: 'Скасаваць сартыроўку',
  columnMenuSortAsc: 'Сартыраваць па нарастанню',
  columnMenuSortDesc: 'Сартыраваць па спаданню',
  // columnMenuManagePivot: 'Manage pivot',

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

  // Pagination
  paginationRowsPerPage: 'Радкоў на старонцы:',
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
      return 'Перайсці на першую старонку';
    }
    if (type === 'last') {
      return 'Перайсці на апошнюю старонку';
    }
    if (type === 'next') {
      return 'Перайсці на наступную старонку';
    }
    // if (type === 'previous') {
    return 'Перайсці на папярэднюю старонку';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Змяненне чарговасці радкоў',

  // Aggregation
  aggregationMenuItemHeader: "Аб'яднанне дадзеных",
  aggregationFunctionLabelSum: 'сума',
  aggregationFunctionLabelAvg: 'сярэдняе',
  aggregationFunctionLabelMin: 'мінімум',
  aggregationFunctionLabelMax: 'максімум',
  aggregationFunctionLabelSize: 'памер',

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
  // promptFieldLabel: 'Prompt',
  // promptFieldPlaceholder: 'Type a prompt…',
  // promptFieldPlaceholderWithRecording: 'Type or record a prompt…',
  // promptFieldPlaceholderListening: 'Listening for prompt…',
  // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  // promptFieldSend: 'Send',
  // promptFieldRecord: 'Record',
  // promptFieldStopRecording: 'Stop recording',

  // Prompt
  // promptProcessingError: 'Could not process prompt',
  // promptRerun: 'Run again',
};

export const beBY: Localization = getGridLocalization(beBYGrid);
