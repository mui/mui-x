import { getLocalization, Localization } from '../utils';

export const ptBR: Localization = getLocalization({
    // Root
    rootGridLabel: 'Grade',
    noRowsLabel: 'Nenhuma linha',
    errorOverlayDefaultLabel: 'Ocorreu um erro.',
    
    // Density selector toolbar button text
    toolbarDensity: 'Densidade',
    toolbarDensityLabel: 'Densidade',
    toolbarDensityCompact: 'Compacto',
    toolbarDensityStandard: 'Padrão',
    toolbarDensityComfortable: 'Confortável',
    
    // Columns selector toolbar button text
    toolbarColumns: 'Colunas',
    toolbarColumnsLabel: 'Exibir Seletor de Colunas',
    
    // Filters toolbar button text
    toolbarFilters: 'Filtros',
    toolbarFiltersLabel: 'Exibir Filtros',
    toolbarFiltersTooltipHide: 'Ocultar Filtros',
    toolbarFiltersTooltipShow: 'Exibir Filtros',
    toolbarFiltersTooltipActive: count =>
        `${count} ${count > 1 ? 'filtros' : 'filtro'} ${
            count > 1 ? 'ativos' : 'ativo'
        }`,
    
    // Columns panel text
    columnsPanelTextFieldLabel: 'Localizar coluna',
    columnsPanelTextFieldPlaceholder: 'Título da coluna',
    columnsPanelDragIconLabel: 'Reordenar Coluna',
    columnsPanelShowAllButton: 'Mostrar todas',
    columnsPanelHideAllButton: 'Ocultar todas',
    
    // Filter panel text
    filterPanelAddFilter: 'Adicionar Filtro',
    filterPanelDeleteIconLabel: 'Excluir',
    filterPanelOperators: 'Operadores',
    filterPanelOperatorAnd: 'E',
    filterPanelOperatorOr: 'Ou',
    filterPanelColumns: 'Colunas',
    filterPanelInputLabel: 'Valor',
    filterPanelInputPlaceholder: 'Filtrar valor',
    
    // Filter operators text
    filterOperatorContains: 'contém',
    filterOperatorEquals: 'é igual a',
    filterOperatorStartsWith: 'começa com',
    filterOperatorEndsWith: 'termina com',
    filterOperatorIs: 'é',
    filterOperatorNot: 'não é',
    filterOperatorOnOrAfter: 'em ou após',
    filterOperatorBefore: 'está antes de',
    filterOperatorOnOrBefore: 'em ou antes de',
    
    // Column menu text
    columnMenuLabel: 'Menu',
    columnMenuShowColumns: 'Exibir colunas',
    columnMenuFilter: 'Filtrar',
    columnMenuHideColumn: 'Ocultar',
    columnMenuUnsort: 'Desfazer ordenação',
    columnMenuSortAsc: 'Ordenar do menor para o maior',
    columnMenuSortDesc: 'Ordenar do maior para o menor',
    
    // Column header text
    columnHeaderFiltersTooltipActive: count =>
        `${count} ${count > 1 ? 'filtros' : 'filtro'} ${
            count > 1 ? 'ativos' : 'ativo'
        }`,
    columnHeaderFiltersLabel: 'Exibir Filtros',
    columnHeaderSortIconLabel: 'Ordenar',
    
    // Rows selected footer text
    footerRowSelected: count =>
        count !== 1
            ? `${count.toLocaleString()} linhas selecionadas`
            : `${count.toLocaleString()} linha selecionada`,
    
    // Total rows footer text
    footerTotalRows: 'Total de Linhas:',
    
    // Pagination footer text
    footerPaginationRowsPerPage: 'Linhas por página:',
});
