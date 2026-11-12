import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, buildLocaleFormat } from '../utils/getGridLocalization';
import type { Localization } from '../utils/getGridLocalization';

const formatNumber = buildLocaleFormat('id-ID');

export const idIDGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Tidak ada baris',
  noResultsOverlayLabel: 'Tidak ada hasil yang ditemukan.',
  noColumnsOverlayLabel: 'Tidak ada kolom',
  noColumnsOverlayManageColumns: 'Kelola kolom',
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
  toolbarCharts: 'Grafik',

  // Toolbar AI Assistant button
  toolbarAssistant: 'Asisten AI',

  // Formula bar (Premium formulas)
  formulaBarLabel: 'Bilah rumus',
  formulaBarInputLabel: 'Rumus',
  formulaBarAddressLabel: 'Sel aktif',

  // Computed columns (Premium)
  columnMenuAddComputedColumn: 'Tambahkan kolom terhitung',
  columnMenuEditComputedColumn: 'Edit kolom terhitung',
  columnMenuViewComputedColumn: 'Lihat kolom terhitung',
  columnMenuRemoveComputedColumn: 'Hapus kolom terhitung',
  toolbarComputedColumns: 'Kolom terhitung',
  computedColumnsPanelTitle: 'Kolom terhitung',
  computedColumnsPanelCloseButton: 'Tutup panel kolom terhitung',
  computedColumnsPanelBackButton: 'Kembali ke daftar',
  computedColumnsPanelEmpty: 'Belum ada kolom terhitung',
  computedColumnsPanelAddButton: 'Tambahkan kolom terhitung',
  computedColumnsPanelItemMenuLabel: 'Tindakan kolom terhitung',
  computedColumnsPanelItemReadOnlyLabel: 'Hanya baca',
  computedColumnEditorNewTitle: 'Kolom terhitung baru',
  computedColumnEditorEditTitle: 'Edit kolom terhitung',
  computedColumnEditorViewTitle: 'Lihat kolom terhitung',
  computedColumnReadOnlyHint: 'Kolom terhitung ini tidak dapat diedit.',
  computedColumnNameLabel: 'Nama',
  computedColumnFieldLabel: 'Bidang',
  computedColumnFormulaLabel: 'Rumus',
  computedColumnTypeLabel: 'Tipe hasil',
  computedColumnTypeNumber: 'Angka',
  computedColumnTypeString: 'Teks',
  computedColumnTypeBoolean: 'Boolean',
  computedColumnTypeDate: 'Tanggal',
  computedColumnTypeDateTime: 'Tanggal dan waktu',
  computedColumnFormatLabel: 'Format',
  computedColumnFormatStyleDecimal: 'Angka',
  computedColumnFormatStylePercent: 'Persen',
  computedColumnFormatStyleCurrency: 'Mata uang',
  computedColumnFormatCurrencyLabel: 'Kode mata uang',
  computedColumnFormatDecimalsLabel: 'Desimal',
  computedColumnFormatGroupingLabel: 'Pemisah ribuan',
  computedColumnPreviewLabel: 'Pratinjau',
  computedColumnPreviewRow: (rowIndex) => `Baris ${rowIndex}`,
  computedColumnPreviewNoRows: 'Tidak ada baris untuk dipratinjau',
  computedColumnReferenceTitle: 'Sisipkan',
  computedColumnReferenceColumns: 'Kolom',
  computedColumnReferenceFunctions: 'Fungsi',
  computedColumnReferenceSearchPlaceholder: 'Cari',
  computedColumnReferenceNoResults: 'Tidak ada yang cocok',
  computedColumnApplyButton: 'Terapkan',
  computedColumnAddButton: 'Tambahkan kolom',
  computedColumnCancelButton: 'Batal',
  computedColumnCloseButton: 'Tutup',
  computedColumnDeleteButton: 'Hapus kolom',
  computedColumnHeaderLabel: 'Kolom terhitung',
  computedColumnHeaderInvalidLabel: 'Kolom terhitung dengan rumus yang tidak valid',
  computedColumnErrorNameRequired: 'Masukkan nama.',
  computedColumnErrorFieldRequired: 'Masukkan nama bidang.',
  computedColumnErrorFieldInvalid:
    'Gunakan huruf, angka, dan garis bawah, diawali dengan huruf atau garis bawah.',
  computedColumnErrorFieldExists: (field) => `Kolom dengan bidang "${field}" sudah ada.`,
  computedColumnErrorFieldA1Like:
    'Nama bidang ini terbaca sebagai alamat sel. Pilih nama yang lebih panjang.',
  computedColumnErrorFormulaRequired: 'Masukkan rumus.',
  computedColumnErrorParse: (message) => `Kesalahan rumus: ${message}`,
  computedColumnErrorUnknownFunction: (name) => `Fungsi ${name} tidak dikenal.`,
  computedColumnErrorUnsupportedReference:
    'Kolom terhitung hanya dapat merujuk kolom pada baris yang sama. Gunakan nama bidang saja.',
  computedColumnErrorUnknownField: (field) => `Kolom "${field}" tidak ada.`,
  computedColumnErrorSelfReference: 'Kolom terhitung tidak dapat merujuk dirinya sendiri.',
  computedColumnErrorCycle: (path) => `Referensi melingkar: ${path}.`,
  computedCellErrorDivByZero:
    'Pembagian dengan nol di baris ini. Bungkus pembagian dengan IFERROR(…, 0) untuk memberikan nilai cadangan.',
  computedCellErrorValue: 'Ada nilai di baris ini yang tipenya tidak sesuai untuk operasi ini.',
  computedCellErrorRef: 'Kolom yang dirujuk tidak ada.',
  computedCellErrorName: 'Rumus menggunakan fungsi yang tidak dikenal.',
  computedCellErrorCycle: 'Rumus bergantung pada dirinya sendiri.',
  computedCellErrorGeneric: 'Rumus tidak dapat dievaluasi untuk baris ini.',

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
  filterPanelColumn: 'Kolom',
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
  columnMenuManageCharts: 'Kelola grafik',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} filter aktif`,
  columnHeaderFiltersLabel: 'Tampilkan filter',
  columnHeaderSortIconLabel: 'Urutkan',
  columnHeaderSortIconAriaLabel: (columnName, direction) => {
    if (direction === 'asc') {
      return `Urutkan ${columnName} secara menaik`;
    }
    if (direction === 'desc') {
      return `Urutkan ${columnName} secara menurun`;
    }
    return `Hapus pengurutan dari ${columnName}`;
  },

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

  // Cell editor text
  emptyCellLabel: 'Kosong',

  // Long text cell
  longTextCellExpandLabel: 'Perluas',
  longTextCellCollapseLabel: 'Ciutkan',

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
      return `${formatNumber(from)}–${formatNumber(to)} dari ${count !== -1 ? formatNumber(count) : `lebih dari ${formatNumber(to)}`}`;
    }
    const estimatedLabel =
      estimated && estimated > to
        ? `sekitar ${formatNumber(estimated)}`
        : `lebih dari ${formatNumber(to)}`;
    return `${formatNumber(from)}–${formatNumber(to)} dari ${count !== -1 ? formatNumber(count) : estimatedLabel}`;
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
  aggregationFunctionLabelNone: 'tidak ada',
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
  chartsNoCharts: 'Tidak ada grafik yang tersedia',
  chartsChartNotSelected: 'Pilih jenis grafik untuk mengatur opsinya',
  chartsTabChart: 'Grafik',
  chartsTabFields: 'Bidang',
  chartsTabCustomize: 'Sesuaikan',
  chartsCloseButton: 'Tutup konfigurasi grafik',
  chartsSyncButtonLabel: 'Sinkronkan grafik',
  chartsSearchPlaceholder: 'Cari bidang',
  chartsSearchLabel: 'Cari bidang',
  chartsSearchClear: 'Hapus pencarian',
  chartsNoFields: 'Tidak ada bidang',
  chartsFieldBlocked: 'Bidang ini tidak dapat ditambahkan ke bagian mana pun',
  chartsCategories: 'Kategori',
  chartsSeries: 'Seri',
  chartsMenuAddToDimensions: (dimensionLabel: string) => `Tambahkan ke ${dimensionLabel}`,
  chartsMenuAddToValues: (valuesLabel: string) => `Tambahkan ke ${valuesLabel}`,
  chartsMenuMoveUp: 'Pindah ke atas',
  chartsMenuMoveDown: 'Pindah ke bawah',
  chartsMenuMoveToTop: 'Pindah ke paling atas',
  chartsMenuMoveToBottom: 'Pindah ke paling bawah',
  chartsMenuOptions: 'Opsi bidang',
  chartsMenuRemove: 'Hapus',
  chartsDragToDimensions: (dimensionLabel: string) =>
    `Seret ke sini untuk menggunakan kolom sebagai ${dimensionLabel}`,
  chartsDragToValues: (valuesLabel: string) =>
    `Seret ke sini untuk menggunakan kolom sebagai ${valuesLabel}`,

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
  promptChangeFilterLabel: (
    column: string,
    operator: string,
    value: string,
    operatorValue?: string,
  ) => {
    if (operatorValue === 'isAnyOf') {
      return `${column} salah satu dari: ${value}`;
    }
    return `${column} ${operator} ${value}`;
  },
  promptChangeFilterDescription: (
    column: string,
    operator: string,
    value: string,
    operatorValue?: string,
  ) => {
    if (operatorValue === 'isAnyOf') {
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
  promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) =>
    `Dimensi (${dimensionsCount}), Nilai (${valuesCount})`,
};

export const idID: Localization = getGridLocalization(idIDGrid);
