import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization } from '../utils/getGridLocalization';
import type { Localization } from '../utils/getGridLocalization';

const hyAMGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Տվյալներ չկան',
  noResultsOverlayLabel: 'Արդյունքներ չեն գտնվել։',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Խտություն',
  toolbarDensityLabel: 'Խտություն',
  toolbarDensityCompact: 'Կոմպակտ',
  toolbarDensityStandard: 'Ստանդարտ',
  toolbarDensityComfortable: 'Հարմարավետ',

  // Undo/redo toolbar button text
  toolbarUndo: 'Հետսարկել',
  toolbarRedo: 'Կրկնվել',

  // Columns selector toolbar button text
  toolbarColumns: 'Սյունակներ',
  toolbarColumnsLabel: 'Ընտրել սյունակներ',

  // Filters toolbar button text
  toolbarFilters: 'Զտիչներ',
  toolbarFiltersLabel: 'Ցուցադրել զտիչները',
  toolbarFiltersTooltipHide: 'Թաքցնել զտիչները',
  toolbarFiltersTooltipShow: 'Ցուցադրել զտիչները',
  toolbarFiltersTooltipActive: (count) => {
    let pluralForm = 'ակտիվ զտիչ';
    if (count === 1) {
      pluralForm = 'ակտիվ զտիչ';
    } else {
      pluralForm = 'ակտիվ զտիչներ';
    }
    return `${count} ${pluralForm}`;
  },

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Որոնել…',
  toolbarQuickFilterLabel: 'Որոնել',
  toolbarQuickFilterDeleteIconLabel: 'Մաքրել',

  // Export selector toolbar button text
  toolbarExport: 'Արտահանում',
  toolbarExportLabel: 'Արտահանում',
  toolbarExportCSV: 'Ներբեռնել CSV-ով',
  toolbarExportPrint: 'Տպել',
  toolbarExportExcel: 'Ներբեռնել Excel-ով',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar charts button
  // toolbarCharts: 'Charts',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Formula bar (Premium formulas)
  // formulaBarLabel: 'Formula bar',
  // formulaBarInputLabel: 'Formula',
  // formulaBarAddressLabel: 'Active cell',

  // Computed columns (Premium)
  // columnMenuAddComputedColumn: 'Add computed column',
  // columnMenuEditComputedColumn: 'Edit computed column',
  // columnMenuRemoveComputedColumn: 'Remove computed column',
  // toolbarComputedColumns: 'Computed columns',
  // computedColumnsPanelTitle: 'Computed columns',
  // computedColumnsPanelCloseButton: 'Close computed columns panel',
  // computedColumnsPanelBackButton: 'Back to the list',
  // computedColumnsPanelEmpty: 'No computed columns yet',
  // computedColumnsPanelAddButton: 'Add computed column',
  // computedColumnsPanelItemMenuLabel: 'Computed column actions',
  // computedColumnEditorNewTitle: 'New computed column',
  // computedColumnEditorEditTitle: 'Edit computed column',
  // computedColumnNameLabel: 'Name',
  // computedColumnFieldLabel: 'Field',
  // computedColumnFormulaLabel: 'Formula',
  // computedColumnTypeLabel: 'Result type',
  // computedColumnTypeNumber: 'Number',
  // computedColumnTypeString: 'Text',
  // computedColumnTypeBoolean: 'Boolean',
  // computedColumnTypeDate: 'Date',
  // computedColumnTypeDateTime: 'Date and time',
  // computedColumnFormatLabel: 'Format',
  // computedColumnFormatStyleDecimal: 'Number',
  // computedColumnFormatStylePercent: 'Percent',
  // computedColumnFormatStyleCurrency: 'Currency',
  // computedColumnFormatCurrencyLabel: 'Currency code',
  // computedColumnFormatDecimalsLabel: 'Decimals',
  // computedColumnFormatGroupingLabel: 'Thousands separator',
  // computedColumnPreviewLabel: 'Preview',
  // computedColumnPreviewRow: rowIndex => `Row ${rowIndex}`,
  // computedColumnPreviewNoRows: 'No rows to preview',
  // computedColumnReferenceTitle: 'Insert',
  // computedColumnReferenceColumns: 'Columns',
  // computedColumnReferenceFunctions: 'Functions',
  // computedColumnReferenceSearchPlaceholder: 'Search',
  // computedColumnReferenceNoResults: 'No matches',
  // computedColumnApplyButton: 'Apply',
  // computedColumnAddButton: 'Add column',
  // computedColumnCancelButton: 'Cancel',
  // computedColumnDeleteButton: 'Delete column',
  // computedColumnHeaderLabel: 'Computed column',
  // computedColumnHeaderInvalidLabel: 'Computed column with an invalid formula',
  // computedColumnErrorNameRequired: 'Enter a name.',
  // computedColumnErrorFieldRequired: 'Enter a field name.',
  // computedColumnErrorFieldInvalid: 'Use letters, digits and underscores, starting with a letter or an underscore.',
  // computedColumnErrorFieldExists: field => `A column with the field "${field}" already exists.`,
  // computedColumnErrorFieldA1Like: 'This field name reads as a cell address. Choose a longer name.',
  // computedColumnErrorFormulaRequired: 'Enter a formula.',
  // computedColumnErrorParse: message => `Formula error: ${message}`,
  // computedColumnErrorUnknownFunction: name => `Unknown function ${name}.`,
  // computedColumnErrorUnsupportedReference: 'Computed columns can only reference columns of the same row. Use bare field names.',
  // computedColumnErrorUnknownField: field => `Column "${field}" does not exist.`,
  // computedColumnErrorSelfReference: 'A computed column cannot reference itself.',
  // computedColumnErrorCycle: path => `Circular reference: ${path}.`,
  // computedCellErrorDivByZero: 'Division by zero in this row. Wrap the division in IFERROR(…, 0) to provide a fallback.',
  // computedCellErrorValue: 'A value in this row has the wrong type for this operation.',
  // computedCellErrorRef: 'A referenced column does not exist.',
  // computedCellErrorName: 'The formula uses an unknown function.',
  // computedCellErrorCycle: 'The formula depends on itself.',
  // computedCellErrorGeneric: 'The formula could not be evaluated for this row.',

  // Columns management text
  columnsManagementSearchTitle: 'Որոնել',
  columnsManagementNoColumns: 'Սյունակներ չկան',
  columnsManagementShowHideAllText: 'Ցուցադրել/Թաքցնել բոլորը',
  columnsManagementReset: 'Վերակայել',
  columnsManagementDeleteIconLabel: 'Հեռացնել',

  // Filter panel text
  filterPanelAddFilter: 'Ավելացնել զտիչ',
  filterPanelRemoveAll: 'Հեռացնել բոլորը',
  filterPanelDeleteIconLabel: 'Հեռացնել',
  filterPanelLogicOperator: 'Տրամաբանական օպերատոր',
  filterPanelOperator: 'Օպերատոր',
  filterPanelOperatorAnd: 'Եվ',
  filterPanelOperatorOr: 'Կամ',
  filterPanelColumn: 'Սյունակներ',
  filterPanelInputLabel: 'Արժեք',
  filterPanelInputPlaceholder: 'Զտիչի արժեք',

  // Filter operators text
  filterOperatorContains: 'պարունակում է',
  filterOperatorDoesNotContain: 'չի պարունակում',
  filterOperatorEquals: 'հավասար է',
  filterOperatorDoesNotEqual: 'հավասար չէ',
  filterOperatorStartsWith: 'սկսվում է',
  filterOperatorEndsWith: 'վերջանում է',
  filterOperatorIs: 'է',
  filterOperatorNot: 'չէ',
  filterOperatorAfter: 'հետո է',
  filterOperatorOnOrAfter: 'այդ օրը կամ հետո է',
  filterOperatorBefore: 'մինչ է',
  filterOperatorOnOrBefore: 'այդ օրը կամ առաջ է',
  filterOperatorIsEmpty: 'դատարկ է',
  filterOperatorIsNotEmpty: 'դատարկ չէ',
  filterOperatorIsAnyOf: 'որևէ մեկը',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Պարունակում է',
  headerFilterOperatorDoesNotContain: 'Չի պարունակում',
  headerFilterOperatorEquals: 'Հավասար է',
  headerFilterOperatorDoesNotEqual: 'Հավասար չէ',
  headerFilterOperatorStartsWith: 'Սկսվում է',
  headerFilterOperatorEndsWith: 'Վերջանում է',
  headerFilterOperatorIs: 'Է',
  headerFilterOperatorNot: 'Չէ',
  headerFilterOperatorAfter: 'Հետո է',
  headerFilterOperatorOnOrAfter: 'Այդ օրը կամ հետո է',
  headerFilterOperatorBefore: 'Մինչ է',
  headerFilterOperatorOnOrBefore: 'Այդ օրը կամ առաջ է',
  headerFilterOperatorIsEmpty: 'Դատարկ է',
  headerFilterOperatorIsNotEmpty: 'Դատարկ չէ',
  headerFilterOperatorIsAnyOf: 'Որևէ մեկը',
  'headerFilterOperator=': 'Հավասար է',
  'headerFilterOperator!=': 'Հավասար չէ',
  'headerFilterOperator>': 'Ավելի մեծ է',
  'headerFilterOperator>=': 'Ավելի մեծ կամ հավասար է',
  'headerFilterOperator<': 'Ավելի փոքր է',
  'headerFilterOperator<=': 'Ավելի փոքր կամ հավասար է',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'ցանկացած',
  filterValueTrue: 'այո',
  filterValueFalse: 'ոչ',

  // Column menu text
  columnMenuLabel: 'Մենյու',
  columnMenuAriaLabel: (columnName: string) => `${columnName} սյունակի մենյու`,
  columnMenuShowColumns: 'Ցուցադրել սյունակները',
  columnMenuManageColumns: 'Կառավարել սյունակները',
  columnMenuFilter: 'Զտիչ',
  columnMenuHideColumn: 'Թաքցնել',
  columnMenuUnsort: 'Մաքրել դասավորումը',
  columnMenuSortAsc: 'Աճման կարգով դասավորել',
  columnMenuSortDesc: 'Նվազման կարգով դասավորել',
  // columnMenuManagePivot: 'Manage pivot',
  // columnMenuManageCharts: 'Manage charts',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => {
    let pluralForm = 'ակտիվ զտիչներ';
    if (count === 1) {
      pluralForm = 'ակտիվ զտիչ';
    }
    return `${count} ${pluralForm}`;
  },
  columnHeaderFiltersLabel: 'Ցուցադրել զտիչները',
  columnHeaderSortIconLabel: 'Դասավորել',

  // Rows selected footer text
  footerRowSelected: (count) => {
    let pluralForm = 'ընտրված տող';
    if (count === 1) {
      pluralForm = 'ընտրված տող';
    } else {
      pluralForm = 'ընտրված տողեր';
    }
    return `${count} ${pluralForm}`;
  },

  // Total row amount footer text
  footerTotalRows: 'Ընդամենը տողեր:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) => {
    return `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`;
  },

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Տողի ընտրություն',
  checkboxSelectionSelectAllRows: 'Ընտրել բոլոր տողերը',
  checkboxSelectionUnselectAllRows: 'Չընտրել բոլոր տողերը',
  checkboxSelectionSelectRow: 'Ընտրել տողը',
  checkboxSelectionUnselectRow: 'Չընտրել տողը',

  // Boolean cell text
  booleanCellTrueLabel: 'այո',
  booleanCellFalseLabel: 'ոչ',

  // Long text cell
  longTextCellExpandLabel: 'Բացել',
  longTextCellCollapseLabel: 'Փակել',

  // Actions cell more text
  actionsCellMore: 'ավելին',

  // Column pinning text
  pinToLeft: 'Կցել ձախ',
  pinToRight: 'Կցել աջ',
  unpin: 'Անջատել',

  // Tree Data
  treeDataGroupingHeaderName: 'Խումբ',
  treeDataExpand: 'Բացել ենթատողերը',
  treeDataCollapse: 'Փակել ենթատողերը',

  // Grouping columns
  groupingColumnHeaderName: 'Խմբավորում',
  groupColumn: (name) => `Խմբավորել ըստ ${name}`,
  unGroupColumn: (name) => `Չխմբավորել ըստ ${name}`,

  // Master/detail
  detailPanelToggle: 'Փոխարկել մանրամասն տեսքը',
  expandDetailPanel: 'Բացել',
  collapseDetailPanel: 'Փակել',

  // Pagination
  // paginationRowsPerPage: 'Rows per page:',
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
  // paginationItemAriaLabel: type => {
  //   if (type === 'first') {
  //     return 'Go to first page';
  //   }
  //   if (type === 'last') {
  //     return 'Go to last page';
  //   }
  //   if (type === 'next') {
  //     return 'Go to next page';
  //   }
  //   // if (type === 'previous') {
  //   return 'Go to previous page';
  // },

  // Row reordering text
  rowReorderingHeaderName: 'Տողերի վերադասավորում',

  // Aggregation
  aggregationMenuItemHeader: 'Ագրեգացում',
  // aggregationFunctionLabelNone: 'none',
  aggregationFunctionLabelSum: 'գումար',
  aggregationFunctionLabelAvg: 'միջին',
  aggregationFunctionLabelMin: 'մինիմում',
  aggregationFunctionLabelMax: 'մաքսիմում',
  aggregationFunctionLabelSize: 'քանակ',

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

export const hyAM: Localization = getGridLocalization(hyAMGrid);
