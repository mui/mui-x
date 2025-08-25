"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deDE = void 0;
var getGridLocalization_1 = require("../utils/getGridLocalization");
var deDEGrid = {
    // Root
    noRowsLabel: 'Keine Einträge',
    noResultsOverlayLabel: 'Keine Ergebnisse gefunden.',
    noColumnsOverlayLabel: 'Keine Spalten',
    noColumnsOverlayManageColumns: 'Spalten verwalten',
    emptyPivotOverlayLabel: 'Felder zu Zeilen, Spalten und Werten hinzufügen, um eine Pivot-Tabelle zu erstellen',
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
    toolbarFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " aktive Filter") : "".concat(count, " aktiver Filter");
    },
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
    columnMenuAriaLabel: function (columnName) { return "".concat(columnName, " Spaltenmen\u00FC"); },
    columnMenuShowColumns: 'Zeige alle Spalten',
    columnMenuManageColumns: 'Spalten verwalten',
    columnMenuFilter: 'Filter',
    columnMenuHideColumn: 'Verbergen',
    columnMenuUnsort: 'Sortierung deaktivieren',
    columnMenuSortAsc: 'Sortiere aufsteigend',
    columnMenuSortDesc: 'Sortiere absteigend',
    columnMenuManagePivot: 'Pivot verwalten',
    // Column header text
    columnHeaderFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " aktive Filter") : "".concat(count, " aktiver Filter");
    },
    columnHeaderFiltersLabel: 'Zeige Filter',
    columnHeaderSortIconLabel: 'Sortieren',
    // Rows selected footer text
    footerRowSelected: function (count) {
        return count !== 1
            ? "".concat(count.toLocaleString(), " Eintr\u00E4ge ausgew\u00E4hlt")
            : "".concat(count.toLocaleString(), " Eintrag ausgew\u00E4hlt");
    },
    // Total row amount footer text
    footerTotalRows: 'Gesamt:',
    // Total visible row amount footer text
    footerTotalVisibleRows: function (visibleCount, totalCount) {
        return "".concat(visibleCount.toLocaleString(), " von ").concat(totalCount.toLocaleString());
    },
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
    groupColumn: function (name) { return "Gruppieren nach ".concat(name); },
    unGroupColumn: function (name) { return "Gruppierung nach ".concat(name, " aufheben"); },
    // Master/detail
    detailPanelToggle: 'Detailansicht Kippschalter',
    expandDetailPanel: 'Aufklappen',
    collapseDetailPanel: 'Zuklappen',
    // Pagination
    paginationRowsPerPage: 'Zeilen pro Seite:',
    paginationDisplayedRows: function (_a) {
        var from = _a.from, to = _a.to, count = _a.count, estimated = _a.estimated;
        if (!estimated) {
            return "".concat(from, "\u2013").concat(to, " von ").concat(count !== -1 ? count : "mehr als ".concat(to));
        }
        var estimatedLabel = estimated && estimated > to ? "ungef\u00E4hr ".concat(estimated) : "mehr als ".concat(to);
        return "".concat(from, "\u2013").concat(to, " von ").concat(count !== -1 ? count : estimatedLabel);
    },
    paginationItemAriaLabel: function (type) {
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
    promptFieldSpeechRecognitionNotSupported: 'Spracherkennung wird in diesem Browser nicht unterstützt',
    promptFieldSend: 'Senden',
    promptFieldRecord: 'Aufnahme starten',
    promptFieldStopRecording: 'Aufnahme stoppen',
    // Prompt
    promptRerun: 'Erneut ausführen',
    promptProcessing: 'Verarbeitung…',
    promptAppliedChanges: 'Änderungen angewendet',
    // Prompt changes
    promptChangeGroupDescription: function (column) { return "Gruppieren nach ".concat(column); },
    promptChangeAggregationLabel: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeAggregationDescription: function (column, aggregation) {
        return "".concat(column, " aggregieren (").concat(aggregation, ")");
    },
    promptChangeFilterLabel: function (column, operator, value) {
        if (operator === 'is any of') {
            return "".concat(column, " entspricht einem der Werte: ").concat(value);
        }
        return "".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeFilterDescription: function (column, operator, value) {
        if (operator === 'is any of') {
            return "Filtern, bei dem ".concat(column, " einem der folgenden Werte entspricht: ").concat(value);
        }
        return "Filtern wo ".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeSortDescription: function (column, direction) {
        return "Sortieren nach ".concat(column, " (").concat(direction, ")");
    },
    promptChangePivotEnableLabel: 'Pivot',
    promptChangePivotEnableDescription: 'Pivot aktivieren',
    promptChangePivotColumnsLabel: function (count) { return "Spalten (".concat(count, ")"); },
    promptChangePivotColumnsDescription: function (column, direction) {
        return "".concat(column).concat(direction ? " (".concat(direction, ")") : '');
    },
    promptChangePivotRowsLabel: function (count) { return "Zeilen (".concat(count, ")"); },
    promptChangePivotValuesLabel: function (count) { return "Werte (".concat(count, ")"); },
    promptChangePivotValuesDescription: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
};
exports.deDE = (0, getGridLocalization_1.getGridLocalization)(deDEGrid);
