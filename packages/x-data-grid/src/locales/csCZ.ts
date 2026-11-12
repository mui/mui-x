import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, buildLocaleFormat } from '../utils/getGridLocalization';
import type { Localization } from '../utils/getGridLocalization';

const formatNumber = buildLocaleFormat('cs-CZ');

const csCZGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Žádné záznamy',
  noResultsOverlayLabel: 'Nenašly se žádné výsledky.',
  noColumnsOverlayLabel: 'Žádné sloupce',
  noColumnsOverlayManageColumns: 'Spravovat sloupce',
  emptyPivotOverlayLabel:
    'Přidejte pole do řádků, sloupců a hodnot a vytvořte kontingenční tabulku',

  // Density selector toolbar button text
  toolbarDensity: 'Zobrazení',
  toolbarDensityLabel: 'Zobrazení',
  toolbarDensityCompact: 'Kompaktní',
  toolbarDensityStandard: 'Standardní',
  toolbarDensityComfortable: 'Komfortní',

  // Undo/redo toolbar button text
  toolbarUndo: 'Zpět',
  toolbarRedo: 'Znovu',

  // Columns selector toolbar button text
  toolbarColumns: 'Sloupce',
  toolbarColumnsLabel: 'Vybrat sloupec',

  // Filters toolbar button text
  toolbarFilters: 'Filtry',
  toolbarFiltersLabel: 'Zobrazit filtry',
  toolbarFiltersTooltipHide: 'Skrýt filtry',
  toolbarFiltersTooltipShow: 'Zobrazit filtry',
  toolbarFiltersTooltipActive: (count) => {
    let pluralForm = 'aktivních filtrů';
    if (count > 1 && count < 5) {
      pluralForm = 'aktivní filtry';
    } else if (count === 1) {
      pluralForm = 'aktivní filtr';
    }
    return `${count} ${pluralForm}`;
  },

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Hledat…',
  toolbarQuickFilterLabel: 'Hledat',
  toolbarQuickFilterDeleteIconLabel: 'Vymazat',

  // Export selector toolbar button text
  toolbarExport: 'Export',
  toolbarExportLabel: 'Export',
  toolbarExportCSV: 'Stáhnout jako CSV',
  toolbarExportPrint: 'Vytisknout',
  toolbarExportExcel: 'Stáhnout jako Excel',

  // Toolbar pivot button
  toolbarPivot: 'Kontingenční tabulka',

  // Toolbar charts button
  toolbarCharts: 'Grafy',

  // Toolbar AI Assistant button
  toolbarAssistant: 'AI asistent',

  // Formula bar (Premium formulas)
  formulaBarLabel: 'Řádek vzorců',
  formulaBarInputLabel: 'Vzorec',
  formulaBarAddressLabel: 'Aktivní buňka',

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
  columnsManagementSearchTitle: 'Hledat sloupce',
  columnsManagementNoColumns: 'Žádné sloupce',
  columnsManagementShowHideAllText: 'Zobrazit/skrýt vše',
  columnsManagementReset: 'Resetovat',
  columnsManagementDeleteIconLabel: 'Vyčistit',

  // Filter panel text
  filterPanelAddFilter: 'Přidat filtr',
  filterPanelRemoveAll: 'Odstranit vše',
  filterPanelDeleteIconLabel: 'Odstranit',
  filterPanelLogicOperator: 'Logický operátor',
  filterPanelOperator: 'Operátor',
  filterPanelOperatorAnd: 'A',
  filterPanelOperatorOr: 'Nebo',
  filterPanelColumn: 'Sloupec',
  filterPanelInputLabel: 'Hodnota',
  filterPanelInputPlaceholder: 'Hodnota filtru',

  // Filter operators text
  filterOperatorContains: 'obsahuje',
  filterOperatorDoesNotContain: 'neobsahuje',
  filterOperatorEquals: 'rovná se',
  filterOperatorDoesNotEqual: 'nerovná se',
  filterOperatorStartsWith: 'začíná na',
  filterOperatorEndsWith: 'končí na',
  filterOperatorIs: 'je',
  filterOperatorNot: 'není',
  filterOperatorAfter: 'je po',
  filterOperatorOnOrAfter: 'je po včetně',
  filterOperatorBefore: 'je před',
  filterOperatorOnOrBefore: 'je před včetně',
  filterOperatorIsEmpty: 'je prázdný',
  filterOperatorIsNotEmpty: 'není prázdný',
  filterOperatorIsAnyOf: 'je jeden z',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Obsahuje',
  headerFilterOperatorDoesNotContain: 'Neobsahuje',
  headerFilterOperatorEquals: 'Rovná se',
  headerFilterOperatorDoesNotEqual: 'Nerovná se',
  headerFilterOperatorStartsWith: 'Začíná na',
  headerFilterOperatorEndsWith: 'Končí na',
  headerFilterOperatorIs: 'Je',
  headerFilterOperatorNot: 'Není',
  headerFilterOperatorAfter: 'Je po',
  headerFilterOperatorOnOrAfter: 'Je po včetně',
  headerFilterOperatorBefore: 'Je před',
  headerFilterOperatorOnOrBefore: 'Je před včetně',
  headerFilterOperatorIsEmpty: 'Je prázdný',
  headerFilterOperatorIsNotEmpty: 'Není prázdný',
  headerFilterOperatorIsAnyOf: 'Je jeden z',
  'headerFilterOperator=': 'Rovná se',
  'headerFilterOperator!=': 'Nerovná se',
  'headerFilterOperator>': 'Větší než',
  'headerFilterOperator>=': 'Větší než nebo rovno',
  'headerFilterOperator<': 'Menší než',
  'headerFilterOperator<=': 'Menší než nebo rovno',
  headerFilterClear: 'Zrušit filtr',

  // Filter values text
  filterValueAny: 'jakýkoliv',
  filterValueTrue: 'ano',
  filterValueFalse: 'ne',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuAriaLabel: (columnName: string) => `Možnosti sloupce ${columnName}`,
  columnMenuShowColumns: 'Zobrazit sloupce',
  columnMenuManageColumns: 'Spravovat sloupce',
  columnMenuFilter: 'Filtr',
  columnMenuHideColumn: 'Skrýt',
  columnMenuUnsort: 'Zrušit řazení',
  columnMenuSortAsc: 'Seřadit vzestupně',
  columnMenuSortDesc: 'Seřadit sestupně',
  columnMenuManagePivot: 'Spravovat kontingenční tabulku',
  columnMenuManageCharts: 'Spravovat grafy',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => {
    let pluralForm = 'aktivních filtrů';
    if (count > 1 && count < 5) {
      pluralForm = 'aktivní filtry';
    } else if (count === 1) {
      pluralForm = 'aktivní filtr';
    }
    return `${count} ${pluralForm}`;
  },
  columnHeaderFiltersLabel: 'Zobrazit filtry',
  columnHeaderSortIconLabel: 'Řadit',
  columnHeaderSortIconAriaLabel: (columnName, direction) => {
    if (direction === 'asc') {
      return `Seřadit sloupec ${columnName} vzestupně`;
    }
    if (direction === 'desc') {
      return `Seřadit sloupec ${columnName} sestupně`;
    }
    return `Zrušit řazení sloupce ${columnName}`;
  },

  // Rows selected footer text
  footerRowSelected: (count) => {
    let pluralForm = 'vybraných záznamů';
    if (count > 1 && count < 5) {
      pluralForm = 'vybrané záznamy';
    } else if (count === 1) {
      pluralForm = 'vybraný záznam';
    }
    return `${count} ${pluralForm}`;
  },

  // Total row amount footer text
  footerTotalRows: 'Celkem řádků:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) => {
    const str = totalCount.toString();
    const firstDigit = str[0];
    const op =
      ['4', '6', '7'].includes(firstDigit) || (firstDigit === '1' && str.length % 3 === 0)
        ? 'ze'
        : 'z';
    return `${visibleCount.toLocaleString()} ${op} ${totalCount.toLocaleString()}`;
  },

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Výběr řádku',
  checkboxSelectionSelectAllRows: 'Označit všechny řádky',
  checkboxSelectionUnselectAllRows: 'Odznačit všechny řádky',
  checkboxSelectionSelectRow: 'Označit řádek',
  checkboxSelectionUnselectRow: 'Odznačit řádek',

  // Boolean cell text
  booleanCellTrueLabel: 'ano',
  booleanCellFalseLabel: 'ne',

  // Cell editor text
  emptyCellLabel: 'Prázdné',

  // Long text cell
  longTextCellExpandLabel: 'Rozbalit',
  longTextCellCollapseLabel: 'Sbalit',

  // Actions cell more text
  actionsCellMore: 'více',

  // Column pinning text
  pinToLeft: 'Připnout vlevo',
  pinToRight: 'Připnout vpravo',
  unpin: 'Odepnout',

  // Tree Data
  treeDataGroupingHeaderName: 'Skupina',
  treeDataExpand: 'zobrazit potomky',
  treeDataCollapse: 'skrýt potomky',

  // Grouping columns
  groupingColumnHeaderName: 'Skupina',
  groupColumn: (name) => `Seskupit podle ${name}`,
  unGroupColumn: (name) => `Přestat seskupovat podle ${name}`,

  // Master/detail
  detailPanelToggle: 'Přepnout detail panelu',
  expandDetailPanel: 'Rozbalit',
  collapseDetailPanel: 'Sbalit',

  // Pagination
  paginationRowsPerPage: 'Řádků na stránce:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${formatNumber(from)}–${formatNumber(to)} z ${count !== -1 ? formatNumber(count) : `více než ${formatNumber(to)}`}`;
    }
    const estimatedLabel =
      estimated && estimated > to
        ? `přibližně ${formatNumber(estimated)}`
        : `více než ${formatNumber(to)}`;
    return `${formatNumber(from)}–${formatNumber(to)} z ${count !== -1 ? formatNumber(count) : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Jít na první stránku';
    }
    if (type === 'last') {
      return 'Jít na poslední stránku';
    }
    if (type === 'next') {
      return 'Jít na další stránku';
    }
    // if (type === 'previous') {
    return 'Jít na předchozí stránku';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Přeuspořádávání řádků',

  // Aggregation
  aggregationMenuItemHeader: 'Agregace',
  aggregationFunctionLabelNone: 'žádná',
  aggregationFunctionLabelSum: 'součet',
  aggregationFunctionLabelAvg: 'průměr',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'počet',

  // Pivot panel
  pivotToggleLabel: 'Kontingenční tabulka',
  pivotRows: 'Řádky',
  pivotColumns: 'Sloupce',
  pivotValues: 'Hodnoty',
  pivotCloseButton: 'Zavřít nastavení kontingenční tabulky',
  pivotSearchButton: 'Hledat pole',
  pivotSearchControlPlaceholder: 'Hledat pole',
  pivotSearchControlLabel: 'Hledat pole',
  pivotSearchControlClear: 'Vymazat hledání',
  pivotNoFields: 'Žádná pole',
  pivotMenuMoveUp: 'Posunout nahoru',
  pivotMenuMoveDown: 'Posunout dolů',
  pivotMenuMoveToTop: 'Přesunout na začátek',
  pivotMenuMoveToBottom: 'Přesunout na konec',
  pivotMenuRows: 'Řádky',
  pivotMenuColumns: 'Sloupce',
  pivotMenuValues: 'Hodnoty',
  pivotMenuOptions: 'Možnosti pole',
  pivotMenuAddToRows: 'Přidat do řádků',
  pivotMenuAddToColumns: 'Přidat do sloupců',
  pivotMenuAddToValues: 'Přidat do hodnot',
  pivotMenuRemove: 'Odebrat',
  pivotDragToRows: 'Přetáhněte sem pro vytvoření řádků',
  pivotDragToColumns: 'Přetáhněte sem pro vytvoření sloupců',
  pivotDragToValues: 'Přetáhněte sem pro vytvoření hodnot',
  pivotYearColumnHeaderName: '(Rok)',
  pivotQuarterColumnHeaderName: '(Čtvrtletí)',

  // Charts configuration panel
  chartsNoCharts: 'Nejsou k dispozici žádné grafy',
  chartsChartNotSelected: 'Vyberte typ grafu, abyste mohli nastavit jeho možnosti',
  chartsTabChart: 'Graf',
  chartsTabFields: 'Pole',
  chartsTabCustomize: 'Přizpůsobit',
  chartsCloseButton: 'Zavřít nastavení grafu',
  chartsSyncButtonLabel: 'Synchronizovat graf',
  chartsSearchPlaceholder: 'Hledat pole',
  chartsSearchLabel: 'Hledat pole',
  chartsSearchClear: 'Vymazat hledání',
  chartsNoFields: 'Žádná pole',
  chartsFieldBlocked: 'Toto pole nelze přidat do žádné sekce',
  chartsCategories: 'Kategorie',
  chartsSeries: 'Řady',
  chartsMenuAddToDimensions: (dimensionLabel: string) => `Přidat do: ${dimensionLabel}`,
  chartsMenuAddToValues: (valuesLabel: string) => `Přidat do: ${valuesLabel}`,
  chartsMenuMoveUp: 'Posunout nahoru',
  chartsMenuMoveDown: 'Posunout dolů',
  chartsMenuMoveToTop: 'Přesunout na začátek',
  chartsMenuMoveToBottom: 'Přesunout na konec',
  chartsMenuOptions: 'Možnosti pole',
  chartsMenuRemove: 'Odebrat',
  chartsDragToDimensions: (dimensionLabel: string) =>
    `Přetáhněte sem pro použití sloupce jako: ${dimensionLabel}`,
  chartsDragToValues: (valuesLabel: string) =>
    `Přetáhněte sem pro použití sloupce jako: ${valuesLabel}`,

  // AI Assistant panel
  aiAssistantPanelTitle: 'AI asistent',
  aiAssistantPanelClose: 'Zavřít AI asistenta',
  aiAssistantPanelNewConversation: 'Nová konverzace',
  aiAssistantPanelConversationHistory: 'Historie konverzací',
  aiAssistantPanelEmptyConversation: 'Žádná historie požadavků',
  aiAssistantSuggestions: 'Návrhy',

  // Prompt field
  promptFieldLabel: 'Vstup požadavku',
  promptFieldPlaceholder: 'Napište požadavek…',
  promptFieldPlaceholderWithRecording: 'Napište nebo nahrajte požadavek…',
  promptFieldPlaceholderListening: 'Naslouchám požadavku…',
  promptFieldSpeechRecognitionNotSupported: 'Tento prohlížeč nepodporuje rozpoznávání řeči',
  promptFieldSend: 'Odeslat',
  promptFieldRecord: 'Nahrát',
  promptFieldStopRecording: 'Zastavit nahrávání',

  // Prompt
  promptRerun: 'Spustit znovu',
  promptProcessing: 'Zpracovávám…',
  promptAppliedChanges: 'Provedené změny',

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `Seskupit podle ${column}`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `Agregovat ${column} (${aggregation})`,
  promptChangeFilterLabel: (
    column: string,
    operator: string,
    value: string,
    operatorValue?: string,
  ) => {
    if (operatorValue === 'isAnyOf') {
      return `${column} ${operator}: ${value}`;
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
      return `Filtrovat, kde ${column} ${operator}: ${value}`;
    }
    return `Filtrovat, kde ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `Seřadit podle ${column} (${direction})`,
  promptChangePivotEnableLabel: 'Kontingenční tabulka',
  promptChangePivotEnableDescription: 'Zapnout kontingenční tabulku',
  promptChangePivotColumnsLabel: (count: number) => `Sloupce (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `Řádky (${count})`,
  promptChangePivotValuesLabel: (count: number) => `Hodnoty (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) =>
    `Dimenze (${dimensionsCount}), hodnoty (${valuesCount})`,
};

export const csCZ: Localization = getGridLocalization(csCZGrid);
