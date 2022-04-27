import { arSD as arSDCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const arSDGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'لا توجد صفوف',
  noResultsOverlayLabel: 'لم يتم العثور على نتائج.',
  errorOverlayDefaultLabel: 'حدث خطأ.',

  // Density selector toolbar button text
  toolbarDensity: 'الكثافة',
  toolbarDensityLabel: 'الكثافة',
  toolbarDensityCompact: 'مضغوط',
  toolbarDensityStandard: 'قياسي',
  toolbarDensityComfortable: 'مريح',

  // Columns selector toolbar button text
  toolbarColumns: 'الأعمدة',
  toolbarColumnsLabel: 'حدد أعمدة',

  // Filters toolbar button text
  toolbarFilters: 'المُرشِحات',
  toolbarFiltersLabel: 'إظهار المرشِحات',
  toolbarFiltersTooltipHide: 'إخفاء المرشِحات',
  toolbarFiltersTooltipShow: 'اظهر المرشِحات',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} من المرشِحات النشطة` : `مرشِح نشط`,

  // Export selector toolbar button text
  toolbarExport: 'تصدير',
  toolbarExportLabel: 'تصدير',
  toolbarExportCSV: 'تنزيل كملف CSV',
  // toolbarExportPrint: 'Print',

  // Columns panel text
  columnsPanelTextFieldLabel: 'البحث عن العمود',
  columnsPanelTextFieldPlaceholder: 'عنوان العمود',
  columnsPanelDragIconLabel: 'إعادة ترتيب العمود',
  columnsPanelShowAllButton: 'إظهار الكل',
  columnsPanelHideAllButton: 'إخفاء الكل',

  // Filter panel text
  filterPanelAddFilter: 'إضافة مرشِح',
  filterPanelDeleteIconLabel: 'حذف',
  filterPanelLinkOperator: 'عامل منطقي',
  filterPanelOperators: 'عامل',

  // TODO v6: rename to filterPanelOperator
  filterPanelOperatorAnd: 'و',
  filterPanelOperatorOr: 'أو',
  filterPanelColumns: 'الأعمدة',
  filterPanelInputLabel: 'القيمة',
  filterPanelInputPlaceholder: 'ترشِيح قيمة',

  // Filter operators text
  filterOperatorContains: 'يحتوي',
  filterOperatorEquals: 'يساوي',
  filterOperatorStartsWith: 'يبدأ بـ',
  filterOperatorEndsWith: 'ينتهي بـ',
  filterOperatorIs: 'يكون',
  filterOperatorNot: 'ليس',
  filterOperatorAfter: 'بعد',
  filterOperatorOnOrAfter: 'عند أو بعد',
  filterOperatorBefore: 'بعد',
  filterOperatorOnOrBefore: 'عند أو قبل',
  filterOperatorIsEmpty: 'خالي',
  filterOperatorIsNotEmpty: 'غير خالي',
  filterOperatorIsAnyOf: 'أي من',

  // Filter values text
  filterValueAny: 'أي',
  filterValueTrue: 'صائب',
  filterValueFalse: 'خاطئ',

  // Column menu text
  columnMenuLabel: 'القائمة',
  columnMenuShowColumns: 'إظهار الأعمدة',
  columnMenuFilter: 'المرشِح',
  columnMenuHideColumn: 'إخفاء',
  columnMenuUnsort: 'الغاء الفرز',
  columnMenuSortAsc: 'الفرز تصاعدياً',
  columnMenuSortDesc: 'الفرز تنازلياً',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} من المرشِحات النشطة` : `مرشِح نشط`,
  columnHeaderFiltersLabel: 'إظهار المرشحات',
  columnHeaderSortIconLabel: 'فرز',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `تم تحديد ${count.toLocaleString()} من الصفوف` : `تم تحديد صف واحد`,

  // Total row amount footer text
  footerTotalRows: 'إجمالي الصفوف:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} من ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'تحديد خانة الاختيار',
  checkboxSelectionSelectAllRows: 'تحديد كل الصفوف',
  checkboxSelectionUnselectAllRows: 'الغاء تحديد كل الصفوف',
  checkboxSelectionSelectRow: 'تحديد صف',
  checkboxSelectionUnselectRow: 'الغاء تحديد الصف',

  // Boolean cell text
  booleanCellTrueLabel: 'نعم',
  booleanCellFalseLabel: 'لا',

  // Actions cell more text
  actionsCellMore: 'المزيد',

  // Column pinning text
  pinToLeft: 'التدبيس يميناً',
  pinToRight: 'التدبيس يساراً',
  unpin: 'الغاء التدبيس',

  // Tree Data
  treeDataGroupingHeaderName: 'تجميع',
  treeDataExpand: 'رؤية الأبناء',
  treeDataCollapse: 'إخفاء الأبناء',

  // Grouping columns
  groupingColumnHeaderName: 'تجميع',
  groupColumn: (name) => `تجميع حسب ${name}`,
  unGroupColumn: (name) => `إيقاف التجميع حسب ${name}`,

  // Master/detail
  expandDetailPanel: 'توسيع',
  collapseDetailPanel: 'طوي',

  // Row reordering text
  // rowReorderingHeaderName: 'Row reordering',
};

export const arSD: Localization = getGridLocalization(arSDGrid, arSDCore);
