import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import {
  getGridLocalization,
  type Localization,
  buildLocaleFormat,
} from '../utils/getGridLocalization';

const formatNumber = buildLocaleFormat('nb-NO');

const nbNOGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Ingen rader',
  noResultsOverlayLabel: 'Fant ingen resultat.',
  noColumnsOverlayLabel: 'Ingen kolonner',
  noColumnsOverlayManageColumns: 'Velg kolonner',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Tetthet',
  toolbarDensityLabel: 'Tetthet',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Komfortabelt',

  // Undo/redo toolbar button text
  toolbarUndo: 'Angre',
  toolbarRedo: 'Gjør om',

  // Columns selector toolbar button text
  toolbarColumns: 'Kolonner',
  toolbarColumnsLabel: 'Velg kolonner',

  // Filters toolbar button text
  toolbarFilters: 'Filter',
  toolbarFiltersLabel: 'Vis filter',
  toolbarFiltersTooltipHide: 'Skjul filter',
  toolbarFiltersTooltipShow: 'Vis filter',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive filter` : `${count} aktivt filter`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Søk…',
  toolbarQuickFilterLabel: 'Søk',
  toolbarQuickFilterDeleteIconLabel: 'Slett',

  // Export selector toolbar button text
  toolbarExport: 'Eksporter',
  toolbarExportLabel: 'Eksporter',
  toolbarExportCSV: 'Last ned som CSV',
  toolbarExportPrint: 'Skriv ut',
  toolbarExportExcel: 'Last ned som Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar charts button
  // toolbarCharts: 'Charts',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'Søk',
  columnsManagementNoColumns: 'Ingen kolonner',
  columnsManagementShowHideAllText: 'Vis/skjul alle',
  columnsManagementReset: 'Nullstill',
  columnsManagementDeleteIconLabel: 'Tøm',

  // Filter panel text
  filterPanelAddFilter: 'Legg til filter',
  filterPanelRemoveAll: 'Fjern alle',
  filterPanelDeleteIconLabel: 'Slett',
  filterPanelLogicOperator: 'Logisk operator',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'Og',
  filterPanelOperatorOr: 'Eller',
  filterPanelColumns: 'Kolonner',
  filterPanelInputLabel: 'Verdi',
  filterPanelInputPlaceholder: 'Filter verdi',

  // Filter operators text
  filterOperatorContains: 'inneholder',
  filterOperatorDoesNotContain: 'inneholder ikke',
  filterOperatorEquals: 'er lik',
  filterOperatorDoesNotEqual: 'er ikke lik',
  filterOperatorStartsWith: 'starter med',
  filterOperatorEndsWith: 'slutter med',
  filterOperatorIs: 'er',
  filterOperatorNot: 'er ikke',
  filterOperatorAfter: 'er etter',
  filterOperatorOnOrAfter: 'er på eller etter',
  filterOperatorBefore: 'er før',
  filterOperatorOnOrBefore: 'er på eller før',
  filterOperatorIsEmpty: 'er tom',
  filterOperatorIsNotEmpty: 'er ikke tom',
  filterOperatorIsAnyOf: 'er en av',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Inneholder',
  headerFilterOperatorDoesNotContain: 'Inneholder ikke',
  headerFilterOperatorEquals: 'Er lik',
  headerFilterOperatorDoesNotEqual: 'Er ikke lik',
  headerFilterOperatorStartsWith: 'Starter på',
  headerFilterOperatorEndsWith: 'Slutter på',
  headerFilterOperatorIs: 'Er',
  headerFilterOperatorNot: 'Er ikke',
  headerFilterOperatorAfter: 'Er etter',
  headerFilterOperatorOnOrAfter: 'Er på eller etter',
  headerFilterOperatorBefore: 'Er før',
  headerFilterOperatorOnOrBefore: 'Er på eller før',
  headerFilterOperatorIsEmpty: 'Er tom',
  headerFilterOperatorIsNotEmpty: 'Er ikke tom',
  headerFilterOperatorIsAnyOf: 'Er en av',
  'headerFilterOperator=': 'Lik',
  'headerFilterOperator!=': 'Ikke lik',
  'headerFilterOperator>': 'Større enn',
  'headerFilterOperator>=': 'Større enn eller lik',
  'headerFilterOperator<': 'Mindre enn',
  'headerFilterOperator<=': 'Mindre enn eller lik',
  headerFilterClear: 'Tøm filter',

  // Filter values text
  filterValueAny: 'noen',
  filterValueTrue: 'sant',
  filterValueFalse: 'usant',

  // Column menu text
  columnMenuLabel: 'Meny',
  columnMenuAriaLabel: (columnName: string) => `${columnName} kolonnemeny`,
  columnMenuShowColumns: 'Vis kolonner',
  columnMenuManageColumns: 'Administrer kolonner',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Skjul',
  columnMenuUnsort: 'Usorter',
  columnMenuSortAsc: 'Sorter ØKENDE',
  columnMenuSortDesc: 'Sorter SYNKENDE',
  // columnMenuManagePivot: 'Manage pivot',
  // columnMenuManageCharts: 'Manage charts',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive filter` : `${count} aktivt filter`,
  columnHeaderFiltersLabel: 'Vis filter',
  columnHeaderSortIconLabel: 'Sorter',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `${count.toLocaleString()} rader valgt` : `${count.toLocaleString()} rad valgt`,

  // Total row amount footer text
  footerTotalRows: 'Totalt antall rader:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} av ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Avmerkingsboks',
  checkboxSelectionSelectAllRows: 'Velg alle rader',
  checkboxSelectionUnselectAllRows: 'Velg bort alle rader',
  checkboxSelectionSelectRow: 'Velg rad',
  checkboxSelectionUnselectRow: 'Velg bort rad',

  // Boolean cell text
  booleanCellTrueLabel: 'sant',
  booleanCellFalseLabel: 'usant',

  // Long text cell
  longTextCellExpandLabel: 'Utvid',
  longTextCellCollapseLabel: 'Kollaps',

  // Actions cell more text
  actionsCellMore: 'mer',

  // Column pinning text
  pinToLeft: 'Fest til venstre',
  pinToRight: 'Fest til høyre',
  unpin: 'Løsne',

  // Tree Data
  treeDataGroupingHeaderName: 'Grupper',
  treeDataExpand: 'se barn',
  treeDataCollapse: 'skjul barn',

  // Grouping columns
  groupingColumnHeaderName: 'Grupper',
  groupColumn: (name) => `Grupper på ${name}`,
  unGroupColumn: (name) => `Slutt å grupper på ${name}`,

  // Master/detail
  detailPanelToggle: 'Utvid/kollaps detalj panel',
  expandDetailPanel: 'Utvid',
  collapseDetailPanel: 'Kollaps',

  // Pagination
  paginationRowsPerPage: 'Rader per side:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${formatNumber(from)}–${formatNumber(to)} av ${count !== -1 ? formatNumber(count) : `mer enn ${formatNumber(to)}`}`;
    }
    const estimatedLabel =
      estimated && estimated > to
        ? `omtrent ${formatNumber(estimated)}`
        : `mer enn ${formatNumber(to)}`;
    return `${formatNumber(from)}–${formatNumber(to)} av ${count !== -1 ? formatNumber(count) : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Gå til første side';
    }
    if (type === 'last') {
      return 'Gå til siste side';
    }
    if (type === 'next') {
      return 'Gå til neste side';
    }
    // if (type === 'previous') {
    return 'Gå til forrige side';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Radreorganisering',

  // Aggregation
  aggregationMenuItemHeader: 'Aggregering',
  // aggregationFunctionLabelNone: 'none',
  aggregationFunctionLabelSum: 'sum',
  aggregationFunctionLabelAvg: 'snitt',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'maks',
  aggregationFunctionLabelSize: 'størrelse',

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

  // Charts configuration panel
  // chartsNoCharts: 'There are no charts available',
  // chartsChartNotSelected: 'Select a chart type to configure its options',
  // chartsTabChart: 'Chart',
  // chartsTabFields: 'Fields',
  // chartsTabCustomize: 'Customize',
  // chartsCloseButton: 'Close charts configuration',
  // chartsSyncButtonLabel: 'Sync chart',
  // chartsSearchPlaceholder: 'Search fields',
  // chartsSearchLabel: 'Search fields',
  // chartsSearchClear: 'Clear search',
  // chartsNoFields: 'No fields',
  // chartsFieldBlocked: 'This field cannot be added to any section',
  // chartsCategories: 'Categories',
  // chartsSeries: 'Series',
  // chartsMenuAddToDimensions: (dimensionLabel: string) => `Add to ${dimensionLabel}`,
  // chartsMenuAddToValues: (valuesLabel: string) => `Add to ${valuesLabel}`,
  // chartsMenuMoveUp: 'Move up',
  // chartsMenuMoveDown: 'Move down',
  // chartsMenuMoveToTop: 'Move to top',
  // chartsMenuMoveToBottom: 'Move to bottom',
  // chartsMenuOptions: 'Field options',
  // chartsMenuRemove: 'Remove',
  // chartsDragToDimensions: (dimensionLabel: string) => `Drag here to use column as ${dimensionLabel}`,
  // chartsDragToValues: (valuesLabel: string) => `Drag here to use column as ${valuesLabel}`,

  // AI Assistant panel
  // aiAssistantPanelTitle: 'AI Assistant',
  // aiAssistantPanelClose: 'Close AI Assistant',
  // aiAssistantPanelNewConversation: 'New conversation',
  // aiAssistantPanelConversationHistory: 'Conversation history',
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
  // promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) => `Dimensions (${dimensionsCount}), Values (${valuesCount})`,
};

export const nbNO: Localization = getGridLocalization(nbNOGrid);
