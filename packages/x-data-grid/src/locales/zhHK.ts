import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization } from '../utils/getGridLocalization';

const zhHKGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: '沒有行',
  noResultsOverlayLabel: '未找到結果。',
  noColumnsOverlayLabel: '沒有欄目',
  noColumnsOverlayManageColumns: '管理欄目',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: '密度',
  toolbarDensityLabel: '密度',
  toolbarDensityCompact: '袖珍的',
  toolbarDensityStandard: '標準',
  toolbarDensityComfortable: '舒服的',

  // Columns selector toolbar button text
  toolbarColumns: '列',
  toolbarColumnsLabel: '選擇列',

  // Filters toolbar button text
  toolbarFilters: '過濾器',
  toolbarFiltersLabel: '顯示過濾器',
  toolbarFiltersTooltipHide: '隱藏過濾器',
  toolbarFiltersTooltipShow: '顯示過濾器',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} 個有效過濾器` : `${count} 個活動過濾器`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: '搜尋…',
  toolbarQuickFilterLabel: '搜尋',
  toolbarQuickFilterDeleteIconLabel: '清除',

  // Export selector toolbar button text
  toolbarExport: '出口',
  toolbarExportLabel: '出口',
  toolbarExportCSV: '下載為 CSV',
  toolbarExportPrint: '列印',
  toolbarExportExcel: '下載為 Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: '搜尋',
  columnsManagementNoColumns: '沒有列',
  columnsManagementShowHideAllText: '顯示/隱藏所有',
  columnsManagementReset: '重置',
  columnsManagementDeleteIconLabel: '清除',

  // Filter panel text
  filterPanelAddFilter: '新增過濾器',
  filterPanelRemoveAll: '移除所有',
  filterPanelDeleteIconLabel: '刪除',
  filterPanelLogicOperator: '邏輯運算符',
  filterPanelOperator: '操作員',
  filterPanelOperatorAnd: '和',
  filterPanelOperatorOr: '或者',
  filterPanelColumns: '列',
  filterPanelInputLabel: '價值',
  filterPanelInputPlaceholder: '過濾值',

  // Filter operators text
  filterOperatorContains: '包含',
  filterOperatorDoesNotContain: '不包含',
  filterOperatorEquals: '等於',
  filterOperatorDoesNotEqual: '不等於',
  filterOperatorStartsWith: '以。。開始',
  filterOperatorEndsWith: '以。。結束',
  filterOperatorIs: '是',
  filterOperatorNot: '不是',
  filterOperatorAfter: '是在之後',
  filterOperatorOnOrAfter: '是在或之後',
  filterOperatorBefore: '是在之前',
  filterOperatorOnOrBefore: '是在或之前',
  filterOperatorIsEmpty: '是空的',
  filterOperatorIsNotEmpty: '不為空',
  filterOperatorIsAnyOf: '是以下任一個',
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
  headerFilterOperatorStartsWith: '以。。開始',
  headerFilterOperatorEndsWith: '以。。結束',
  headerFilterOperatorIs: '是',
  headerFilterOperatorNot: '不是',
  headerFilterOperatorAfter: '是在之後',
  headerFilterOperatorOnOrAfter: '是在或之後',
  headerFilterOperatorBefore: '是之前',
  headerFilterOperatorOnOrBefore: '是在或之前',
  headerFilterOperatorIsEmpty: '是空的',
  headerFilterOperatorIsNotEmpty: '不為空',
  headerFilterOperatorIsAnyOf: '是以下任一個',
  'headerFilterOperator=': '等於',
  'headerFilterOperator!=': '不等於',
  'headerFilterOperator>': '大於',
  'headerFilterOperator>=': '大於或等於',
  'headerFilterOperator<': '少於',
  'headerFilterOperator<=': '小於或等於',
  headerFilterClear: '清除篩選',

  // Filter values text
  filterValueAny: '任何',
  filterValueTrue: '真的',
  filterValueFalse: '錯誤的',

  // Column menu text
  columnMenuLabel: '選單',
  columnMenuAriaLabel: (columnName: string) => `${columnName} 欄目選單`,
  columnMenuShowColumns: '顯示欄目',
  columnMenuManageColumns: '管理欄目',
  columnMenuFilter: '篩選',
  columnMenuHideColumn: '隱藏列',
  columnMenuUnsort: '取消排序',
  columnMenuSortAsc: '按升序排序',
  columnMenuSortDesc: '按降序排序',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} 個有效過濾器` : `${count} 個活動過濾器`,
  columnHeaderFiltersLabel: '顯示過濾器',
  columnHeaderSortIconLabel: '種類',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `已選擇 ${count.toLocaleString()} 行` : `已選擇 ${count.toLocaleString()} 行`,

  // Total row amount footer text
  footerTotalRows: '總行數：',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${totalCount.toLocaleString()} 的 ${visibleCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: '複選框選擇',
  checkboxSelectionSelectAllRows: '選擇所有行',
  checkboxSelectionUnselectAllRows: '取消選擇所有行',
  checkboxSelectionSelectRow: '選擇行',
  checkboxSelectionUnselectRow: '取消選擇行',

  // Boolean cell text
  booleanCellTrueLabel: '是的',
  booleanCellFalseLabel: '不',

  // Actions cell more text
  actionsCellMore: '更多的',

  // Column pinning text
  pinToLeft: '固定到左側',
  pinToRight: '固定到右側',
  unpin: '取消固定',

  // Tree Data
  treeDataGroupingHeaderName: 'Group',
  treeDataExpand: '看看孩子們',
  treeDataCollapse: '隱藏孩子',

  // Grouping columns
  groupingColumnHeaderName: '團體',
  groupColumn: (name) => `按 ${name} 分組`,
  unGroupColumn: (name) => `停止以 ${name} 分組`,

  // Master/detail
  detailPanelToggle: '詳細資訊面板切換',
  expandDetailPanel: '擴張',
  collapseDetailPanel: '坍塌',

  // Pagination
  paginationRowsPerPage: '每頁行數:',
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
  rowReorderingHeaderName: '行重新排序',

  // Aggregation
  aggregationMenuItemHeader: '聚合',
  aggregationFunctionLabelSum: '和',
  aggregationFunctionLabelAvg: '平均',
  aggregationFunctionLabelMin: '分分鐘',
  aggregationFunctionLabelMax: '最大限度',
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
  // aiAssistantPanelClose: 'Close AI Assistant',
  // aiAssistantPanelNewConversation: 'New conversation',
  // aiAssistantPanelConversationHistory: 'Conversation history',
  // aiAssistantPanelEmptyConversation: 'No prompt history',
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

export const zhHK = getGridLocalization(zhHKGrid);
