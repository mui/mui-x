import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, buildLocaleFormat } from '../utils/getGridLocalization';
import type { Localization } from '../utils/getGridLocalization';

const formatNumber = buildLocaleFormat('uz-UZ');

const uzUZGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Qatorlar yoʻq',
  noResultsOverlayLabel: 'Hech narsa topilmadi.',
  noColumnsOverlayLabel: 'Ustunlar yoʻq',
  noColumnsOverlayManageColumns: 'Ustunlarni boshqarish',
  emptyPivotOverlayLabel:
    'Pivot jadval yaratish uchun qatorlar, ustunlar va qiymatlarga maydonlar qoʻshing',

  // Density selector toolbar button text
  toolbarDensity: 'Zichlik',
  toolbarDensityLabel: 'Zichlik',
  toolbarDensityCompact: 'Ixcham',
  toolbarDensityStandard: 'Standart',
  toolbarDensityComfortable: 'Keng',

  // Undo/redo toolbar button text
  toolbarUndo: 'Bekor qilish',
  toolbarRedo: 'Qaytarish',

  // Columns selector toolbar button text
  toolbarColumns: 'Ustunlar',
  toolbarColumnsLabel: 'Ustunlarni tanlash',

  // Filters toolbar button text
  toolbarFilters: 'Filtrlar',
  toolbarFiltersLabel: 'Filtrlarni koʻrsatish',
  toolbarFiltersTooltipHide: 'Filtrlarni yashirish',
  toolbarFiltersTooltipShow: 'Filtrlarni koʻrsatish',
  toolbarFiltersTooltipActive: (count) => `${count} ta faol filtr`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Qidirish…',
  toolbarQuickFilterLabel: 'Qidirish',
  toolbarQuickFilterDeleteIconLabel: 'Tozalash',

  // Export selector toolbar button text
  toolbarExport: 'Eksport',
  toolbarExportLabel: 'Eksport',
  toolbarExportCSV: 'CSV formatida yuklab olish',
  toolbarExportPrint: 'Chop etish',
  toolbarExportExcel: 'Excel formatida yuklab olish',

  // Toolbar pivot button
  toolbarPivot: 'Pivot',

  // Toolbar charts button
  toolbarCharts: 'Diagrammalar',

  // Toolbar AI Assistant button
  toolbarAssistant: 'AI yordamchi',

  // Formula bar (Premium formulas)
  formulaBarLabel: 'Formulalar qatori',
  formulaBarInputLabel: 'Formula',
  formulaBarAddressLabel: 'Faol katak',

  // Computed columns (Premium)
  columnMenuAddComputedColumn: 'Hisoblanadigan ustun qoʻshish',
  columnMenuEditComputedColumn: 'Hisoblanadigan ustunni tahrirlash',
  columnMenuViewComputedColumn: 'Hisoblanadigan ustunni koʻrish',
  columnMenuRemoveComputedColumn: 'Hisoblanadigan ustunni oʻchirish',
  toolbarComputedColumns: 'Hisoblanadigan ustunlar',
  computedColumnsPanelTitle: 'Hisoblanadigan ustunlar',
  computedColumnsPanelCloseButton: 'Hisoblanadigan ustunlar panelini yopish',
  computedColumnsPanelBackButton: 'Roʻyxatga qaytish',
  computedColumnsPanelEmpty: 'Hali hisoblanadigan ustunlar yoʻq',
  computedColumnsPanelAddButton: 'Hisoblanadigan ustun qoʻshish',
  computedColumnsPanelItemMenuLabel: 'Hisoblanadigan ustun amallari',
  computedColumnsPanelItemReadOnlyLabel: 'Faqat oʻqish uchun',
  computedColumnEditorNewTitle: 'Yangi hisoblanadigan ustun',
  computedColumnEditorEditTitle: 'Hisoblanadigan ustunni tahrirlash',
  computedColumnEditorViewTitle: 'Hisoblanadigan ustunni koʻrish',
  computedColumnReadOnlyHint: 'Bu hisoblanadigan ustunni tahrirlab boʻlmaydi.',
  computedColumnNameLabel: 'Nomi',
  computedColumnFieldLabel: 'Maydon',
  computedColumnFormulaLabel: 'Formula',
  computedColumnTypeLabel: 'Natija turi',
  computedColumnTypeNumber: 'Son',
  computedColumnTypeString: 'Matn',
  computedColumnTypeBoolean: 'Mantiqiy',
  computedColumnTypeDate: 'Sana',
  computedColumnTypeDateTime: 'Sana va vaqt',
  computedColumnFormatLabel: 'Format',
  computedColumnFormatStyleDecimal: 'Son',
  computedColumnFormatStylePercent: 'Foiz',
  computedColumnFormatStyleCurrency: 'Valyuta',
  computedColumnFormatCurrencyLabel: 'Valyuta kodi',
  computedColumnFormatDecimalsLabel: 'Kasr xonalari',
  computedColumnFormatGroupingLabel: 'Minglik ajratgich',
  computedColumnPreviewLabel: 'Oldindan koʻrish',
  computedColumnPreviewRow: (rowIndex) => `${rowIndex}-qator`,
  computedColumnPreviewNoRows: 'Oldindan koʻrish uchun qatorlar yoʻq',
  computedColumnReferenceTitle: 'Qoʻyish',
  computedColumnReferenceColumns: 'Ustunlar',
  computedColumnReferenceFunctions: 'Funksiyalar',
  computedColumnReferenceSearchPlaceholder: 'Qidirish',
  computedColumnReferenceNoResults: 'Mosliklar yoʻq',
  computedColumnApplyButton: 'Qoʻllash',
  computedColumnAddButton: 'Ustun qoʻshish',
  computedColumnCancelButton: 'Bekor qilish',
  computedColumnCloseButton: 'Yopish',
  computedColumnDeleteButton: 'Ustunni oʻchirish',
  computedColumnHeaderLabel: 'Hisoblanadigan ustun',
  computedColumnHeaderInvalidLabel: 'Formulasi notoʻgʻri hisoblanadigan ustun',
  computedColumnErrorNameRequired: 'Nomini kiriting.',
  computedColumnErrorFieldRequired: 'Maydon nomini kiriting.',
  computedColumnErrorFieldInvalid:
    'Harflar, raqamlar va pastki chiziqdan foydalaning. Nom harf yoki pastki chiziq bilan boshlanishi kerak.',
  computedColumnErrorFieldExists: (field) => `"${field}" maydonli ustun allaqachon mavjud.`,
  computedColumnErrorFieldA1Like: 'Bu maydon nomi katak manziliga oʻxshaydi. Uzunroq nom tanlang.',
  computedColumnErrorFormulaRequired: 'Formulani kiriting.',
  computedColumnErrorParse: (message) => `Formula xatosi: ${message}`,
  computedColumnErrorUnknownFunction: (name) => `Nomaʼlum funksiya: ${name}.`,
  computedColumnErrorUnsupportedReference:
    'Hisoblanadigan ustun faqat shu qatordagi ustunlarga murojaat qila oladi. Faqat maydon nomlarini yozing.',
  computedColumnErrorUnknownField: (field) => `"${field}" ustuni mavjud emas.`,
  computedColumnErrorSelfReference: 'Hisoblanadigan ustun oʻziga murojaat qila olmaydi.',
  computedColumnErrorCycle: (path) => `Aylanma murojaat: ${path}.`,
  computedCellErrorDivByZero:
    'Bu qatorda nolga boʻlish bor. Zaxira qiymat berish uchun boʻlishni IFERROR(…, 0) ichiga oling.',
  computedCellErrorValue: 'Bu qatordagi qiymatning turi ushbu amalga mos emas.',
  computedCellErrorRef: 'Murojaat qilingan ustun mavjud emas.',
  computedCellErrorName: 'Formulada nomaʼlum funksiya ishlatilgan.',
  computedCellErrorCycle: 'Formula oʻziga bogʻliq.',
  computedCellErrorGeneric: 'Bu qator uchun formulani hisoblab boʻlmadi.',

  // Columns management text
  columnsManagementSearchTitle: 'Qidirish',
  columnsManagementNoColumns: 'Ustunlar yoʻq',
  columnsManagementShowHideAllText: 'Hammasini koʻrsatish/yashirish',
  columnsManagementReset: 'Asliga qaytarish',
  columnsManagementDeleteIconLabel: 'Tozalash',

  // Filter panel text
  filterPanelAddFilter: 'Filtr qoʻshish',
  filterPanelRemoveAll: 'Hammasini oʻchirish',
  filterPanelDeleteIconLabel: 'Oʻchirish',
  filterPanelLogicOperator: 'Mantiqiy operator',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'Va',
  filterPanelOperatorOr: 'Yoki',
  filterPanelColumn: 'Ustun',
  filterPanelInputLabel: 'Qiymat',
  filterPanelInputPlaceholder: 'Filtr qiymati',

  // Filter operators text
  filterOperatorContains: 'oʻz ichiga oladi',
  filterOperatorDoesNotContain: 'oʻz ichiga olmaydi',
  filterOperatorEquals: 'teng',
  filterOperatorDoesNotEqual: 'teng emas',
  filterOperatorStartsWith: 'bilan boshlanadi',
  filterOperatorEndsWith: 'bilan tugaydi',
  filterOperatorIs: 'teng',
  filterOperatorNot: 'teng emas',
  filterOperatorAfter: 'dan keyin',
  filterOperatorOnOrAfter: 'shu kuni yoki keyin',
  filterOperatorBefore: 'dan oldin',
  filterOperatorOnOrBefore: 'shu kuni yoki oldin',
  filterOperatorIsEmpty: 'boʻsh',
  filterOperatorIsNotEmpty: 'boʻsh emas',
  filterOperatorIsAnyOf: 'quyidagilardan biri',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Oʻz ichiga oladi',
  headerFilterOperatorDoesNotContain: 'Oʻz ichiga olmaydi',
  headerFilterOperatorEquals: 'Teng',
  headerFilterOperatorDoesNotEqual: 'Teng emas',
  headerFilterOperatorStartsWith: 'Bilan boshlanadi',
  headerFilterOperatorEndsWith: 'Bilan tugaydi',
  headerFilterOperatorIs: 'Teng',
  headerFilterOperatorNot: 'Teng emas',
  headerFilterOperatorAfter: 'Keyin',
  headerFilterOperatorOnOrAfter: 'Shu kuni yoki keyin',
  headerFilterOperatorBefore: 'Oldin',
  headerFilterOperatorOnOrBefore: 'Shu kuni yoki oldin',
  headerFilterOperatorIsEmpty: 'Boʻsh',
  headerFilterOperatorIsNotEmpty: 'Boʻsh emas',
  headerFilterOperatorIsAnyOf: 'Quyidagilardan biri',
  'headerFilterOperator=': 'Teng',
  'headerFilterOperator!=': 'Teng emas',
  'headerFilterOperator>': 'Katta',
  'headerFilterOperator>=': 'Katta yoki teng',
  'headerFilterOperator<': 'Kichik',
  'headerFilterOperator<=': 'Kichik yoki teng',
  headerFilterClear: 'Filtrni tozalash',

  // Filter values text
  filterValueAny: 'istalgan',
  filterValueTrue: 'rost',
  filterValueFalse: 'yolgʻon',

  // Column menu text
  columnMenuLabel: 'Menyu',
  columnMenuAriaLabel: (columnName: string) => `${columnName} ustuni menyusi`,
  columnMenuShowColumns: 'Ustunlarni koʻrsatish',
  columnMenuManageColumns: 'Ustunlarni boshqarish',
  columnMenuFilter: 'Filtr',
  columnMenuHideColumn: 'Ustunni yashirish',
  columnMenuUnsort: 'Saralashni bekor qilish',
  columnMenuSortAsc: 'Oʻsish tartibida saralash',
  columnMenuSortDesc: 'Kamayish tartibida saralash',
  columnMenuManagePivot: 'Pivotni boshqarish',
  columnMenuManageCharts: 'Diagrammalarni boshqarish',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} ta faol filtr`,
  columnHeaderFiltersLabel: 'Filtrlarni koʻrsatish',
  columnHeaderSortIconLabel: 'Saralash',
  columnHeaderSortIconAriaLabel: (columnName, direction) => {
    if (direction === 'asc') {
      return `${columnName} ustunini oʻsish tartibida saralash`;
    }
    if (direction === 'desc') {
      return `${columnName} ustunini kamayish tartibida saralash`;
    }
    return `${columnName} ustunidan saralashni olib tashlash`;
  },

  // Rows selected footer text
  footerRowSelected: (count) => `${count.toLocaleString()} ta qator tanlandi`,

  // Total row amount footer text
  footerTotalRows: 'Jami qatorlar:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Belgilash katagi',
  checkboxSelectionSelectAllRows: 'Barcha qatorlarni tanlash',
  checkboxSelectionUnselectAllRows: 'Barcha qatorlardan tanlovni olib tashlash',
  checkboxSelectionSelectRow: 'Qatorni tanlash',
  checkboxSelectionUnselectRow: 'Qatordan tanlovni olib tashlash',

  // Boolean cell text
  booleanCellTrueLabel: 'ha',
  booleanCellFalseLabel: 'yoʻq',

  // Cell editor text
  emptyCellLabel: 'Boʻsh',

  // Long text cell
  longTextCellExpandLabel: 'Yoyish',
  longTextCellCollapseLabel: 'Yigʻish',

  // Actions cell more text
  actionsCellMore: 'yana',

  // Column pinning text
  pinToLeft: 'Chapga qadash',
  pinToRight: 'Oʻngga qadash',
  unpin: 'Qadashni bekor qilish',

  // Tree Data
  treeDataGroupingHeaderName: 'Guruh',
  treeDataExpand: 'ichki elementlarni koʻrsatish',
  treeDataCollapse: 'ichki elementlarni yashirish',

  // Grouping columns
  groupingColumnHeaderName: 'Guruh',
  groupColumn: (name) => `${name} boʻyicha guruhlash`,
  unGroupColumn: (name) => `${name} boʻyicha guruhlashni toʻxtatish`,

  // Master/detail
  detailPanelToggle: 'Batafsil panelni ochish/yopish',
  expandDetailPanel: 'Yoyish',
  collapseDetailPanel: 'Yigʻish',

  // Pagination
  paginationRowsPerPage: 'Sahifadagi qatorlar:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    const unknownRowCount = count == null || count === -1;
    if (!estimated) {
      return `${formatNumber(from)}–${formatNumber(to)}, jami ${!unknownRowCount ? formatNumber(count) : `${formatNumber(to)} tadan koʻp`}`;
    }
    const estimatedLabel =
      estimated && estimated > to
        ? `taxminan ${formatNumber(estimated)}`
        : `${formatNumber(to)} tadan koʻp`;
    return `${formatNumber(from)}–${formatNumber(to)}, jami ${!unknownRowCount ? formatNumber(count) : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Birinchi sahifaga oʻtish';
    }
    if (type === 'last') {
      return 'Oxirgi sahifaga oʻtish';
    }
    if (type === 'next') {
      return 'Keyingi sahifaga oʻtish';
    }
    // if (type === 'previous') {
    return 'Oldingi sahifaga oʻtish';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Qatorlar tartibini oʻzgartirish',
  // rowReorderingAnnouncementMoved: ({
  //   position,
  //   total
  // }) => `Row moved to position ${formatNumber(position)} of ${formatNumber(total)}.`,
  // rowReorderingAnnouncementEdge: ({
  //   direction
  // }) => `Can't move the row further ${direction === 'up' ? 'up' : 'down'}.`,
  // rowReorderingAnnouncementSorted: () => "Rows can't be reordered while the grid is sorted.",
  // rowReorderingAnnouncementInvalid: () => "The row can't be moved there.",
  // rowReorderingAnnouncementDisabled: () => "This row can't be reordered.",

  // Column reordering text
  // columnReorderingAnnouncementMoved: ({
  //   columnName,
  //   position,
  //   total
  // }) => `Column ${columnName} moved to position ${formatNumber(position)} of ${formatNumber(total)}.`,
  // columnReorderingAnnouncementEdge: ({
  //   columnName,
  //   direction
  // }) => `Can't move column ${columnName} further ${direction === 'left' ? 'left' : 'right'}.`,
  // columnReorderingAnnouncementDisabled: ({
  //   columnName
  // }) => `Column ${columnName} can't be reordered.`,

  // Aggregation
  aggregationMenuItemHeader: 'Agregatsiya',
  aggregationFunctionLabelNone: 'yoʻq',
  aggregationFunctionLabelSum: 'yigʻindi',
  aggregationFunctionLabelAvg: 'oʻrtacha',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'maks',
  aggregationFunctionLabelSize: 'soni',

  // Pivot panel
  pivotToggleLabel: 'Pivot',
  pivotRows: 'Qatorlar',
  pivotColumns: 'Ustunlar',
  pivotValues: 'Qiymatlar',
  pivotCloseButton: 'Pivot sozlamalarini yopish',
  pivotSearchButton: 'Maydonlarni qidirish',
  pivotSearchControlPlaceholder: 'Maydonlarni qidirish',
  pivotSearchControlLabel: 'Maydonlarni qidirish',
  pivotSearchControlClear: 'Qidiruvni tozalash',
  pivotNoFields: 'Maydonlar yoʻq',
  pivotMenuMoveUp: 'Yuqoriga surish',
  pivotMenuMoveDown: 'Pastga surish',
  pivotMenuMoveToTop: 'Eng yuqoriga surish',
  pivotMenuMoveToBottom: 'Eng pastga surish',
  pivotMenuRows: 'Qatorlar',
  pivotMenuColumns: 'Ustunlar',
  pivotMenuValues: 'Qiymatlar',
  pivotMenuOptions: 'Maydon sozlamalari',
  pivotMenuAddToRows: 'Qatorlarga qoʻshish',
  pivotMenuAddToColumns: 'Ustunlarga qoʻshish',
  pivotMenuAddToValues: 'Qiymatlarga qoʻshish',
  pivotMenuRemove: 'Olib tashlash',
  pivotDragToRows: 'Qator yaratish uchun shu yerga torting',
  pivotDragToColumns: 'Ustun yaratish uchun shu yerga torting',
  pivotDragToValues: 'Qiymat yaratish uchun shu yerga torting',
  pivotYearColumnHeaderName: '(Yil)',
  pivotQuarterColumnHeaderName: '(Chorak)',

  // Charts configuration panel
  chartsNoCharts: 'Mavjud diagrammalar yoʻq',
  chartsChartNotSelected: 'Sozlash uchun diagramma turini tanlang',
  chartsTabChart: 'Diagramma',
  chartsTabFields: 'Maydonlar',
  chartsTabCustomize: 'Sozlash',
  chartsCloseButton: 'Diagramma sozlamalarini yopish',
  chartsSyncButtonLabel: 'Diagrammani sinxronlash',
  chartsSearchPlaceholder: 'Maydonlarni qidirish',
  chartsSearchLabel: 'Maydonlarni qidirish',
  chartsSearchClear: 'Qidiruvni tozalash',
  chartsNoFields: 'Maydonlar yoʻq',
  chartsFieldBlocked: 'Bu maydonni hech bir boʻlimga qoʻshib boʻlmaydi',
  chartsCategories: 'Toifalar',
  chartsSeries: 'Seriyalar',
  chartsMenuAddToDimensions: (dimensionLabel: string) => `Qoʻshish: ${dimensionLabel}`,
  chartsMenuAddToValues: (valuesLabel: string) => `Qoʻshish: ${valuesLabel}`,
  chartsMenuMoveUp: 'Yuqoriga surish',
  chartsMenuMoveDown: 'Pastga surish',
  chartsMenuMoveToTop: 'Eng yuqoriga surish',
  chartsMenuMoveToBottom: 'Eng pastga surish',
  chartsMenuOptions: 'Maydon sozlamalari',
  chartsMenuRemove: 'Olib tashlash',
  chartsDragToDimensions: (dimensionLabel: string) =>
    `Ustunni ${dimensionLabel} sifatida ishlatish uchun shu yerga torting`,
  chartsDragToValues: (valuesLabel: string) =>
    `Ustunni ${valuesLabel} sifatida ishlatish uchun shu yerga torting`,

  // AI Assistant panel
  aiAssistantPanelTitle: 'AI yordamchi',
  aiAssistantPanelClose: 'AI yordamchini yopish',
  aiAssistantPanelNewConversation: 'Yangi suhbat',
  aiAssistantPanelConversationHistory: 'Suhbatlar tarixi',
  aiAssistantPanelEmptyConversation: 'Soʻrovlar tarixi yoʻq',
  aiAssistantSuggestions: 'Takliflar',

  // Prompt field
  promptFieldLabel: 'Soʻrov',
  promptFieldPlaceholder: 'Soʻrov yozing…',
  promptFieldPlaceholderWithRecording: 'Soʻrovni yozing yoki ovozli yozib oling…',
  promptFieldPlaceholderListening: 'Soʻrov tinglanmoqda…',
  promptFieldSpeechRecognitionNotSupported: 'Bu brauzer nutqni aniqlashni qoʻllab-quvvatlamaydi',
  promptFieldSend: 'Yuborish',
  promptFieldRecord: 'Ovoz yozish',
  promptFieldStopRecording: 'Yozishni toʻxtatish',

  // Prompt
  promptRerun: 'Qayta ishga tushirish',
  promptProcessing: 'Bajarilmoqda…',
  promptAppliedChanges: 'Qoʻllangan oʻzgarishlar',

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `${column} boʻyicha guruhlash`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `${column} agregatsiyasi (${aggregation})`,
  promptChangeFilterLabel: (
    column: string,
    operator: string,
    value: string,
    operatorValue?: string,
  ) => {
    if (operatorValue === 'isAnyOf') {
      return `${column} ${operator}: ${value}`;
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
      return `Filtr: ${column} ${operator}: ${value}`;
    }
    return `Filtr: ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `${column} boʻyicha saralash (${direction})`,
  promptChangePivotEnableLabel: 'Pivot',
  promptChangePivotEnableDescription: 'Pivotni yoqish',
  promptChangePivotColumnsLabel: (count: number) => `Ustunlar (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `Qatorlar (${count})`,
  promptChangePivotValuesLabel: (count: number) => `Qiymatlar (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) =>
    `Oʻlchamlar (${dimensionsCount}), Qiymatlar (${valuesCount})`,
};

export const uzUZ: Localization = getGridLocalization(uzUZGrid);
