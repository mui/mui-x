import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const itITGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Nessun record',
  noResultsOverlayLabel: 'Nessun record trovato.',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Densità',
  toolbarDensityLabel: 'Densità',
  toolbarDensityCompact: 'Compatta',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Comoda',

  // Columns selector toolbar button text
  toolbarColumns: 'Colonne',
  toolbarColumnsLabel: 'Seleziona le colonne',

  // Filters toolbar button text
  toolbarFilters: 'Filtri',
  toolbarFiltersLabel: 'Mostra i filtri',
  toolbarFiltersTooltipHide: 'Nascondi i filtri',
  toolbarFiltersTooltipShow: 'Mostra i filtri',
  toolbarFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtri attivi` : `${count} filtro attivo`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Cerca…',
  toolbarQuickFilterLabel: 'Cerca',
  toolbarQuickFilterDeleteIconLabel: 'Resetta',

  // Export selector toolbar button text
  toolbarExport: 'Esporta',
  toolbarExportLabel: 'Esporta',
  toolbarExportCSV: 'Esporta in CSV',
  toolbarExportPrint: 'Stampa',
  toolbarExportExcel: 'Scarica come Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'Cerca',
  columnsManagementNoColumns: 'Nessuna colonna',
  columnsManagementShowHideAllText: 'Mostra/Nascondi Tutto',
  columnsManagementReset: 'Resetta',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Aggiungi un filtro',
  filterPanelRemoveAll: 'Rimuovi filtri',
  filterPanelDeleteIconLabel: 'Rimuovi',
  filterPanelLogicOperator: 'Operatore logico',
  filterPanelOperator: 'Operatori',
  filterPanelOperatorAnd: 'E (and)',
  filterPanelOperatorOr: 'O (or)',
  filterPanelColumns: 'Colonne',
  filterPanelInputLabel: 'Valore',
  filterPanelInputPlaceholder: 'Filtra il valore',

  // Filter operators text
  filterOperatorContains: 'contiene',
  filterOperatorDoesNotContain: 'non contiene',
  filterOperatorEquals: 'uguale a',
  filterOperatorDoesNotEqual: 'diverso da',
  filterOperatorStartsWith: 'comincia per',
  filterOperatorEndsWith: 'termina per',
  filterOperatorIs: 'uguale a',
  filterOperatorNot: 'diverso da',
  filterOperatorAfter: 'dopo il',
  filterOperatorOnOrAfter: 'a partire dal',
  filterOperatorBefore: 'prima del',
  filterOperatorOnOrBefore: 'fino al',
  filterOperatorIsEmpty: 'è vuoto',
  filterOperatorIsNotEmpty: 'non è vuoto',
  filterOperatorIsAnyOf: 'è uno tra',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Contiene',
  headerFilterOperatorDoesNotContain: 'Non contiene',
  headerFilterOperatorEquals: 'Uguale a',
  headerFilterOperatorDoesNotEqual: 'Diverso da',
  headerFilterOperatorStartsWith: 'Comincia per',
  headerFilterOperatorEndsWith: 'Termina per',
  headerFilterOperatorIs: 'Uguale a',
  headerFilterOperatorNot: 'Diverso da',
  headerFilterOperatorAfter: 'Dopo il',
  headerFilterOperatorOnOrAfter: 'A partire dal',
  headerFilterOperatorBefore: 'Prima del',
  headerFilterOperatorOnOrBefore: 'Fino al',
  headerFilterOperatorIsEmpty: 'È vuoto',
  headerFilterOperatorIsNotEmpty: 'Non è vuoto',
  headerFilterOperatorIsAnyOf: 'È uno tra',
  'headerFilterOperator=': 'Uguale a',
  'headerFilterOperator!=': 'Diverso da',
  'headerFilterOperator>': 'Maggiore di',
  'headerFilterOperator>=': 'Maggiore o uguale a',
  'headerFilterOperator<': 'Minore di',
  'headerFilterOperator<=': 'Minore o uguale a',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'qualunque',
  filterValueTrue: 'vero',
  filterValueFalse: 'falso',

  // Column menu text
  columnMenuLabel: 'Menu',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Mostra le colonne',
  columnMenuManageColumns: 'Gestisci colonne',
  columnMenuFilter: 'Filtra',
  columnMenuHideColumn: 'Nascondi',
  columnMenuUnsort: "Annulla l'ordinamento",
  columnMenuSortAsc: 'Ordinamento crescente',
  columnMenuSortDesc: 'Ordinamento decrescente',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtri attivi` : `${count} filtro attivo`,
  columnHeaderFiltersLabel: 'Mostra i filtri',
  columnHeaderSortIconLabel: 'Ordina',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count > 1
      ? `${count.toLocaleString()} record selezionati`
      : `${count.toLocaleString()} record selezionato`,

  // Total row amount footer text
  footerTotalRows: 'Record totali:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} di ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Seleziona',
  checkboxSelectionSelectAllRows: 'Seleziona tutte le righe',
  checkboxSelectionUnselectAllRows: 'Deseleziona tutte le righe',
  checkboxSelectionSelectRow: 'Seleziona riga',
  checkboxSelectionUnselectRow: 'Deseleziona riga',

  // Boolean cell text
  booleanCellTrueLabel: 'vero',
  booleanCellFalseLabel: 'falso',

  // Actions cell more text
  actionsCellMore: 'più',

  // Column pinning text
  pinToLeft: 'Blocca a sinistra',
  pinToRight: 'Blocca a destra',
  unpin: 'Sblocca',

  // Tree Data
  treeDataGroupingHeaderName: 'Gruppo',
  treeDataExpand: 'mostra figli',
  treeDataCollapse: 'nascondi figli',

  // Grouping columns
  groupingColumnHeaderName: 'Gruppo',
  groupColumn: (name) => `Raggruppa per ${name}`,
  unGroupColumn: (name) => `Annulla raggruppamento per ${name}`,

  // Master/detail
  detailPanelToggle: 'Abilita pannello dettagli',
  expandDetailPanel: 'Espandi',
  collapseDetailPanel: 'Comprimi',

  // Pagination
  paginationRowsPerPage: 'Righe per pagina:',
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
      return 'Vai alla prima pagina';
    }
    if (type === 'last') {
      return "Vai all'ultima pagina";
    }
    if (type === 'next') {
      return 'Vai alla pagina successiva';
    }
    // if (type === 'previous') {
    return 'Vai alla pagina precedente';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Riordinamento righe',

  // Aggregation
  aggregationMenuItemHeader: 'aggregazione',
  aggregationFunctionLabelSum: 'somma',
  aggregationFunctionLabelAvg: 'media',
  aggregationFunctionLabelMin: 'minimo',
  aggregationFunctionLabelMax: 'massimo',
  aggregationFunctionLabelSize: 'numero di elementi',

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

export const itIT: Localization = getGridLocalization(itITGrid);
