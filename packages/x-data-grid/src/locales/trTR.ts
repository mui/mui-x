import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, buildLocaleFormat } from '../utils/getGridLocalization';
import type { Localization } from '../utils/getGridLocalization';

const formatNumber = buildLocaleFormat('tr-TR');

const trTRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Satır yok',
  noResultsOverlayLabel: 'Sonuç bulunamadı.',
  noColumnsOverlayLabel: 'Sütun yok',
  noColumnsOverlayManageColumns: 'Sütunları yönet',
  emptyPivotOverlayLabel:
    'Pivot tablo oluşturmak için satırlara, sütunlara ve değerlere alan ekleyin',

  // Density selector toolbar button text
  toolbarDensity: 'Yoğunluk',
  toolbarDensityLabel: 'Yoğunluk',
  toolbarDensityCompact: 'Sıkı',
  toolbarDensityStandard: 'Standart',
  toolbarDensityComfortable: 'Rahat',

  // Undo/redo toolbar button text
  toolbarUndo: 'Geri al',
  toolbarRedo: 'Yinele',

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
  toolbarPivot: 'Pivot',

  // Toolbar charts button
  toolbarCharts: 'Grafikler',

  // Toolbar AI Assistant button
  toolbarAssistant: 'Yapay Zeka Asistanı',

  // Formula bar (Premium formulas)
  formulaBarLabel: 'Formül çubuğu',
  formulaBarInputLabel: 'Formül',
  formulaBarAddressLabel: 'Etkin hücre',

  // Computed columns (Premium)
  // columnMenuAddComputedColumn: 'Add computed column',
  // columnMenuEditComputedColumn: 'Edit computed column',
  // columnMenuViewComputedColumn: 'View computed column',
  // columnMenuRemoveComputedColumn: 'Remove computed column',
  // toolbarComputedColumns: 'Computed columns',
  // computedColumnsPanelTitle: 'Computed columns',
  // computedColumnsPanelCloseButton: 'Close computed columns panel',
  // computedColumnsPanelBackButton: 'Back to the list',
  // computedColumnsPanelEmpty: 'No computed columns yet',
  // computedColumnsPanelAddButton: 'Add computed column',
  // computedColumnsPanelItemMenuLabel: 'Computed column actions',
  // computedColumnsPanelItemReadOnlyLabel: 'Read-only',
  // computedColumnEditorNewTitle: 'New computed column',
  // computedColumnEditorEditTitle: 'Edit computed column',
  // computedColumnEditorViewTitle: 'View computed column',
  // computedColumnReadOnlyHint: 'This computed column cannot be edited.',
  // computedColumnNameLabel: 'Name',
  // computedColumnFieldLabel: 'Field',
  // computedColumnFormulaLabel: 'Formula',
  // computedColumnTypeLabel: 'Result type',
  // computedColumnTypeNumber: 'Number',
  // computedColumnTypeString: 'Text',
  // computedColumnTypeBoolean: 'Boolean',
  // computedColumnTypeDate: 'Date',
  // computedColumnTypeDateTime: 'Date and time',
  // computedColumnFormatLabel: 'Format',
  // computedColumnFormatStyleDecimal: 'Number',
  // computedColumnFormatStylePercent: 'Percent',
  // computedColumnFormatStyleCurrency: 'Currency',
  // computedColumnFormatCurrencyLabel: 'Currency code',
  // computedColumnFormatDecimalsLabel: 'Decimals',
  // computedColumnFormatGroupingLabel: 'Thousands separator',
  // computedColumnPreviewLabel: 'Preview',
  // computedColumnPreviewRow: rowIndex => `Row ${rowIndex}`,
  // computedColumnPreviewNoRows: 'No rows to preview',
  // computedColumnReferenceTitle: 'Insert',
  // computedColumnReferenceColumns: 'Columns',
  // computedColumnReferenceFunctions: 'Functions',
  // computedColumnReferenceSearchPlaceholder: 'Search',
  // computedColumnReferenceNoResults: 'No matches',
  // computedColumnApplyButton: 'Apply',
  // computedColumnAddButton: 'Add column',
  // computedColumnCancelButton: 'Cancel',
  // computedColumnCloseButton: 'Close',
  // computedColumnDeleteButton: 'Delete column',
  // computedColumnHeaderLabel: 'Computed column',
  // computedColumnHeaderInvalidLabel: 'Computed column with an invalid formula',
  // computedColumnErrorNameRequired: 'Enter a name.',
  // computedColumnErrorFieldRequired: 'Enter a field name.',
  // computedColumnErrorFieldInvalid: 'Use letters, digits and underscores, starting with a letter or an underscore.',
  // computedColumnErrorFieldExists: field => `A column with the field "${field}" already exists.`,
  // computedColumnErrorFieldA1Like: 'This field name reads as a cell address. Choose a longer name.',
  // computedColumnErrorFormulaRequired: 'Enter a formula.',
  // computedColumnErrorParse: message => `Formula error: ${message}`,
  // computedColumnErrorUnknownFunction: name => `Unknown function ${name}.`,
  // computedColumnErrorUnsupportedReference: 'Computed columns can only reference columns of the same row. Use bare field names.',
  // computedColumnErrorUnknownField: field => `Column "${field}" does not exist.`,
  // computedColumnErrorSelfReference: 'A computed column cannot reference itself.',
  // computedColumnErrorCycle: path => `Circular reference: ${path}.`,
  // computedCellErrorDivByZero: 'Division by zero in this row. Wrap the division in IFERROR(…, 0) to provide a fallback.',
  // computedCellErrorValue: 'A value in this row has the wrong type for this operation.',
  // computedCellErrorRef: 'A referenced column does not exist.',
  // computedCellErrorName: 'The formula uses an unknown function.',
  // computedCellErrorCycle: 'The formula depends on itself.',
  // computedCellErrorGeneric: 'The formula could not be evaluated for this row.',

  // Columns management text
  columnsManagementSearchTitle: 'Arama',
  columnsManagementNoColumns: 'Sütun yok',
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
  filterPanelColumn: 'Sütunlar',
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
  headerFilterClear: 'Filtreyi temizle',

  // Filter values text
  filterValueAny: 'herhangi',
  filterValueTrue: 'doğru',
  filterValueFalse: 'yanlış',

  // Column menu text
  columnMenuLabel: 'Menü',
  columnMenuAriaLabel: (columnName: string) => `${columnName} sütun menüsü`,
  columnMenuShowColumns: 'Sütunları göster',
  columnMenuManageColumns: 'Sütunları yönet',
  columnMenuFilter: 'Filtre Ekle',
  columnMenuHideColumn: 'Gizle',
  columnMenuUnsort: 'Varsayılan Sıralama',
  columnMenuSortAsc: 'Sırala - Artan',
  columnMenuSortDesc: 'Sırala - Azalan',
  columnMenuManagePivot: 'Pivotu yönet',
  columnMenuManageCharts: 'Grafikleri yönet',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} filtre aktif`,
  columnHeaderFiltersLabel: 'Filtreleri göster',
  columnHeaderSortIconLabel: 'Sırala',
  // columnHeaderSortIconAriaLabel: (columnName, direction) => {
  //   if (direction === 'asc') {
  //     return `Sort ${columnName} in ascending order`;
  //   }
  //   if (direction === 'desc') {
  //     return `Sort ${columnName} in descending order`;
  //   }
  //   return `Remove sorting from ${columnName}`;
  // },

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

  // Cell editor text
  // emptyCellLabel: 'Empty',

  // Long text cell
  longTextCellExpandLabel: 'Genişlet',
  longTextCellCollapseLabel: 'Gizle',

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
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    const unknownRowCount = count == null || count === -1;
    if (!estimated) {
      return `${formatNumber(from)}–${formatNumber(to)} / ${!unknownRowCount ? formatNumber(count) : `${formatNumber(to)} üzeri`}`;
    }
    const estimatedLabel =
      estimated && estimated > to
        ? `yaklaşık ${formatNumber(estimated)}`
        : `${formatNumber(to)} üzeri`;
    return `${formatNumber(from)}–${formatNumber(to)} / ${!unknownRowCount ? formatNumber(count) : estimatedLabel}`;
  },
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
  aggregationFunctionLabelNone: 'yok',
  aggregationFunctionLabelSum: 'top',
  aggregationFunctionLabelAvg: 'ort',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'maks',
  aggregationFunctionLabelSize: 'adet',

  // Pivot panel
  pivotToggleLabel: 'Pivot',
  pivotRows: 'Satırlar',
  pivotColumns: 'Sütunlar',
  pivotValues: 'Değerler',
  pivotCloseButton: 'Pivot ayarlarını kapat',
  pivotSearchButton: 'Alanlarda ara',
  pivotSearchControlPlaceholder: 'Alanlarda ara',
  pivotSearchControlLabel: 'Alanlarda ara',
  pivotSearchControlClear: 'Aramayı temizle',
  pivotNoFields: 'Alan yok',
  pivotMenuMoveUp: 'Yukarı taşı',
  pivotMenuMoveDown: 'Aşağı taşı',
  pivotMenuMoveToTop: 'En üste taşı',
  pivotMenuMoveToBottom: 'En alta taşı',
  pivotMenuRows: 'Satırlar',
  pivotMenuColumns: 'Sütunlar',
  pivotMenuValues: 'Değerler',
  pivotMenuOptions: 'Alan seçenekleri',
  pivotMenuAddToRows: 'Satırlara ekle',
  pivotMenuAddToColumns: 'Sütunlara ekle',
  pivotMenuAddToValues: 'Değerlere ekle',
  pivotMenuRemove: 'Kaldır',
  pivotDragToRows: 'Satır oluşturmak için buraya sürükleyin',
  pivotDragToColumns: 'Sütun oluşturmak için buraya sürükleyin',
  pivotDragToValues: 'Değer oluşturmak için buraya sürükleyin',
  pivotYearColumnHeaderName: '(Yıl)',
  pivotQuarterColumnHeaderName: '(Çeyrek)',

  // Charts configuration panel
  chartsNoCharts: 'Kullanılabilir grafik yok',
  chartsChartNotSelected: 'Seçeneklerini yapılandırmak için bir grafik türü seçin',
  chartsTabChart: 'Grafik',
  chartsTabFields: 'Alanlar',
  chartsTabCustomize: 'Özelleştir',
  chartsCloseButton: 'Grafik yapılandırmasını kapat',
  chartsSyncButtonLabel: 'Grafiği senkronize et',
  chartsSearchPlaceholder: 'Alanlarda ara',
  chartsSearchLabel: 'Alanlarda ara',
  chartsSearchClear: 'Aramayı temizle',
  chartsNoFields: 'Alan yok',
  chartsFieldBlocked: 'Bu alan hiçbir bölüme eklenemez',
  chartsCategories: 'Kategoriler',
  chartsSeries: 'Seriler',
  chartsMenuAddToDimensions: (dimensionLabel: string) => `${dimensionLabel} bölümüne ekle`,
  chartsMenuAddToValues: (valuesLabel: string) => `${valuesLabel} bölümüne ekle`,
  chartsMenuMoveUp: 'Yukarı taşı',
  chartsMenuMoveDown: 'Aşağı taşı',
  chartsMenuMoveToTop: 'En üste taşı',
  chartsMenuMoveToBottom: 'En alta taşı',
  chartsMenuOptions: 'Alan seçenekleri',
  chartsMenuRemove: 'Kaldır',
  chartsDragToDimensions: (dimensionLabel: string) =>
    `Sütunu ${dimensionLabel} olarak kullanmak için buraya sürükleyin`,
  chartsDragToValues: (valuesLabel: string) =>
    `Sütunu ${valuesLabel} olarak kullanmak için buraya sürükleyin`,

  // AI Assistant panel
  aiAssistantPanelTitle: 'Yapay Zeka Asistanı',
  aiAssistantPanelClose: 'Yapay Zeka Asistanını kapat',
  aiAssistantPanelNewConversation: 'Yeni sohbet',
  aiAssistantPanelConversationHistory: 'Sohbet geçmişi',
  aiAssistantPanelEmptyConversation: 'İstem geçmişi yok',
  aiAssistantSuggestions: 'Öneriler',

  // Prompt field
  promptFieldLabel: 'İstem girişi',
  promptFieldPlaceholder: 'Bir istem yazın…',
  promptFieldPlaceholderWithRecording: 'Bir istem yazın veya kaydedin…',
  promptFieldPlaceholderListening: 'İstem dinleniyor…',
  promptFieldSpeechRecognitionNotSupported: 'Bu tarayıcı konuşma tanımayı desteklemiyor',
  promptFieldSend: 'Gönder',
  promptFieldRecord: 'Kaydı başlat',
  promptFieldStopRecording: 'Kaydı durdur',

  // Prompt
  promptRerun: 'Yeniden çalıştır',
  promptProcessing: 'İşleniyor…',
  promptAppliedChanges: 'Uygulanan değişiklikler',

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `${column} sütununa göre grupla`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `${column} sütununda toplama uygula (${aggregation})`,
  promptChangeFilterLabel: (
    column: string,
    operator: string,
    value: string,
    operatorValue?: string,
  ) => {
    if (operatorValue === 'isAnyOf') {
      return `${column} şunlardan biri: ${value}`;
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
      return `${column} değeri şunlardan biri olan satırları filtrele: ${value}`;
    }
    return `Filtrele: ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `${column} sütununa göre sırala (${direction})`,
  promptChangePivotEnableLabel: 'Pivot',
  promptChangePivotEnableDescription: 'Pivotu etkinleştir',
  promptChangePivotColumnsLabel: (count: number) => `Sütunlar (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `Satırlar (${count})`,
  promptChangePivotValuesLabel: (count: number) => `Değerler (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) =>
    `Boyutlar (${dimensionsCount}), Değerler (${valuesCount})`,
};

export const trTR: Localization = getGridLocalization(trTRGrid);
