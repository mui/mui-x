import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization } from '../utils/getGridLocalization';

const hrHRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Nema redova',
  noResultsOverlayLabel: 'Nema rezultata.',
  noColumnsOverlayLabel: 'Nema stupaca',
  noColumnsOverlayManageColumns: 'Upravljaj stupcima',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Gustoća',
  toolbarDensityLabel: 'Gustoća',
  toolbarDensityCompact: 'Kompaktno',
  toolbarDensityStandard: 'Standardno',
  toolbarDensityComfortable: 'Udobno',

  // Columns selector toolbar button text
  toolbarColumns: 'Stupci',
  toolbarColumnsLabel: 'Odaberite stupce',

  // Filters toolbar button text
  toolbarFilters: 'Filteri',
  toolbarFiltersLabel: 'Prikaži filtere',
  toolbarFiltersTooltipHide: 'Sakrij filtere',
  toolbarFiltersTooltipShow: 'Prikaži filtere',
  toolbarFiltersTooltipActive: (count) => {
    if (count === 1) {
      return `${count} aktivan filter`;
    }
    if (count < 5) {
      return `${count} aktivna filtera`;
    }
    return `${count} aktivnih filtera`;
  },

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Traži…',
  toolbarQuickFilterLabel: 'traži',
  toolbarQuickFilterDeleteIconLabel: 'Obriši',

  // Export selector toolbar button text
  toolbarExport: 'Izvoz',
  toolbarExportLabel: 'Izvoz',
  toolbarExportCSV: 'Preuzmi kao CSV',
  toolbarExportPrint: 'Štampaj',
  toolbarExportExcel: 'Preuzmi kao Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  toolbarAssistant: 'AI Asistent',

  // Columns management text
  columnsManagementSearchTitle: 'Traži',
  columnsManagementNoColumns: 'Nema stupaca',
  columnsManagementShowHideAllText: 'Prikaži/Sakrij sve',
  columnsManagementReset: 'Ponovno namjesti',
  columnsManagementDeleteIconLabel: 'Obriši',

  // Filter panel text
  filterPanelAddFilter: 'Dodaj filter',
  filterPanelRemoveAll: 'Ukloni sve',
  filterPanelDeleteIconLabel: 'Obriši',
  filterPanelLogicOperator: 'Logički operator',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'I',
  filterPanelOperatorOr: 'Ili',
  filterPanelColumns: 'Stupac',
  filterPanelInputLabel: 'Vrijednost',
  filterPanelInputPlaceholder: 'Vrijednost filtera',

  // Filter operators text
  filterOperatorContains: 'sadrži',
  filterOperatorDoesNotContain: 'ne sadrži',
  filterOperatorEquals: 'je jednak',
  filterOperatorDoesNotEqual: 'nije jednak',
  filterOperatorStartsWith: 'počinje sa',
  filterOperatorEndsWith: 'završava sa',
  filterOperatorIs: 'je',
  filterOperatorNot: 'nije',
  filterOperatorAfter: 'je poslije',
  filterOperatorOnOrAfter: 'je na ili poslije',
  filterOperatorBefore: 'je prije',
  filterOperatorOnOrBefore: 'je na ili prije',
  filterOperatorIsEmpty: 'je prazno',
  filterOperatorIsNotEmpty: 'nije prazno',
  filterOperatorIsAnyOf: 'je bilo koji od',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Sadrži',
  headerFilterOperatorDoesNotContain: 'Ne sadrži',
  headerFilterOperatorEquals: 'Jednako',
  headerFilterOperatorDoesNotEqual: 'Nije jednako',
  headerFilterOperatorStartsWith: 'Počinje sa',
  headerFilterOperatorEndsWith: 'Završava sa',
  headerFilterOperatorIs: 'Je',
  headerFilterOperatorNot: 'Nije',
  headerFilterOperatorAfter: 'Je poslije',
  headerFilterOperatorOnOrAfter: 'Je uključeno ili poslije',
  headerFilterOperatorBefore: 'Je prije',
  headerFilterOperatorOnOrBefore: 'Je uključeno ili prije',
  headerFilterOperatorIsEmpty: 'Je prazno',
  headerFilterOperatorIsNotEmpty: 'Nije prazno',
  headerFilterOperatorIsAnyOf: 'Je bilo koji od',
  'headerFilterOperator=': 'Jednako',
  'headerFilterOperator!=': 'Nije jednako',
  'headerFilterOperator>': 'Veći od',
  'headerFilterOperator>=': 'Veće ili jednako',
  'headerFilterOperator<': 'Manje od',
  'headerFilterOperator<=': 'Manje od ili jednako',
  headerFilterClear: 'Obriši filter',

  // Filter values text
  filterValueAny: 'bilo koji',
  filterValueTrue: 'tačno',
  filterValueFalse: 'netačno',

  // Column menu text
  columnMenuLabel: 'Izbornik',
  columnMenuAriaLabel: (columnName: string) => `Izbornik stupca ${columnName}`,
  columnMenuShowColumns: 'Prikaži stupce',
  columnMenuManageColumns: 'Upravljanje stupcima',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Sakrij stupac',
  columnMenuUnsort: 'Poništi sortiranje',
  columnMenuSortAsc: 'Poredaj uzlazno',
  columnMenuSortDesc: 'Poredaj silazno',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => {
    if (count === 1) {
      return `${count} aktivan filter`;
    }
    if (count < 5) {
      return `${count} aktivna filtera`;
    }
    return `${count} aktivnih filtera`;
  },
  columnHeaderFiltersLabel: 'Prikaži filtere',
  columnHeaderSortIconLabel: 'Poredaj',

  // Rows selected footer text
  footerRowSelected: (count) => {
    if (count === 1) {
      return `Odabran je ${count.toLocaleString()} redak`;
    }
    if (count < 5) {
      return `Odabrana su ${count.toLocaleString()} retka`;
    }
    return `Odabrano je ${count.toLocaleString()} redaka`;
  },

  // Total row amount footer text
  footerTotalRows: 'Ukupno redaka:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} od ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Odabir redaka',
  checkboxSelectionSelectAllRows: 'Odaberite sve retke',
  checkboxSelectionUnselectAllRows: 'Poništi odabir svih redaka',
  checkboxSelectionSelectRow: 'Odaberite redak',
  checkboxSelectionUnselectRow: 'Poništi odabir retka',

  // Boolean cell text
  booleanCellTrueLabel: 'Da',
  booleanCellFalseLabel: 'Ne',

  // Actions cell more text
  actionsCellMore: 'više',

  // Column pinning text
  pinToLeft: 'Prikvači lijevo',
  pinToRight: 'Prikvači desno',
  unpin: 'Otkvači',

  // Tree Data
  treeDataGroupingHeaderName: 'Skupina',
  treeDataExpand: 'vidjeti djecu',
  treeDataCollapse: 'sakriti djecu',

  // Grouping columns
  groupingColumnHeaderName: 'Skupina',
  groupColumn: (name) => `Grupiraj prema ${name}`,
  unGroupColumn: (name) => `Zaustavi grupiranje prema ${name}`,

  // Master/detail
  detailPanelToggle: 'Prebacivanje ploče s detaljima',
  expandDetailPanel: 'Proširiti',
  collapseDetailPanel: 'Skupiti',

  // Pagination
  paginationRowsPerPage: 'Redova po stranici:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${from}–${to} od ${count !== -1 ? count : `više nego ${to}`}`;
    }
    const estimatedLabel = estimated && estimated > to ? `oko ${estimated}` : `više nego ${to}`;
    return `${from}–${to} od ${count !== -1 ? count : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Idi na prvu stranicu';
    }
    if (type === 'last') {
      return 'Idi na posljednju stranicu';
    }
    if (type === 'next') {
      return 'Idi na sljedeću stranicu';
    }
    // if (type === 'previous') {
    return 'Idi na prethodnu stranicu';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Promjena redoslijeda',

  // Aggregation
  aggregationMenuItemHeader: 'Agregacija',
  aggregationFunctionLabelSum: 'iznos',
  aggregationFunctionLabelAvg: 'prosj',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'veličina',

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
  aiAssistantPanelTitle: 'AI Asistent',
  // aiAssistantPanelClose: 'Close AI Assistant',
  // aiAssistantPanelNewConversation: 'New conversation',
  // aiAssistantPanelConversationHistory: 'Conversation history',
  // aiAssistantPanelEmptyConversation: 'No prompt history',
  aiAssistantSuggestions: 'Prijedlozi',

  // Prompt field
  promptFieldLabel: 'Upit',
  promptFieldPlaceholder: 'Unesi upit…',
  promptFieldPlaceholderWithRecording: 'Unesi ili snimi upit…',
  promptFieldPlaceholderListening: 'Slušam upit…',
  promptFieldSpeechRecognitionNotSupported: 'Prepoznavanje govora nije podržana u ovom pregledniku',
  promptFieldSend: 'Pošalji',
  promptFieldRecord: 'Snimi',
  promptFieldStopRecording: 'Zaustavi snimanje',

  // Prompt
  promptRerun: 'Probaj ponovno',
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

export const hrHR = getGridLocalization(hrHRGrid);
