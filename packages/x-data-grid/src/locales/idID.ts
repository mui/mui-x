import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

export const idIDGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Tidak ad abaris',
  noResultsOverlayLabel: 'Tidak ada hasil yang ditemukan.',
  noColumnsOverlayLabel: 'Tidak ada kolom',
  noColumnsOverlayManageColumns: 'Kelola columns',
  emptyPivotOverlayLabel: 'Tambahkan bidang ke baris, kolom, dan nilai untuk membuat tabel pivot',

  // Density selector toolbar button text
  toolbarDensity: 'Kepadatan',
  toolbarDensityLabel: 'Kepadatan',
  toolbarDensityCompact: 'Ringkas',
  toolbarDensityStandard: 'Standar',
  toolbarDensityComfortable: 'Nyaman',

  // Undo/redo toolbar button text
  toolbarUndo: 'Urungkan',
  toolbarRedo: 'Ulangi',

  // Columns selector toolbar button text
  toolbarColumns: 'Kolom',
  toolbarColumnsLabel: 'Pilih kolom',

  // Filters toolbar button text
  toolbarFilters: 'Filter',
  toolbarFiltersLabel: 'Tampilkan filter',
  toolbarFiltersTooltipHide: 'Sembunyikan filter',
  toolbarFiltersTooltipShow: 'Tampilkan filter',
  toolbarFiltersTooltipActive: (count) => `${count} filter aktif`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Cari…',
  toolbarQuickFilterLabel: 'Cari',
  toolbarQuickFilterDeleteIconLabel: 'Hapus',

  // Export selector toolbar button text
  toolbarExport: 'Ekspor',
  toolbarExportLabel: 'Ekspor',
  toolbarExportCSV: 'Unduh sebagai CSV',
  toolbarExportPrint: 'Cetak',
  toolbarExportExcel: 'Unduh sebagai Excel',

  // Toolbar pivot button
  toolbarPivot: 'Pivot',

  // Toolbar charts button
  // toolbarCharts: 'Charts',

  // Toolbar AI Assistant button
  toolbarAssistant: 'Asisten AI',

  // Columns management text
  columnsManagementSearchTitle: 'Cari',
  columnsManagementNoColumns: 'Tidak ada kolom',
  columnsManagementShowHideAllText: 'Tampilkan/Sembunyikan Semua',
  columnsManagementReset: 'Atur ulang',
  columnsManagementDeleteIconLabel: 'Hapus',

  // Filter panel text
  filterPanelAddFilter: 'Tambahkan filter',
  filterPanelRemoveAll: 'Hapus semua',
  filterPanelDeleteIconLabel: 'Hapus',
  filterPanelLogicOperator: 'Operator logika',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'Dan',
  filterPanelOperatorOr: 'Atau',
  filterPanelColumns: 'Kolom',
  filterPanelInputLabel: 'Nilai',
  filterPanelInputPlaceholder: 'Nilai filter',

  // Filter operators text
  filterOperatorContains: 'berisi',
  filterOperatorDoesNotContain: 'tidak berisi',
  filterOperatorEquals: 'sama dengan',
  filterOperatorDoesNotEqual: 'tidak sama dengan',
  filterOperatorStartsWith: 'diawali dengan',
  filterOperatorEndsWith: 'diakhiri dengan',
  filterOperatorIs: 'adalah',
  filterOperatorNot: 'bukan',
  filterOperatorAfter: 'setelah',
  filterOperatorOnOrAfter: 'pada atau setelah',
  filterOperatorBefore: 'sebelum',
  filterOperatorOnOrBefore: 'pada atau sebelum',
  filterOperatorIsEmpty: 'kosong',
  filterOperatorIsNotEmpty: 'tidak kosong',
  filterOperatorIsAnyOf: 'salah satu dari',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Mengandung',
  headerFilterOperatorDoesNotContain: 'Tidak mengandung',
  headerFilterOperatorEquals: 'Sama dengan',
  headerFilterOperatorDoesNotEqual: 'Tidak sama dengan',
  headerFilterOperatorStartsWith: 'Diawali dengan',
  headerFilterOperatorEndsWith: 'Diakhiri dengan',
  headerFilterOperatorIs: 'Adalah',
  headerFilterOperatorNot: 'Bukan',
  headerFilterOperatorAfter: 'Setelah',
  headerFilterOperatorOnOrAfter: 'Pada atau setelah',
  headerFilterOperatorBefore: 'Sebelum',
  headerFilterOperatorOnOrBefore: 'Pada atau sebelum',
  headerFilterOperatorIsEmpty: 'Kosong',
  headerFilterOperatorIsNotEmpty: 'Tidak kosong',
  headerFilterOperatorIsAnyOf: 'Salah satu dari',
  'headerFilterOperator=': 'Sama dengan',
  'headerFilterOperator!=': 'Tidak sama dengan',
  'headerFilterOperator>': 'Lebih dari',
  'headerFilterOperator>=': 'Lebih dari atau sama dengan',
  'headerFilterOperator<': 'Kurang dari',
  'headerFilterOperator<=': 'Kurang dari atau sama dengan',
  headerFilterClear: 'Hapus filter',

  // Filter values text
  filterValueAny: 'apa saja',
  filterValueTrue: 'benar',
  filterValueFalse: 'salah',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuAriaLabel: (columnName: string) => `Menu kolom ${columnName}`,
  columnMenuShowColumns: 'Tampilkan kolom',
  columnMenuManageColumns: 'Kelola kolom',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Sembunyikan kolom',
  columnMenuUnsort: 'Batalkan urutan',
  columnMenuSortAsc: 'Urutkan menaik',
  columnMenuSortDesc: 'Urutkan menurun',
  columnMenuManagePivot: 'Kelola pivot',
  // columnMenuManageCharts: 'Manage charts',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} filter aktif`,
  columnHeaderFiltersLabel: 'Tampilkan filter',
  columnHeaderSortIconLabel: 'Urutkan',

  // Rows selected footer text
  footerRowSelected: (count) => `${count.toLocaleString()} baris dipilih`,

  // Total row amount footer text
  footerTotalRows: 'Total Baris:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} dari ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Pilihan kotak centang',
  checkboxSelectionSelectAllRows: 'Pilih semua baris',
  checkboxSelectionUnselectAllRows: 'Batal pilih semua baris',
  checkboxSelectionSelectRow: 'Pilih baris',
  checkboxSelectionUnselectRow: 'Batal pilih baris',

  // Boolean cell text
  booleanCellTrueLabel: 'ya',
  booleanCellFalseLabel: 'tidak',

  // Long text cell
  // longTextCellExpandLabel: 'Expand',
  // longTextCellCollapseLabel: 'Collapse',

  // Actions cell more text
  actionsCellMore: 'lainnya',

  // Column pinning text
  pinToLeft: 'Sematkan ke kiri',
  pinToRight: 'Sematkan ke kanan',
  unpin: 'Lepas sematan',

  // Tree Data
  treeDataGroupingHeaderName: 'Kelompok',
  treeDataExpand: 'lihat turunan',
  treeDataCollapse: 'sembunyikan turunan',

  // Grouping columns
  groupingColumnHeaderName: 'Kelompok',
  groupColumn: (name) => `Kelompokkan berdasarkan ${name}`,
  unGroupColumn: (name) => `Hentikan pengelompokan berdasarkan ${name}`,

  // Master/detail
  detailPanelToggle: 'Pengalih panel detail',
  expandDetailPanel: 'Perluas',
  collapseDetailPanel: 'Ciutkan',

  // Pagination
  paginationRowsPerPage: 'Baris per halaman:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${from}–${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`;
    }
    const estimatedLabel =
      estimated && estimated > to ? `sekitar ${estimated}` : `lebih dari ${to}`;
    return `${from}–${to} dari ${count !== -1 ? count : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Pergi ke halaman pertama';
    }
    if (type === 'last') {
      return 'Pergi ke halaman terakhir';
    }
    if (type === 'next') {
      return 'Pergi ke halaman berikutnya';
    }
    // if (type === 'previous') {
    return 'Pergi ke halaman sebelumnya';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Pengurutan ulang baris',

  // Aggregation
  aggregationMenuItemHeader: 'Agregasi',
  // aggregationFunctionLabelNone: 'none',
  aggregationFunctionLabelSum: 'jumlah',
  aggregationFunctionLabelAvg: 'rata-rata',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'maks',
  aggregationFunctionLabelSize: 'ukuran',

  // Pivot panel
  pivotToggleLabel: 'Pivot',
  pivotRows: 'Baris',
  pivotColumns: 'Kolom',
  pivotValues: 'Nilai',
  pivotCloseButton: 'Tutup pengaturan pivot',
  pivotSearchButton: 'Cari bidang',
  pivotSearchControlPlaceholder: 'Cari bidang',
  pivotSearchControlLabel: 'Cari bidang',
  pivotSearchControlClear: 'Hapus pencarian',
  pivotNoFields: 'Tidak ada bidang',
  pivotMenuMoveUp: 'Pindah ke atas',
  pivotMenuMoveDown: 'Pindah ke bawah',
  pivotMenuMoveToTop: 'Pindah ke paling atas',
  pivotMenuMoveToBottom: 'Pindah ke paling bawah',
  pivotMenuRows: 'Baris',
  pivotMenuColumns: 'Kolom',
  pivotMenuValues: 'Nilai',
  pivotMenuOptions: 'Opsi bidang',
  pivotMenuAddToRows: 'Tambahkan ke Baris',
  pivotMenuAddToColumns: 'Tambahkan ke Kolom',
  pivotMenuAddToValues: 'Tambahkan ke Nilai',
  pivotMenuRemove: 'Hapus',
  pivotDragToRows: 'Seret ke sini untuk membuat baris',
  pivotDragToColumns: 'Seret ke sini untuk membuat kolom',
  pivotDragToValues: 'Seret ke sini untuk membuat nilai',
  pivotYearColumnHeaderName: '(Tahun)',
  pivotQuarterColumnHeaderName: '(Kuartal)',

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
  aiAssistantPanelTitle: 'Asisten AI',
  aiAssistantPanelClose: 'Tutup Asisten AI',
  aiAssistantPanelNewConversation: 'Percakapan baru',
  aiAssistantPanelConversationHistory: 'Riwayat percakapan',
  aiAssistantPanelEmptyConversation: 'Tidak ada riwayat percakapan',
  aiAssistantSuggestions: 'Saran',

  // Prompt field
  promptFieldLabel: 'Perintah',
  promptFieldPlaceholder: 'Ketik perintah…',
  promptFieldPlaceholderWithRecording: 'Ketik atau rekam perintah…',
  promptFieldPlaceholderListening: 'Mendengarkan perintah',
  promptFieldSpeechRecognitionNotSupported: 'Pengenalan suara tidak didukung di browser ini',
  promptFieldSend: 'Kirim',
  promptFieldRecord: 'Rekam',
  promptFieldStopRecording: 'Hentikan perekaman',

  // Prompt
  promptRerun: 'Jalankan lagi',
  promptProcessing: 'Memproses…',
  promptAppliedChanges: 'Perubahan diterapkan',

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `Kelompokkan berdasarkan ${column}`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `Agregasikan ${column} (${aggregation})`,
  promptChangeFilterLabel: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `${column} salah satu dari: ${value}`;
    }
    return `${column} ${operator} ${value}`;
  },
  promptChangeFilterDescription: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `Filter di mana ${column} salah satu dari: ${value}`;
    }
    return `Filter di mana ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `Urutkan berdasarkan ${column} (${direction})`,
  promptChangePivotEnableLabel: 'Pivot',
  promptChangePivotEnableDescription: 'Aktifkan pivot',
  promptChangePivotColumnsLabel: (count: number) => `Kolom (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `Baris (${count})`,
  promptChangePivotValuesLabel: (count: number) => `Nilai (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  // promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) => `Dimensions (${dimensionsCount}), Values (${valuesCount})`,
};

export const idID: Localization = getGridLocalization(idIDGrid);
