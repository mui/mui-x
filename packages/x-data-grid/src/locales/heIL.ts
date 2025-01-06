import { heIL as heILCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const heILGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'אין שורות',
  noResultsOverlayLabel: 'לא נמצאו תוצאות.',

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

  // Prompt toolbar field
  toolbarPromptControlPlaceholder: 'הקלד ערך…',
  toolbarPromptControlWithRecordingPlaceholder: 'הקלד או הקלט ערך…',
  toolbarPromptControlRecordingPlaceholder: 'ממתין להנחיה…',
  toolbarPromptControlLabel: 'הזן ערך',
  toolbarPromptControlRecordButtonDefaultLabel: 'הקלטה',
  toolbarPromptControlRecordButtonActiveLabel: 'הפסק הקלטה',
  toolbarPromptControlSendActionLabel: 'שלח',
  toolbarPromptControlSendActionAriaLabel: 'שלח ערך',
  toolbarPromptControlErrorMessage: 'התרחשה שגיאה בזמן העיבוד של הבקשה. נסה שוב עם ערך אחר בבקשה.',

  // Export selector toolbar button text
  toolbarExport: 'ייצוא',
  toolbarExportLabel: 'ייצוא',
  toolbarExportCSV: 'ייצוא ל- CSV',
  toolbarExportPrint: 'הדפסה',
  toolbarExportExcel: 'ייצוא ל- Excel',

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

  // Filter values text
  filterValueAny: 'כל ערך',
  filterValueTrue: 'כן',
  filterValueFalse: 'לא',

  // Column menu text
  columnMenuLabel: 'תפריט',
  columnMenuShowColumns: 'הצג עמודות',
  columnMenuManageColumns: 'נהל עמודות',
  columnMenuFilter: 'סנן',
  columnMenuHideColumn: 'הסתר',
  columnMenuUnsort: 'בטל מיון',
  columnMenuSortAsc: 'מיין בסדר עולה',
  columnMenuSortDesc: 'מיין בסדר יורד',

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

  // Row reordering text
  rowReorderingHeaderName: 'סידור שורות',

  // Aggregation
  aggregationMenuItemHeader: 'צבירה',
  aggregationFunctionLabelSum: 'סכום',
  aggregationFunctionLabelAvg: 'ממוצע',
  aggregationFunctionLabelMin: 'מינימום',
  aggregationFunctionLabelMax: 'מקסימום',
  aggregationFunctionLabelSize: 'גודל',
};

export const heIL: Localization = getGridLocalization(heILGrid, heILCore);
