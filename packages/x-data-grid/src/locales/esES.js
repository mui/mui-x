"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esES = void 0;
var getGridLocalization_1 = require("../utils/getGridLocalization");
var esESGrid = {
    // Root
    noRowsLabel: 'Sin filas',
    noResultsOverlayLabel: 'Resultados no encontrados',
    noColumnsOverlayLabel: 'Ninguna columna',
    noColumnsOverlayManageColumns: 'Gestionar columnas',
    emptyPivotOverlayLabel: 'Añada campos a filas, columnas y valores para crear una tabla dinámica',
    // Density selector toolbar button text
    toolbarDensity: 'Densidad',
    toolbarDensityLabel: 'Densidad',
    toolbarDensityCompact: 'Compacta',
    toolbarDensityStandard: 'Estándar',
    toolbarDensityComfortable: 'Cómoda',
    // Columns selector toolbar button text
    toolbarColumns: 'Columnas',
    toolbarColumnsLabel: 'Seleccionar columnas',
    // Filters toolbar button text
    toolbarFilters: 'Filtros',
    toolbarFiltersLabel: 'Mostrar filtros',
    toolbarFiltersTooltipHide: 'Ocultar filtros',
    toolbarFiltersTooltipShow: 'Mostrar filtros',
    toolbarFiltersTooltipActive: function (count) {
        return count > 1 ? "".concat(count, " filtros activos") : "".concat(count, " filtro activo");
    },
    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'Buscar…',
    toolbarQuickFilterLabel: 'Buscar',
    toolbarQuickFilterDeleteIconLabel: 'Limpiar',
    // Export selector toolbar button text
    toolbarExport: 'Exportar',
    toolbarExportLabel: 'Exportar',
    toolbarExportCSV: 'Descargar como CSV',
    toolbarExportPrint: 'Imprimir',
    toolbarExportExcel: 'Descargar como Excel',
    // Toolbar pivot button
    toolbarPivot: 'Tabla dinámica',
    // Toolbar charts button
    toolbarCharts: 'Gráficos',
    // Toolbar AI Assistant button
    toolbarAssistant: 'Asistente de IA',
    // Columns management text
    columnsManagementSearchTitle: 'Buscar',
    columnsManagementNoColumns: 'Sin columnas',
    columnsManagementShowHideAllText: 'Mostrar/Ocultar todas',
    columnsManagementReset: 'Restablecer',
    columnsManagementDeleteIconLabel: 'Limpiar',
    // Filter panel text
    filterPanelAddFilter: 'Agregar filtro',
    filterPanelRemoveAll: 'Remover todos',
    filterPanelDeleteIconLabel: 'Borrar',
    filterPanelLogicOperator: 'Operador lógico',
    filterPanelOperator: 'Operadores',
    filterPanelOperatorAnd: 'Y',
    filterPanelOperatorOr: 'O',
    filterPanelColumns: 'Columnas',
    filterPanelInputLabel: 'Valor',
    filterPanelInputPlaceholder: 'Valor de filtro',
    // Filter operators text
    filterOperatorContains: 'contiene',
    filterOperatorDoesNotContain: 'no contiene',
    filterOperatorEquals: 'es igual',
    filterOperatorDoesNotEqual: 'es diferente a',
    filterOperatorStartsWith: 'comienza con',
    filterOperatorEndsWith: 'termina con',
    filterOperatorIs: 'es',
    filterOperatorNot: 'no es',
    filterOperatorAfter: 'es posterior',
    filterOperatorOnOrAfter: 'es en o posterior',
    filterOperatorBefore: 'es anterior',
    filterOperatorOnOrBefore: 'es en o anterior',
    filterOperatorIsEmpty: 'esta vacío',
    filterOperatorIsNotEmpty: 'no esta vacío',
    filterOperatorIsAnyOf: 'es cualquiera de',
    'filterOperator=': '=',
    'filterOperator!=': '!=',
    'filterOperator>': '>',
    'filterOperator>=': '>=',
    'filterOperator<': '<',
    'filterOperator<=': '<=',
    // Header filter operators text
    headerFilterOperatorContains: 'Contiene',
    headerFilterOperatorDoesNotContain: 'No contiene',
    headerFilterOperatorEquals: 'Es igual a',
    headerFilterOperatorDoesNotEqual: 'Es diferente a',
    headerFilterOperatorStartsWith: 'Comienza con',
    headerFilterOperatorEndsWith: 'Termina con',
    headerFilterOperatorIs: 'Es',
    headerFilterOperatorNot: 'No es',
    headerFilterOperatorAfter: 'Esta después de',
    headerFilterOperatorOnOrAfter: 'Esta en o después de',
    headerFilterOperatorBefore: 'Esta antes de',
    headerFilterOperatorOnOrBefore: 'Esta en o antes de',
    headerFilterOperatorIsEmpty: 'Esta vacío',
    headerFilterOperatorIsNotEmpty: 'No esta vacío',
    headerFilterOperatorIsAnyOf: 'Es cualquiera de',
    'headerFilterOperator=': 'Es igual a',
    'headerFilterOperator!=': 'Es diferente a',
    'headerFilterOperator>': 'Es mayor que',
    'headerFilterOperator>=': 'Es mayor o igual que',
    'headerFilterOperator<': 'Es menor que',
    'headerFilterOperator<=': 'Es menor o igual que',
    headerFilterClear: 'Limpiar filtros',
    // Filter values text
    filterValueAny: 'cualquiera',
    filterValueTrue: 'verdadero',
    filterValueFalse: 'falso',
    // Column menu text
    columnMenuLabel: 'Menú',
    columnMenuAriaLabel: function (columnName) { return "Men\u00FA de la columna ".concat(columnName); },
    columnMenuShowColumns: 'Mostrar columnas',
    columnMenuManageColumns: 'Administrar columnas',
    columnMenuFilter: 'Filtro',
    columnMenuHideColumn: 'Ocultar',
    columnMenuUnsort: 'Desordenar',
    columnMenuSortAsc: 'Ordenar ASC',
    columnMenuSortDesc: 'Ordenar DESC',
    columnMenuManagePivot: 'Gestionar tabla dinámica',
    columnMenuManageCharts: 'Gestionar gráficos',
    // Column header text
    columnHeaderFiltersTooltipActive: function (count) {
        return count > 1 ? "".concat(count, " filtros activos") : "".concat(count, " filtro activo");
    },
    columnHeaderFiltersLabel: 'Mostrar filtros',
    columnHeaderSortIconLabel: 'Ordenar',
    // Rows selected footer text
    footerRowSelected: function (count) {
        return count > 1
            ? "".concat(count.toLocaleString(), " filas seleccionadas")
            : "".concat(count.toLocaleString(), " fila seleccionada");
    },
    // Total row amount footer text
    footerTotalRows: 'Filas Totales:',
    // Total visible row amount footer text
    footerTotalVisibleRows: function (visibleCount, totalCount) {
        return "".concat(visibleCount.toLocaleString(), " de ").concat(totalCount.toLocaleString());
    },
    // Checkbox selection text
    checkboxSelectionHeaderName: 'Seleccionar casilla',
    checkboxSelectionSelectAllRows: 'Seleccionar todas las filas',
    checkboxSelectionUnselectAllRows: 'Deseleccionar todas las filas',
    checkboxSelectionSelectRow: 'Seleccionar fila',
    checkboxSelectionUnselectRow: 'Deseleccionar fila',
    // Boolean cell text
    booleanCellTrueLabel: 'si',
    booleanCellFalseLabel: 'no',
    // Actions cell more text
    actionsCellMore: 'más',
    // Column pinning text
    pinToLeft: 'Anclar a la izquierda',
    pinToRight: 'Anclar a la derecha',
    unpin: 'Desanclar',
    // Tree Data
    treeDataGroupingHeaderName: 'Grupo',
    treeDataExpand: 'mostrar hijos',
    treeDataCollapse: 'ocultar hijos',
    // Grouping columns
    groupingColumnHeaderName: 'Grupo',
    groupColumn: function (name) { return "Agrupar por ".concat(name); },
    unGroupColumn: function (name) { return "No agrupar por ".concat(name); },
    // Master/detail
    detailPanelToggle: 'Alternar detalle',
    expandDetailPanel: 'Expandir',
    collapseDetailPanel: 'Contraer',
    // Pagination
    paginationRowsPerPage: 'Filas por página:',
    paginationDisplayedRows: function (_a) {
        var from = _a.from, to = _a.to, count = _a.count, estimated = _a.estimated;
        if (!estimated) {
            return "".concat(from, "\u2013").concat(to, " de ").concat(count !== -1 ? count : "m\u00E1s de ".concat(to));
        }
        var estimatedLabel = estimated && estimated > to ? "alrededor de ".concat(estimated) : "m\u00E1s de ".concat(to);
        return "".concat(from, "\u2013").concat(to, " de ").concat(count !== -1 ? count : estimatedLabel);
    },
    paginationItemAriaLabel: function (type) {
        if (type === 'first') {
            return 'Ir a la primera página';
        }
        if (type === 'last') {
            return 'Ir a la última página';
        }
        if (type === 'next') {
            return 'Ir a la página siguiente';
        }
        // if (type === 'previous') {
        return 'Ir a la página anterior';
    },
    // Row reordering text
    rowReorderingHeaderName: 'Reordenar filas',
    // Aggregation
    aggregationMenuItemHeader: 'Agregación',
    aggregationFunctionLabelNone: 'ninguna',
    aggregationFunctionLabelSum: 'suma',
    aggregationFunctionLabelAvg: 'promedio',
    aggregationFunctionLabelMin: 'mínimo',
    aggregationFunctionLabelMax: 'máximo',
    aggregationFunctionLabelSize: 'tamaño',
    // Pivot panel
    pivotToggleLabel: 'Tabla dinámica',
    pivotRows: 'Filas',
    pivotColumns: 'Columnas',
    pivotValues: 'Valores',
    pivotCloseButton: 'Cerrar la configuración de tabla dinámica',
    pivotSearchButton: 'Campos de búsqueda',
    pivotSearchControlPlaceholder: 'Campos de búsqueda',
    pivotSearchControlLabel: 'Campos de búsqueda',
    pivotSearchControlClear: 'Limpiar la búsqueda',
    pivotNoFields: 'Ningún campo',
    pivotMenuMoveUp: 'Mover arriba',
    pivotMenuMoveDown: 'Mover abajo',
    pivotMenuMoveToTop: 'Mover al inicio',
    pivotMenuMoveToBottom: 'Mover al final',
    pivotMenuRows: 'Filas',
    pivotMenuColumns: 'Columnas',
    pivotMenuValues: 'Valores',
    pivotMenuOptions: 'Opciones de campo',
    pivotMenuAddToRows: 'Añadir a filas',
    pivotMenuAddToColumns: 'Añadir a columnas',
    pivotMenuAddToValues: 'Añadir a valores',
    pivotMenuRemove: 'Eliminar',
    pivotDragToRows: 'Arrastrar aquí para crear filas',
    pivotDragToColumns: 'Arrastrar aquí para crear columnas',
    pivotDragToValues: 'Arrastrar aquí para crear valores',
    pivotYearColumnHeaderName: '(Año)',
    pivotQuarterColumnHeaderName: '(Trimestre)',
    // Charts configuration panel
    chartsNoCharts: 'No hay ningún gráfico disponible',
    chartsChartNotSelected: 'Seleccionar un tipo de gráfico para configurar sus opciones',
    chartsTabChart: 'Gráfico',
    chartsTabFields: 'Campos',
    chartsTabCustomize: 'Personalizar',
    chartsCloseButton: 'Cerrar la configuración de gráficos',
    chartsSyncButtonLabel: 'Sincronizar gráfico',
    chartsSearchPlaceholder: 'Campos de búsqueda',
    chartsSearchLabel: 'Campos de búsqueda',
    chartsSearchClear: 'Limpiar búsqueda',
    chartsNoFields: 'Ningún campo',
    chartsFieldBlocked: 'Este campo no se puede añadir a ninguna sección',
    chartsCategories: 'Categorías',
    chartsSeries: 'Series',
    chartsMenuAddToDimensions: function (dimensionLabel) { return "A\u00F1adir a ".concat(dimensionLabel); },
    chartsMenuAddToValues: function (valuesLabel) { return "A\u00F1adir a ".concat(valuesLabel); },
    chartsMenuMoveUp: 'Mover arriba',
    chartsMenuMoveDown: 'Mover abajo',
    chartsMenuMoveToTop: 'Mover al inicio',
    chartsMenuMoveToBottom: 'Mover al final',
    chartsMenuOptions: 'Opciones de campo',
    chartsMenuRemove: 'Eliminar',
    chartsDragToDimensions: function (dimensionLabel) {
        return "Arrastrar aqu\u00ED para utilizar la columna como ".concat(dimensionLabel);
    },
    chartsDragToValues: function (valuesLabel) {
        return "Arrastrar aqu\u00ED para utilizar la columna como  ".concat(valuesLabel);
    },
    // AI Assistant panel
    aiAssistantPanelTitle: 'Asistente de IA',
    aiAssistantPanelClose: 'Cerrar el asistente de IA',
    aiAssistantPanelNewConversation: 'Nueva conversación',
    aiAssistantPanelConversationHistory: 'Historial de conversaciones',
    aiAssistantPanelEmptyConversation: 'El historial de conversaciones está vacío',
    aiAssistantSuggestions: 'Sugerencias',
    // Prompt field
    promptFieldLabel: 'Prompt',
    promptFieldPlaceholder: 'Escribe un prompt…',
    promptFieldPlaceholderWithRecording: 'Escriba o grabe un prompt…',
    promptFieldPlaceholderListening: 'Esperando por un prompt…',
    promptFieldSpeechRecognitionNotSupported: 'El reconocimiento de voz no está soportado en este navegador',
    promptFieldSend: 'Enviar',
    promptFieldRecord: 'Grabar',
    promptFieldStopRecording: 'Parar de grabar',
    // Prompt
    promptRerun: 'Ejecutar de nuevo',
    promptProcessing: 'Procesando…',
    promptAppliedChanges: 'Se han aplicado los cambios',
    // Prompt changes
    promptChangeGroupDescription: function (column) { return "Agrupar por ".concat(column); },
    promptChangeAggregationLabel: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeAggregationDescription: function (column, aggregation) {
        return "Agregar ".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeFilterLabel: function (column, operator, value) {
        if (operator === 'is any of') {
            return "".concat(column, " es uno de: ").concat(value);
        }
        return "".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeFilterDescription: function (column, operator, value) {
        if (operator === 'is any of') {
            return "Filtrar por ".concat(column, " cuando sea uno de: ").concat(value);
        }
        return "Filtrar por ".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeSortDescription: function (column, direction) {
        return "Ordenar por ".concat(column, " (").concat(direction, ")");
    },
    promptChangePivotEnableLabel: 'Tabla dinámica',
    promptChangePivotEnableDescription: 'Activar tabla dinámica',
    promptChangePivotColumnsLabel: function (count) { return "Columnas (".concat(count, ")"); },
    promptChangePivotColumnsDescription: function (column, direction) {
        return "".concat(column).concat(direction ? " (".concat(direction, ")") : '');
    },
    promptChangePivotRowsLabel: function (count) { return "Filas (".concat(count, ")"); },
    promptChangePivotValuesLabel: function (count) { return "Valores (".concat(count, ")"); },
    promptChangePivotValuesDescription: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeChartsLabel: function (dimensionsCount, valuesCount) {
        return "Dimensiones (".concat(dimensionsCount, "), Valores (").concat(valuesCount, ")");
    },
};
exports.esES = (0, getGridLocalization_1.getGridLocalization)(esESGrid);
