import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const heILGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'אין שורות',
  noResultsOverlayLabel: 'לא נמצאו תוצאות.',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'צפיפות',
  toolbarDensityLabel: 'צפיפות',
  toolbarDensityCompact: 'דחוסה',
  toolbarDensityStandard: 'רגילה',
  toolbarDensityComfortable: 'אוורירית',

  // Columns selector toolbar button text
  toolbarColumns: 'עמודות',
  toolbarColumnsLabel: 'בחר עמודות',

  // Filters toolbar button text
  toolbarFilters: 'סינון',
  toolbarFiltersLabel: 'הצג מסננים',
  toolbarFiltersTooltipHide: 'הסתר מסננים',
  toolbarFiltersTooltipShow: 'הצג מסננים',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} מסננים פעילים` : `מסנן אחד פעיל`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'חיפוש…',
  toolbarQuickFilterLabel: 'חיפוש',
  toolbarQuickFilterDeleteIconLabel: 'ניקוי',

  // Export selector toolbar button text
  toolbarExport: 'ייצוא',
  toolbarExportLabel: 'ייצוא',
  toolbarExportCSV: 'ייצוא ל- CSV',
  toolbarExportPrint: 'הדפסה',
  toolbarExportExcel: 'ייצוא ל- Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Columns management text
  columnsManagementSearchTitle: 'חיפוש',
  columnsManagementNoColumns: 'אין עמודות',
  columnsManagementShowHideAllText: 'הצג/הסתר הכל',
  columnsManagementReset: 'אתחול',
  columnsManagementDeleteIconLabel: 'נקה',

  // Filter panel text
  filterPanelAddFilter: 'הוסף מסנן',
  filterPanelRemoveAll: 'מחק הכל',
  filterPanelDeleteIconLabel: 'מחק',
  filterPanelLogicOperator: 'אופרטור לוגי',
  filterPanelOperator: 'אופרטור',
  filterPanelOperatorAnd: 'וגם',
  filterPanelOperatorOr: 'או',
  filterPanelColumns: 'עמודות',
  filterPanelInputLabel: 'ערך',
  filterPanelInputPlaceholder: 'ערך מסנן',

  // Filter operators text
  filterOperatorContains: 'מכיל',
  filterOperatorDoesNotContain: 'לא מכיל',
  filterOperatorEquals: 'שווה',
  filterOperatorDoesNotEqual: 'לא שווה',
  filterOperatorStartsWith: 'מתחיל ב-',
  filterOperatorEndsWith: 'נגמר ב-',
  filterOperatorIs: 'הינו',
  filterOperatorNot: 'אינו',
  filterOperatorAfter: 'אחרי',
  filterOperatorOnOrAfter: 'ב- או אחרי',
  filterOperatorBefore: 'לפני',
  filterOperatorOnOrBefore: 'ב- או לפני',
  filterOperatorIsEmpty: 'ריק',
  filterOperatorIsNotEmpty: 'אינו ריק',
  filterOperatorIsAnyOf: 'הוא אחד מ-',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'מכיל',
  headerFilterOperatorDoesNotContain: 'לא מכיל',
  headerFilterOperatorEquals: 'שווה',
  headerFilterOperatorDoesNotEqual: 'לא שווה',
  headerFilterOperatorStartsWith: 'מתחיל ב-',
  headerFilterOperatorEndsWith: 'נגמר ב-',
  headerFilterOperatorIs: 'הינו',
  headerFilterOperatorNot: 'אינו',
  headerFilterOperatorAfter: 'אחרי',
  headerFilterOperatorOnOrAfter: 'ב- או אחרי',
  headerFilterOperatorBefore: 'לפני',
  headerFilterOperatorOnOrBefore: 'ב- או לפני',
  headerFilterOperatorIsEmpty: 'ריק',
  headerFilterOperatorIsNotEmpty: 'אינו ריק',
  headerFilterOperatorIsAnyOf: 'הוא אחד מ-',
  'headerFilterOperator=': 'שווה',
  'headerFilterOperator!=': 'אינו שווה',
  'headerFilterOperator>': 'גדול מ-',
  'headerFilterOperator>=': 'גדול שווה ל-',
  'headerFilterOperator<': 'קטן מ-',
  'headerFilterOperator<=': 'קטן שווה ל-',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'כל ערך',
  filterValueTrue: 'כן',
  filterValueFalse: 'לא',

  // Column menu text
  columnMenuLabel: 'תפריט',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'הצג עמודות',
  columnMenuManageColumns: 'נהל עמודות',
  columnMenuFilter: 'סנן',
  columnMenuHideColumn: 'הסתר',
  columnMenuUnsort: 'בטל מיון',
  columnMenuSortAsc: 'מיין בסדר עולה',
  columnMenuSortDesc: 'מיין בסדר יורד',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} מסננים פעילים` : `מסנן אחד פעיל`,
  columnHeaderFiltersLabel: 'הצג מסננים',
  columnHeaderSortIconLabel: 'מיין',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `${count.toLocaleString()} שורות נבחרו` : `שורה אחת נבחרה`,

  // Total row amount footer text
  footerTotalRows: 'סך הכל:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} מתוך ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'בחירה',
  checkboxSelectionSelectAllRows: 'בחר הכל',
  checkboxSelectionUnselectAllRows: 'בטל הכל',
  checkboxSelectionSelectRow: 'בחר שורה',
  checkboxSelectionUnselectRow: 'בטל בחירת שורה',

  // Boolean cell text
  booleanCellTrueLabel: 'כן',
  booleanCellFalseLabel: 'לא',

  // Actions cell more text
  actionsCellMore: 'עוד',

  // Column pinning text
  pinToLeft: 'נעץ משמאל',
  pinToRight: 'נעץ מימין',
  unpin: 'הסר נעיצה',

  // Tree Data
  treeDataGroupingHeaderName: 'קבוצה',
  treeDataExpand: 'הרחב',
  treeDataCollapse: 'כווץ',

  // Grouping columns
  groupingColumnHeaderName: 'קבוצה',
  groupColumn: (name) => `קבץ לפי ${name}`,
  unGroupColumn: (name) => `הפסק לקבץ לפי ${name}`,

  // Master/detail
  detailPanelToggle: 'הצג/הסתר פרטים',
  expandDetailPanel: 'הרחב',
  collapseDetailPanel: 'כווץ',

  // Pagination
  paginationRowsPerPage: 'שורות בעמוד:',
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
      return 'לעמוד הראשון';
    }
    if (type === 'last') {
      return 'לעמוד האחרון';
    }
    if (type === 'next') {
      return 'לעמוד הבא';
    }
    // if (type === 'previous') {
    return 'לעמוד הקודם';
  },

  // Row reordering text
  rowReorderingHeaderName: 'סידור שורות',

  // Aggregation
  aggregationMenuItemHeader: 'צבירה',
  aggregationFunctionLabelSum: 'סכום',
  aggregationFunctionLabelAvg: 'ממוצע',
  aggregationFunctionLabelMin: 'מינימום',
  aggregationFunctionLabelMax: 'מקסימום',
  aggregationFunctionLabelSize: 'גודל',

  // Pivot panel
  // pivotToggleLabel: 'Pivot',
  // pivotRows: 'Rows',
  // pivotColumns: 'Columns',
  // pivotValues: 'Values',
  // pivotCloseButton: 'Close pivot settings',
  // pivotSearchButton: 'Search fields',
  // pivotSearchControlPlaceholder: 'Search fields',
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
  // pivotYearColumnHeaderName: '(Year)',
  // pivotQuarterColumnHeaderName: '(Quarter)',

  // AI Assistant panel
  // aiAssistantPanelTitle: 'AI Assistant',
  // aiAssistantPanelNoHistory: 'No prompt history',
  // aiAssistantSuggestions: 'Suggestions',

  // Prompt field
  promptFieldLabel: 'הזן ערך',
  promptFieldPlaceholder: 'הקלד ערך…',
  promptFieldPlaceholderWithRecording: 'הקלד או הקלט ערך…',
  promptFieldPlaceholderListening: 'ממתין להנחיה…',
  // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  promptFieldSend: 'שלח',
  promptFieldRecord: 'הקלטה',
  promptFieldStopRecording: 'הפסק הקלטה',

  // Prompt
  // promptRerun: 'Run again',
  // promptProcessing: 'Processing…',
  // promptAppliedChanges: 'Applied changes',
};

export const heIL: Localization = getGridLocalization(heILGrid);
