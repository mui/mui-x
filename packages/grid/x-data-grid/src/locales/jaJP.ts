import { jaJP as jaJPCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const jaJPGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: '行がありません。',
  noResultsOverlayLabel: '結果がありません。',
  errorOverlayDefaultLabel: 'エラーが発生しました。',

  // Density selector toolbar button text
  toolbarDensity: '行間隔',
  toolbarDensityLabel: '行間隔',
  toolbarDensityCompact: 'コンパクト',
  toolbarDensityStandard: '標準',
  toolbarDensityComfortable: 'ひろめ',

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
  toolbarQuickFilterPlaceholder: '検索...',
  toolbarQuickFilterLabel: '検索',
  toolbarQuickFilterDeleteIconLabel: 'クリア',

  // Export selector toolbar button text
  toolbarExport: 'エクスポート',
  toolbarExportLabel: 'エクスポート',
  toolbarExportCSV: 'CSVダウンロード',
  toolbarExportPrint: '印刷',
  toolbarExportExcel: 'Excelダウンロード',

  // Columns panel text
  columnsPanelTextFieldLabel: '列検索',
  columnsPanelTextFieldPlaceholder: '検索クエリを入力...',
  columnsPanelDragIconLabel: '列並べ替え',
  columnsPanelShowAllButton: 'すべて表示',
  columnsPanelHideAllButton: 'すべて非表示',

  // Filter panel text
  filterPanelAddFilter: 'フィルター追加',
  filterPanelDeleteIconLabel: '削除',
  // filterPanelLinkOperator: 'Logic operator',
  filterPanelOperators: 'オペレータ',

  // TODO v6: rename to filterPanelOperator
  filterPanelOperatorAnd: 'And',
  filterPanelOperatorOr: 'Or',
  filterPanelColumns: '列',
  filterPanelInputLabel: '値',
  filterPanelInputPlaceholder: '値を入力...',

  // Filter operators text
  filterOperatorContains: '...を含む',
  filterOperatorEquals: '...に等しい',
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

  // Filter values text
  // filterValueAny: 'any',
  // filterValueTrue: 'true',
  // filterValueFalse: 'false',

  // Column menu text
  columnMenuLabel: 'メニュー',
  columnMenuShowColumns: '列表示',
  columnMenuFilter: 'フィルター',
  columnMenuHideColumn: '列非表示',
  columnMenuUnsort: 'ソート解除',
  columnMenuSortAsc: '昇順ソート',
  columnMenuSortDesc: '降順ソート',

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
  // actionsCellMore: 'more',

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
  expandDetailPanel: '展開',
  collapseDetailPanel: '折りたたみ',

  // Row reordering text
  rowReorderingHeaderName: '行並び替え',
};

export const jaJP: Localization = getGridLocalization(jaJPGrid, jaJPCore);
