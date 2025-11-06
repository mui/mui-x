"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caES = void 0;
var getGridLocalization_1 = require("../utils/getGridLocalization");
var caESGrid = {
    // Root
    noRowsLabel: 'Sense files',
    noResultsOverlayLabel: "No s'han trobat resultats",
    noColumnsOverlayLabel: 'Cap columna',
    noColumnsOverlayManageColumns: 'Gestiona les columnes',
    emptyPivotOverlayLabel: 'Afegiu camps a files, columnes i valors per crear una taula dinàmica',
    // Density selector toolbar button text
    toolbarDensity: 'Densitat',
    toolbarDensityLabel: 'Densitat',
    toolbarDensityCompact: 'Compacta',
    toolbarDensityStandard: 'Estàndard',
    toolbarDensityComfortable: 'Còmoda',
    // Columns selector toolbar button text
    toolbarColumns: 'Columnes',
    toolbarColumnsLabel: 'Selecciona columnes',
    // Filters toolbar button text
    toolbarFilters: 'Filtres',
    toolbarFiltersLabel: 'Mostra filtres',
    toolbarFiltersTooltipHide: 'Amaga filtres',
    toolbarFiltersTooltipShow: 'Mostra filtres',
    toolbarFiltersTooltipActive: function (count) {
        return count > 1 ? "".concat(count, " filtres actius") : "".concat(count, " filtre actiu");
    },
    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'Cerca…',
    toolbarQuickFilterLabel: 'Cerca',
    toolbarQuickFilterDeleteIconLabel: 'Neteja',
    // Export selector toolbar button text
    toolbarExport: 'Exporta',
    toolbarExportLabel: 'Exporta',
    toolbarExportCSV: 'Baixa com a CSV',
    toolbarExportPrint: 'Imprimeix',
    toolbarExportExcel: 'Baixa com a Excel',
    // Toolbar pivot button
    toolbarPivot: 'Taula dinàmica',
    // Toolbar charts button
    toolbarCharts: 'Gràfics',
    // Toolbar AI Assistant button
    toolbarAssistant: "Assistent d'IA",
    // Columns management text
    columnsManagementSearchTitle: 'Cerca',
    columnsManagementNoColumns: 'Sense columnes',
    columnsManagementShowHideAllText: 'Mostra/Amaga-ho tot',
    columnsManagementReset: 'Restableix',
    columnsManagementDeleteIconLabel: 'Neteja',
    // Filter panel text
    filterPanelAddFilter: 'Afegeix filtre',
    filterPanelRemoveAll: "Elimina'ls tots",
    filterPanelDeleteIconLabel: 'Esborra',
    filterPanelLogicOperator: 'Operador lògic',
    filterPanelOperator: 'Operadors',
    filterPanelOperatorAnd: 'I',
    filterPanelOperatorOr: 'O',
    filterPanelColumns: 'Columnes',
    filterPanelInputLabel: 'Valor',
    filterPanelInputPlaceholder: 'Valor del filtre',
    // Filter operators text
    filterOperatorContains: 'conté',
    filterOperatorDoesNotContain: 'no conté',
    filterOperatorEquals: 'és igual a',
    filterOperatorDoesNotEqual: 'no és igual a',
    filterOperatorStartsWith: 'comença per',
    filterOperatorEndsWith: 'acaba en',
    filterOperatorIs: 'és',
    filterOperatorNot: 'no és',
    filterOperatorAfter: 'és posterior',
    filterOperatorOnOrAfter: 'és igual o posterior',
    filterOperatorBefore: 'és anterior',
    filterOperatorOnOrBefore: 'és igual o anterior',
    filterOperatorIsEmpty: 'està buit',
    filterOperatorIsNotEmpty: 'no està buit',
    filterOperatorIsAnyOf: 'és qualsevol de',
    'filterOperator=': '=',
    'filterOperator!=': '!=',
    'filterOperator>': '>',
    'filterOperator>=': '>=',
    'filterOperator<': '<',
    'filterOperator<=': '<=',
    // Header filter operators text
    headerFilterOperatorContains: 'Conté',
    headerFilterOperatorDoesNotContain: 'No conté',
    headerFilterOperatorEquals: 'És igual a',
    headerFilterOperatorDoesNotEqual: 'No és igual a',
    headerFilterOperatorStartsWith: 'Comença per',
    headerFilterOperatorEndsWith: 'Acaba en',
    headerFilterOperatorIs: 'És',
    headerFilterOperatorNot: 'No és',
    headerFilterOperatorAfter: 'És posterior a',
    headerFilterOperatorOnOrAfter: 'És igual o posterior a',
    headerFilterOperatorBefore: 'És anterior a',
    headerFilterOperatorOnOrBefore: 'És igual o anterior a',
    headerFilterOperatorIsEmpty: 'Està buit',
    headerFilterOperatorIsNotEmpty: 'No està buit',
    headerFilterOperatorIsAnyOf: 'És qualsevol de',
    'headerFilterOperator=': 'És igual a',
    'headerFilterOperator!=': 'No és igual a',
    'headerFilterOperator>': 'És més gran que',
    'headerFilterOperator>=': 'És més gran o igual que',
    'headerFilterOperator<': 'És més petit que',
    'headerFilterOperator<=': 'És més petit o igual que',
    headerFilterClear: 'Neteja filtres',
    // Filter values text
    filterValueAny: 'qualsevol',
    filterValueTrue: 'veritable',
    filterValueFalse: 'fals',
    // Column menu text
    columnMenuLabel: 'Menú',
    columnMenuAriaLabel: function (columnName) { return "Men\u00FA de la columna ".concat(columnName); },
    columnMenuShowColumns: 'Mostra columnes',
    columnMenuManageColumns: 'Gestiona columnes',
    columnMenuFilter: 'Filtre',
    columnMenuHideColumn: 'Amaga',
    columnMenuUnsort: 'Desordena',
    columnMenuSortAsc: 'Ordena ASC',
    columnMenuSortDesc: 'Ordena DESC',
    columnMenuManagePivot: 'Gestiona la taula dinàmica',
    columnMenuManageCharts: 'Gestiona els gràfics',
    // Column header text
    columnHeaderFiltersTooltipActive: function (count) {
        return count > 1 ? "".concat(count, " filtres actius") : "".concat(count, " filtre actiu");
    },
    columnHeaderFiltersLabel: 'Mostra filtres',
    columnHeaderSortIconLabel: 'Ordena',
    // Rows selected footer text
    footerRowSelected: function (count) {
        return count > 1
            ? "".concat(count.toLocaleString(), " files seleccionades")
            : "".concat(count.toLocaleString(), " fila seleccionada");
    },
    // Total row amount footer text
    footerTotalRows: 'Files totals:',
    // Total visible row amount footer text
    footerTotalVisibleRows: function (visibleCount, totalCount) {
        return "".concat(visibleCount.toLocaleString(), " de ").concat(totalCount.toLocaleString());
    },
    // Checkbox selection text
    checkboxSelectionHeaderName: 'Casella de selecció',
    checkboxSelectionSelectAllRows: 'Selecciona totes les files',
    checkboxSelectionUnselectAllRows: 'Desselecciona totes les files',
    checkboxSelectionSelectRow: 'Selecciona fila',
    checkboxSelectionUnselectRow: 'Desselecciona fila',
    // Boolean cell text
    booleanCellTrueLabel: 'sí',
    booleanCellFalseLabel: 'no',
    // Actions cell more text
    actionsCellMore: 'més',
    // Column pinning text
    pinToLeft: "Fixa a l'esquerra",
    pinToRight: 'Fixa a la dreta',
    unpin: 'Desfixa',
    // Tree Data
    treeDataGroupingHeaderName: 'Grup',
    treeDataExpand: 'mostra fills',
    treeDataCollapse: 'amaga fills',
    // Grouping columns
    groupingColumnHeaderName: 'Grup',
    groupColumn: function (name) { return "Agrupa per ".concat(name); },
    unGroupColumn: function (name) { return "No agrupis per ".concat(name); },
    // Master/detail
    detailPanelToggle: 'Alterna detall',
    expandDetailPanel: 'Expandeix',
    collapseDetailPanel: 'Contrau',
    // Pagination
    paginationRowsPerPage: 'Files per pàgina:',
    paginationDisplayedRows: function (_a) {
        var from = _a.from, to = _a.to, count = _a.count, estimated = _a.estimated;
        if (!estimated) {
            return "".concat(from, "\u2013").concat(to, " de ").concat(count !== -1 ? count : "m\u00E9s de ".concat(to));
        }
        var estimatedLabel = estimated && estimated > to ? "al voltant de ".concat(estimated) : "m\u00E9s de ".concat(to);
        return "".concat(from, "\u2013").concat(to, " de ").concat(count !== -1 ? count : estimatedLabel);
    },
    paginationItemAriaLabel: function (type) {
        if (type === 'first') {
            return 'Vés a la primera pàgina';
        }
        if (type === 'last') {
            return "Vés a l'última pàgina";
        }
        if (type === 'next') {
            return 'Vés a la pàgina següent';
        }
        // if (type === 'previous') {
        return 'Vés a la pàgina anterior';
    },
    // Row reordering text
    rowReorderingHeaderName: 'Reordena files',
    // Aggregation
    aggregationMenuItemHeader: 'Agregació',
    aggregationFunctionLabelNone: 'cap',
    aggregationFunctionLabelSum: 'suma',
    aggregationFunctionLabelAvg: 'mitjana',
    aggregationFunctionLabelMin: 'mínim',
    aggregationFunctionLabelMax: 'màxim',
    aggregationFunctionLabelSize: 'recompte',
    // Pivot panel
    pivotToggleLabel: 'Taula dinàmica',
    pivotRows: 'Files',
    pivotColumns: 'Columnes',
    pivotValues: 'Valors',
    pivotCloseButton: 'Tanca la configuració de taula dinàmica',
    pivotSearchButton: 'Camps de cerca',
    pivotSearchControlPlaceholder: 'Camps de cerca',
    pivotSearchControlLabel: 'Camps de cerca',
    pivotSearchControlClear: 'Neteja la cerca',
    pivotNoFields: 'Cap camp',
    pivotMenuMoveUp: 'Mou amunt',
    pivotMenuMoveDown: 'Mou avall',
    pivotMenuMoveToTop: 'Mou al principi',
    pivotMenuMoveToBottom: 'Mou al final',
    pivotMenuRows: 'Files',
    pivotMenuColumns: 'Columnes',
    pivotMenuValues: 'Valors',
    pivotMenuOptions: 'Opcions del camp',
    pivotMenuAddToRows: 'Afegeix a files',
    pivotMenuAddToColumns: 'Afegeix a columnes',
    pivotMenuAddToValues: 'Afegeix a valors',
    pivotMenuRemove: 'Elimina',
    pivotDragToRows: 'Arrossega aquí per crear files',
    pivotDragToColumns: 'Arrossega aquí per crear columnes',
    pivotDragToValues: 'Arrossega aquí per crear valors',
    pivotYearColumnHeaderName: '(Any)',
    pivotQuarterColumnHeaderName: '(Trimestre)',
    // Charts configuration panel
    chartsNoCharts: 'No hi ha cap gràfic disponible',
    chartsChartNotSelected: 'Selecciona un tipus de gràfic per configurar les seves opcions',
    chartsTabChart: 'Gràfic',
    chartsTabFields: 'Camps',
    chartsTabCustomize: 'Personalitza',
    chartsCloseButton: 'Tanca la configuració de gràfics',
    chartsSyncButtonLabel: 'Sincronitza gràfic',
    chartsSearchPlaceholder: 'Camps de cerca',
    chartsSearchLabel: 'Camps de cerca',
    chartsSearchClear: 'Neteja la cerca',
    chartsNoFields: 'Cap camp',
    chartsFieldBlocked: 'Aquest camp no es pot afegir a cap secció',
    chartsCategories: 'Categories',
    chartsSeries: 'Sèries',
    chartsMenuAddToDimensions: function (dimensionLabel) { return "Afegeix a ".concat(dimensionLabel); },
    chartsMenuAddToValues: function (valuesLabel) { return "Afegeix a ".concat(valuesLabel); },
    chartsMenuMoveUp: 'Mou amunt',
    chartsMenuMoveDown: 'Mou avall',
    chartsMenuMoveToTop: 'Mou al principi',
    chartsMenuMoveToBottom: 'Mou al final',
    chartsMenuOptions: 'Opcions del camp',
    chartsMenuRemove: 'Elimina',
    chartsDragToDimensions: function (dimensionLabel) {
        return "Arrossega aqu\u00ED per utilitzar la columna com a ".concat(dimensionLabel);
    },
    chartsDragToValues: function (valuesLabel) {
        return "Arrossega aqu\u00ED per utilitzar la columna com a ".concat(valuesLabel);
    },
    // AI Assistant panel
    aiAssistantPanelTitle: "Assistent d'IA",
    aiAssistantPanelClose: "Tanca l'assistent d'IA",
    aiAssistantPanelNewConversation: 'Nova conversa',
    aiAssistantPanelConversationHistory: 'Historial de converses',
    aiAssistantPanelEmptyConversation: "L'historial de converses és buit",
    aiAssistantSuggestions: 'Suggeriments',
    // Prompt field
    promptFieldLabel: 'Petició',
    promptFieldPlaceholder: 'Escriu una petició…',
    promptFieldPlaceholderWithRecording: 'Escriu o enregistra una petició…',
    promptFieldPlaceholderListening: 'Esperant una petició…',
    promptFieldSpeechRecognitionNotSupported: 'El reconeixement de veu no és compatible amb aquest navegador',
    promptFieldSend: 'Envia',
    promptFieldRecord: 'Enregistra',
    promptFieldStopRecording: "Atura l'enregistrament",
    // Prompt
    promptRerun: 'Torna a executar',
    promptProcessing: 'Processant…',
    promptAppliedChanges: "S'han aplicat els canvis",
    // Prompt changes
    promptChangeGroupDescription: function (column) { return "Agrupa per ".concat(column); },
    promptChangeAggregationLabel: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeAggregationDescription: function (column, aggregation) {
        return "Agrega ".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeFilterLabel: function (column, operator, value) {
        if (operator === 'is any of') {
            return "".concat(column, " \u00E9s un de: ").concat(value);
        }
        return "".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeFilterDescription: function (column, operator, value) {
        if (operator === 'is any of') {
            return "Filtra per ".concat(column, " quan sigui un de: ").concat(value);
        }
        return "Filtra per ".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeSortDescription: function (column, direction) {
        return "Ordena per ".concat(column, " (").concat(direction, ")");
    },
    promptChangePivotEnableLabel: 'Taula dinàmica',
    promptChangePivotEnableDescription: 'Activa la taula dinàmica',
    promptChangePivotColumnsLabel: function (count) { return "Columnes (".concat(count, ")"); },
    promptChangePivotColumnsDescription: function (column, direction) {
        return "".concat(column).concat(direction ? " (".concat(direction, ")") : '');
    },
    promptChangePivotRowsLabel: function (count) { return "Files (".concat(count, ")"); },
    promptChangePivotValuesLabel: function (count) { return "Valors (".concat(count, ")"); },
    promptChangePivotValuesDescription: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeChartsLabel: function (dimensionsCount, valuesCount) {
        return "Dimensions (".concat(dimensionsCount, "), Valors (").concat(valuesCount, ")");
    },
};
exports.caES = (0, getGridLocalization_1.getGridLocalization)(caESGrid);
