import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const bnBDGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'কোনো সারি নেই',
  noResultsOverlayLabel: 'কোনো ফলাফল পাওয়া যায়নি।',
  noColumnsOverlayLabel: 'কোনো কলাম নেই',
  noColumnsOverlayManageColumns: 'কলাম পরিচালনা করুন',

  // Density selector toolbar button text
  toolbarDensity: 'ঘনত্ব',
  toolbarDensityLabel: 'ঘনত্ব',
  toolbarDensityCompact: 'সংকুচিত',
  toolbarDensityStandard: 'মানক',
  toolbarDensityComfortable: 'স্বাচ্ছন্দ্যদায়ক',

  // Columns selector toolbar button text
  toolbarColumns: 'কলাম',
  toolbarColumnsLabel: 'কলাম নির্বাচন করুন',

  // Filters toolbar button text
  toolbarFilters: 'ফিল্টার',
  toolbarFiltersLabel: 'ফিল্টার দেখান',
  toolbarFiltersTooltipHide: 'ফিল্টার লুকান',
  toolbarFiltersTooltipShow: 'ফিল্টার দেখান',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} টি সক্রিয় ফিল্টার` : `${count} টি সক্রিয় ফিল্টার`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'অনুসন্ধান করুন…',
  toolbarQuickFilterLabel: 'অনুসন্ধান',
  toolbarQuickFilterDeleteIconLabel: 'পরিষ্কার করুন',

  // Prompt toolbar field
  toolbarPromptControlPlaceholder: 'একটি প্রম্পট লিখুন…',
  toolbarPromptControlWithRecordingPlaceholder: 'লিখুন বা রেকর্ড করুন…',
  toolbarPromptControlRecordingPlaceholder: 'শুনছে…',
  toolbarPromptControlLabel: 'প্রম্পট ইনপুট',
  toolbarPromptControlRecordButtonDefaultLabel: 'রেকর্ড',
  toolbarPromptControlRecordButtonActiveLabel: 'রেকর্ড বন্ধ করুন',
  toolbarPromptControlSendActionLabel: 'পাঠান',
  toolbarPromptControlSendActionAriaLabel: 'প্রম্পট পাঠান',
  toolbarPromptControlErrorMessage:
    'অনুরোধ প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে অন্য প্রম্পট দিয়ে আবার চেষ্টা করুন।',

  // Export selector toolbar button text
  toolbarExport: 'এক্সপোর্ট',
  toolbarExportLabel: 'এক্সপোর্ট',
  toolbarExportCSV: 'CSV হিসাবে ডাউনলোড করুন',
  toolbarExportPrint: 'প্রিন্ট করুন',
  toolbarExportExcel: 'Excel হিসাবে ডাউনলোড করুন',

  // Columns management text
  columnsManagementSearchTitle: 'অনুসন্ধান',
  columnsManagementNoColumns: 'কোনো কলাম নেই',
  columnsManagementShowHideAllText: 'সব দেখান/লুকান',
  columnsManagementReset: 'রিসেট',
  columnsManagementDeleteIconLabel: 'পরিষ্কার',

  // Filter panel text
  filterPanelAddFilter: 'ফিল্টার যোগ করুন',
  filterPanelRemoveAll: 'সব সরান',
  filterPanelDeleteIconLabel: 'মুছুন',
  filterPanelLogicOperator: 'লজিক অপারেটর',
  filterPanelOperator: 'অপারেটর',
  filterPanelOperatorAnd: 'এবং',
  filterPanelOperatorOr: 'অথবা',
  filterPanelColumns: 'কলাম',
  filterPanelInputLabel: 'মান',
  filterPanelInputPlaceholder: 'ফিল্টার মান',

  // Filter operators text
  filterOperatorContains: 'অন্তর্ভুক্ত',
  filterOperatorDoesNotContain: 'অন্তর্ভুক্ত নয়',
  filterOperatorEquals: 'সমান',
  filterOperatorDoesNotEqual: 'সমান নয়',
  filterOperatorStartsWith: 'দিয়ে শুরু হয়',
  filterOperatorEndsWith: 'দিয়ে শেষ হয়',
  filterOperatorIs: 'হচ্ছে',
  filterOperatorNot: 'হচ্ছে না',
  filterOperatorAfter: 'পরবর্তী',
  filterOperatorOnOrAfter: 'এই তারিখ বা পরবর্তী',
  filterOperatorBefore: 'পূর্ববর্তী',
  filterOperatorOnOrBefore: 'এই তারিখ বা পূর্ববর্তী',
  filterOperatorIsEmpty: 'খালি',
  filterOperatorIsNotEmpty: 'খালি নয়',
  filterOperatorIsAnyOf: 'এর যেকোনো একটি',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'অন্তর্ভুক্ত',
  headerFilterOperatorDoesNotContain: 'অন্তর্ভুক্ত নয়',
  headerFilterOperatorEquals: 'সমান',
  headerFilterOperatorDoesNotEqual: 'সমান নয়',
  headerFilterOperatorStartsWith: 'দিয়ে শুরু হয়',
  headerFilterOperatorEndsWith: 'দিয়ে শেষ হয়',
  headerFilterOperatorIs: 'হচ্ছে',
  headerFilterOperatorNot: 'হচ্ছে না',
  headerFilterOperatorAfter: 'পরবর্তী',
  headerFilterOperatorOnOrAfter: 'এই তারিখ বা পরবর্তী',
  headerFilterOperatorBefore: 'পূর্ববর্তী',
  headerFilterOperatorOnOrBefore: 'এই তারিখ বা পূর্ববর্তী',
  headerFilterOperatorIsEmpty: 'খালি',
  headerFilterOperatorIsNotEmpty: 'খালি নয়',
  headerFilterOperatorIsAnyOf: 'এর যেকোনো একটি',
  'headerFilterOperator=': 'সমান',
  'headerFilterOperator!=': 'সমান নয়',
  'headerFilterOperator>': 'বড়',
  'headerFilterOperator>=': 'বড় বা সমান',
  'headerFilterOperator<': 'ছোট',
  'headerFilterOperator<=': 'ছোট বা সমান',
  headerFilterClear: 'ফিল্টার মুছুন',

  // Filter values text
  filterValueAny: 'যেকোনো',
  filterValueTrue: 'সত্য',
  filterValueFalse: 'মিথ্যা',

  // Column menu text
  columnMenuLabel: 'মেনু',
  columnMenuShowColumns: 'কলাম দেখান',
  columnMenuManageColumns: 'কলাম পরিচালনা করুন',
  columnMenuFilter: 'ফিল্টার',
  columnMenuHideColumn: 'কলাম লুকান',
  columnMenuUnsort: 'সাজানো বাতিল করুন',
  columnMenuSortAsc: 'ASC অনুযায়ী সাজান',
  columnMenuSortDesc: 'DESC অনুযায়ী সাজান',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} টি সক্রিয় ফিল্টার` : `${count} টি সক্রিয় ফিল্টার`,
  columnHeaderFiltersLabel: 'ফিল্টার দেখান',
  columnHeaderSortIconLabel: 'সাজান',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} টি সারি নির্বাচিত`
      : `${count.toLocaleString()} টি সারি নির্বাচিত`,

  // Total row amount footer text
  footerTotalRows: 'মোট সারি:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'চেকবক্স নির্বাচন',
  checkboxSelectionSelectAllRows: 'সব সারি নির্বাচন করুন',
  checkboxSelectionUnselectAllRows: 'সব সারি নির্বাচন বাতিল করুন',
  checkboxSelectionSelectRow: 'সারি নির্বাচন করুন',
  checkboxSelectionUnselectRow: 'সারি নির্বাচন বাতিল করুন',

  // Boolean cell text
  booleanCellTrueLabel: 'হ্যাঁ',
  booleanCellFalseLabel: 'না',

  // Actions cell more text
  actionsCellMore: 'আরও',

  // Column pinning text
  pinToLeft: 'বাঁ দিকে পিন করুন',
  pinToRight: 'ডান দিকে পিন করুন',
  unpin: 'আনপিন করুন',

  // Tree Data
  treeDataGroupingHeaderName: 'গ্রুপ',
  // treeDataExpand: 'see children',
  // treeDataCollapse: 'hide children',

  // Grouping columns
  groupingColumnHeaderName: 'গ্রুপ',
  groupColumn: (name) => `${name} অনুসারে গ্রুপ করুন`,
  unGroupColumn: (name) => `${name} অনুসারে গ্রুপ বন্ধ করুন`,

  // Master/detail
  detailPanelToggle: 'বিস্তারিত প্যানেল টগল করুন',
  expandDetailPanel: 'সম্প্রসারিত করুন',
  collapseDetailPanel: 'সংকুচিত করুন',

  // Pagination
  paginationRowsPerPage: 'প্রতি পৃষ্ঠায় সারি:',
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
      return 'প্রথম পৃষ্ঠায় যান';
    }
    if (type === 'last') {
      return 'শেষ পৃষ্ঠায় যান';
    }
    if (type === 'next') {
      return 'পরবর্তী পৃষ্ঠায় যান';
    }
    // if (type === 'previous') {
    return 'আগের পৃষ্ঠায় যান';
  },

  // Row reordering text
  rowReorderingHeaderName: 'সারি পুনর্বিন্যাস',

  // Aggregation
  aggregationMenuItemHeader: 'সংকলন',
  aggregationFunctionLabelSum: 'যোগফল',
  aggregationFunctionLabelAvg: 'গড়',
  aggregationFunctionLabelMin: 'সর্বনিম্ন',
  aggregationFunctionLabelMax: 'সর্বোচ্চ',
  aggregationFunctionLabelSize: 'মাপ',
};

export const bnBD: Localization = getGridLocalization(bnBDGrid);
