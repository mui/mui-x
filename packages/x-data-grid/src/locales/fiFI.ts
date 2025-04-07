import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const fiFIGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Ei rivejä',
  noResultsOverlayLabel: 'Ei tuloksia.',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Tiiveys',
  toolbarDensityLabel: 'Tiiveys',
  toolbarDensityCompact: 'Kompakti',
  toolbarDensityStandard: 'Vakio',
  toolbarDensityComfortable: 'Mukava',

  // Columns selector toolbar button text
  toolbarColumns: 'Sarakkeet',
  toolbarColumnsLabel: 'Valitse sarakkeet',

  // Filters toolbar button text
  toolbarFilters: 'Suodattimet',
  toolbarFiltersLabel: 'Näytä suodattimet',
  toolbarFiltersTooltipHide: 'Piilota suodattimet',
  toolbarFiltersTooltipShow: 'Näytä suodattimet',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktiivista suodatinta` : `${count} aktiivinen suodatin`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Hae…',
  toolbarQuickFilterLabel: 'Hae',
  toolbarQuickFilterDeleteIconLabel: 'Tyhjennä',

  // Export selector toolbar button text
  toolbarExport: 'Vie',
  toolbarExportLabel: 'Vie',
  toolbarExportCSV: 'Lataa CSV-muodossa',
  toolbarExportPrint: 'Tulosta',
  toolbarExportExcel: 'Lataa Excel-muodossa',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'Hae',
  columnsManagementNoColumns: 'Ei sarakkeita näytettäväksi',
  columnsManagementShowHideAllText: 'Näytä/Piilota kaikki',
  columnsManagementReset: 'Palauta',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Lisää suodatin',
  filterPanelRemoveAll: 'Poista kaikki',
  filterPanelDeleteIconLabel: 'Poista',
  filterPanelLogicOperator: 'Logiikkaoperaattori',
  filterPanelOperator: 'Operaattorit',
  filterPanelOperatorAnd: 'Ja',
  filterPanelOperatorOr: 'Tai',
  filterPanelColumns: 'Sarakkeet',
  filterPanelInputLabel: 'Arvo',
  filterPanelInputPlaceholder: 'Suodattimen arvo',

  // Filter operators text
  filterOperatorContains: 'sisältää',
  // filterOperatorDoesNotContain: 'does not contain',
  filterOperatorEquals: 'on yhtä suuri kuin',
  // filterOperatorDoesNotEqual: 'does not equal',
  filterOperatorStartsWith: 'alkaa',
  filterOperatorEndsWith: 'päättyy',
  filterOperatorIs: 'on',
  filterOperatorNot: 'ei ole',
  filterOperatorAfter: 'on jälkeen',
  filterOperatorOnOrAfter: 'on sama tai jälkeen',
  filterOperatorBefore: 'on ennen',
  filterOperatorOnOrBefore: 'on sama tai ennen',
  filterOperatorIsEmpty: 'on tyhjä',
  filterOperatorIsNotEmpty: 'ei ole tyhjä',
  filterOperatorIsAnyOf: 'on mikä tahansa seuraavista',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Sisältää',
  // headerFilterOperatorDoesNotContain: 'Does not contain',
  headerFilterOperatorEquals: 'On yhtä suuri kuin',
  // headerFilterOperatorDoesNotEqual: 'Does not equal',
  headerFilterOperatorStartsWith: 'Alkaa',
  headerFilterOperatorEndsWith: 'Päättyy',
  headerFilterOperatorIs: 'On',
  headerFilterOperatorNot: 'Ei ole',
  headerFilterOperatorAfter: 'On jälkeen',
  headerFilterOperatorOnOrAfter: 'On sama tai jälkeen',
  headerFilterOperatorBefore: 'On ennen',
  headerFilterOperatorOnOrBefore: 'On sama tai ennen',
  headerFilterOperatorIsEmpty: 'On tyhjä',
  headerFilterOperatorIsNotEmpty: 'Ei ole tyhjä',
  headerFilterOperatorIsAnyOf: 'On mikä tahansa seuraavista',
  'headerFilterOperator=': 'On yhtä suuri kuin',
  'headerFilterOperator!=': 'Ei ole yhtä suuri kuin',
  'headerFilterOperator>': 'Enemmän kuin',
  'headerFilterOperator>=': 'Enemmän tai yhtä paljon kuin',
  'headerFilterOperator<': 'Vähemmän kuin',
  'headerFilterOperator<=': 'Vähemmän tai yhtä paljon kuin',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'mikä tahansa',
  filterValueTrue: 'tosi',
  filterValueFalse: 'epätosi',

  // Column menu text
  columnMenuLabel: 'Valikko',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Näytä sarakkeet',
  columnMenuManageColumns: 'Hallitse sarakkeita',
  columnMenuFilter: 'Suodata',
  columnMenuHideColumn: 'Piilota',
  columnMenuUnsort: 'Poista järjestys',
  columnMenuSortAsc: 'Järjestä nousevasti',
  columnMenuSortDesc: 'Järjestä laskevasti',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktiivista suodatinta` : `${count} aktiivinen suodatin`,
  columnHeaderFiltersLabel: 'Näytä suodattimet',
  columnHeaderSortIconLabel: 'Järjestä',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} riviä valittu`
      : `${count.toLocaleString()} rivi valittu`,

  // Total row amount footer text
  footerTotalRows: 'Rivejä yhteensä:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Valintaruutu',
  checkboxSelectionSelectAllRows: 'Valitse kaikki rivit',
  checkboxSelectionUnselectAllRows: 'Poista kaikkien rivien valinta',
  checkboxSelectionSelectRow: 'Valitse rivi',
  checkboxSelectionUnselectRow: 'Poista rivin valinta',

  // Boolean cell text
  booleanCellTrueLabel: 'tosi',
  booleanCellFalseLabel: 'epätosi',

  // Actions cell more text
  actionsCellMore: 'lisää',

  // Column pinning text
  pinToLeft: 'Kiinnitä vasemmalle',
  pinToRight: 'Kiinnitä oikealle',
  unpin: 'Irrota kiinnitys',

  // Tree Data
  treeDataGroupingHeaderName: 'Ryhmä',
  treeDataExpand: 'Laajenna',
  treeDataCollapse: 'Supista',

  // Grouping columns
  groupingColumnHeaderName: 'Ryhmä',
  groupColumn: (name) => `Ryhmittelyperuste ${name}`,
  unGroupColumn: (name) => `Poista ryhmittelyperuste ${name}`,

  // Master/detail
  detailPanelToggle: 'Yksityiskohtapaneelin vaihto',
  expandDetailPanel: 'Laajenna',
  collapseDetailPanel: 'Tiivistä',

  // Pagination
  paginationRowsPerPage: 'Rivejä per sivu:',
  // paginationDisplayedRows: ({
  //   from,
  //   to,
  //   count,
  //   estimated
  // }) => {
  //   if (!estimated) {
  //     return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
  //   }
  //   const estimatedLabel = estimated && estimated > to ? `around ${estimated}` : `more than ${to}`;
  //   return `${from}–${to} of ${count !== -1 ? count : estimatedLabel}`;
  // },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Mene ensimmäiselle sivulle';
    }
    if (type === 'last') {
      return 'Mene viimeiselle sivulle';
    }
    if (type === 'next') {
      return 'Mene seuraavalle sivulle';
    }
    // if (type === 'previous') {
    return 'Mene edelliselle sivulle';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Rivien uudelleenjärjestely',

  // Aggregation
  aggregationMenuItemHeader: 'Koostaminen',
  aggregationFunctionLabelSum: 'summa',
  aggregationFunctionLabelAvg: 'ka.',
  aggregationFunctionLabelMin: 'min.',
  aggregationFunctionLabelMax: 'maks.',
  aggregationFunctionLabelSize: 'koko',

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
  // aiAssistantPanelEmptyConversation: 'No prompt history',
  // aiAssistantSuggestions: 'Suggestions',

  // Prompt field
  // promptFieldLabel: 'Prompt',
  // promptFieldPlaceholder: 'Type a prompt…',
  // promptFieldPlaceholderWithRecording: 'Type or record a prompt…',
  // promptFieldPlaceholderListening: 'Listening for prompt…',
  // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  // promptFieldSend: 'Send',
  // promptFieldRecord: 'Record',
  // promptFieldStopRecording: 'Stop recording',

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

export const fiFI: Localization = getGridLocalization(fiFIGrid);
