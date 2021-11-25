import { arSD as arSDCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const arSDGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'لا توجد صفوف',
  noResultsOverlayLabel: 'لم يتم العثور على نتائج.',
  errorOverlayDefaultLabel: 'حدث خطأ.',

  // Density selector toolbar button text
  toolbarDensity: 'كثافة',
  toolbarDensityLabel: 'كثافة',
  toolbarDensityCompact: 'مدمج',
  toolbarDensityStandard: 'المعيار',
  toolbarDensityComfortable: 'مريح',

  // Columns selector toolbar button text
  toolbarColumns: 'الأعمدة',
  toolbarColumnsLabel: 'حدد الأعمدة',

  // Filters toolbar button text
  toolbarFilters: 'الفلاتر',
  toolbarFiltersLabel: 'اظهر الفلاتر',
  toolbarFiltersTooltipHide: 'إخفاء الفلاتر',
  toolbarFiltersTooltipShow: 'اظهر الفلاتر',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} فلاتر نشطة` : `${count} فلاتر نشطة`,

  // Export selector toolbar button text
  toolbarExport: 'تصدير',
  toolbarExportLabel: 'تصدير',
  toolbarExportCSV: 'تنزيل كملف CSV',
  // toolbarExportPrint: 'Print',

  // Columns panel text
  columnsPanelTextFieldLabel: 'ايجاد عمود',
  columnsPanelTextFieldPlaceholder: 'عنوان العمود',
  columnsPanelDragIconLabel: 'إعادة ترتيب العمود',
  columnsPanelShowAllButton: 'عرض الكل',
  columnsPanelHideAllButton: 'اخفاء الكل',

  // Filter panel text
  filterPanelAddFilter: 'اضف فلتر',
  filterPanelDeleteIconLabel: 'حذف',
  filterPanelOperators: 'العاملين',
  filterPanelOperatorAnd: 'و',
  filterPanelOperatorOr: 'او',
  filterPanelColumns: 'الأعمدة',
  filterPanelInputLabel: 'قيمة',
  filterPanelInputPlaceholder: 'قيمة التصفية',

  // Filter operators text
  filterOperatorContains: 'يحتوي على',
  filterOperatorEquals: 'يساوي',
  filterOperatorStartsWith: 'يبدأ ب',
  filterOperatorEndsWith: 'ينتهي بـ',
  filterOperatorIs: 'يكون',
  filterOperatorNot: 'ليس',
  filterOperatorAfter: 'يكون بعد',
  filterOperatorOnOrAfter: 'في أو بعد',
  filterOperatorBefore: 'يكون',
  filterOperatorOnOrBefore: 'في أو قبل',
  filterOperatorIsEmpty: 'فارغ',
  filterOperatorIsNotEmpty: 'ليس فارغا',

  // Filter values text
  filterValueAny: 'أي',
  filterValueTrue: 'صحيح',
  filterValueFalse: 'خاطئة',

  // Column menu text
  columnMenuLabel: 'القائمة',
  columnMenuShowColumns: 'إظهار الأعمدة',
  columnMenuFilter: 'فلتر',
  columnMenuHideColumn: 'إخفاء',
  columnMenuUnsort: 'غير مرتب',
  columnMenuSortAsc: 'الترتيب حسب ASC',
  columnMenuSortDesc: 'الترتيب حسب DESC',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} فلاتر نشطة` : `${count} فلاتر نشطة`,
  columnHeaderFiltersLabel: 'اظهر الفلاتر',
  columnHeaderSortIconLabel: 'ترتيب',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `${count.toLocaleString()} صفوف مختارة` : `${count.toLocaleString()} صفوف مختارة`,

  // Total rows footer text
  footerTotalRows: 'إجمالي الصفوف:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} من ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'تحديد',

  // Boolean cell text
  booleanCellTrueLabel: 'صحيح',
  booleanCellFalseLabel: 'خاطئة',

  // Actions cell more text
  // actionsCellMore: 'more',

  // Column pinning text
  // pinToLeft: 'Pin to left',
  // pinToRight: 'Pin to right',
  // unpin: 'Unpin',

  // Tree Data
  // treeDataGroupingHeaderName: 'Group',
  // treeDataExpand: 'see children',
  // treeDataCollapse: 'hide children',
};

export const arSD: Localization = getGridLocalization(arSDGrid, arSDCore);
