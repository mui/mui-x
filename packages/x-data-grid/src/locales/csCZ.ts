import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const csCZGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Žádné záznamy',
  noResultsOverlayLabel: 'Nenašly se žadné výsledky.',
  noColumnsOverlayLabel: 'Žádné sloupce',
  noColumnsOverlayManageColumns: 'Spravovat sloupce',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Zobrazení',
  toolbarDensityLabel: 'Zobrazení',
  toolbarDensityCompact: 'Kompaktní',
  toolbarDensityStandard: 'Standartní',
  toolbarDensityComfortable: 'Komfortní',

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
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

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
  filterPanelOperator: 'Operátory',
  filterPanelOperatorAnd: 'A',
  filterPanelOperatorOr: 'Nebo',
  filterPanelColumns: 'Sloupce',
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
  columnMenuUnsort: 'Zrušit filtry',
  columnMenuSortAsc: 'Seřadit vzestupně',
  columnMenuSortDesc: 'Seřadit sestupně',
  // columnMenuManagePivot: 'Manage pivot',

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
  columnHeaderSortIconLabel: 'Filtrovat',

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
      return `${from}–${to} z ${count !== -1 ? count : `více než ${to}`}`;
    }
    const estimatedLabel =
      estimated && estimated > to ? `přibližně ${estimated}` : `více než ${to}`;
    return `${from}–${to} z ${count !== -1 ? count : estimatedLabel}`;
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
  aggregationMenuItemHeader: 'Seskupování',
  aggregationFunctionLabelSum: 'součet',
  aggregationFunctionLabelAvg: 'průměr',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'počet',

  // Pivot panel
  // pivotToggleLabel: 'Pivot',
  // pivotRows: 'Rows',
  // pivotColumns: 'Columns',
  // pivotValues: 'Values',
  // pivotCloseButton: 'Close pivot settings',
  // pivotSearchButton: 'Search fields',
  // pivotSearchControlPlaceholder: 'Search fields',
  // pivotSearchControlLabel: 'Search fields',
  // pivotSearchControlClear: 'Clear search',
  // pivotNoFields: 'No fields',
  // pivotMenuMoveUp: 'Move up',
  // pivotMenuMoveDown: 'Move down',
  // pivotMenuMoveToTop: 'Move to top',
  // pivotMenuMoveToBottom: 'Move to bottom',
  // pivotMenuRows: 'Rows',
  // pivotMenuColumns: 'Columns',
  // pivotMenuValues: 'Values',
  // pivotMenuOptions: 'Field options',
  // pivotMenuAddToRows: 'Add to Rows',
  // pivotMenuAddToColumns: 'Add to Columns',
  // pivotMenuAddToValues: 'Add to Values',
  // pivotMenuRemove: 'Remove',
  // pivotDragToRows: 'Drag here to create rows',
  // pivotDragToColumns: 'Drag here to create columns',
  // pivotDragToValues: 'Drag here to create values',
  // pivotYearColumnHeaderName: '(Year)',
  // pivotQuarterColumnHeaderName: '(Quarter)',

  // AI Assistant panel
  // aiAssistantPanelTitle: 'AI Assistant',
  // aiAssistantPanelClose: 'Close AI Assistant',
  // aiAssistantPanelNewConversation: 'New conversation',
  // aiAssistantPanelConversationHistory: 'Conversation history',
  // aiAssistantPanelEmptyConversation: 'No prompt history',
  // aiAssistantSuggestions: 'Suggestions',

  // Prompt field
  promptFieldLabel: 'Vstup požadavku',
  promptFieldPlaceholder: 'Napište požadavek…',
  promptFieldPlaceholderWithRecording: 'Napište nebo nahrajte požadavek…',
  promptFieldPlaceholderListening: 'Naslouchám požadavku…',
  // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  promptFieldSend: 'Odeslat',
  promptFieldRecord: 'Nahrát',
  promptFieldStopRecording: 'Zastavit nahrávání',

  // Prompt
  // promptRerun: 'Run again',
  // promptProcessing: 'Processing…',
  // promptAppliedChanges: 'Applied changes',

  // Prompt changes
  // promptChangeGroupDescription: (column: string) => `Group by ${column}`,
  // promptChangeAggregationLabel: (column: string, aggregation: string) => `${column} (${aggregation})`,
  // promptChangeAggregationDescription: (column: string, aggregation: string) => `Aggregate ${column} (${aggregation})`,
  // promptChangeFilterLabel: (column: string, operator: string, value: string) => {
  //   if (operator === 'is any of') {
  //     return `${column} is any of: ${value}`;
  //   }
  //   return `${column} ${operator} ${value}`;
  // },
  // promptChangeFilterDescription: (column: string, operator: string, value: string) => {
  //   if (operator === 'is any of') {
  //     return `Filter where ${column} is any of: ${value}`;
  //   }
  //   return `Filter where ${column} ${operator} ${value}`;
  // },
  // promptChangeSortDescription: (column: string, direction: string) => `Sort by ${column} (${direction})`,
  // promptChangePivotEnableLabel: 'Pivot',
  // promptChangePivotEnableDescription: 'Enable pivot',
  // promptChangePivotColumnsLabel: (count: number) => `Columns (${count})`,
  // promptChangePivotColumnsDescription: (column: string, direction: string) => `${column}${direction ? ` (${direction})` : ''}`,
  // promptChangePivotRowsLabel: (count: number) => `Rows (${count})`,
  // promptChangePivotValuesLabel: (count: number) => `Values (${count})`,
  // promptChangePivotValuesDescription: (column: string, aggregation: string) => `${column} (${aggregation})`,
};

export const csCZ: Localization = getGridLocalization(csCZGrid);
