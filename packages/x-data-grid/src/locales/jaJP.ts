import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

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

  // Prompt toolbar field
  // toolbarPromptControlPlaceholder: 'Type a prompt…',
  // toolbarPromptControlWithRecordingPlaceholder: 'Type or record a prompt…',
  // toolbarPromptControlRecordingPlaceholder: 'Listening for prompt…',
  // toolbarPromptControlLabel: 'Prompt input',
  // toolbarPromptControlRecordButtonDefaultLabel: 'Record',
  // toolbarPromptControlRecordButtonActiveLabel: 'Stop recording',
  // toolbarPromptControlSendActionLabel: 'Send',
  // toolbarPromptControlSendActionAriaLabel: 'Send prompt',
  // toolbarPromptControlErrorMessage: 'An error occurred while processing the request. Please try again with a different prompt.',

  // Export selector toolbar button text
  toolbarExport: 'エクスポート',
  toolbarExportLabel: 'エクスポート',
  toolbarExportCSV: 'CSVダウンロード',
  toolbarExportPrint: '印刷',
  toolbarExportExcel: 'Excelダウンロード',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

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
  // headerFilterClear: 'Clear filter',

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
  // columnMenuManagePivot: 'Manage pivot',

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
};

export const jaJP: Localization = getGridLocalization(jaJPGrid);
