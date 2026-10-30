import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, buildLocaleFormat } from '../utils/getGridLocalization';
import type { Localization } from '../utils/getGridLocalization';

const formatNumber = buildLocaleFormat('ro-RO');

// Romanian inserts "de" before the plural noun for counts of 20 and above,
// unless the count ends in 01 to 19: "2 filtre active", "20 de filtre active", "101 filtre active"
function getPluralForm(count: number, one: string, few: string) {
  if (count === 1) {
    return one;
  }
  const lastTwoDigits = count % 100;
  if (count < 20 || (lastTwoDigits >= 1 && lastTwoDigits <= 19)) {
    return few;
  }
  return `de ${few}`;
}

const roROGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Lipsă date',
  noResultsOverlayLabel: 'Nu au fost găsite rezultate.',
  noColumnsOverlayLabel: 'Nicio coloană',
  noColumnsOverlayManageColumns: 'Gestionează coloane',
  emptyPivotOverlayLabel:
    'Adaugă câmpuri la rânduri, coloane și valori pentru a crea un tabel pivot',

  // Density selector toolbar button text
  toolbarDensity: 'Înălțime rând',
  toolbarDensityLabel: 'Înălțime rând',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Lat',

  // Undo/redo toolbar button text
  toolbarUndo: 'Anulează',
  toolbarRedo: 'Refă',

  // Columns selector toolbar button text
  toolbarColumns: 'Coloane',
  toolbarColumnsLabel: 'Afișează selecție coloane',

  // Filters toolbar button text
  toolbarFilters: 'Filtru',
  toolbarFiltersLabel: 'Afișează filtru',
  toolbarFiltersTooltipHide: 'Ascunde filtru',
  toolbarFiltersTooltipShow: 'Afișează filtru',
  toolbarFiltersTooltipActive: (count) =>
    `${count} ${getPluralForm(count, 'filtru activ', 'filtre active')}`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Căutare…',
  toolbarQuickFilterLabel: 'Căutare',
  toolbarQuickFilterDeleteIconLabel: 'Ștergere',

  // Export selector toolbar button text
  toolbarExport: 'Export',
  toolbarExportLabel: 'Export',
  toolbarExportCSV: 'Descarcă în format CSV',
  toolbarExportPrint: 'Printare',
  toolbarExportExcel: 'Descarcă în format Excel',

  // Toolbar pivot button
  toolbarPivot: 'Pivot',

  // Toolbar charts button
  toolbarCharts: 'Grafice',

  // Toolbar AI Assistant button
  toolbarAssistant: 'Asistent AI',

  // Formula bar (Premium formulas)
  formulaBarLabel: 'Bara de formule',
  formulaBarInputLabel: 'Formulă',
  formulaBarAddressLabel: 'Celula activă',

  // Computed columns (Premium)
  // columnMenuAddComputedColumn: 'Add computed column',
  // columnMenuEditComputedColumn: 'Edit computed column',
  // columnMenuViewComputedColumn: 'View computed column',
  // columnMenuRemoveComputedColumn: 'Remove computed column',
  // toolbarComputedColumns: 'Computed columns',
  // computedColumnsPanelTitle: 'Computed columns',
  // computedColumnsPanelCloseButton: 'Close computed columns panel',
  // computedColumnsPanelBackButton: 'Back to the list',
  // computedColumnsPanelEmpty: 'No computed columns yet',
  // computedColumnsPanelAddButton: 'Add computed column',
  // computedColumnsPanelItemMenuLabel: 'Computed column actions',
  // computedColumnsPanelItemReadOnlyLabel: 'Read-only',
  // computedColumnEditorNewTitle: 'New computed column',
  // computedColumnEditorEditTitle: 'Edit computed column',
  // computedColumnEditorViewTitle: 'View computed column',
  // computedColumnReadOnlyHint: 'This computed column cannot be edited.',
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
  // computedColumnCloseButton: 'Close',
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
  columnsManagementSearchTitle: 'Caută',
  columnsManagementNoColumns: 'Nicio coloană',
  columnsManagementShowHideAllText: 'Arată/Ascunde tot',
  columnsManagementReset: 'Resetează',
  columnsManagementDeleteIconLabel: 'Șterge',

  // Filter panel text
  filterPanelAddFilter: 'Adăugare filtru',
  filterPanelRemoveAll: 'Șterge tot',
  filterPanelDeleteIconLabel: 'Ștergere',
  filterPanelLogicOperator: 'Operator logic',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'Și',
  filterPanelOperatorOr: 'Sau',
  filterPanelColumn: 'Coloană',
  filterPanelInputLabel: 'Valoare',
  filterPanelInputPlaceholder: 'Filtrare valoare',

  // Filter operators text
  filterOperatorContains: 'conține',
  filterOperatorDoesNotContain: 'nu conține',
  filterOperatorEquals: 'este egal cu',
  filterOperatorDoesNotEqual: 'nu este egal cu',
  filterOperatorStartsWith: 'începe cu',
  filterOperatorEndsWith: 'se termină cu',
  filterOperatorIs: 'este',
  filterOperatorNot: 'nu este',
  filterOperatorAfter: 'este după',
  filterOperatorOnOrAfter: 'este la sau după',
  filterOperatorBefore: 'este înainte de',
  filterOperatorOnOrBefore: 'este la sau înainte de',
  filterOperatorIsEmpty: 'este gol',
  filterOperatorIsNotEmpty: 'nu este gol',
  filterOperatorIsAnyOf: 'este una din valori',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Conține',
  headerFilterOperatorDoesNotContain: 'Nu conține',
  headerFilterOperatorEquals: 'Egal cu',
  headerFilterOperatorDoesNotEqual: 'Nu este egal cu',
  headerFilterOperatorStartsWith: 'Începe cu',
  headerFilterOperatorEndsWith: 'Se termină cu',
  headerFilterOperatorIs: 'Este',
  headerFilterOperatorNot: 'Nu este',
  headerFilterOperatorAfter: 'Este după',
  headerFilterOperatorOnOrAfter: 'Este la sau după',
  headerFilterOperatorBefore: 'Este înainte de',
  headerFilterOperatorOnOrBefore: 'Este la sau înainte de',
  headerFilterOperatorIsEmpty: 'Este gol',
  headerFilterOperatorIsNotEmpty: 'Nu este gol',
  headerFilterOperatorIsAnyOf: 'Este una din valori',
  'headerFilterOperator=': 'Egal cu',
  'headerFilterOperator!=': 'Nu este egal cu',
  'headerFilterOperator>': 'Mai mare decât',
  'headerFilterOperator>=': 'Mai mare sau egal cu',
  'headerFilterOperator<': 'Mai mic decât',
  'headerFilterOperator<=': 'Mai mic sau egal cu',
  headerFilterClear: 'Șterge filtrul',

  // Filter values text
  filterValueAny: 'Oricare',
  filterValueTrue: 'Da',
  filterValueFalse: 'Nu',

  // Column menu text
  columnMenuLabel: 'Meniu',
  columnMenuAriaLabel: (columnName: string) => `Meniul coloanei ${columnName}`,
  columnMenuShowColumns: 'Afișează toate coloanele',
  columnMenuManageColumns: 'Gestionează coloane',
  columnMenuFilter: 'Filtru',
  columnMenuHideColumn: 'Ascunde',
  columnMenuUnsort: 'Dezactivare sortare',
  columnMenuSortAsc: 'Sortează crescător',
  columnMenuSortDesc: 'Sortează descrescător',
  columnMenuManagePivot: 'Gestionează pivotul',
  columnMenuManageCharts: 'Gestionează graficele',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    `${count} ${getPluralForm(count, 'filtru activ', 'filtre active')}`,
  columnHeaderFiltersLabel: 'Afișează filtru',
  columnHeaderSortIconLabel: 'Sortare',
  // columnHeaderSortIconAriaLabel: (columnName, direction) => {
  //   if (direction === 'asc') {
  //     return `Sort ${columnName} in ascending order`;
  //   }
  //   if (direction === 'desc') {
  //     return `Sort ${columnName} in descending order`;
  //   }
  //   return `Remove sorting from ${columnName}`;
  // },

  // Rows selected footer text
  footerRowSelected: (count) =>
    `${count.toLocaleString()} ${getPluralForm(count, 'înregistrare selectată', 'înregistrări selectate')}`,

  // Total row amount footer text
  footerTotalRows: 'Total:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} din ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Selecție prin bifare',
  checkboxSelectionSelectAllRows: 'Selectare toate rândurile',
  checkboxSelectionUnselectAllRows: 'Deselectare toate rândurile',
  checkboxSelectionSelectRow: 'Selectare rând',
  checkboxSelectionUnselectRow: 'Deselectare rând',

  // Boolean cell text
  booleanCellTrueLabel: 'Da',
  booleanCellFalseLabel: 'Nu',

  // Cell editor text
  // emptyCellLabel: 'Empty',

  // Long text cell
  longTextCellExpandLabel: 'Extindere',
  longTextCellCollapseLabel: 'Restrângere',

  // Actions cell more text
  actionsCellMore: 'Mai multe',

  // Column pinning text
  pinToLeft: 'Fixare în stânga',
  pinToRight: 'Fixare în dreapta',
  unpin: 'Anulare fixare',

  // Tree Data
  treeDataGroupingHeaderName: 'Grup',
  treeDataExpand: 'Afișare copii',
  treeDataCollapse: 'Ascundere copii',

  // Grouping columns
  groupingColumnHeaderName: 'Grupare',
  groupColumn: (name) => `Grupare după ${name}`,
  unGroupColumn: (name) => `Anulare grupare după ${name}`,

  // Master/detail
  detailPanelToggle: 'Comutare panou detalii',
  expandDetailPanel: 'Extindere',
  collapseDetailPanel: 'Restrângere',

  // Pagination
  paginationRowsPerPage: 'Rânduri pe pagină:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    const unknownRowCount = count == null || count === -1;
    if (!estimated) {
      return `${formatNumber(from)}–${formatNumber(to)} din ${!unknownRowCount ? formatNumber(count) : `mai mult de ${formatNumber(to)}`}`;
    }
    const estimatedLabel =
      estimated && estimated > to
        ? `aproximativ ${formatNumber(estimated)}`
        : `mai mult de ${formatNumber(to)}`;
    return `${formatNumber(from)}–${formatNumber(to)} din ${!unknownRowCount ? formatNumber(count) : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Mergi la prima pagină';
    }
    if (type === 'last') {
      return 'Mergi la ultima pagină';
    }
    if (type === 'next') {
      return 'Mergi la pagina următoare';
    }
    // if (type === 'previous') {
    return 'Mergi la pagina precedentă';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Reordonare rânduri',

  // Aggregation
  aggregationMenuItemHeader: 'Agregare',
  aggregationFunctionLabelNone: 'Niciuna',
  aggregationFunctionLabelSum: 'Sumă',
  aggregationFunctionLabelAvg: 'Medie',
  aggregationFunctionLabelMin: 'Minim',
  aggregationFunctionLabelMax: 'Maxim',
  aggregationFunctionLabelSize: 'Numărul elementelor',

  // Pivot panel
  pivotToggleLabel: 'Pivot',
  pivotRows: 'Rânduri',
  pivotColumns: 'Coloane',
  pivotValues: 'Valori',
  pivotCloseButton: 'Închide setările pivot',
  pivotSearchButton: 'Caută câmpuri',
  pivotSearchControlPlaceholder: 'Caută câmpuri',
  pivotSearchControlLabel: 'Caută câmpuri',
  pivotSearchControlClear: 'Șterge căutarea',
  pivotNoFields: 'Niciun câmp',
  pivotMenuMoveUp: 'Mută în sus',
  pivotMenuMoveDown: 'Mută în jos',
  pivotMenuMoveToTop: 'Mută la început',
  pivotMenuMoveToBottom: 'Mută la sfârșit',
  pivotMenuRows: 'Rânduri',
  pivotMenuColumns: 'Coloane',
  pivotMenuValues: 'Valori',
  pivotMenuOptions: 'Opțiuni câmp',
  pivotMenuAddToRows: 'Adaugă la rânduri',
  pivotMenuAddToColumns: 'Adaugă la coloane',
  pivotMenuAddToValues: 'Adaugă la valori',
  pivotMenuRemove: 'Elimină',
  pivotDragToRows: 'Trage aici pentru a crea rânduri',
  pivotDragToColumns: 'Trage aici pentru a crea coloane',
  pivotDragToValues: 'Trage aici pentru a crea valori',
  pivotYearColumnHeaderName: '(An)',
  pivotQuarterColumnHeaderName: '(Trimestru)',

  // Charts configuration panel
  chartsNoCharts: 'Nu există grafice disponibile',
  chartsChartNotSelected: 'Selectează un tip de grafic pentru a-i configura opțiunile',
  chartsTabChart: 'Grafic',
  chartsTabFields: 'Câmpuri',
  chartsTabCustomize: 'Personalizare',
  chartsCloseButton: 'Închide configurarea graficelor',
  chartsSyncButtonLabel: 'Sincronizează graficul',
  chartsSearchPlaceholder: 'Caută câmpuri',
  chartsSearchLabel: 'Caută câmpuri',
  chartsSearchClear: 'Șterge căutarea',
  chartsNoFields: 'Niciun câmp',
  chartsFieldBlocked: 'Acest câmp nu poate fi adăugat în nicio secțiune',
  chartsCategories: 'Categorii',
  chartsSeries: 'Serii',
  chartsMenuAddToDimensions: (dimensionLabel: string) => `Adaugă la ${dimensionLabel}`,
  chartsMenuAddToValues: (valuesLabel: string) => `Adaugă la ${valuesLabel}`,
  chartsMenuMoveUp: 'Mută în sus',
  chartsMenuMoveDown: 'Mută în jos',
  chartsMenuMoveToTop: 'Mută la început',
  chartsMenuMoveToBottom: 'Mută la sfârșit',
  chartsMenuOptions: 'Opțiuni câmp',
  chartsMenuRemove: 'Elimină',
  chartsDragToDimensions: (dimensionLabel: string) =>
    `Trage aici pentru a folosi coloana ca ${dimensionLabel}`,
  chartsDragToValues: (valuesLabel: string) =>
    `Trage aici pentru a folosi coloana ca ${valuesLabel}`,

  // AI Assistant panel
  aiAssistantPanelTitle: 'Asistent AI',
  aiAssistantPanelClose: 'Închide asistentul AI',
  aiAssistantPanelNewConversation: 'Conversație nouă',
  aiAssistantPanelConversationHistory: 'Istoricul conversațiilor',
  aiAssistantPanelEmptyConversation: 'Niciun prompt în istoric',
  aiAssistantSuggestions: 'Sugestii',

  // Prompt field
  promptFieldLabel: 'Prompt',
  promptFieldPlaceholder: 'Scrie un prompt…',
  promptFieldPlaceholderWithRecording: 'Scrie sau înregistrează un prompt…',
  promptFieldPlaceholderListening: 'Ascultare prompt…',
  promptFieldSpeechRecognitionNotSupported:
    'Recunoașterea vocală nu este acceptată în acest browser',
  promptFieldSend: 'Trimite',
  promptFieldRecord: 'Înregistrează',
  promptFieldStopRecording: 'Oprește înregistrarea',

  // Prompt
  promptRerun: 'Rulează din nou',
  promptProcessing: 'Se procesează…',
  promptAppliedChanges: 'Modificări aplicate',

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `Grupare după ${column}`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `Agregare ${column} (${aggregation})`,
  promptChangeFilterLabel: (
    column: string,
    operator: string,
    value: string,
    operatorValue?: string,
  ) => {
    if (operatorValue === 'isAnyOf') {
      return `${column} este una din valorile: ${value}`;
    }
    return `${column} ${operator} ${value}`;
  },
  promptChangeFilterDescription: (
    column: string,
    operator: string,
    value: string,
    operatorValue?: string,
  ) => {
    if (operatorValue === 'isAnyOf') {
      return `Filtrare rânduri în care ${column} este una din valorile: ${value}`;
    }
    return `Filtrare rânduri în care ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `Sortare după ${column} (${direction})`,
  promptChangePivotEnableLabel: 'Pivot',
  promptChangePivotEnableDescription: 'Activare pivot',
  promptChangePivotColumnsLabel: (count: number) => `Coloane (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `Rânduri (${count})`,
  promptChangePivotValuesLabel: (count: number) => `Valori (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) =>
    `Dimensiuni (${dimensionsCount}), Valori (${valuesCount})`,
};

export const roRO: Localization = getGridLocalization(roROGrid);
