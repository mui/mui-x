import { ptPT as ptPTCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization } from '../utils/getGridLocalization';

const ptPTGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Nenhuma linha',
  noResultsOverlayLabel: 'Nenhum resultado encontrado.',

  // Density selector toolbar button text
  toolbarDensity: 'Densidade',
  toolbarDensityLabel: 'Densidade',
  toolbarDensityCompact: 'Compactar',
  toolbarDensityStandard: 'Padrão',
  toolbarDensityComfortable: 'Confortável',

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
  toolbarQuickFilterDeleteIconLabel: 'Claro',

  // Prompt toolbar field
  toolbarPromptControlPlaceholder: 'Digite um prompt…',
  toolbarPromptControlWithRecordingPlaceholder: 'Digite ou grave um prompt…',
  toolbarPromptControlRecordingPlaceholder: 'Ouvindo o prompt…',
  toolbarPromptControlLabel: 'Entrada de prompt',
  toolbarPromptControlRecordButtonDefaultLabel: 'Gravar',
  toolbarPromptControlRecordButtonActiveLabel: 'Parar gravação',
  toolbarPromptControlSendActionLabel: 'Enviar',
  toolbarPromptControlSendActionAriaLabel: 'Enviar prompt',
  toolbarPromptControlErrorMessage:
    'Ocorreu um erro ao processar a solicitação. Por favor, tente novamente com um prompt diferente.',

  // Export selector toolbar button text
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Descarregar como CSV',
  toolbarExportPrint: 'Imprimir',
  toolbarExportExcel: 'Descarregar como Excel',

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
  'headerFilterOperator>=': 'Melhor que ou igual a',
  'headerFilterOperator<': 'Menor que',
  'headerFilterOperator<=': 'Menos que ou igual a',

  // Filter values text
  filterValueAny: 'qualquer',
  filterValueTrue: 'verdadeiro',
  filterValueFalse: 'falso',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Mostrar colunas',
  columnMenuManageColumns: 'Gerir colunas',
  columnMenuFilter: 'Filtro',
  columnMenuHideColumn: 'Ocultar coluna',
  columnMenuUnsort: 'Desclassificar',
  columnMenuSortAsc: 'Classificar por ordem crescente',
  columnMenuSortDesc: 'Classificar por ordem decrescente',

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

  // Actions cell more text
  actionsCellMore: 'mais',

  // Column pinning text
  pinToLeft: 'Fixar à esquerda',
  pinToRight: 'Fixar à direita',
  unpin: 'Desafixar',

  // Tree Data
  treeDataGroupingHeaderName: 'Grupo',
  treeDataExpand: 'ver crianças',
  treeDataCollapse: 'esconder crianças',

  // Grouping columns
  groupingColumnHeaderName: 'Grupo',
  groupColumn: (name) => `Agrupar por ${name}`,
  unGroupColumn: (name) => `Pare de agrupar por ${name}`,

  // Master/detail
  detailPanelToggle: 'Alternar painel de detalhes',
  expandDetailPanel: 'Expandir',
  collapseDetailPanel: 'Colapsar',

  // Row reordering text
  rowReorderingHeaderName: 'Reordenação de linhas',

  // Aggregation
  aggregationMenuItemHeader: 'Agregação',
  aggregationFunctionLabelSum: 'soma',
  aggregationFunctionLabelAvg: 'média',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'máx.',
  aggregationFunctionLabelSize: 'tamanho',
};

export const ptPT = getGridLocalization(ptPTGrid, ptPTCore);
