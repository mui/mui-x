"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nnNO = void 0;
var getGridLocalization_1 = require("../utils/getGridLocalization");
var nnNOGrid = {
    // Root
    noRowsLabel: 'Ingen rader',
    noResultsOverlayLabel: 'Fann ingen resultat.',
    noColumnsOverlayLabel: 'Ingen kolonner',
    noColumnsOverlayManageColumns: 'Vel kolonner',
    emptyPivotOverlayLabel: 'Legg til felt i rader, kolonner og verdiar for å opprette ein pivot-tabell',
    // Density selector toolbar button text
    toolbarDensity: 'Tettheit',
    toolbarDensityLabel: 'Tettheit',
    toolbarDensityCompact: 'Kompakt',
    toolbarDensityStandard: 'Standard',
    toolbarDensityComfortable: 'Komfortabelt',
    // Columns selector toolbar button text
    toolbarColumns: 'Kolonner',
    toolbarColumnsLabel: 'Vel kolonner',
    // Filters toolbar button text
    toolbarFilters: 'Filter',
    toolbarFiltersLabel: 'Vis filter',
    toolbarFiltersTooltipHide: 'Skjul filter',
    toolbarFiltersTooltipShow: 'Vis filter',
    toolbarFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " aktive filter") : "".concat(count, " aktivt filter");
    },
    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'Søk…',
    toolbarQuickFilterLabel: 'Søk',
    toolbarQuickFilterDeleteIconLabel: 'Slett',
    // Export selector toolbar button text
    toolbarExport: 'Eksporter',
    toolbarExportLabel: 'Eksporter',
    toolbarExportCSV: 'Last ned som CSV',
    toolbarExportPrint: 'Skriv ut',
    toolbarExportExcel: 'Last ned som Excel',
    // Toolbar pivot button
    toolbarPivot: 'Pivot',
    // Toolbar AI Assistant button
    toolbarAssistant: 'AI Assistent',
    // Columns management text
    columnsManagementSearchTitle: 'Søk',
    columnsManagementNoColumns: 'Ingen kolonner',
    columnsManagementShowHideAllText: 'Vis/skjul alle',
    columnsManagementReset: 'Nullstill',
    columnsManagementDeleteIconLabel: 'Tøm',
    // Filter panel text
    filterPanelAddFilter: 'Legg til filter',
    filterPanelRemoveAll: 'Fjern alle',
    filterPanelDeleteIconLabel: 'Slett',
    filterPanelLogicOperator: 'Logisk operator',
    filterPanelOperator: 'Operator',
    filterPanelOperatorAnd: 'Og',
    filterPanelOperatorOr: 'Eller',
    filterPanelColumns: 'Kolonner',
    filterPanelInputLabel: 'Verdi',
    filterPanelInputPlaceholder: 'Filter verdi',
    // Filter operators text
    filterOperatorContains: 'inneheld',
    filterOperatorDoesNotContain: 'inneheld ikkje',
    filterOperatorEquals: 'er lik',
    filterOperatorDoesNotEqual: 'er ikkje lik',
    filterOperatorStartsWith: 'startar med',
    filterOperatorEndsWith: 'sluttar med',
    filterOperatorIs: 'er',
    filterOperatorNot: 'er ikkje',
    filterOperatorAfter: 'er etter',
    filterOperatorOnOrAfter: 'er på eller etter',
    filterOperatorBefore: 'er før',
    filterOperatorOnOrBefore: 'er på eller før',
    filterOperatorIsEmpty: 'er tom',
    filterOperatorIsNotEmpty: 'er ikkje tom',
    filterOperatorIsAnyOf: 'er ein av',
    'filterOperator=': '=',
    'filterOperator!=': '!=',
    'filterOperator>': '>',
    'filterOperator>=': '>=',
    'filterOperator<': '<',
    'filterOperator<=': '<=',
    // Header filter operators text
    headerFilterOperatorContains: 'Inneheld',
    headerFilterOperatorDoesNotContain: 'Inneheld ikkje',
    headerFilterOperatorEquals: 'Lik',
    headerFilterOperatorDoesNotEqual: 'Er ikkje lik',
    headerFilterOperatorStartsWith: 'Startar på',
    headerFilterOperatorEndsWith: 'Sluttar på',
    headerFilterOperatorIs: 'Er',
    headerFilterOperatorNot: 'Er ikkje',
    headerFilterOperatorAfter: 'Er etter',
    headerFilterOperatorOnOrAfter: 'Er på eller etter',
    headerFilterOperatorBefore: 'Er før',
    headerFilterOperatorOnOrBefore: 'Er på eller før',
    headerFilterOperatorIsEmpty: 'Er tom',
    headerFilterOperatorIsNotEmpty: 'Er ikkje tom',
    headerFilterOperatorIsAnyOf: 'Er ein av',
    'headerFilterOperator=': 'Lik',
    'headerFilterOperator!=': 'Ikkje lik',
    'headerFilterOperator>': 'Større enn',
    'headerFilterOperator>=': 'Større enn eller lik',
    'headerFilterOperator<': 'Mindre enn',
    'headerFilterOperator<=': 'Mindre enn eller lik',
    headerFilterClear: 'Tøm filter',
    // Filter values text
    filterValueAny: 'nokon',
    filterValueTrue: 'sant',
    filterValueFalse: 'usant',
    // Column menu text
    columnMenuLabel: 'Meny',
    columnMenuAriaLabel: function (columnName) { return "".concat(columnName, " kolonne meny"); },
    columnMenuShowColumns: 'Vis kolonner',
    columnMenuManageColumns: 'Administrer kolonner',
    columnMenuFilter: 'Filter',
    columnMenuHideColumn: 'Skjul',
    columnMenuUnsort: 'Usorter',
    columnMenuSortAsc: 'Sorter AUKANDE',
    columnMenuSortDesc: 'Sorter SYNKANDE',
    columnMenuManagePivot: 'Behandle pivot',
    // Column header text
    columnHeaderFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " aktive filter") : "".concat(count, " aktivt filter");
    },
    columnHeaderFiltersLabel: 'Vis filter',
    columnHeaderSortIconLabel: 'Sorter',
    // Rows selected footer text
    footerRowSelected: function (count) {
        return count !== 1 ? "".concat(count.toLocaleString(), " rader valt") : "".concat(count.toLocaleString(), " rad valt");
    },
    // Total row amount footer text
    footerTotalRows: 'Totalt tal rader:',
    // Total visible row amount footer text
    footerTotalVisibleRows: function (visibleCount, totalCount) {
        return "".concat(visibleCount.toLocaleString(), " av ").concat(totalCount.toLocaleString());
    },
    // Checkbox selection text
    checkboxSelectionHeaderName: 'Avmerkingsboks',
    checkboxSelectionSelectAllRows: 'Vel alle rader',
    checkboxSelectionUnselectAllRows: 'Vel vekk alle rader',
    checkboxSelectionSelectRow: 'Vel rad',
    checkboxSelectionUnselectRow: 'Vel vekk rad',
    // Boolean cell text
    booleanCellTrueLabel: 'sant',
    booleanCellFalseLabel: 'usant',
    // Actions cell more text
    actionsCellMore: 'meir',
    // Column pinning text
    pinToLeft: 'Fest til venstre',
    pinToRight: 'Fest til høgre',
    unpin: 'Lausne',
    // Tree Data
    treeDataGroupingHeaderName: 'Grupper',
    treeDataExpand: 'vis barn',
    treeDataCollapse: 'skjul barn',
    // Grouping columns
    groupingColumnHeaderName: 'Grupper',
    groupColumn: function (name) { return "Grupper p\u00E5 ".concat(name); },
    unGroupColumn: function (name) { return "Slutt \u00E5 grupper p\u00E5 ".concat(name); },
    // Master/detail
    detailPanelToggle: 'Vis/gøym detaljpanel',
    expandDetailPanel: 'Vis',
    collapseDetailPanel: 'Gøym',
    // Pagination
    paginationRowsPerPage: 'Rader per side:',
    paginationDisplayedRows: function (_a) {
        var from = _a.from, to = _a.to, count = _a.count, estimated = _a.estimated;
        if (!estimated) {
            return "".concat(from, "\u2013").concat(to, " av ").concat(count !== -1 ? count : "flere enn ".concat(to));
        }
        var estimatedLabel = estimated && estimated > to ? "omtrent ".concat(estimated) : "flere enn ".concat(to);
        return "".concat(from, "\u2013").concat(to, " av ").concat(count !== -1 ? count : estimatedLabel);
    },
    paginationItemAriaLabel: function (type) {
        if (type === 'first') {
            return 'Gå til første side';
        }
        if (type === 'last') {
            return 'Gå til siste side';
        }
        if (type === 'next') {
            return 'Gå til neste side';
        }
        // if (type === 'previous') {
        return 'Gå til førre side';
    },
    // Row reordering text
    rowReorderingHeaderName: 'Radreorganisering',
    // Aggregation
    aggregationMenuItemHeader: 'Aggregering',
    aggregationFunctionLabelSum: 'sum',
    aggregationFunctionLabelAvg: 'snitt',
    aggregationFunctionLabelMin: 'min',
    aggregationFunctionLabelMax: 'maks',
    aggregationFunctionLabelSize: 'størrelse',
    // Pivot panel
    pivotToggleLabel: 'Pivot',
    pivotRows: 'Rader',
    pivotColumns: 'Kolonner',
    pivotValues: 'Verdiar',
    pivotCloseButton: 'Lukk pivotinnstillingar',
    pivotSearchButton: 'Søk felt',
    pivotSearchControlPlaceholder: 'Søk felt',
    pivotSearchControlLabel: 'Søk felt',
    pivotSearchControlClear: 'Tøm søk',
    pivotNoFields: 'Ingen felt',
    pivotMenuMoveUp: 'Flytt opp',
    pivotMenuMoveDown: 'Flytt ned',
    pivotMenuMoveToTop: 'Flytt til toppen',
    pivotMenuMoveToBottom: 'Flytt til botnen',
    pivotMenuRows: 'Rader',
    pivotMenuColumns: 'Kolonner',
    pivotMenuValues: 'Verdiar',
    pivotMenuOptions: 'Feltalternativ',
    pivotMenuAddToRows: 'Legg til i Rader',
    pivotMenuAddToColumns: 'Legg til i Kolonner',
    pivotMenuAddToValues: 'Legg til i Verdiar',
    pivotMenuRemove: 'Fjern',
    pivotDragToRows: 'Dra hit for å opprette rader',
    pivotDragToColumns: 'Dra hit for å opprette kolonner',
    pivotDragToValues: 'Dra hit for å opprette verdiar',
    pivotYearColumnHeaderName: '(År)',
    pivotQuarterColumnHeaderName: '(Kvartal)',
    // AI Assistant panel
    aiAssistantPanelTitle: 'AI Assistent',
    aiAssistantPanelClose: 'Lukk AI Assistent',
    aiAssistantPanelNewConversation: 'Ny samtale',
    aiAssistantPanelConversationHistory: 'Samtalehistorikk',
    aiAssistantPanelEmptyConversation: 'Ingen prompt-historikk',
    aiAssistantSuggestions: 'Forslag',
    // Prompt field
    promptFieldLabel: 'Prompt',
    promptFieldPlaceholder: 'Skriv ein prompt…',
    promptFieldPlaceholderWithRecording: 'Skriv eller spel inn ein prompt…',
    promptFieldPlaceholderListening: 'Lyttar etter prompt…',
    promptFieldSpeechRecognitionNotSupported: 'Talegjenkjenning er ikkje støtta i denne nettlesaren',
    promptFieldSend: 'Send',
    promptFieldRecord: 'Spel inn',
    promptFieldStopRecording: 'Stopp opptak',
    // Prompt
    promptRerun: 'Kjør på nytt',
    promptProcessing: 'Behandlar…',
    promptAppliedChanges: 'Brukte endringar',
    // Prompt changes
    promptChangeGroupDescription: function (column) { return "Grupper etter ".concat(column); },
    promptChangeAggregationLabel: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeAggregationDescription: function (column, aggregation) {
        return "Aggreger ".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeFilterLabel: function (column, operator, value) {
        if (operator === 'is any of') {
            return "".concat(column, " er ein av: ").concat(value);
        }
        return "".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeFilterDescription: function (column, operator, value) {
        if (operator === 'is any of') {
            return "Filter der ".concat(column, " er ein av: ").concat(value);
        }
        return "Filter der ".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeSortDescription: function (column, direction) {
        return "Sorter etter ".concat(column, " (").concat(direction, ")");
    },
    promptChangePivotEnableLabel: 'Pivot',
    promptChangePivotEnableDescription: 'Aktiver pivot',
    promptChangePivotColumnsLabel: function (count) { return "Kolonner (".concat(count, ")"); },
    promptChangePivotColumnsDescription: function (column, direction) {
        return "".concat(column).concat(direction ? " (".concat(direction, ")") : '');
    },
    promptChangePivotRowsLabel: function (count) { return "Rader (".concat(count, ")"); },
    promptChangePivotValuesLabel: function (count) { return "Verdiar (".concat(count, ")"); },
    promptChangePivotValuesDescription: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
};
exports.nnNO = (0, getGridLocalization_1.getGridLocalization)(nnNOGrid);
