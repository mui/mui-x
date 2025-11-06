"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ptBR = void 0;
var getGridLocalization_1 = require("../utils/getGridLocalization");
var ptBRGrid = {
    // Root
    noRowsLabel: 'Nenhuma linha',
    noResultsOverlayLabel: 'Nenhum resultado encontrado.',
    noColumnsOverlayLabel: 'Nenhuma coluna',
    noColumnsOverlayManageColumns: 'Gerenciar colunas',
    emptyPivotOverlayLabel: 'Adicionar campos às linhas, colunas e valores para criar uma tabela dinâmica',
    // Density selector toolbar button text
    toolbarDensity: 'Densidade',
    toolbarDensityLabel: 'Densidade',
    toolbarDensityCompact: 'Compacto',
    toolbarDensityStandard: 'Padrão',
    toolbarDensityComfortable: 'Confortável',
    // Columns selector toolbar button text
    toolbarColumns: 'Colunas',
    toolbarColumnsLabel: 'Exibir seletor de colunas',
    // Filters toolbar button text
    toolbarFilters: 'Filtros',
    toolbarFiltersLabel: 'Exibir filtros',
    toolbarFiltersTooltipHide: 'Ocultar filtros',
    toolbarFiltersTooltipShow: 'Exibir filtros',
    toolbarFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " filtros ativos") : "".concat(count, " filtro ativo");
    },
    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'Procurar…',
    toolbarQuickFilterLabel: 'Procurar',
    toolbarQuickFilterDeleteIconLabel: 'Limpar',
    // Export selector toolbar button text
    toolbarExport: 'Exportar',
    toolbarExportLabel: 'Exportar',
    toolbarExportCSV: 'Baixar como CSV',
    toolbarExportPrint: 'Imprimir',
    toolbarExportExcel: 'Baixar como Excel',
    // Toolbar pivot button
    toolbarPivot: 'Pivotar',
    // Toolbar charts button
    toolbarCharts: 'Gráficos',
    // Toolbar AI Assistant button
    toolbarAssistant: 'Assistente de IA',
    // Columns management text
    columnsManagementSearchTitle: 'Buscar',
    columnsManagementNoColumns: 'Nenhuma coluna',
    columnsManagementShowHideAllText: 'Mostrar/Ocultar Todas',
    columnsManagementReset: 'Redefinir',
    columnsManagementDeleteIconLabel: 'Limpar',
    // Filter panel text
    filterPanelAddFilter: 'Adicionar filtro',
    filterPanelRemoveAll: 'Remover todos',
    filterPanelDeleteIconLabel: 'Excluir',
    filterPanelLogicOperator: 'Operador lógico',
    filterPanelOperator: 'Operador',
    filterPanelOperatorAnd: 'E',
    filterPanelOperatorOr: 'Ou',
    filterPanelColumns: 'Colunas',
    filterPanelInputLabel: 'Valor',
    filterPanelInputPlaceholder: 'Filtrar valor',
    // Filter operators text
    filterOperatorContains: 'contém',
    filterOperatorDoesNotContain: 'não contém',
    filterOperatorEquals: 'é igual a',
    filterOperatorDoesNotEqual: 'não é igual a',
    filterOperatorStartsWith: 'começa com',
    filterOperatorEndsWith: 'termina com',
    filterOperatorIs: 'é',
    filterOperatorNot: 'não é',
    filterOperatorAfter: 'após',
    filterOperatorOnOrAfter: 'em ou após',
    filterOperatorBefore: 'antes de',
    filterOperatorOnOrBefore: 'em ou antes de',
    filterOperatorIsEmpty: 'está vazio',
    filterOperatorIsNotEmpty: 'não está vazio',
    filterOperatorIsAnyOf: 'é qualquer um dos',
    'filterOperator=': 'igual à',
    'filterOperator!=': 'diferente de',
    'filterOperator>': 'maior que',
    'filterOperator>=': 'maior ou igual que',
    'filterOperator<': 'menor que',
    'filterOperator<=': 'menor ou igual que',
    // Header filter operators text
    headerFilterOperatorContains: 'Contém',
    headerFilterOperatorDoesNotContain: 'Não contém',
    headerFilterOperatorEquals: 'Igual',
    headerFilterOperatorDoesNotEqual: 'Não é igual a',
    headerFilterOperatorStartsWith: 'Começa com',
    headerFilterOperatorEndsWith: 'Termina com',
    headerFilterOperatorIs: 'É',
    headerFilterOperatorNot: 'Não é',
    headerFilterOperatorAfter: 'Depois de',
    headerFilterOperatorOnOrAfter: 'Está entre ou depois de',
    headerFilterOperatorBefore: 'Antes de',
    headerFilterOperatorOnOrBefore: 'Está entre ou antes de',
    headerFilterOperatorIsEmpty: 'É vazio',
    headerFilterOperatorIsNotEmpty: 'Não é vazio',
    headerFilterOperatorIsAnyOf: 'É algum',
    'headerFilterOperator=': 'Igual',
    'headerFilterOperator!=': 'Não igual',
    'headerFilterOperator>': 'Maior que',
    'headerFilterOperator>=': 'Maior que ou igual a',
    'headerFilterOperator<': 'Menor que',
    'headerFilterOperator<=': 'Menor que ou igual a',
    headerFilterClear: 'Limpar filtro',
    // Filter values text
    filterValueAny: 'qualquer',
    filterValueTrue: 'verdadeiro',
    filterValueFalse: 'falso',
    // Column menu text
    columnMenuLabel: 'Menu',
    columnMenuAriaLabel: function (columnName) { return "menu da coluna ".concat(columnName); },
    columnMenuShowColumns: 'Exibir colunas',
    columnMenuManageColumns: 'Gerir colunas',
    columnMenuFilter: 'Filtrar',
    columnMenuHideColumn: 'Ocultar coluna',
    columnMenuUnsort: 'Desfazer ordenação',
    columnMenuSortAsc: 'Ordenar do menor para o maior',
    columnMenuSortDesc: 'Ordenar do maior para o menor',
    columnMenuManagePivot: 'Gerenciar pivot',
    columnMenuManageCharts: 'Gerenciar gráficos',
    // Column header text
    columnHeaderFiltersTooltipActive: function (count) {
        return count !== 1 ? "".concat(count, " filtros ativos") : "".concat(count, " filtro ativo");
    },
    columnHeaderFiltersLabel: 'Exibir filtros',
    columnHeaderSortIconLabel: 'Ordenar',
    // Rows selected footer text
    footerRowSelected: function (count) {
        return count !== 1
            ? "".concat(count.toLocaleString(), " linhas selecionadas")
            : "".concat(count.toLocaleString(), " linha selecionada");
    },
    // Total row amount footer text
    footerTotalRows: 'Total de linhas:',
    // Total visible row amount footer text
    footerTotalVisibleRows: function (visibleCount, totalCount) {
        return "".concat(visibleCount.toLocaleString(), " de ").concat(totalCount.toLocaleString());
    },
    // Checkbox selection text
    checkboxSelectionHeaderName: 'Caixa de seleção',
    checkboxSelectionSelectAllRows: 'Selecionar todas as linhas',
    checkboxSelectionUnselectAllRows: 'Deselecionar todas as linhas',
    checkboxSelectionSelectRow: 'Selecionar linha',
    checkboxSelectionUnselectRow: 'Deselecionar linha',
    // Boolean cell text
    booleanCellTrueLabel: 'sim',
    booleanCellFalseLabel: 'não',
    // Actions cell more text
    actionsCellMore: 'mais',
    // Column pinning text
    pinToLeft: 'Fixar à esquerda',
    pinToRight: 'Fixar à direita',
    unpin: 'Desafixar',
    // Tree Data
    treeDataGroupingHeaderName: 'Grupo',
    treeDataExpand: 'mostrar filhos',
    treeDataCollapse: 'ocultar filhos',
    // Grouping columns
    groupingColumnHeaderName: 'Grupo',
    groupColumn: function (name) { return "Agrupar por ".concat(name); },
    unGroupColumn: function (name) { return "Parar agrupamento por ".concat(name); },
    // Master/detail
    detailPanelToggle: 'Painel de detalhes',
    expandDetailPanel: 'Expandir',
    collapseDetailPanel: 'Recolher',
    // Pagination
    paginationRowsPerPage: 'Linhas por página:',
    paginationDisplayedRows: function (_a) {
        var from = _a.from, to = _a.to, count = _a.count, estimated = _a.estimated;
        if (!estimated) {
            return "".concat(from, "\u2013").concat(to, " de ").concat(count !== -1 ? count : "mais de ".concat(to));
        }
        var estimatedLabel = estimated && estimated > to ? "cerca de ".concat(estimated) : "mais de ".concat(to);
        return "".concat(from, "\u2013").concat(to, " de ").concat(count !== -1 ? count : estimatedLabel);
    },
    paginationItemAriaLabel: function (type) {
        if (type === 'first') {
            return 'Ir para a primeira página';
        }
        if (type === 'last') {
            return 'Ir para a última página';
        }
        if (type === 'next') {
            return 'Ir para a próxima página';
        }
        // if (type === 'previous') {
        return 'Ir para a página anterior';
    },
    // Row reordering text
    rowReorderingHeaderName: 'Reorganizar linhas',
    // Aggregation
    aggregationMenuItemHeader: 'Agrupar',
    aggregationFunctionLabelNone: 'nenhum',
    aggregationFunctionLabelSum: 'soma',
    aggregationFunctionLabelAvg: 'média',
    aggregationFunctionLabelMin: 'mín',
    aggregationFunctionLabelMax: 'máx',
    aggregationFunctionLabelSize: 'tamanho',
    // Pivot panel
    pivotToggleLabel: 'Pivot',
    pivotRows: 'Linhas',
    pivotColumns: 'Colunas',
    pivotValues: 'Valores',
    pivotCloseButton: 'Fechar configurações de pivot',
    pivotSearchButton: 'Pesquisar campos',
    pivotSearchControlPlaceholder: 'Pesquisar campos',
    pivotSearchControlLabel: 'Pesquisar campos',
    pivotSearchControlClear: 'Limpar pesquisa',
    pivotNoFields: 'Nenhum campo',
    pivotMenuMoveUp: 'Mover para cima',
    pivotMenuMoveDown: 'Mover para baixo',
    pivotMenuMoveToTop: 'Mover para o topo',
    pivotMenuMoveToBottom: 'Mover para a parte inferior',
    pivotMenuRows: 'Linhas',
    pivotMenuColumns: 'Colunas',
    pivotMenuValues: 'Valores',
    pivotMenuOptions: 'Opções de campo',
    pivotMenuAddToRows: 'Adicionar às Linhas',
    pivotMenuAddToColumns: 'Adicionar às Colunas',
    pivotMenuAddToValues: 'Adicionar aos Valores',
    pivotMenuRemove: 'Remover',
    pivotDragToRows: 'Arraste aqui para criar linhas',
    pivotDragToColumns: 'Arraste aqui para criar colunas',
    pivotDragToValues: 'Arraste aqui para criar valores',
    pivotYearColumnHeaderName: '(Ano)',
    pivotQuarterColumnHeaderName: '(Trimestre)',
    // Charts configuration panel
    chartsNoCharts: 'Não há gráficos disponíveis',
    chartsChartNotSelected: 'Selecione um tipo de gráfico para configurar suas opções',
    chartsTabChart: 'Gráfico',
    chartsTabFields: 'Campos',
    chartsTabCustomize: 'Personalizar',
    chartsCloseButton: 'Fechar configuração de gráficos',
    chartsSyncButtonLabel: 'Sincronizar gráfico',
    chartsSearchPlaceholder: 'Pesquisar campos',
    chartsSearchLabel: 'Pesquisar campos',
    chartsSearchClear: 'Limpar pesquisa',
    chartsNoFields: 'Nenhum campo',
    chartsFieldBlocked: 'Este campo não pode ser adicionado a nenhuma seção',
    chartsCategories: 'Categorias',
    chartsSeries: 'Séries',
    chartsMenuAddToDimensions: function (dimensionLabel) { return "Adicionar a ".concat(dimensionLabel); },
    chartsMenuAddToValues: function (valuesLabel) { return "Adicionar a ".concat(valuesLabel); },
    chartsMenuMoveUp: 'Mover para cima',
    chartsMenuMoveDown: 'Mover para baixo',
    chartsMenuMoveToTop: 'Mover para o topo',
    chartsMenuMoveToBottom: 'Mover para a parte inferior',
    chartsMenuOptions: 'Opções de campo',
    chartsMenuRemove: 'Remover',
    chartsDragToDimensions: function (dimensionLabel) {
        return "Arraste aqui para usar a coluna como ".concat(dimensionLabel);
    },
    chartsDragToValues: function (valuesLabel) {
        return "Arraste aqui para usar a coluna como ".concat(valuesLabel);
    },
    // AI Assistant panel
    aiAssistantPanelTitle: 'Assistente de IA',
    aiAssistantPanelClose: 'Fechar Assistente de IA',
    aiAssistantPanelNewConversation: 'Nova conversa',
    aiAssistantPanelConversationHistory: 'Histórico de conversas',
    aiAssistantPanelEmptyConversation: 'Sem histórico de prompts',
    aiAssistantSuggestions: 'Sugestões',
    // Prompt field
    promptFieldLabel: 'Prompt',
    promptFieldPlaceholder: 'Digite um prompt…',
    promptFieldPlaceholderWithRecording: 'Digite ou grave um prompt…',
    promptFieldPlaceholderListening: 'Ouvindo o prompt…',
    promptFieldSpeechRecognitionNotSupported: 'O reconhecimento de fala não é suportado neste navegador',
    promptFieldSend: 'Enviar',
    promptFieldRecord: 'Gravar',
    promptFieldStopRecording: 'Parar gravação',
    // Prompt
    promptRerun: 'Executar novamente',
    promptProcessing: 'Processando…',
    promptAppliedChanges: 'Alterações aplicadas',
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
            return "".concat(column, " \u00E9 um destes: ").concat(value);
        }
        return "".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeFilterDescription: function (column, operator, value) {
        if (operator === 'is any of') {
            return "Filtrar onde ".concat(column, " \u00E9 um destes: ").concat(value);
        }
        return "Filtrar onde ".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeSortDescription: function (column, direction) {
        return "Classificar por ".concat(column, " (").concat(direction, ")");
    },
    promptChangePivotEnableLabel: 'Pivotar',
    promptChangePivotEnableDescription: 'Ativar pivotar',
    promptChangePivotColumnsLabel: function (count) { return "Colunas (".concat(count, ")"); },
    promptChangePivotColumnsDescription: function (column, direction) {
        return "".concat(column).concat(direction ? " (".concat(direction, ")") : '');
    },
    promptChangePivotRowsLabel: function (count) { return "Linhas (".concat(count, ")"); },
    promptChangePivotValuesLabel: function (count) { return "Valores (".concat(count, ")"); },
    promptChangePivotValuesDescription: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
    // promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) => `Dimensions (${dimensionsCount}), Values (${valuesCount})`,
};
exports.ptBR = (0, getGridLocalization_1.getGridLocalization)(ptBRGrid);
