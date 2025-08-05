import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization } from '../utils/getGridLocalization';

const srLatnGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Nema redova',
  noResultsOverlayLabel: 'Nema rezultata.',
  noColumnsOverlayLabel: 'Nema kolona',
  noColumnsOverlayManageColumns: 'Upravljaj kolonama',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Gustoća',
  toolbarDensityLabel: 'Gustoća',
  toolbarDensityCompact: 'Kompaktno',
  toolbarDensityStandard: 'Standardno',
  toolbarDensityComfortable: 'Udobno',

  // Columns selector toolbar button text
  toolbarColumns: 'Kolone',
  toolbarColumnsLabel: 'Izaberite kolone',

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
  columnsManagementSearchTitle: 'Pretraži',
  columnsManagementNoColumns: 'Nema kolona',
  columnsManagementShowHideAllText: 'Prikaži/Sakrij sve',
  columnsManagementReset: 'Resetuj',
  columnsManagementDeleteIconLabel: 'Obriši',

  // Filter panel text
  filterPanelAddFilter: 'Dodaj filter',
  filterPanelRemoveAll: 'Ukloni sve',
  filterPanelDeleteIconLabel: 'Obriši',
  filterPanelLogicOperator: 'Logički operator',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'I',
  filterPanelOperatorOr: 'Ili',
  filterPanelColumns: 'Kolona',
  filterPanelInputLabel: 'Vrednost',
  filterPanelInputPlaceholder: 'Vrednost filtera',

  // Filter operators text
  filterOperatorContains: 'sadrži',
  filterOperatorDoesNotContain: 'ne sadrži',
  filterOperatorEquals: 'je jednak',
  filterOperatorDoesNotEqual: 'nije jednak',
  filterOperatorStartsWith: 'počinje sa',
  filterOperatorEndsWith: 'završava sa',
  filterOperatorIs: 'je',
  filterOperatorNot: 'nije',
  filterOperatorAfter: 'je posle',
  filterOperatorOnOrAfter: 'je na ili posle',
  filterOperatorBefore: 'je pre',
  filterOperatorOnOrBefore: 'je na ili pre',
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
  headerFilterOperatorAfter: 'Je posle',
  headerFilterOperatorOnOrAfter: 'Je uključeno ili posle',
  headerFilterOperatorBefore: 'Je pre',
  headerFilterOperatorOnOrBefore: 'Je uključeno ili pre',
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
  columnMenuLabel: 'Meni',
  columnMenuAriaLabel: (columnName: string) => `Meni kolona ${columnName}`,
  columnMenuShowColumns: 'Prikaži kolone',
  columnMenuManageColumns: 'Upravljanje kolonama',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Sakrij kolonu',
  columnMenuUnsort: 'Poništi sortiranje',
  columnMenuSortAsc: 'Sortiraj uzlazno',
  columnMenuSortDesc: 'Sortiraj silazno',
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
  columnHeaderSortIconLabel: 'Sortiraj',

  // Rows selected footer text
  footerRowSelected: (count) => {
    if (count === 1) {
      return `Izabran je ${count.toLocaleString()} red`;
    }
    if (count < 5) {
      return `Izabrana su ${count.toLocaleString()} reda`;
    }
    return `Izabrano je ${count.toLocaleString()} redova`;
  },

  // Total row amount footer text
  footerTotalRows: 'Ukupno redova:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} od ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Izbor redova',
  checkboxSelectionSelectAllRows: 'Izaberite sve redove',
  checkboxSelectionUnselectAllRows: 'Poništi izbor svih redova',
  checkboxSelectionSelectRow: 'Izaberite red',
  checkboxSelectionUnselectRow: 'Poništi izbor reda',

  // Boolean cell text
  booleanCellTrueLabel: 'Da',
  booleanCellFalseLabel: 'Ne',

  // Actions cell more text
  actionsCellMore: 'više',

  // Column pinning text
  pinToLeft: 'Zakači levo',
  pinToRight: 'Zakači desno',
  unpin: 'Otkači',

  // Tree Data
  treeDataGroupingHeaderName: 'Grupa',
  treeDataExpand: 'prikaži decu',
  treeDataCollapse: 'sakrij decu',

  // Grouping columns
  groupingColumnHeaderName: 'Grupa',
  groupColumn: (name) => `Grupiši po ${name}`,
  unGroupColumn: (name) => `Prekini grupisanje po ${name}`,

  // Master/detail
  detailPanelToggle: 'Prebacivanje panela sa detaljima',
  expandDetailPanel: 'Proširi',
  collapseDetailPanel: 'Skupi',

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
      return 'Idi na poslednju stranicu';
    }
    if (type === 'next') {
      return 'Idi na sledeću stranicu';
    }
    // if (type === 'previous') {
    return 'Idi na prethodnu stranicu';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Promena redosleda',

  // Aggregation
  aggregationMenuItemHeader: 'Agregacija',
  aggregationFunctionLabelSum: 'iznos',
  aggregationFunctionLabelAvg: 'pros',
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
  aiAssistantSuggestions: 'Predlozi',

  // Prompt field
  promptFieldLabel: 'Upit',
  promptFieldPlaceholder: 'Unesi upit…',
  promptFieldPlaceholderWithRecording: 'Unesi ili snimi upit…',
  promptFieldPlaceholderListening: 'Slušam upit…',
  promptFieldSpeechRecognitionNotSupported: 'Prepoznavanje govora nije podržano u ovom pregledaču',
  promptFieldSend: 'Pošalji',
  promptFieldRecord: 'Snimi',
  promptFieldStopRecording: 'Zaustavi snimanje',

  // Prompt
  promptRerun: 'Probaj ponovo',
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

export const srLatn = getGridLocalization(srLatnGrid);
