import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization } from '../utils/getGridLocalization';
import type { Localization } from '../utils/getGridLocalization';
import { buildLocaleFormat } from '../utils/getGridLocalization';

const formatNumber = buildLocaleFormat('tk-TM');

const tkTMGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Setir ýok',
  noResultsOverlayLabel: 'Netije tapylmady.',
  noColumnsOverlayLabel: 'Sütün ýok',
  noColumnsOverlayManageColumns: 'Sütünleri sazla',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Dykyzlyk',
  toolbarDensityLabel: 'Dykyzlyk',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standart',
  toolbarDensityComfortable: 'Rahat',

  // Undo/redo toolbar button text
  toolbarUndo: 'Yza al',
  toolbarRedo: 'Öňe',

  // Columns selector toolbar button text
  toolbarColumns: 'Sütünler',
  toolbarColumnsLabel: 'Sütün saýla',

  // Filters toolbar button text
  toolbarFilters: 'Filtrler',
  toolbarFiltersLabel: 'Filtrleri görkez',
  toolbarFiltersTooltipHide: 'Filtrleri gizle ',
  toolbarFiltersTooltipShow: 'Filtrleri gözkez',
  toolbarFiltersTooltipActive: (count) => `${count} aktiw filtr`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Gözle...',
  toolbarQuickFilterLabel: 'Gözle',
  toolbarQuickFilterDeleteIconLabel: 'Arassala',

  // Export selector toolbar button text
  toolbarExport: 'Eksport',
  toolbarExportLabel: 'Eksport',
  toolbarExportCSV: 'CSV eksport',
  toolbarExportPrint: 'Çap etmek',
  toolbarExportExcel: 'Excel eksport',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar charts button
  // toolbarCharts: 'Charts',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'Gözleg',
  columnsManagementNoColumns: 'Sütün ýok',
  columnsManagementShowHideAllText: 'Hemmesini Görkez/Gizle',
  columnsManagementReset: 'Täzeden',
  columnsManagementDeleteIconLabel: 'Arassala',

  // Filter panel text
  filterPanelAddFilter: 'Filtr goşmak',
  filterPanelRemoveAll: 'Hemmesini aýyrmak',
  filterPanelDeleteIconLabel: 'Aýyrmak',
  filterPanelLogicOperator: 'Logiki operatorlar',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'We',
  filterPanelOperatorOr: 'Ýa-da',
  filterPanelColumn: 'Sütün',
  filterPanelInputLabel: 'Baha',
  filterPanelInputPlaceholder: 'Filtriň bahasy',

  // Filter operators text
  filterOperatorContains: 'saklaýar',
  filterOperatorDoesNotContain: 'saklamavar',
  filterOperatorEquals: 'deňdir',
  filterOperatorDoesNotEqual: 'deň däldir',
  filterOperatorStartsWith: 'bilen başlaýar',
  filterOperatorEndsWith: 'bilen gutarýar',
  filterOperatorIs: 'deňdir',
  filterOperatorNot: 'deň däldir',
  filterOperatorAfter: 'soň',
  filterOperatorOnOrAfter: 'soň ýa-da deň',
  filterOperatorBefore: 'öň',
  filterOperatorOnOrBefore: 'öň ýa-da deň',
  filterOperatorIsEmpty: 'boş',
  filterOperatorIsNotEmpty: 'boş däl',
  filterOperatorIsAnyOf: 'islendigi',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Saklaýar',
  headerFilterOperatorDoesNotContain: 'Saklamaýar',
  headerFilterOperatorEquals: 'Deňdir',
  headerFilterOperatorDoesNotEqual: 'Deň däldir',
  headerFilterOperatorStartsWith: 'Bilen başlaýar',
  headerFilterOperatorEndsWith: 'Bilen gutarýar',
  headerFilterOperatorIs: 'Deň',
  headerFilterOperatorNot: 'Deň däl',
  headerFilterOperatorAfter: 'Soňra',
  headerFilterOperatorOnOrAfter: 'Soňra ýa-da deň',
  headerFilterOperatorBefore: 'Öň',
  headerFilterOperatorOnOrBefore: 'Öň ýa-da deň',
  headerFilterOperatorIsEmpty: 'Boş',
  headerFilterOperatorIsNotEmpty: 'Boş değil',
  headerFilterOperatorIsAnyOf: 'Islendigi',
  'headerFilterOperator=': 'Deňdir',
  'headerFilterOperator!=': 'Deň däldir',
  'headerFilterOperator>': 'Uludyr',
  'headerFilterOperator>=': 'Uludyr ýa-da deňdir',
  'headerFilterOperator<': 'Kiçidir',
  'headerFilterOperator<=': 'Kiçidir ýa-da deňdir',
  headerFilterClear: 'Filtri aýyr',

  // Filter values text
  filterValueAny: 'islendigi',
  filterValueTrue: 'dogry',
  filterValueFalse: 'ýalňyş',

  // Column menu text
  columnMenuLabel: 'Menýu',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Sütünleri görkez',
  columnMenuManageColumns: 'Sütünleri sazla',
  columnMenuFilter: 'Filtr',
  columnMenuHideColumn: 'Sütüni gizle',
  columnMenuUnsort: 'Tertiplenmedik',
  columnMenuSortAsc: 'Artýan tertip',
  columnMenuSortDesc: 'Kemelýän tertip',
  // columnMenuManagePivot: 'Manage pivot',
  columnMenuManageCharts: 'Manage charts',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} aktiw filtr`,
  columnHeaderFiltersLabel: 'Filtrleri görkez',
  columnHeaderSortIconLabel: 'Tertiple',

  // Rows selected footer text
  footerRowSelected: (count) => `${count.toLocaleString()} setir saýlandy`,

  // Total row amount footer text
  footerTotalRows: 'Jemi setir:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Saýlaw',
  checkboxSelectionSelectAllRows: 'Hemme setiri saýla',
  checkboxSelectionUnselectAllRows: 'Hemme setiri saýlawdan aýyr',
  checkboxSelectionSelectRow: 'Setiri saýla',
  checkboxSelectionUnselectRow: 'Setiri saýlawdan aýyr',

  // Boolean cell text
  booleanCellTrueLabel: 'hawa',
  booleanCellFalseLabel: 'ýok',

  // Long text cell
  longTextCellExpandLabel: 'Giňelt',
  longTextCellCollapseLabel: 'Gizle',

  // Actions cell more text
  actionsCellMore: 'başga',

  // Column pinning text
  pinToLeft: 'Çepe birikdir',
  pinToRight: 'Saga birikdir',
  unpin: 'Birikmäni aýyr',

  // Tree Data
  treeDataGroupingHeaderName: 'Topar',
  treeDataExpand: 'görkez',
  treeDataCollapse: 'gizle',

  // Grouping columns
  groupingColumnHeaderName: 'Topar',
  groupColumn: (name) => `${name} üçin toparla`,
  unGroupColumn: (name) => `${name} üçin toparlamany aýyr`,

  // Master/detail
  detailPanelToggle: 'Giňişleýin sazlamalara geçiş',
  expandDetailPanel: 'Giňelt',
  collapseDetailPanel: 'Gizle',

  // Pagination
  paginationRowsPerPage: 'Sahypadaky setir sany:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    const unknownRowCount = count == null || count === -1;
    if (!estimated) {
      return `${formatNumber(from)}–${formatNumber(to)} / ${!unknownRowCount ? formatNumber(count) : `jemi > ${formatNumber(to)}`}`;
    }
    const estimatedLabel =
      estimated && estimated > to
        ? `${formatNumber(estimated)} töwerek`
        : `jemi > ${formatNumber(to)}`;
    return `${formatNumber(from)}–${formatNumber(to)} / ${!unknownRowCount ? formatNumber(count) : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Birinji sahypa geç';
    }
    if (type === 'last') {
      return 'Soňky sahypa geç';
    }
    if (type === 'next') {
      return 'Indiki sahypa geç';
    }
    // if (type === 'previous') {
    return 'Öňki sahypa geç';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Setirleri täzeden tertiple',

  // Aggregation
  aggregationMenuItemHeader: 'Jemlemek',
  aggregationFunctionLabelNone: 'hiç',
  aggregationFunctionLabelSum: 'jem',
  aggregationFunctionLabelAvg: 'ort',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'maks',
  aggregationFunctionLabelSize: 'ölçeg',

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
  promptFieldLabel: 'Görkezme',
  promptFieldPlaceholder: 'Görkezme ýazyň...',
  promptFieldPlaceholderWithRecording: 'Görkezme ýazyň ýa-da ýazgy ediň...',
  promptFieldPlaceholderListening: 'Görkezme diňlenýär...',
  promptFieldSpeechRecognitionNotSupported: 'Bu browzerde ses tanama gollanmaýar',
  promptFieldSend: 'Ugrat',
  promptFieldRecord: 'Ýazgy et',
  promptFieldStopRecording: 'Ýazgyny duruz',

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

export const tkTM: Localization = getGridLocalization(tkTMGrid);
