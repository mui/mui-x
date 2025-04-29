import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const daDKGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Ingen rækker',
  noResultsOverlayLabel: 'Ingen resultater',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Tæthed',
  toolbarDensityLabel: 'Tæthed',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Luftig',

  // Columns selector toolbar button text
  toolbarColumns: 'Kolonner',
  toolbarColumnsLabel: 'Vælg kolonner',

  // Filters toolbar button text
  toolbarFilters: 'Filtre',
  toolbarFiltersLabel: 'Vis filtre',
  toolbarFiltersTooltipHide: 'Skjul filtre',
  toolbarFiltersTooltipShow: 'Vis filtre',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive filtre` : `${count} aktivt filter`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Søg…',
  toolbarQuickFilterLabel: 'Søg',
  toolbarQuickFilterDeleteIconLabel: 'Ryd',

  // Export selector toolbar button text
  toolbarExport: 'Eksport',
  toolbarExportLabel: 'Eksporter',
  toolbarExportCSV: 'Download som CSV',
  toolbarExportPrint: 'Print',
  toolbarExportExcel: 'Download som Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'Søg',
  columnsManagementNoColumns: 'Ingen søjler',
  columnsManagementShowHideAllText: 'Vis/Skjul Alle',
  columnsManagementReset: 'Nulstil',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Tilføj filter',
  filterPanelRemoveAll: 'Fjern alle',
  filterPanelDeleteIconLabel: 'Slet',
  filterPanelLogicOperator: 'Logisk operator',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'Og',
  filterPanelOperatorOr: 'Eller',
  filterPanelColumns: 'Kolonner',
  filterPanelInputLabel: 'Værdi',
  filterPanelInputPlaceholder: 'Filterværdi',

  // Filter operators text
  filterOperatorContains: 'indeholder',
  filterOperatorDoesNotContain: 'indeholder ikke',
  filterOperatorEquals: 'lig med',
  filterOperatorDoesNotEqual: 'ikke lig med',
  filterOperatorStartsWith: 'begynder med',
  filterOperatorEndsWith: 'ender med',
  filterOperatorIs: 'er lig med',
  filterOperatorNot: 'er ikke lig med',
  filterOperatorAfter: 'efter',
  filterOperatorOnOrAfter: 'på eller efter',
  filterOperatorBefore: 'før',
  filterOperatorOnOrBefore: 'på eller før',
  filterOperatorIsEmpty: 'indeholder ikke data',
  filterOperatorIsNotEmpty: 'indeholder data',
  filterOperatorIsAnyOf: 'indeholder en af',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Indeholder',
  headerFilterOperatorDoesNotContain: 'Indeholder ikke',
  headerFilterOperatorEquals: 'Lig med',
  headerFilterOperatorDoesNotEqual: 'Ikke lig med',
  headerFilterOperatorStartsWith: 'Begynder med',
  headerFilterOperatorEndsWith: 'Ender med',
  headerFilterOperatorIs: 'Er lig med',
  headerFilterOperatorNot: 'Er ikke lig med',
  headerFilterOperatorAfter: 'Efter',
  headerFilterOperatorOnOrAfter: 'På eller efter',
  headerFilterOperatorBefore: 'Før',
  headerFilterOperatorOnOrBefore: 'På eller før',
  headerFilterOperatorIsEmpty: 'Indeholder ikke data',
  headerFilterOperatorIsNotEmpty: 'Indeholder data',
  headerFilterOperatorIsAnyOf: 'Indeholder en af',
  'headerFilterOperator=': 'Lig med',
  'headerFilterOperator!=': 'Ikke lig med',
  'headerFilterOperator>': 'Større end',
  'headerFilterOperator>=': 'Større end eller lig med',
  'headerFilterOperator<': 'Mindre end',
  'headerFilterOperator<=': 'Mindre end eller lig med',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'hvilken som helst',
  filterValueTrue: 'positiv',
  filterValueFalse: 'negativ',

  // Column menu text
  columnMenuLabel: 'Menu',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Vis kolonner',
  columnMenuManageColumns: 'Administrer kolonner',
  columnMenuFilter: 'Filtrer',
  columnMenuHideColumn: 'Skjul kolonne',
  columnMenuUnsort: 'Fjern sortering',
  columnMenuSortAsc: 'Sorter stigende',
  columnMenuSortDesc: 'Sorter faldende',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive filtre` : `Ét aktivt filter`,
  columnHeaderFiltersLabel: 'Vis filtre',
  columnHeaderSortIconLabel: 'Sorter',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `${count.toLocaleString()} rækker valgt` : `Én række valgt`,

  // Total row amount footer text
  footerTotalRows: 'Antal rækker i alt:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} af ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Afkrydsningsvalg',
  checkboxSelectionSelectAllRows: 'Vælg alle rækker',
  checkboxSelectionUnselectAllRows: 'Fravælg alle rækker',
  checkboxSelectionSelectRow: 'Vælg række',
  checkboxSelectionUnselectRow: 'Fravælg række',

  // Boolean cell text
  booleanCellTrueLabel: 'ja',
  booleanCellFalseLabel: 'nej',

  // Actions cell more text
  actionsCellMore: 'mere',

  // Column pinning text
  pinToLeft: 'Fastgør til venstre',
  pinToRight: 'Fastgør til højre',
  unpin: 'Frigiv',

  // Tree Data
  treeDataGroupingHeaderName: 'Gruppe',
  treeDataExpand: 'Vis underelementer',
  treeDataCollapse: 'Skjul underelementer',

  // Grouping columns
  groupingColumnHeaderName: 'Gruppe',
  groupColumn: (name) => `Gruppér efter ${name}`,
  unGroupColumn: (name) => `Fjern gruppering efter ${name}`,

  // Master/detail
  detailPanelToggle: 'Udvid/kollaps detaljepanel',
  expandDetailPanel: 'Udvid',
  collapseDetailPanel: 'Kollaps',

  // Pagination
  paginationRowsPerPage: 'Rækker pr side:',
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
      return 'Gå til den første side';
    }
    if (type === 'last') {
      return 'Gå til den sidste side';
    }
    if (type === 'next') {
      return 'Gå til den næste side';
    }
    // if (type === 'previous') {
    return 'Gå til den forrige side';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Omarrangering af rækker',

  // Aggregation
  aggregationMenuItemHeader: 'Aggregering',
  aggregationFunctionLabelSum: 'sum',
  aggregationFunctionLabelAvg: 'gns',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'størrelse',

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
};

export const daDK: Localization = getGridLocalization(daDKGrid);
