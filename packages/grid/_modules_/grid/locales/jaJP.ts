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

  // Export selector toolbar button text
  toolbarExport: 'エクスポート',
  toolbarExportLabel: 'エクスポート',
  toolbarExportCSV: 'CSVダウンロード',
  // toolbarExportPrint: 'Print',

  // Columns panel text
  columnsPanelTextFieldLabel: '列検索',
  columnsPanelTextFieldPlaceholder: '検索クエリを入力...',
  columnsPanelDragIconLabel: '列並べ替え',
  columnsPanelShowAllButton: 'すべて表示',
  columnsPanelHideAllButton: 'すべて非表示',

  // Filter panel text
  filterPanelAddFilter: 'フィルター追加',
  filterPanelDeleteIconLabel: '削除',
  filterPanelOperators: 'オペレータ',
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

  // Total rows footer text
  footerTotalRows: '総行数:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'チェックボックス',

  // Boolean cell text
  booleanCellTrueLabel: '真',
  booleanCellFalseLabel: '偽',

  // Actions cell more text
  // actionsCellMore: 'more',
};

export const jaJP: Localization = getGridLocalization(jaJPGrid, jaJPCore);
