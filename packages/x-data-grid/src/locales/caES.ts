import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, buildLocaleFormat } from '../utils/getGridLocalization';
import type { Localization } from '../utils/getGridLocalization';

const formatNumber = buildLocaleFormat('ca-ES');

const caESGrid: Partial<GridLocaleText> = {
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

  // Undo/redo toolbar button text
  toolbarUndo: 'Desfés',
  toolbarRedo: 'Refés',

  // Columns selector toolbar button text
  toolbarColumns: 'Columnes',
  toolbarColumnsLabel: 'Selecciona columnes',

  // Filters toolbar button text
  toolbarFilters: 'Filtres',
  toolbarFiltersLabel: 'Mostra filtres',
  toolbarFiltersTooltipHide: 'Amaga filtres',
  toolbarFiltersTooltipShow: 'Mostra filtres',
  toolbarFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtres actius` : `${count} filtre actiu`,

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

  // Formula bar (Premium formulas)
  // formulaBarLabel: 'Formula bar',
  // formulaBarInputLabel: 'Formula',
  // formulaBarAddressLabel: 'Active cell',

  // Computed columns (Premium)
  // columnMenuAddComputedColumn: 'Add computed column',
  // columnMenuEditComputedColumn: 'Edit computed column',
  // columnMenuRemoveComputedColumn: 'Remove computed column',
  // toolbarComputedColumns: 'Computed columns',
  // computedColumnsPanelTitle: 'Computed columns',
  // computedColumnsPanelCloseButton: 'Close computed columns panel',
  // computedColumnsPanelBackButton: 'Back to the list',
  // computedColumnsPanelEmpty: 'No computed columns yet',
  // computedColumnsPanelAddButton: 'Add computed column',
  // computedColumnsPanelItemMenuLabel: 'Computed column actions',
  // computedColumnEditorNewTitle: 'New computed column',
  // computedColumnEditorEditTitle: 'Edit computed column',
  // computedColumnNameLabel: 'Name',
  // computedColumnFieldLabel: 'Field',
  // computedColumnFormulaLabel: 'Formula',
  // computedColumnTypeLabel: 'Result type',
  // computedColumnTypeNumber: 'Number',
  // computedColumnTypeString: 'Text',
  // computedColumnTypeBoolean: 'Boolean',
  // computedColumnTypeDate: 'Date',
  // computedColumnTypeDateTime: 'Date and time',
  // computedColumnFormatLabel: 'Format',
  // computedColumnFormatStyleDecimal: 'Number',
  // computedColumnFormatStylePercent: 'Percent',
  // computedColumnFormatStyleCurrency: 'Currency',
  // computedColumnFormatCurrencyLabel: 'Currency code',
  // computedColumnFormatDecimalsLabel: 'Decimals',
  // computedColumnFormatGroupingLabel: 'Thousands separator',
  // computedColumnPreviewLabel: 'Preview',
  // computedColumnPreviewRow: rowIndex => `Row ${rowIndex}`,
  // computedColumnPreviewNoRows: 'No rows to preview',
  // computedColumnReferenceTitle: 'Insert',
  // computedColumnReferenceColumns: 'Columns',
  // computedColumnReferenceFunctions: 'Functions',
  // computedColumnReferenceSearchPlaceholder: 'Search',
  // computedColumnReferenceNoResults: 'No matches',
  // computedColumnApplyButton: 'Apply',
  // computedColumnAddButton: 'Add column',
  // computedColumnCancelButton: 'Cancel',
  // computedColumnDeleteButton: 'Delete column',
  // computedColumnHeaderLabel: 'Computed column',
  // computedColumnHeaderInvalidLabel: 'Computed column with an invalid formula',
  // computedColumnErrorNameRequired: 'Enter a name.',
  // computedColumnErrorFieldRequired: 'Enter a field name.',
  // computedColumnErrorFieldInvalid: 'Use letters, digits and underscores, starting with a letter or an underscore.',
  // computedColumnErrorFieldExists: field => `A column with the field "${field}" already exists.`,
  // computedColumnErrorFieldA1Like: 'This field name reads as a cell address. Choose a longer name.',
  // computedColumnErrorFormulaRequired: 'Enter a formula.',
  // computedColumnErrorParse: message => `Formula error: ${message}`,
  // computedColumnErrorUnknownFunction: name => `Unknown function ${name}.`,
  // computedColumnErrorUnsupportedReference: 'Computed columns can only reference columns of the same row. Use bare field names.',
  // computedColumnErrorUnknownField: field => `Column "${field}" does not exist.`,
  // computedColumnErrorSelfReference: 'A computed column cannot reference itself.',
  // computedColumnErrorCycle: path => `Circular reference: ${path}.`,
  // computedCellErrorDivByZero: 'Division by zero in this row. Wrap the division in IFERROR(…, 0) to provide a fallback.',
  // computedCellErrorValue: 'A value in this row has the wrong type for this operation.',
  // computedCellErrorRef: 'A referenced column does not exist.',
  // computedCellErrorName: 'The formula uses an unknown function.',
  // computedCellErrorCycle: 'The formula depends on itself.',
  // computedCellErrorGeneric: 'The formula could not be evaluated for this row.',

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
  filterPanelColumn: 'Columnes',
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
  columnMenuAriaLabel: (columnName: string) => `Menú de la columna ${columnName}`,
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
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtres actius` : `${count} filtre actiu`,
  columnHeaderFiltersLabel: 'Mostra filtres',
  columnHeaderSortIconLabel: 'Ordena',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count > 1
      ? `${count.toLocaleString()} files seleccionades`
      : `${count.toLocaleString()} fila seleccionada`,

  // Total row amount footer text
  footerTotalRows: 'Files totals:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Casella de selecció',
  checkboxSelectionSelectAllRows: 'Selecciona totes les files',
  checkboxSelectionUnselectAllRows: 'Desselecciona totes les files',
  checkboxSelectionSelectRow: 'Selecciona fila',
  checkboxSelectionUnselectRow: 'Desselecciona fila',

  // Boolean cell text
  booleanCellTrueLabel: 'sí',
  booleanCellFalseLabel: 'no',

  // Long text cell
  longTextCellExpandLabel: 'Expandeix',
  longTextCellCollapseLabel: 'Contrau',

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
  groupColumn: (name) => `Agrupa per ${name}`,
  unGroupColumn: (name) => `No agrupis per ${name}`,

  // Master/detail
  detailPanelToggle: 'Alterna detall',
  expandDetailPanel: 'Expandeix',
  collapseDetailPanel: 'Contrau',

  // Pagination
  paginationRowsPerPage: 'Files per pàgina:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${formatNumber(from)}–${formatNumber(to)} de ${count !== -1 ? formatNumber(count) : `més de ${formatNumber(to)}`}`;
    }
    const estimatedLabel =
      estimated && estimated > to
        ? `al voltant de ${formatNumber(estimated)}`
        : `més de ${formatNumber(to)}`;
    return `${formatNumber(from)}–${formatNumber(to)} de ${count !== -1 ? formatNumber(count) : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
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
  chartsMenuAddToDimensions: (dimensionLabel: string) => `Afegeix a ${dimensionLabel}`,
  chartsMenuAddToValues: (valuesLabel: string) => `Afegeix a ${valuesLabel}`,
  chartsMenuMoveUp: 'Mou amunt',
  chartsMenuMoveDown: 'Mou avall',
  chartsMenuMoveToTop: 'Mou al principi',
  chartsMenuMoveToBottom: 'Mou al final',
  chartsMenuOptions: 'Opcions del camp',
  chartsMenuRemove: 'Elimina',
  chartsDragToDimensions: (dimensionLabel: string) =>
    `Arrossega aquí per utilitzar la columna com a ${dimensionLabel}`,
  chartsDragToValues: (valuesLabel: string) =>
    `Arrossega aquí per utilitzar la columna com a ${valuesLabel}`,

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
  promptFieldSpeechRecognitionNotSupported:
    'El reconeixement de veu no és compatible amb aquest navegador',
  promptFieldSend: 'Envia',
  promptFieldRecord: 'Enregistra',
  promptFieldStopRecording: "Atura l'enregistrament",

  // Prompt
  promptRerun: 'Torna a executar',
  promptProcessing: 'Processant…',
  promptAppliedChanges: "S'han aplicat els canvis",

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `Agrupa per ${column}`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `Agrega ${column} (${aggregation})`,
  promptChangeFilterLabel: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `${column} és un de: ${value}`;
    }
    return `${column} ${operator} ${value}`;
  },
  promptChangeFilterDescription: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `Filtra per ${column} quan sigui un de: ${value}`;
    }
    return `Filtra per ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `Ordena per ${column} (${direction})`,
  promptChangePivotEnableLabel: 'Taula dinàmica',
  promptChangePivotEnableDescription: 'Activa la taula dinàmica',
  promptChangePivotColumnsLabel: (count: number) => `Columnes (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `Files (${count})`,
  promptChangePivotValuesLabel: (count: number) => `Valors (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) =>
    `Dimensions (${dimensionsCount}), Valors (${valuesCount})`,
};

export const caES: Localization = getGridLocalization(caESGrid);
