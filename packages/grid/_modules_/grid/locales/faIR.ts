import { faIR as faIRCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const faIRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'بدون سطر',
  noResultsOverlayLabel: 'نتیجه ای پیدا نشد.',
  errorOverlayDefaultLabel: 'خطایی روی داد.',

  // Density selector toolbar button text
  toolbarDensity: 'تراکم',
  toolbarDensityLabel: 'تراکم',
  toolbarDensityCompact: 'فشرده',
  toolbarDensityStandard: 'استاندارد',
  toolbarDensityComfortable: 'راحت',

  // Columns selector toolbar button text
  toolbarColumns: 'ستون‌ها',
  toolbarColumnsLabel: 'ستون‌ها را انتخاب کنید',

  // Filters toolbar button text
  toolbarFilters: 'فیلترها',
  toolbarFiltersLabel: 'نمایش فیلترها',
  toolbarFiltersTooltipHide: 'مخفی کردن فیلترها',
  toolbarFiltersTooltipShow: 'نمایش فیلترها',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} فیلترهای فعال` : `${count} فیلتر فعال`,

  // Export selector toolbar button text
  toolbarExport: 'خروجی',
  toolbarExportLabel: 'خروجی',
  toolbarExportCSV: 'دانلود به‌صورت CSV',
  // toolbarExportPrint: 'Print',

  // Columns panel text
  columnsPanelTextFieldLabel: 'پیداکردن ستون',
  columnsPanelTextFieldPlaceholder: 'عنوان ستون',
  columnsPanelDragIconLabel: 'جا‌به‌جایی ستون',
  columnsPanelShowAllButton: 'نمایش همه',
  columnsPanelHideAllButton: 'مخفی همه',

  // Filter panel text
  filterPanelAddFilter: 'افزودن فیلتر',
  filterPanelDeleteIconLabel: 'حذف',
  filterPanelOperators: 'عملگرها',
  filterPanelOperatorAnd: 'و',
  filterPanelOperatorOr: 'یا',
  filterPanelColumns: 'ستون‌ها',
  filterPanelInputLabel: 'مقدار',
  filterPanelInputPlaceholder: 'فیلتر مقدار',

  // Filter operators text
  filterOperatorContains: 'شامل',
  filterOperatorEquals: 'مساوی',
  filterOperatorStartsWith: 'شروع با',
  filterOperatorEndsWith: 'پایان با',
  filterOperatorIs: 'هست',
  filterOperatorNot: 'نیست',
  filterOperatorAfter: 'بعد از',
  filterOperatorOnOrAfter: 'معادل یا بعدش',
  filterOperatorBefore: 'قبلش',
  filterOperatorOnOrBefore: 'معادل یا قبلش',
  filterOperatorIsEmpty: 'خالی است',
  filterOperatorIsNotEmpty: 'خالی نیست',

  // Filter values text
  filterValueAny: 'هرچیزی',
  filterValueTrue: 'صحیح',
  filterValueFalse: 'غلط',

  // Column menu text
  columnMenuLabel: 'فهرست',
  columnMenuShowColumns: 'نمایش ستون‌ها',
  columnMenuFilter: 'فیلتر',
  columnMenuHideColumn: 'مخفی',
  columnMenuUnsort: 'نامرتب‌کردن',
  columnMenuSortAsc: 'مرتب‌کردن صعودی',
  columnMenuSortDesc: 'مرتب‌کردن نزولی',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} فیلتر‌های فعال` : `${count} فیلتر فعال`,
  columnHeaderFiltersLabel: 'نمایش فیلترها',
  columnHeaderSortIconLabel: 'مرتب‌کردن',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} سطرهای انتخاب شده`
      : `${count.toLocaleString()} سطر انتخاب شده`,

  // Total rows footer text
  footerTotalRows: 'مجموع سطرها:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} از ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'انتخاب چک‌باکس',

  // Boolean cell text
  booleanCellTrueLabel: 'صحیح',
  booleanCellFalseLabel: 'غلط',

  // Actions cell more text
  actionsCellMore: 'بیشتر',

  // Column pinning text
  // pinToLeft: 'Pin to left',
  // pinToRight: 'Pin to right',
  // unpin: 'Unpin',

  // Tree Data
  // treeDataGroupingHeaderName: 'Group',
  // treeDataExpand: 'see children',
  // treeDataCollapse: 'hide children',
};

export const faIR: Localization = getGridLocalization(faIRGrid, faIRCore);
