import { heIL as heILCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const heILGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'אין שורות',
  noResultsOverlayLabel: 'לא נמצאו תוצאות.',
  errorOverlayDefaultLabel: 'אירעה שגיאה.',

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
  toolbarFiltersTooltipActive: (count) => (count > 1 ? `${count} מסננים פעילים` : `מסנן אחד פעיל`),

  // Export selector toolbar button text
  toolbarExport: 'ייצוא',
  toolbarExportLabel: 'ייצוא',
  toolbarExportCSV: 'הורדה כ- CSV',
  toolbarExportPrint: 'הדפסה',

  // Columns panel text
  columnsPanelTextFieldLabel: 'חפש עמודה',
  columnsPanelTextFieldPlaceholder: 'כותרת עמודה',
  columnsPanelDragIconLabel: 'סדר עמודות מחדש',
  columnsPanelShowAllButton: 'הצג הכל',
  columnsPanelHideAllButton: 'הסתר הכל',

  // Filter panel text
  filterPanelAddFilter: 'הוסף מסנן',
  filterPanelDeleteIconLabel: 'מחק',
  filterPanelOperators: 'אופרטור',
  filterPanelOperatorAnd: 'וגם',
  filterPanelOperatorOr: 'או',
  filterPanelColumns: 'עמודות',
  filterPanelInputLabel: 'ערך',
  filterPanelInputPlaceholder: 'ערך מסנן',

  // Filter values text
  filterValueAny: 'כל ערך',
  filterValueTrue: 'כן',
  filterValueFalse: 'לא',

  // Filter operators text
  filterOperatorContains: 'מכיל',
  filterOperatorEquals: 'שווה ל-',
  filterOperatorStartsWith: 'מתחיל ב-',
  filterOperatorEndsWith: 'נגמר ב-',
  filterOperatorIs: 'הינו',
  filterOperatorNot: 'אינו',
  filterOperatorOnOrAfter: 'אחרי',
  filterOperatorAfter: 'ב- או אחרי',
  filterOperatorBefore: 'לפני',
  filterOperatorOnOrBefore: 'ב- או לפני',
  filterOperatorIsEmpty: 'ריק',
  filterOperatorIsNotEmpty: 'אינו ריק',

  // Column menu text
  columnMenuLabel: 'תפריט',
  columnMenuShowColumns: 'הצג עמודות',
  columnMenuFilter: 'סנן',
  columnMenuHideColumn: 'הסתר',
  columnMenuUnsort: 'בטל מיון',
  columnMenuSortAsc: 'מיין בסדר עולה',
  columnMenuSortDesc: 'מיין בסדר יורד',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} מסננים פעילים` : `מסנן אחד פעיל`,
  columnHeaderFiltersLabel: 'הצג מסננים',
  columnHeaderSortIconLabel: 'מיין',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count > 1 ? `${count.toLocaleString()} שורות נבחרו` : `שורה אחת נבחרה`,

  // Total rows footer text
  footerTotalRows: 'סך הכל שורות: ',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} מתוך ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'בחירה',

  // Boolean cell text
  booleanCellTrueLabel: 'כן',
  booleanCellFalseLabel: 'לא',

  // Actions cell more text
  actionsCellMore: 'עוד',
};

export const heIL: Localization = getGridLocalization(heILGrid, heILCore);
