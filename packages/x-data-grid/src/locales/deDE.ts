import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const deDEGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Keine Einträge',
  noResultsOverlayLabel: 'Keine Ergebnisse gefunden.',
  noColumnsOverlayLabel: 'Keine Spalten',
  noColumnsOverlayManageColumns: 'Spalten verwalten',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Zeilenhöhe',
  toolbarDensityLabel: 'Zeilenhöhe',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Breit',

  // Columns selector toolbar button text
  toolbarColumns: 'Spalten',
  toolbarColumnsLabel: 'Zeige Spaltenauswahl',

  // Filters toolbar button text
  toolbarFilters: 'Filter',
  toolbarFiltersLabel: 'Zeige Filter',
  toolbarFiltersTooltipHide: 'Verberge Filter',
  toolbarFiltersTooltipShow: 'Zeige Filter',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive Filter` : `${count} aktiver Filter`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Suchen…',
  toolbarQuickFilterLabel: 'Suchen',
  toolbarQuickFilterDeleteIconLabel: 'Löschen',

  // Export selector toolbar button text
  toolbarExport: 'Exportieren',
  toolbarExportLabel: 'Exportieren',
  toolbarExportCSV: 'Download als CSV',
  toolbarExportPrint: 'Drucken',
  toolbarExportExcel: 'Download als Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'Suche',
  columnsManagementNoColumns: 'Keine Spalten',
  columnsManagementShowHideAllText: 'Alle anzeigen/verbergen',
  columnsManagementReset: 'Zurücksetzen',
  columnsManagementDeleteIconLabel: 'Löschen',

  // Filter panel text
  filterPanelAddFilter: 'Filter hinzufügen',
  filterPanelRemoveAll: 'Alle entfernen',
  filterPanelDeleteIconLabel: 'Löschen',
  filterPanelLogicOperator: 'Logische Operatoren',
  filterPanelOperator: 'Operatoren',
  filterPanelOperatorAnd: 'Und',
  filterPanelOperatorOr: 'Oder',
  filterPanelColumns: 'Spalten',
  filterPanelInputLabel: 'Wert',
  filterPanelInputPlaceholder: 'Wert filtern',

  // Filter operators text
  filterOperatorContains: 'enthält',
  filterOperatorDoesNotContain: 'enthält nicht',
  filterOperatorEquals: 'ist gleich',
  filterOperatorDoesNotEqual: 'ist ungleich',
  filterOperatorStartsWith: 'beginnt mit',
  filterOperatorEndsWith: 'endet mit',
  filterOperatorIs: 'ist',
  filterOperatorNot: 'ist nicht',
  filterOperatorAfter: 'ist nach',
  filterOperatorOnOrAfter: 'ist am oder nach',
  filterOperatorBefore: 'ist vor',
  filterOperatorOnOrBefore: 'ist am oder vor',
  filterOperatorIsEmpty: 'ist leer',
  filterOperatorIsNotEmpty: 'ist nicht leer',
  filterOperatorIsAnyOf: 'ist einer der Werte',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Enthält',
  headerFilterOperatorDoesNotContain: 'Enthält nicht',
  headerFilterOperatorEquals: 'Gleich',
  headerFilterOperatorDoesNotEqual: 'Ungleich',
  headerFilterOperatorStartsWith: 'Beginnt mit',
  headerFilterOperatorEndsWith: 'Endet mit',
  headerFilterOperatorIs: 'Ist',
  headerFilterOperatorNot: 'Ist nicht',
  headerFilterOperatorAfter: 'Ist nach',
  headerFilterOperatorOnOrAfter: 'Ist am oder nach',
  headerFilterOperatorBefore: 'Ist vor',
  headerFilterOperatorOnOrBefore: 'Ist am oder vor',
  headerFilterOperatorIsEmpty: 'Ist leer',
  headerFilterOperatorIsNotEmpty: 'Ist nicht leer',
  headerFilterOperatorIsAnyOf: 'Ist eines von',
  'headerFilterOperator=': 'Gleich',
  'headerFilterOperator!=': 'Ungleich',
  'headerFilterOperator>': 'Größer als',
  'headerFilterOperator>=': 'Größer als oder gleich',
  'headerFilterOperator<': 'Kleiner als',
  'headerFilterOperator<=': 'Kleiner als oder gleich',
  headerFilterClear: 'Filter löschen',

  // Filter values text
  filterValueAny: 'Beliebig',
  filterValueTrue: 'Ja',
  filterValueFalse: 'Nein',

  // Column menu text
  columnMenuLabel: 'Menü',
  columnMenuAriaLabel: (columnName: string) => `${columnName} Spaltenmenü`,
  columnMenuShowColumns: 'Zeige alle Spalten',
  columnMenuManageColumns: 'Spalten verwalten',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Verbergen',
  columnMenuUnsort: 'Sortierung deaktivieren',
  columnMenuSortAsc: 'Sortiere aufsteigend',
  columnMenuSortDesc: 'Sortiere absteigend',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive Filter` : `${count} aktiver Filter`,
  columnHeaderFiltersLabel: 'Zeige Filter',
  columnHeaderSortIconLabel: 'Sortieren',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} Einträge ausgewählt`
      : `${count.toLocaleString()} Eintrag ausgewählt`,

  // Total row amount footer text
  footerTotalRows: 'Gesamt:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} von ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Checkbox Auswahl',
  checkboxSelectionSelectAllRows: 'Alle Zeilen auswählen',
  checkboxSelectionUnselectAllRows: 'Alle Zeilen abwählen',
  checkboxSelectionSelectRow: 'Zeile auswählen',
  checkboxSelectionUnselectRow: 'Zeile abwählen',

  // Boolean cell text
  booleanCellTrueLabel: 'Ja',
  booleanCellFalseLabel: 'Nein',

  // Actions cell more text
  actionsCellMore: 'Mehr',

  // Column pinning text
  pinToLeft: 'Links anheften',
  pinToRight: 'Rechts anheften',
  unpin: 'Loslösen',

  // Tree Data
  treeDataGroupingHeaderName: 'Gruppe',
  treeDataExpand: 'Kinder einblenden',
  treeDataCollapse: 'Kinder ausblenden',

  // Grouping columns
  groupingColumnHeaderName: 'Gruppierung',
  groupColumn: (name) => `Gruppieren nach ${name}`,
  unGroupColumn: (name) => `Gruppierung nach ${name} aufheben`,

  // Master/detail
  detailPanelToggle: 'Detailansicht Kippschalter',
  expandDetailPanel: 'Aufklappen',
  collapseDetailPanel: 'Zuklappen',

  // Pagination
  paginationRowsPerPage: 'Zeilen pro Seite:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${from}–${to} von ${count !== -1 ? count : `mehr als ${to}`}`;
    }
    const estimatedLabel = estimated && estimated > to ? `ungefähr ${estimated}` : `mehr als ${to}`;
    return `${from}–${to} von ${count !== -1 ? count : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Zur ersten Seite';
    }
    if (type === 'last') {
      return 'Zur letzten Seite';
    }
    if (type === 'next') {
      return 'Zur nächsten Seite';
    }
    // if (type === 'previous') {
    return 'Zur vorherigen Seite';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Reihen neu ordnen',

  // Aggregation
  aggregationMenuItemHeader: 'Aggregation',
  aggregationFunctionLabelSum: 'Summe',
  aggregationFunctionLabelAvg: 'Mittelwert',
  aggregationFunctionLabelMin: 'Minimum',
  aggregationFunctionLabelMax: 'Maximum',
  aggregationFunctionLabelSize: 'Anzahl',

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
  promptFieldLabel: 'Prompteingabe',
  promptFieldPlaceholder: 'Prompt eingeben…',
  promptFieldPlaceholderWithRecording: 'Prompt eingeben oder aufnehmen…',
  promptFieldPlaceholderListening: 'Hört Prompteingabe zu…',
  // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  promptFieldSend: 'Senden',
  promptFieldRecord: 'Aufnahme starten',
  promptFieldStopRecording: 'Aufnahme stoppen',

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

export const deDE: Localization = getGridLocalization(deDEGrid);
