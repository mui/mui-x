import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import {
  getGridLocalization,
  type Localization,
  buildLocaleFormat,
} from '../utils/getGridLocalization';

const formatNumber = buildLocaleFormat('pt-PT');

const ptPTGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Nenhuma linha',
  noResultsOverlayLabel: 'Nenhum resultado encontrado.',
  noColumnsOverlayLabel: 'Sem colunas',
  noColumnsOverlayManageColumns: 'Gerir colunas',
  emptyPivotOverlayLabel:
    'Adicione campos às linhas, colunas e valores para criar uma tabela dinâmica',

  // Density selector toolbar button text
  toolbarDensity: 'Densidade',
  toolbarDensityLabel: 'Densidade',
  toolbarDensityCompact: 'Compacto',
  toolbarDensityStandard: 'Padrão',
  toolbarDensityComfortable: 'Confortável',

  // Undo/redo toolbar button text
  toolbarUndo: 'Anular',
  toolbarRedo: 'Refazer',

  // Columns selector toolbar button text
  toolbarColumns: 'Colunas',
  toolbarColumnsLabel: 'Selecione colunas',

  // Filters toolbar button text
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Mostrar filtros',
  toolbarFiltersTooltipHide: 'Ocultar filtros',
  toolbarFiltersTooltipShow: 'Mostrar filtros',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros ativos` : `${count} filtro ativo`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Procurar…',
  toolbarQuickFilterLabel: 'Procurar',
  toolbarQuickFilterDeleteIconLabel: 'Limpar',

  // Export selector toolbar button text
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Descarregar como CSV',
  toolbarExportPrint: 'Imprimir',
  toolbarExportExcel: 'Descarregar como Excel',

  // Toolbar pivot button
  toolbarPivot: 'Pivot',

  // Toolbar charts button
  toolbarCharts: 'Gráficos',

  // Toolbar AI Assistant button
  toolbarAssistant: 'Assistente de IA',

  // Columns management text
  columnsManagementSearchTitle: 'Procurar',
  columnsManagementNoColumns: 'Sem colunas',
  columnsManagementShowHideAllText: 'Mostrar/Ocultar Todas',
  columnsManagementReset: 'Repor',
  columnsManagementDeleteIconLabel: 'Limpar',

  // Filter panel text
  filterPanelAddFilter: 'Adicionar filtro',
  filterPanelRemoveAll: 'Excluir todos',
  filterPanelDeleteIconLabel: 'Excluir',
  filterPanelLogicOperator: 'Operador lógico',
  filterPanelOperator: 'Operador',
  filterPanelOperatorAnd: 'E',
  filterPanelOperatorOr: 'Ou',
  filterPanelColumns: 'Colunas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Valor do filtro',

  // Filter operators text
  filterOperatorContains: 'contém',
  filterOperatorDoesNotContain: 'não contém',
  filterOperatorEquals: 'é igual a',
  filterOperatorDoesNotEqual: 'não é igual a',
  filterOperatorStartsWith: 'começa com',
  filterOperatorEndsWith: 'termina com',
  filterOperatorIs: 'é',
  filterOperatorNot: 'não é',
  filterOperatorAfter: 'está depois',
  filterOperatorOnOrAfter: 'está ligado ou depois',
  filterOperatorBefore: 'é antes',
  filterOperatorOnOrBefore: 'está ligado ou antes',
  filterOperatorIsEmpty: 'está vazia',
  filterOperatorIsNotEmpty: 'não está vazio',
  filterOperatorIsAnyOf: 'é qualquer um',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Contém',
  headerFilterOperatorDoesNotContain: 'Não contém',
  headerFilterOperatorEquals: 'É igual a',
  headerFilterOperatorDoesNotEqual: 'Não é igual',
  headerFilterOperatorStartsWith: 'Começa com',
  headerFilterOperatorEndsWith: 'Termina com',
  headerFilterOperatorIs: 'É',
  headerFilterOperatorNot: 'Não é',
  headerFilterOperatorAfter: 'Está depois',
  headerFilterOperatorOnOrAfter: 'Está ligado ou depois',
  headerFilterOperatorBefore: 'É antes',
  headerFilterOperatorOnOrBefore: 'Está ligado ou antes',
  headerFilterOperatorIsEmpty: 'Está vazia',
  headerFilterOperatorIsNotEmpty: 'Não está vazio',
  headerFilterOperatorIsAnyOf: 'Algum',
  'headerFilterOperator=': 'É igual a',
  'headerFilterOperator!=': 'Não é igual',
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
  columnMenuAriaLabel: (columnName: string) => `Menu da coluna ${columnName}`,
  columnMenuShowColumns: 'Mostrar colunas',
  columnMenuManageColumns: 'Gerir colunas',
  columnMenuFilter: 'Filtro',
  columnMenuHideColumn: 'Ocultar coluna',
  columnMenuUnsort: 'Desclassificar',
  columnMenuSortAsc: 'Classificar por ordem crescente',
  columnMenuSortDesc: 'Classificar por ordem decrescente',
  columnMenuManagePivot: 'Gerir pivot',
  columnMenuManageCharts: 'Gerir gráficos',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros ativos` : `${count} filtro ativo`,
  columnHeaderFiltersLabel: 'Mostrar filtros',
  columnHeaderSortIconLabel: 'Organizar',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} linhas selecionadas`
      : `${count.toLocaleString()} linha selecionada`,

  // Total row amount footer text
  footerTotalRows: 'Total de linhas:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Seleção de caixa de seleção',
  checkboxSelectionSelectAllRows: 'Selecione todas as linhas',
  checkboxSelectionUnselectAllRows: 'Desmarque todas as linhas',
  checkboxSelectionSelectRow: 'Selecione a linha',
  checkboxSelectionUnselectRow: 'Desmarcar linha',

  // Boolean cell text
  booleanCellTrueLabel: 'sim',
  booleanCellFalseLabel: 'não',

  // Long text cell
  longTextCellExpandLabel: 'Expandir',
  longTextCellCollapseLabel: 'Colapsar',

  // Actions cell more text
  actionsCellMore: 'mais',

  // Column pinning text
  pinToLeft: 'Fixar à esquerda',
  pinToRight: 'Fixar à direita',
  unpin: 'Desafixar',

  // Tree Data
  treeDataGroupingHeaderName: 'Grupo',
  treeDataExpand: 'expandir',
  treeDataCollapse: 'colapsar',

  // Grouping columns
  groupingColumnHeaderName: 'Grupo',
  groupColumn: (name) => `Agrupar por ${name}`,
  unGroupColumn: (name) => `Pare de agrupar por ${name}`,

  // Master/detail
  detailPanelToggle: 'Alternar painel de detalhes',
  expandDetailPanel: 'Expandir',
  collapseDetailPanel: 'Colapsar',

  // Pagination
  paginationRowsPerPage: 'Linhas por página:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${formatNumber(from)}–${formatNumber(to)} de ${count !== -1 ? formatNumber(count) : `mais do que ${formatNumber(to)}`}`;
    }
    const estimatedLabel =
      estimated && estimated > to
        ? `cerca de ${formatNumber(estimated)}`
        : `mais do que ${formatNumber(to)}`;
    return `${formatNumber(from)}–${formatNumber(to)} de ${count !== -1 ? formatNumber(count) : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Primeira página';
    }
    if (type === 'last') {
      return 'Última página';
    }
    if (type === 'next') {
      return 'Próxima página';
    }
    // if (type === 'previous') {
    return 'Página anterior';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Reordenação de linhas',

  // Aggregation
  aggregationMenuItemHeader: 'Agregação',
  aggregationFunctionLabelNone: 'nenhuma',
  aggregationFunctionLabelSum: 'soma',
  aggregationFunctionLabelAvg: 'média',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'máx.',
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
  pivotMenuMoveToBottom: 'Mover para o fundo',
  pivotMenuRows: 'Linhas',
  pivotMenuColumns: 'Colunas',
  pivotMenuValues: 'Valores',
  pivotMenuOptions: 'Opções do campo',
  pivotMenuAddToRows: 'Adicionar às Linhas',
  pivotMenuAddToColumns: 'Adicionar às Colunas',
  pivotMenuAddToValues: 'Adicionar aos Valores',
  pivotMenuRemove: 'Remover',
  pivotDragToRows: 'Arraste para aqui para criar linhas',
  pivotDragToColumns: 'Arraste para aqui para criar colunas',
  pivotDragToValues: 'Arraste para aqui para criar valores',
  pivotYearColumnHeaderName: '(Ano)',
  pivotQuarterColumnHeaderName: '(Trimestre)',

  // Charts configuration panel
  chartsNoCharts: 'Não há gráficos disponíveis',
  chartsChartNotSelected: 'Selecione um tipo de gráfico para configurar as suas opções',
  chartsTabChart: 'Gráfico',
  chartsTabFields: 'Campos',
  chartsTabCustomize: 'Personalizar',
  chartsCloseButton: 'Fechar configuração de gráficos',
  chartsSyncButtonLabel: 'Sincronizar gráfico',
  chartsSearchPlaceholder: 'Pesquisar campos',
  chartsSearchLabel: 'Pesquisar campos',
  chartsSearchClear: 'Limpar pesquisa',
  chartsNoFields: 'Nenhum campo',
  chartsFieldBlocked: 'Este campo não pode ser adicionado a nenhuma secção',
  chartsCategories: 'Categorias',
  chartsSeries: 'Séries',
  chartsMenuAddToDimensions: (dimensionLabel: string) => `Adicionar a ${dimensionLabel}`,
  chartsMenuAddToValues: (valuesLabel: string) => `Adicionar a ${valuesLabel}`,
  chartsMenuMoveUp: 'Mover para cima',
  chartsMenuMoveDown: 'Mover para baixo',
  chartsMenuMoveToTop: 'Mover para o topo',
  chartsMenuMoveToBottom: 'Mover para o fundo',
  chartsMenuOptions: 'Opções do campo',
  chartsMenuRemove: 'Remover',
  chartsDragToDimensions: (dimensionLabel: string) =>
    `Arraste para aqui para usar a coluna como ${dimensionLabel}`,
  chartsDragToValues: (valuesLabel: string) =>
    `Arraste para aqui para usar a coluna como ${valuesLabel}`,

  // AI Assistant panel
  aiAssistantPanelTitle: 'Assistente de IA',
  aiAssistantPanelClose: 'Fechar Assistente de IA',
  aiAssistantPanelNewConversation: 'Nova conversa',
  aiAssistantPanelConversationHistory: 'Histórico de conversas',
  aiAssistantPanelEmptyConversation: 'Nenhum histórico de prompts',
  aiAssistantSuggestions: 'Sugestões',

  // Prompt field
  promptFieldLabel: 'Prompt',
  promptFieldPlaceholder: 'Digite um prompt',
  promptFieldPlaceholderWithRecording: 'Digite ou grave um prompt',
  promptFieldPlaceholderListening: 'Ouvindo o prompt',
  promptFieldSpeechRecognitionNotSupported: 'Reconhecimento de voz não é suportado neste navegador',
  promptFieldSend: 'Enviar',
  promptFieldRecord: 'Gravar',
  promptFieldStopRecording: 'Parar gravação',

  // Prompt
  promptRerun: 'Executar novamente',
  promptProcessing: 'Processando…',
  promptAppliedChanges: 'Alterações aplicadas',

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `Agrupar por ${column}`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `Agregar ${column} (${aggregation})`,
  promptChangeFilterLabel: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `${column} é um de: ${value}`;
    }
    return `${column} ${operator} ${value}`;
  },
  promptChangeFilterDescription: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `Filtrar onde ${column} é um de: ${value}`;
    }
    return `Filtrar onde ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `Ordenar por ${column} (${direction})`,
  promptChangePivotEnableLabel: 'Pivot',
  promptChangePivotEnableDescription: 'Ativar pivot',
  promptChangePivotColumnsLabel: (count: number) => `Colunas (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `Linhas (${count})`,
  promptChangePivotValuesLabel: (count: number) => `Valores (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) =>
    `Dimensões (${dimensionsCount}), Valores (${valuesCount})`,
};

export const ptPT: Localization = getGridLocalization(ptPTGrid);
