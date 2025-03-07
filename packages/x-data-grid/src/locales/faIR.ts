import { faIR as faIRCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const faIRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'بدون سطر',
  noResultsOverlayLabel: 'نتیجه‌ای پیدا نشد.',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',
  // emptyPivotOverlayPivotSettings: 'Pivot settings',

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

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'جستجو...',
  toolbarQuickFilterLabel: 'جستجو',
  toolbarQuickFilterDeleteIconLabel: 'حذف',

  // Prompt toolbar field
  // toolbarPromptControlPlaceholder: 'Type a prompt…',
  // toolbarPromptControlWithRecordingPlaceholder: 'Type or record a prompt…',
  // toolbarPromptControlRecordingPlaceholder: 'Listening for prompt…',
  // toolbarPromptControlLabel: 'Prompt input',
  // toolbarPromptControlRecordButtonDefaultLabel: 'Record',
  // toolbarPromptControlRecordButtonActiveLabel: 'Stop recording',
  // toolbarPromptControlSendActionLabel: 'Send',
  // toolbarPromptControlSendActionAriaLabel: 'Send prompt',
  // toolbarPromptControlErrorMessage: 'An error occurred while processing the request. Please try again with a different prompt.',

  // Export selector toolbar button text
  toolbarExport: 'خروجی',
  toolbarExportLabel: 'خروجی',
  toolbarExportCSV: 'دانلود به صورت CSV',
  toolbarExportPrint: 'چاپ',
  toolbarExportExcel: 'دانلود به صورت اکسل',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Columns management text
  columnsManagementSearchTitle: 'جستجو',
  columnsManagementNoColumns: 'بدون سطر',
  columnsManagementShowHideAllText: 'نمایش/مخفی کردن همه',
  columnsManagementReset: 'بازنشانی',
  columnsManagementDeleteIconLabel: 'پاک کردن',

  // Filter panel text
  filterPanelAddFilter: 'افزودن فیلتر',
  filterPanelRemoveAll: 'حذف همه',
  filterPanelDeleteIconLabel: 'حذف',
  filterPanelLogicOperator: 'عملگر منطقی',
  filterPanelOperator: 'عملگرها',
  filterPanelOperatorAnd: 'و',
  filterPanelOperatorOr: 'یا',
  filterPanelColumns: 'ستون‌ها',
  filterPanelInputLabel: 'مقدار',
  filterPanelInputPlaceholder: 'فیلتر مقدار',

  // Filter operators text
  filterOperatorContains: 'شامل',
  filterOperatorDoesNotContain: 'شامل نمیشود',
  filterOperatorEquals: 'مساوی',
  filterOperatorDoesNotEqual: 'برابر نیست',
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
  filterOperatorIsAnyOf: 'هر یک از',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'شامل',
  headerFilterOperatorDoesNotContain: 'شامل نمیشود',
  headerFilterOperatorEquals: 'مساوی',
  headerFilterOperatorDoesNotEqual: 'برابر نیست',
  headerFilterOperatorStartsWith: 'شروع با',
  headerFilterOperatorEndsWith: 'پایان با',
  headerFilterOperatorIs: 'هست',
  headerFilterOperatorNot: 'نیست',
  headerFilterOperatorAfter: 'بعد از',
  headerFilterOperatorOnOrAfter: 'معادل یا بعد از',
  headerFilterOperatorBefore: 'قبل از',
  headerFilterOperatorOnOrBefore: 'معادل یا قبل از',
  headerFilterOperatorIsEmpty: 'خالی است',
  headerFilterOperatorIsNotEmpty: 'خالی نیست',
  headerFilterOperatorIsAnyOf: 'هر یک از',
  'headerFilterOperator=': 'مساوی',
  'headerFilterOperator!=': 'نامساوی',
  'headerFilterOperator>': 'بزرگتر',
  'headerFilterOperator>=': 'بزرگتر یا مساوی',
  'headerFilterOperator<': 'کوچکتر',
  'headerFilterOperator<=': 'کوچکتر یا مساوی',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'هرچیزی',
  filterValueTrue: 'صحیح',
  filterValueFalse: 'غلط',

  // Column menu text
  columnMenuLabel: 'فهرست',
  columnMenuShowColumns: 'نمایش ستون‌ها',
  columnMenuManageColumns: 'مدیریت ستون‌ها',
  columnMenuFilter: 'فیلتر',
  columnMenuHideColumn: 'مخفی',
  columnMenuUnsort: 'نامرتب‌کردن',
  columnMenuSortAsc: 'مرتب‌سازی صعودی',
  columnMenuSortDesc: 'مرتب‌سازی نزولی',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} فیلتر‌های فعال` : `${count} فیلتر فعال`,
  columnHeaderFiltersLabel: 'نمایش فیلترها',
  columnHeaderSortIconLabel: 'مرتب‌سازی',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} سطرهای انتخاب شده`
      : `${count.toLocaleString()} سطر انتخاب شده`,

  // Total row amount footer text
  footerTotalRows: 'مجموع سطرها:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} از ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'چک‌باکس انتخاب',
  checkboxSelectionSelectAllRows: 'انتخاب همه‌ی ردیف‌ها',
  checkboxSelectionUnselectAllRows: 'لغو انتخاب همه‌ی ردیف‌ها',
  checkboxSelectionSelectRow: 'انتخاب ردیف',
  checkboxSelectionUnselectRow: 'لغو انتخاب ردیف',

  // Boolean cell text
  booleanCellTrueLabel: 'صحیح',
  booleanCellFalseLabel: 'غلط',

  // Actions cell more text
  actionsCellMore: 'بیشتر',

  // Column pinning text
  pinToLeft: 'سنجاق کردن به چپ',
  pinToRight: 'سنجاق کردن به راست',
  unpin: 'برداشتن سنجاق',

  // Tree Data
  treeDataGroupingHeaderName: 'گروه‌بندی',
  treeDataExpand: 'نمایش فرزندان',
  treeDataCollapse: 'پنهان‌سازی فرزندان',

  // Grouping columns
  groupingColumnHeaderName: 'گروه‌بندی',
  groupColumn: (name) => `گروه‌بندی براساس ${name}`,
  unGroupColumn: (name) => `لغو گروه‌بندی براساس ${name}`,

  // Master/detail
  detailPanelToggle: 'پنل جزئیات',
  expandDetailPanel: 'بازکردن پنل جزئیات',
  collapseDetailPanel: 'بستن پنل جزئیات',

  // Row reordering text
  rowReorderingHeaderName: 'ترتیب مجدد سطر',

  // Aggregation
  aggregationMenuItemHeader: 'تجمیع',
  aggregationFunctionLabelSum: 'جمع',
  aggregationFunctionLabelAvg: 'میانگین',
  aggregationFunctionLabelMin: 'حداقل',
  aggregationFunctionLabelMax: 'حداکثر',
  aggregationFunctionLabelSize: 'اندازه',

  // Pivot
  // pivotSettings: 'Pivot settings',
  // pivotToggleLabel: 'Pivot',
  // pivotRows: 'Rows',
  // pivotColumns: 'Columns',
  // pivotValues: 'Values',
  // pivotCloseButton: 'Close pivot settings',
  // pivotSearchButton: 'Search fields',
  // pivotSearchControlPlaceholder: 'Search',
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

  // Sidebar
  // sidebarExpandSection: name => `Expand ${name}`,
  // sidebarCollapseSection: name => `Collapse ${name}`,
};

export const faIR: Localization = getGridLocalization(faIRGrid, faIRCore);
