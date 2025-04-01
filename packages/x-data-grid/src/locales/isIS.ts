import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const isISGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Engar raðir',
  noResultsOverlayLabel: 'Engar niðurstöður',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Þéttleiki',
  toolbarDensityLabel: 'Þéttleiki',
  toolbarDensityCompact: 'Þétt',
  toolbarDensityStandard: 'Staðlað',
  toolbarDensityComfortable: 'Rúmlegt',

  // Columns selector toolbar button text
  toolbarColumns: 'Dálkar',
  toolbarColumnsLabel: 'Veldu dálka',

  // Filters toolbar button text
  toolbarFilters: 'Sía',
  toolbarFiltersLabel: 'Sjá síur',
  toolbarFiltersTooltipHide: 'Fela síur',
  toolbarFiltersTooltipShow: 'Sjá síur',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} virk sía` : `${count} virkar síur`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Leita…',
  toolbarQuickFilterLabel: 'Leita',
  toolbarQuickFilterDeleteIconLabel: 'Eyða',

  // Export selector toolbar button text
  toolbarExport: 'Flytja út',
  toolbarExportLabel: 'Flytja út',
  toolbarExportCSV: 'Hlaða niður sem CSV',
  toolbarExportPrint: 'Prenta',
  toolbarExportExcel: 'Hlaða niður sem Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  // columnsManagementSearchTitle: 'Search',
  // columnsManagementNoColumns: 'No columns',
  // columnsManagementShowHideAllText: 'Show/Hide All',
  // columnsManagementReset: 'Reset',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Bæta síu',
  filterPanelRemoveAll: 'Fjarlægja alla',
  filterPanelDeleteIconLabel: 'Eyða',
  filterPanelLogicOperator: 'Rökvirkir',
  filterPanelOperator: 'Virkir',
  filterPanelOperatorAnd: 'Og',
  filterPanelOperatorOr: 'Eða',
  filterPanelColumns: 'Dálkar',
  filterPanelInputLabel: 'Gildi',
  filterPanelInputPlaceholder: 'Síu gildi',

  // Filter operators text
  filterOperatorContains: 'inniheldur',
  // filterOperatorDoesNotContain: 'does not contain',
  filterOperatorEquals: 'jafnt og',
  // filterOperatorDoesNotEqual: 'does not equal',
  filterOperatorStartsWith: 'byrjar með',
  filterOperatorEndsWith: 'endar með',
  filterOperatorIs: 'er líka með',
  filterOperatorNot: 'er ekki líka með',
  filterOperatorAfter: 'eftir',
  filterOperatorOnOrAfter: 'á eða eftir',
  filterOperatorBefore: 'fyrir',
  filterOperatorOnOrBefore: 'á eða fyrir',
  filterOperatorIsEmpty: 'inniheldur ekki gögn',
  filterOperatorIsNotEmpty: 'inniheldur gögn',
  filterOperatorIsAnyOf: 'inniheldur einn af',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Inniheldur',
  // headerFilterOperatorDoesNotContain: 'Does not contain',
  headerFilterOperatorEquals: 'Jafnt og',
  // headerFilterOperatorDoesNotEqual: 'Does not equal',
  headerFilterOperatorStartsWith: 'Byrjar með',
  headerFilterOperatorEndsWith: 'Endar með',
  headerFilterOperatorIs: 'Er jafnt og',
  headerFilterOperatorNot: 'Er ekki jafnt og',
  headerFilterOperatorAfter: 'Eftir',
  headerFilterOperatorOnOrAfter: 'Á eða eftir',
  headerFilterOperatorBefore: 'Fyrir',
  headerFilterOperatorOnOrBefore: 'Á eða fyrir',
  headerFilterOperatorIsEmpty: 'Inniheldur ekki gögn',
  headerFilterOperatorIsNotEmpty: 'Inniheldur gögn',
  headerFilterOperatorIsAnyOf: 'Inniheldur einn af',
  'headerFilterOperator=': 'Jafnt og',
  'headerFilterOperator!=': 'Ekki jafnt og',
  'headerFilterOperator>': 'Stærra en',
  'headerFilterOperator>=': 'Stærra en eða jafnt og',
  'headerFilterOperator<': 'Minna en',
  'headerFilterOperator<=': 'Minna en eða jafnt og',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'hvað sem er',
  filterValueTrue: 'satt',
  filterValueFalse: 'falskt',

  // Column menu text
  columnMenuLabel: 'Valmynd',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Sýna dálka',
  columnMenuManageColumns: 'Stjórna dálkum',
  columnMenuFilter: 'Síur',
  columnMenuHideColumn: 'Fela dálka',
  columnMenuUnsort: 'Fjarlægja röðun',
  columnMenuSortAsc: 'Raða hækkandi',
  columnMenuSortDesc: 'Raða lækkandi',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} virkar síur` : `Ein virk sía`,
  columnHeaderFiltersLabel: 'Sýna síur',
  columnHeaderSortIconLabel: 'Raða',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `${count.toLocaleString()} raðir valdar` : `Ein röð valin`,

  // Total row amount footer text
  footerTotalRows: 'Heildarfjöldi lína:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} af ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Val á gátreit',
  checkboxSelectionSelectAllRows: 'Velja allar raðir',
  checkboxSelectionUnselectAllRows: 'Afvelja allar raðir',
  checkboxSelectionSelectRow: 'Velja röð',
  checkboxSelectionUnselectRow: 'Afvelja röð',

  // Boolean cell text
  booleanCellTrueLabel: 'já',
  booleanCellFalseLabel: 'nei',

  // Actions cell more text
  actionsCellMore: 'meira',

  // Column pinning text
  pinToLeft: 'Festa til vinstri',
  pinToRight: 'Festa til hægri',
  unpin: 'Losa um',

  // Tree Data
  treeDataGroupingHeaderName: 'Hópur',
  treeDataExpand: 'Sýna undirliði',
  treeDataCollapse: 'Fela undirliði',

  // Grouping columns
  groupingColumnHeaderName: 'Hópur',
  groupColumn: (name) => `Hópa eftir ${name}`,
  unGroupColumn: (name) => `Fjarlægja hópun eftir ${name}`,

  // Master/detail
  detailPanelToggle: 'Stækka/minnka smáatriðaspjald',
  expandDetailPanel: 'Stækka',
  collapseDetailPanel: 'Minnka',

  // Pagination
  paginationRowsPerPage: 'Raðir á síðu:',
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
      return 'Fara á fyrstu síðu';
    }
    if (type === 'last') {
      return 'Fara á síðustu síðu';
    }
    if (type === 'next') {
      return 'Fara á næstu síðu';
    }
    // if (type === 'previous') {
    return 'Fara á fyrri síðu';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Endurröðun raða',

  // Aggregation
  aggregationMenuItemHeader: 'Samsafn',
  aggregationFunctionLabelSum: 'sum',
  aggregationFunctionLabelAvg: 'avg',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'stærð',

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
  // aiAssistantPanelNoHistory: 'No prompt history',
  // aiAssistantSuggestions: 'Suggestions',
  // aiAssistantSuggestionsMore: (count: number) => `${count} more`,

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
};

export const isIS: Localization = getGridLocalization(isISGrid);
