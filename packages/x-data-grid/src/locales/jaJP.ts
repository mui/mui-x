import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, type Localization } from '../utils/getGridLocalization';

const jaJPGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: '行がありません。',
  noResultsOverlayLabel: '結果がありません。',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: '行間隔',
  toolbarDensityLabel: '行間隔',
  toolbarDensityCompact: 'コンパクト',
  toolbarDensityStandard: '標準',
  toolbarDensityComfortable: '広め',

  // Undo/redo toolbar button text
  toolbarUndo: '元に戻す',
  toolbarRedo: 'やり直す',

  // Columns selector toolbar button text
  toolbarColumns: '列一覧',
  toolbarColumnsLabel: '列選択',

  // Filters toolbar button text
  toolbarFilters: 'フィルター',
  toolbarFiltersLabel: 'フィルター表示',
  toolbarFiltersTooltipHide: 'フィルター非表示',
  toolbarFiltersTooltipShow: 'フィルター表示',
  toolbarFiltersTooltipActive: (count) => `${count}件のフィルターを適用中`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: '検索…',
  toolbarQuickFilterLabel: '検索',
  toolbarQuickFilterDeleteIconLabel: 'クリア',

  // Export selector toolbar button text
  toolbarExport: 'エクスポート',
  toolbarExportLabel: 'エクスポート',
  toolbarExportCSV: 'CSVダウンロード',
  toolbarExportPrint: '印刷',
  toolbarExportExcel: 'Excelダウンロード',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar charts button
  // toolbarCharts: 'Charts',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: '検索',
  columnsManagementNoColumns: 'カラムなし',
  columnsManagementShowHideAllText: 'すべて表示/非表示',
  columnsManagementReset: 'リセット',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'フィルター追加',
  filterPanelRemoveAll: 'すべて削除',
  filterPanelDeleteIconLabel: '削除',
  filterPanelLogicOperator: '論理演算子',
  filterPanelOperator: '演算子',
  filterPanelOperatorAnd: 'And',
  filterPanelOperatorOr: 'Or',
  filterPanelColumns: '列',
  filterPanelInputLabel: '値',
  filterPanelInputPlaceholder: '値を入力…',

  // Filter operators text
  filterOperatorContains: '...を含む',
  filterOperatorDoesNotContain: '...を含まない',
  filterOperatorEquals: '...に等しい',
  filterOperatorDoesNotEqual: '...に等しくない',
  filterOperatorStartsWith: '...で始まる',
  filterOperatorEndsWith: '...で終わる',
  filterOperatorIs: '...である',
  filterOperatorNot: '...でない',
  filterOperatorAfter: '...より後ろ',
  filterOperatorOnOrAfter: '...以降',
  filterOperatorBefore: '...より前',
  filterOperatorOnOrBefore: '...以前',
  filterOperatorIsEmpty: '...空である',
  filterOperatorIsNotEmpty: '...空でない',
  filterOperatorIsAnyOf: '...のいずれか',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: '含む',
  headerFilterOperatorDoesNotContain: '含まない',
  headerFilterOperatorEquals: '等しい',
  headerFilterOperatorDoesNotEqual: '等しくない',
  headerFilterOperatorStartsWith: 'で始まる',
  headerFilterOperatorEndsWith: 'で終わる',
  headerFilterOperatorIs: 'である',
  headerFilterOperatorNot: 'ではない',
  headerFilterOperatorAfter: '...より後ろ',
  headerFilterOperatorOnOrAfter: '...以降',
  headerFilterOperatorBefore: '...より前',
  headerFilterOperatorOnOrBefore: '...以前',
  headerFilterOperatorIsEmpty: '空白',
  headerFilterOperatorIsNotEmpty: '空白ではない',
  headerFilterOperatorIsAnyOf: 'いずれか',
  'headerFilterOperator=': '等しい',
  'headerFilterOperator!=': '等しくない',
  'headerFilterOperator>': 'より大きい',
  'headerFilterOperator>=': '以上',
  'headerFilterOperator<': '未満',
  'headerFilterOperator<=': '以下',
  headerFilterClear: 'フィルターを削除',

  // Filter values text
  filterValueAny: 'いずれか',
  filterValueTrue: '真',
  filterValueFalse: '偽',

  // Column menu text
  columnMenuLabel: 'メニュー',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: '列表示',
  columnMenuManageColumns: '列管理',
  columnMenuFilter: 'フィルター',
  columnMenuHideColumn: '列非表示',
  columnMenuUnsort: 'ソート解除',
  columnMenuSortAsc: '昇順ソート',
  columnMenuSortDesc: '降順ソート',
  columnMenuManagePivot: 'ピボットを管理',
  columnMenuManageCharts: 'チャートを管理',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count}件のフィルターを適用中`,
  columnHeaderFiltersLabel: 'フィルター表示',
  columnHeaderSortIconLabel: 'ソート',

  // Rows selected footer text
  footerRowSelected: (count) => `${count}行を選択中`,

  // Total row amount footer text
  footerTotalRows: '総行数:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'チェックボックス',
  checkboxSelectionSelectAllRows: 'すべての行を選択',
  checkboxSelectionUnselectAllRows: 'すべての行選択を解除',
  checkboxSelectionSelectRow: '行を選択',
  checkboxSelectionUnselectRow: '行選択を解除',

  // Boolean cell text
  booleanCellTrueLabel: '真',
  booleanCellFalseLabel: '偽',

  // Long text cell
  longTextCellExpandLabel: '展開',
  longTextCellCollapseLabel: '折りたたみ',

  // Actions cell more text
  actionsCellMore: 'もっと見る',

  // Column pinning text
  pinToLeft: '左側に固定',
  pinToRight: '右側に固定',
  unpin: '固定解除',

  // Tree Data
  treeDataGroupingHeaderName: 'グループ',
  treeDataExpand: '展開',
  treeDataCollapse: '折りたたみ',

  // Grouping columns
  groupingColumnHeaderName: 'グループ',
  groupColumn: (name) => `${name}でグループ化`,
  unGroupColumn: (name) => `${name}のグループを解除`,

  // Master/detail
  detailPanelToggle: '詳細パネルの切り替え',
  expandDetailPanel: '展開',
  collapseDetailPanel: '折りたたみ',

  // Pagination
  paginationRowsPerPage: 'ページあたりの行数:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${from}–${to} of ${count !== -1 ? count : `${to}以上`}`;
    }
    const estimatedLabel = estimated && estimated > to ? `${estimated}前後` : `${to}以上`;
    return `${from}–${to} of ${count !== -1 ? count : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return '最初のページへ';
    }
    if (type === 'last') {
      return '最後のページへ';
    }
    if (type === 'next') {
      return '次のページへ';
    }
    // if (type === 'previous') {
    return '前のページへ';
  },

  // Row reordering text
  rowReorderingHeaderName: '行並び替え',

  // Aggregation
  aggregationMenuItemHeader: '合計',
  // aggregationFunctionLabelNone: 'none',
  aggregationFunctionLabelSum: '和',
  aggregationFunctionLabelAvg: '平均',
  aggregationFunctionLabelMin: '最小値',
  aggregationFunctionLabelMax: '最大値',
  aggregationFunctionLabelSize: 'サイズ',

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
  chartsTabCustomize: 'カスタマイズ',
  // chartsCloseButton: 'Close charts configuration',
  // chartsSyncButtonLabel: 'Sync chart',
  // chartsSearchPlaceholder: 'Search fields',
  chartsSearchLabel: 'フィールドを検索する',
  // chartsSearchClear: 'Clear search',
  // chartsNoFields: 'No fields',
  // chartsFieldBlocked: 'This field cannot be added to any section',
  chartsCategories: 'カテゴリ',
  chartsSeries: 'シリーズ',
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
  aiAssistantPanelTitle: 'AIアシスタント',
  aiAssistantPanelClose: 'AIアシスタントパネルを閉じる',
  aiAssistantPanelNewConversation: '新しい会話を開始する',
  aiAssistantPanelConversationHistory: '会話の履歴',
  // aiAssistantPanelEmptyConversation: 'No prompt history',
  aiAssistantSuggestions: '提案',

  // Prompt field
  promptFieldLabel: 'プロンプト',
  promptFieldPlaceholder: 'プロンプトを入力...',
  // promptFieldPlaceholderWithRecording: 'Type or record a prompt…',
  // promptFieldPlaceholderListening: 'Listening for prompt…',
  // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  promptFieldSend: '送信',
  promptFieldRecord: '録音',
  promptFieldStopRecording: '録音を止める',

  // Prompt
  promptRerun: '再試行',
  promptProcessing: '実行中…',
  promptAppliedChanges: '変更を適用済み',

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

export const jaJP: Localization = getGridLocalization(jaJPGrid);
