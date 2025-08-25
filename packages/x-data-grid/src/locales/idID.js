"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idID = exports.idIDGrid = void 0;
var getGridLocalization_1 = require("../utils/getGridLocalization");
exports.idIDGrid = {
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
    // Columns selector toolbar button text
    toolbarColumns: 'Kolom',
    toolbarColumnsLabel: 'Pilih kolom',
    // Filters toolbar button text
    toolbarFilters: 'Filter',
    toolbarFiltersLabel: 'Tampilkan filter',
    toolbarFiltersTooltipHide: 'Sembunyikan filter',
    toolbarFiltersTooltipShow: 'Tampilkan filter',
    toolbarFiltersTooltipActive: function (count) { return "".concat(count, " filter aktif"); },
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
    columnMenuAriaLabel: function (columnName) { return "Menu kolom ".concat(columnName); },
    columnMenuShowColumns: 'Tampilkan kolom',
    columnMenuManageColumns: 'Kelola kolom',
    columnMenuFilter: 'Filter',
    columnMenuHideColumn: 'Sembunyikan kolom',
    columnMenuUnsort: 'Batalkan urutan',
    columnMenuSortAsc: 'Urutkan menaik',
    columnMenuSortDesc: 'Urutkan menurun',
    columnMenuManagePivot: 'Kelola pivot',
    // Column header text
    columnHeaderFiltersTooltipActive: function (count) { return "".concat(count, " filter aktif"); },
    columnHeaderFiltersLabel: 'Tampilkan filter',
    columnHeaderSortIconLabel: 'Urutkan',
    // Rows selected footer text
    footerRowSelected: function (count) { return "".concat(count.toLocaleString(), " baris dipilih"); },
    // Total row amount footer text
    footerTotalRows: 'Total Baris:',
    // Total visible row amount footer text
    footerTotalVisibleRows: function (visibleCount, totalCount) {
        return "".concat(visibleCount.toLocaleString(), " dari ").concat(totalCount.toLocaleString());
    },
    // Checkbox selection text
    checkboxSelectionHeaderName: 'Pilihan kotak centang',
    checkboxSelectionSelectAllRows: 'Pilih semua baris',
    checkboxSelectionUnselectAllRows: 'Batal pilih semua baris',
    checkboxSelectionSelectRow: 'Pilih baris',
    checkboxSelectionUnselectRow: 'Batal pilih baris',
    // Boolean cell text
    booleanCellTrueLabel: 'ya',
    booleanCellFalseLabel: 'tidak',
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
    groupColumn: function (name) { return "Kelompokkan berdasarkan ".concat(name); },
    unGroupColumn: function (name) { return "Hentikan pengelompokan berdasarkan ".concat(name); },
    // Master/detail
    detailPanelToggle: 'Pengalih panel detail',
    expandDetailPanel: 'Perluas',
    collapseDetailPanel: 'Ciutkan',
    // Pagination
    paginationRowsPerPage: 'Baris per halaman:',
    paginationDisplayedRows: function (_a) {
        var from = _a.from, to = _a.to, count = _a.count, estimated = _a.estimated;
        if (!estimated) {
            return "".concat(from, "\u2013").concat(to, " dari ").concat(count !== -1 ? count : "lebih dari ".concat(to));
        }
        var estimatedLabel = estimated && estimated > to ? "sekitar ".concat(estimated) : "lebih dari ".concat(to);
        return "".concat(from, "\u2013").concat(to, " dari ").concat(count !== -1 ? count : estimatedLabel);
    },
    paginationItemAriaLabel: function (type) {
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
    promptChangeGroupDescription: function (column) { return "Kelompokkan berdasarkan ".concat(column); },
    promptChangeAggregationLabel: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeAggregationDescription: function (column, aggregation) {
        return "Agregasikan ".concat(column, " (").concat(aggregation, ")");
    },
    promptChangeFilterLabel: function (column, operator, value) {
        if (operator === 'is any of') {
            return "".concat(column, " salah satu dari: ").concat(value);
        }
        return "".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeFilterDescription: function (column, operator, value) {
        if (operator === 'is any of') {
            return "Filter di mana ".concat(column, " salah satu dari: ").concat(value);
        }
        return "Filter di mana ".concat(column, " ").concat(operator, " ").concat(value);
    },
    promptChangeSortDescription: function (column, direction) {
        return "Urutkan berdasarkan ".concat(column, " (").concat(direction, ")");
    },
    promptChangePivotEnableLabel: 'Pivot',
    promptChangePivotEnableDescription: 'Aktifkan pivot',
    promptChangePivotColumnsLabel: function (count) { return "Kolom (".concat(count, ")"); },
    promptChangePivotColumnsDescription: function (column, direction) {
        return "".concat(column).concat(direction ? " (".concat(direction, ")") : '');
    },
    promptChangePivotRowsLabel: function (count) { return "Baris (".concat(count, ")"); },
    promptChangePivotValuesLabel: function (count) { return "Nilai (".concat(count, ")"); },
    promptChangePivotValuesDescription: function (column, aggregation) {
        return "".concat(column, " (").concat(aggregation, ")");
    },
};
exports.idID = (0, getGridLocalization_1.getGridLocalization)(exports.idIDGrid);
