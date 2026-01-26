import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const deDEGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Keine Einträge',
  noResultsOverlayLabel: 'Keine Ergebnisse gefunden.',
  noColumnsOverlayLabel: 'Keine Spalten',
  noColumnsOverlayManageColumns: 'Spalten verwalten',
  emptyPivotOverlayLabel:
    'Felder zu Zeilen, Spalten und Werten hinzufügen, um eine Pivot-Tabelle zu erstellen',

  // Density selector toolbar button text
  toolbarDensity: 'Zeilenhöhe',
  toolbarDensityLabel: 'Zeilenhöhe',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Breit',

  // Undo/redo toolbar button text
  toolbarUndo: 'Rückgängig',
  toolbarRedo: 'Wiederholen',

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
  toolbarPivot: 'Pivot',

  // Toolbar charts button
  // toolbarCharts: 'Charts',

  // Toolbar AI Assistant button
  toolbarAssistant: 'KI-Assistent',

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
  columnMenuManagePivot: 'Pivot verwalten',
  // columnMenuManageCharts: 'Manage charts',

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

  // Long text cell
  // longTextCellExpandLabel: 'Expand',
  // longTextCellCollapseLabel: 'Collapse',

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
  // aggregationFunctionLabelNone: 'none',
  aggregationFunctionLabelSum: 'Summe',
  aggregationFunctionLabelAvg: 'Mittelwert',
  aggregationFunctionLabelMin: 'Minimum',
  aggregationFunctionLabelMax: 'Maximum',
  aggregationFunctionLabelSize: 'Anzahl',

  // Pivot panel
  pivotToggleLabel: 'Pivot',
  pivotRows: 'Zeilen',
  pivotColumns: 'Spalten',
  pivotValues: 'Werte',
  pivotCloseButton: 'Pivot-Einstellungen schließen',
  pivotSearchButton: 'Felder suchen',
  pivotSearchControlPlaceholder: 'Felder suchen',
  pivotSearchControlLabel: 'Felder suchen',
  pivotSearchControlClear: 'Suche löschen',
  pivotNoFields: 'Keine Felder',
  pivotMenuMoveUp: 'Nach oben',
  pivotMenuMoveDown: 'Nach unten',
  pivotMenuMoveToTop: 'An den Anfang',
  pivotMenuMoveToBottom: 'An das Ende',
  pivotMenuRows: 'Zeilen',
  pivotMenuColumns: 'Spalten',
  pivotMenuValues: 'Werte',
  pivotMenuOptions: 'Feldoptionen',
  pivotMenuAddToRows: 'Zu Zeilen hinzufügen',
  pivotMenuAddToColumns: 'Zu Spalten hinzufügen',
  pivotMenuAddToValues: 'Zu Werten hinzufügen',
  pivotMenuRemove: 'Entfernen',
  pivotDragToRows: 'Hier hinziehen, um Zeilen zu erstellen',
  pivotDragToColumns: 'Hier hinziehen, um Spalten zu erstellen',
  pivotDragToValues: 'Hier hinziehen, um Werte zu erstellen',
  pivotYearColumnHeaderName: '(Jahr)',
  pivotQuarterColumnHeaderName: '(Quartal)',

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
  aiAssistantPanelTitle: 'KI-Assistent',
  aiAssistantPanelClose: 'KI-Assistent schließen',
  aiAssistantPanelNewConversation: 'Neue Unterhaltung',
  aiAssistantPanelConversationHistory: 'Unterhaltungsverlauf',
  aiAssistantPanelEmptyConversation: 'Kein Prompt-Verlauf',
  aiAssistantSuggestions: 'Vorschläge',

  // Prompt field
  promptFieldLabel: 'Prompteingabe',
  promptFieldPlaceholder: 'Prompt eingeben…',
  promptFieldPlaceholderWithRecording: 'Prompt eingeben oder aufnehmen…',
  promptFieldPlaceholderListening: 'Hört Prompteingabe zu…',
  promptFieldSpeechRecognitionNotSupported:
    'Spracherkennung wird in diesem Browser nicht unterstützt',
  promptFieldSend: 'Senden',
  promptFieldRecord: 'Aufnahme starten',
  promptFieldStopRecording: 'Aufnahme stoppen',

  // Prompt
  promptRerun: 'Erneut ausführen',
  promptProcessing: 'Verarbeitung…',
  promptAppliedChanges: 'Änderungen angewendet',

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `Gruppieren nach ${column}`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `${column} aggregieren (${aggregation})`,
  promptChangeFilterLabel: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `${column} entspricht einem der Werte: ${value}`;
    }
    return `${column} ${operator} ${value}`;
  },
  promptChangeFilterDescription: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `Filtern, bei dem ${column} einem der folgenden Werte entspricht: ${value}`;
    }
    return `Filtern wo ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `Sortieren nach ${column} (${direction})`,
  promptChangePivotEnableLabel: 'Pivot',
  promptChangePivotEnableDescription: 'Pivot aktivieren',
  promptChangePivotColumnsLabel: (count: number) => `Spalten (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `Zeilen (${count})`,
  promptChangePivotValuesLabel: (count: number) => `Werte (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  // promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) => `Dimensions (${dimensionsCount}), Values (${valuesCount})`,
};

export const deDE: Localization = getGridLocalization(deDEGrid);
