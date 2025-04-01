import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const trTRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Satır yok',
  noResultsOverlayLabel: 'Sonuç bulunamadı.',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Yoğunluk',
  toolbarDensityLabel: 'Yoğunluk',
  toolbarDensityCompact: 'Sıkı',
  toolbarDensityStandard: 'Standart',
  toolbarDensityComfortable: 'Rahat',

  // Columns selector toolbar button text
  toolbarColumns: 'Sütunlar',
  toolbarColumnsLabel: 'Sütun seç',

  // Filters toolbar button text
  toolbarFilters: 'Filtreler',
  toolbarFiltersLabel: 'Filtreleri göster',
  toolbarFiltersTooltipHide: 'Filtreleri gizle',
  toolbarFiltersTooltipShow: 'Filtreleri göster',
  toolbarFiltersTooltipActive: (count) => `${count} aktif filtre`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Ara…',
  toolbarQuickFilterLabel: 'Ara',
  toolbarQuickFilterDeleteIconLabel: 'Temizle',

  // Export selector toolbar button text
  toolbarExport: 'Dışa aktar',
  toolbarExportLabel: 'Dışa aktar',
  toolbarExportCSV: 'CSV olarak aktar',
  toolbarExportPrint: 'Yazdır',
  toolbarExportExcel: 'Excel olarak aktar',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'Arama',
  columnsManagementNoColumns: 'Kolon yok',
  columnsManagementShowHideAllText: 'Hepsini Göster/Gizle',
  columnsManagementReset: 'Sıfırla',
  columnsManagementDeleteIconLabel: 'Temizle',

  // Filter panel text
  filterPanelAddFilter: 'Filtre Ekle',
  filterPanelRemoveAll: 'Hepsini kaldır',
  filterPanelDeleteIconLabel: 'Kaldır',
  filterPanelLogicOperator: 'Mantıksal operatörler',
  filterPanelOperator: 'Operatör',
  filterPanelOperatorAnd: 'Ve',
  filterPanelOperatorOr: 'Veya',
  filterPanelColumns: 'Sütunlar',
  filterPanelInputLabel: 'Değer',
  filterPanelInputPlaceholder: 'Filtre değeri',

  // Filter operators text
  filterOperatorContains: 'içerir',
  filterOperatorDoesNotContain: 'içermiyor',
  filterOperatorEquals: 'eşittir',
  filterOperatorDoesNotEqual: 'eşit değil',
  filterOperatorStartsWith: 'ile başlar',
  filterOperatorEndsWith: 'ile biter',
  filterOperatorIs: 'eşittir',
  filterOperatorNot: 'eşit değildir',
  filterOperatorAfter: 'büyük',
  filterOperatorOnOrAfter: 'büyük eşit',
  filterOperatorBefore: 'küçük',
  filterOperatorOnOrBefore: 'küçük eşit',
  filterOperatorIsEmpty: 'boş',
  filterOperatorIsNotEmpty: 'dolu',
  filterOperatorIsAnyOf: 'herhangi biri',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Şunu içerir',
  headerFilterOperatorDoesNotContain: 'İçermez',
  headerFilterOperatorEquals: 'Şuna eşittir',
  headerFilterOperatorDoesNotEqual: 'Eşit değildir',
  headerFilterOperatorStartsWith: 'Şununla başlar',
  headerFilterOperatorEndsWith: 'Şununla biter',
  headerFilterOperatorIs: 'Eşittir',
  headerFilterOperatorNot: 'Eşit değil',
  headerFilterOperatorAfter: 'Sonra',
  headerFilterOperatorOnOrAfter: 'Sonra veya eşit',
  headerFilterOperatorBefore: 'Önce',
  headerFilterOperatorOnOrBefore: 'Önce veya eşit',
  headerFilterOperatorIsEmpty: 'Boş',
  headerFilterOperatorIsNotEmpty: 'Boş değil',
  headerFilterOperatorIsAnyOf: 'Herhangi biri',
  'headerFilterOperator=': 'Eşittir',
  'headerFilterOperator!=': 'Eşit değil',
  'headerFilterOperator>': 'Büyüktür',
  'headerFilterOperator>=': 'Büyük veya eşit',
  'headerFilterOperator<': 'Küçüktür',
  'headerFilterOperator<=': 'Küçük veya eşit',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'herhangi',
  filterValueTrue: 'doğru',
  filterValueFalse: 'yanlış',

  // Column menu text
  columnMenuLabel: 'Menü',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Sütunları göster',
  columnMenuManageColumns: 'Sütunları yönet',
  columnMenuFilter: 'Filtre Ekle',
  columnMenuHideColumn: 'Gizle',
  columnMenuUnsort: 'Varsayılan Sıralama',
  columnMenuSortAsc: 'Sırala - Artan',
  columnMenuSortDesc: 'Sırala - Azalan',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} filtre aktif`,
  columnHeaderFiltersLabel: 'Filtreleri göster',
  columnHeaderSortIconLabel: 'Sırala',

  // Rows selected footer text
  footerRowSelected: (count) => `${count.toLocaleString()} satır seçildi`,

  // Total row amount footer text
  footerTotalRows: 'Toplam Satır:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Seçim',
  checkboxSelectionSelectAllRows: 'Tüm satırları seç',
  checkboxSelectionUnselectAllRows: 'Tüm satırların seçimini kaldır',
  checkboxSelectionSelectRow: 'Satırı seç',
  checkboxSelectionUnselectRow: 'Satır seçimini bırak',

  // Boolean cell text
  booleanCellTrueLabel: 'Evet',
  booleanCellFalseLabel: 'Hayır',

  // Actions cell more text
  actionsCellMore: 'daha fazla',

  // Column pinning text
  pinToLeft: 'Sola sabitle',
  pinToRight: 'Sağa sabitle',
  unpin: 'Sabitlemeyi kaldır',

  // Tree Data
  treeDataGroupingHeaderName: 'Grup',
  treeDataExpand: 'göster',
  treeDataCollapse: 'gizle',

  // Grouping columns
  groupingColumnHeaderName: 'Grup',
  groupColumn: (name) => `${name} için grupla`,
  unGroupColumn: (name) => `${name} için gruplamayı kaldır`,

  // Master/detail
  detailPanelToggle: 'Detay görünümüne geçiş',
  expandDetailPanel: 'Genişlet',
  collapseDetailPanel: 'Gizle',

  // Pagination
  paginationRowsPerPage: 'Sayfa başına satır:',
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
      return 'İlk sayfaya git';
    }
    if (type === 'last') {
      return 'Son sayfaya git';
    }
    if (type === 'next') {
      return 'Sonraki sayfaya git';
    }
    // if (type === 'previous') {
    return 'Önceki sayfaya git';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Satırı yeniden sırala',

  // Aggregation
  aggregationMenuItemHeader: 'Toplama',
  aggregationFunctionLabelSum: 'top',
  aggregationFunctionLabelAvg: 'ort',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'maks',
  aggregationFunctionLabelSize: 'boyut',

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
  promptFieldLabel: 'İstem girişi',
  promptFieldPlaceholder: 'Bir istem yazın…',
  promptFieldPlaceholderWithRecording: 'Bir istem yazın veya kaydedin…',
  promptFieldPlaceholderListening: 'İstem dinleniyor…',
  // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  promptFieldSend: 'Gönder',
  promptFieldRecord: 'Kaydet',
  promptFieldStopRecording: 'Kaydı durdur',

  // Prompt
  // promptRerun: 'Run again',
};

export const trTR: Localization = getGridLocalization(trTRGrid);
