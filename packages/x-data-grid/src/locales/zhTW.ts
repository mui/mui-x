import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const zhTWGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: '沒有資料',
  noResultsOverlayLabel: '沒有結果',
  noColumnsOverlayLabel: '沒有欄位',
  noColumnsOverlayManageColumns: '管理欄位',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: '表格密度',
  toolbarDensityLabel: '表格密度',
  toolbarDensityCompact: '緊湊',
  toolbarDensityStandard: '標準',
  toolbarDensityComfortable: '舒適',

  // Columns selector toolbar button text
  toolbarColumns: '欄位',
  toolbarColumnsLabel: '選擇欄位',

  // Filters toolbar button text
  toolbarFilters: '篩選器',
  toolbarFiltersLabel: '顯示篩選器',
  toolbarFiltersTooltipHide: '隱藏篩選器',
  toolbarFiltersTooltipShow: '顯示篩選器',
  toolbarFiltersTooltipActive: (count) => `${count} 個篩選器`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: '搜尋…',
  toolbarQuickFilterLabel: '搜尋',
  toolbarQuickFilterDeleteIconLabel: '清除',

  // Export selector toolbar button text
  toolbarExport: '匯出',
  toolbarExportLabel: '匯出',
  toolbarExportCSV: '匯出 CSV',
  toolbarExportPrint: '列印',
  toolbarExportExcel: '匯出 Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: '搜尋',
  columnsManagementNoColumns: '沒有欄位',
  columnsManagementShowHideAllText: '顯示/隱藏所有',
  columnsManagementReset: '重置',
  columnsManagementDeleteIconLabel: '清除',

  // Filter panel text
  filterPanelAddFilter: '增加篩選器',
  filterPanelRemoveAll: '清除所有',
  filterPanelDeleteIconLabel: '刪除',
  filterPanelLogicOperator: '邏輯運算子',
  filterPanelOperator: '運算子',
  filterPanelOperatorAnd: '且',
  filterPanelOperatorOr: '或',
  filterPanelColumns: '欄位',
  filterPanelInputLabel: '值',
  filterPanelInputPlaceholder: '篩選值',

  // Filter operators text
  filterOperatorContains: '包含',
  filterOperatorDoesNotContain: '不包含',
  filterOperatorEquals: '等於',
  filterOperatorDoesNotEqual: '不等於',
  filterOperatorStartsWith: '以...開頭',
  filterOperatorEndsWith: '以...結束',
  filterOperatorIs: '為',
  filterOperatorNot: '不為',
  filterOperatorAfter: '...之後',
  filterOperatorOnOrAfter: '...(含)之後',
  filterOperatorBefore: '...之前',
  filterOperatorOnOrBefore: '...(含)之前',
  filterOperatorIsEmpty: '為空',
  filterOperatorIsNotEmpty: '不為空',
  filterOperatorIsAnyOf: '是其中之一',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: '包含',
  headerFilterOperatorDoesNotContain: '不包含',
  headerFilterOperatorEquals: '等於',
  headerFilterOperatorDoesNotEqual: '不等於',
  headerFilterOperatorStartsWith: '以...開頭',
  headerFilterOperatorEndsWith: '以...結束',
  headerFilterOperatorIs: '為',
  headerFilterOperatorNot: '不為',
  headerFilterOperatorAfter: '...之後',
  headerFilterOperatorOnOrAfter: '...(含)之後',
  headerFilterOperatorBefore: '...之前',
  headerFilterOperatorOnOrBefore: '...(含)之前',
  headerFilterOperatorIsEmpty: '為空',
  headerFilterOperatorIsNotEmpty: '不為空',
  headerFilterOperatorIsAnyOf: '是其中之一',
  'headerFilterOperator=': '等於',
  'headerFilterOperator!=': '不等於',
  'headerFilterOperator>': '大於',
  'headerFilterOperator>=': '大於或等於',
  'headerFilterOperator<': '小於',
  'headerFilterOperator<=': '小於或等於',
  headerFilterClear: '清除篩選',

  // Filter values text
  filterValueAny: '任何值',
  filterValueTrue: '真',
  filterValueFalse: '假',

  // Column menu text
  columnMenuLabel: '選單',
  columnMenuAriaLabel: (columnName: string) => `${columnName} 欄位選單`,
  columnMenuShowColumns: '顯示欄位',
  columnMenuManageColumns: '管理欄位',
  columnMenuFilter: '篩選器',
  columnMenuHideColumn: '隱藏',
  columnMenuUnsort: '預設排序',
  columnMenuSortAsc: '升序',
  columnMenuSortDesc: '降序',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} 個篩選器`,
  columnHeaderFiltersLabel: '顯示篩選器',
  columnHeaderSortIconLabel: '排序',

  // Rows selected footer text
  footerRowSelected: (count) => `已選取 ${count.toLocaleString()} 個`,

  // Total row amount footer text
  footerTotalRows: '總數:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: '核取方塊',
  checkboxSelectionSelectAllRows: '全選',
  checkboxSelectionUnselectAllRows: '取消全選',
  checkboxSelectionSelectRow: '選取',
  checkboxSelectionUnselectRow: '取消選取',

  // Boolean cell text
  booleanCellTrueLabel: '真',
  booleanCellFalseLabel: '假',

  // Actions cell more text
  actionsCellMore: '查看更多',

  // Column pinning text
  pinToLeft: '釘選在左側',
  pinToRight: '釘選在右側',
  unpin: '取消釘選',

  // Tree Data
  treeDataGroupingHeaderName: '群組',
  treeDataExpand: '查看子項目',
  treeDataCollapse: '隱藏子項目',

  // Grouping columns
  groupingColumnHeaderName: '群組',
  groupColumn: (name) => `以 ${name} 分組`,
  unGroupColumn: (name) => `取消以 ${name} 分組`,

  // Master/detail
  detailPanelToggle: '切換顯示詳細資訊',
  expandDetailPanel: '展開',
  collapseDetailPanel: '摺疊',

  // Pagination
  paginationRowsPerPage: '每頁數量:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${from}–${to} 共 ${count !== -1 ? count : `超過 ${to}`}`;
    }
    const estimatedLabel = estimated && estimated > to ? `約 ${estimated}` : `超過 ${to}`;
    return `${from}–${to} 共 ${count !== -1 ? count : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return '第一頁';
    }
    if (type === 'last') {
      return '最後一頁';
    }
    if (type === 'next') {
      return '下一頁';
    }
    return '上一頁';
  },

  // Row reordering text
  rowReorderingHeaderName: '排序',

  // Aggregation
  aggregationMenuItemHeader: '集合',
  aggregationFunctionLabelSum: '總數',
  aggregationFunctionLabelAvg: '平均數',
  aggregationFunctionLabelMin: '最小',
  aggregationFunctionLabelMax: '最大',
  aggregationFunctionLabelSize: '尺寸',

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

  // Prompt field
  promptFieldLabel: '提示詞輸入',
  promptFieldPlaceholder: '輸入提示詞',
  promptFieldPlaceholderWithRecording: '輸入或錄製提示詞',
  promptFieldPlaceholderListening: '正在錄音…',
  // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  promptFieldSend: '發送',
  promptFieldRecord: '錄音',
  promptFieldStopRecording: '停止錄音',

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

export const zhTW: Localization = getGridLocalization(zhTWGrid);
