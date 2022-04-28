import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const elGRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Δεν υπάρχουν καταχωρήσεις',
  noResultsOverlayLabel: 'Δεν βρέθηκαν αποτελέσματα.',
  errorOverlayDefaultLabel: 'Παρουσιάστηκε απρόβλεπτο σφάλμα.',

  // Density selector toolbar button text
  toolbarDensity: 'Ύψος σειράς',
  toolbarDensityLabel: 'Ύψος σειράς',
  toolbarDensityCompact: 'Συμπαγής',
  toolbarDensityStandard: 'Προκαθορισμένο',
  toolbarDensityComfortable: 'Πλατύ',

  // Columns selector toolbar button text
  toolbarColumns: 'Στήλες',
  toolbarColumnsLabel: 'Επιλέξτε στήλες',

  // Filters toolbar button text
  toolbarFilters: 'Φίλτρα',
  toolbarFiltersLabel: 'Εμφάνιση φίλτρων',
  toolbarFiltersTooltipHide: 'Απόκρυψη φίλτρων',
  toolbarFiltersTooltipShow: 'Εμφάνιση φίλτρων',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} ενεργά φίλτρα` : `${count} ενεργό φίλτρο`,

  // Export selector toolbar button text
  toolbarExport: 'Εξαγωγή',
  toolbarExportLabel: 'Εξαγωγή',
  toolbarExportCSV: 'Λήψη ως CSV',
  // toolbarExportPrint: 'Print',
  // toolbarExportExcel: 'Download as Excel',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Εύρεση στήλης',
  columnsPanelTextFieldPlaceholder: 'Επικεφαλίδα στήλης',
  columnsPanelDragIconLabel: 'Αναδιάταξη στήλης',
  columnsPanelShowAllButton: 'Προβολή όλων',
  columnsPanelHideAllButton: 'Απόκρυψη όλων',

  // Filter panel text
  filterPanelAddFilter: 'Προσθήκη φίλτρου',
  filterPanelDeleteIconLabel: 'Διαγραφή',
  // filterPanelLinkOperator: 'Logic operator',
  filterPanelOperators: 'Τελεστές',

  // TODO v6: rename to filterPanelOperator
  filterPanelOperatorAnd: 'Καί',
  filterPanelOperatorOr: 'Ή',
  filterPanelColumns: 'Στήλες',
  filterPanelInputLabel: 'Τιμή',
  filterPanelInputPlaceholder: 'Τιμή φίλτρου',

  // Filter operators text
  filterOperatorContains: 'περιέχει',
  filterOperatorEquals: 'ισούται',
  filterOperatorStartsWith: 'ξεκινάει με',
  filterOperatorEndsWith: 'τελειώνει με',
  filterOperatorIs: 'είναι',
  filterOperatorNot: 'δεν είναι',
  filterOperatorAfter: 'είναι μετά',
  filterOperatorOnOrAfter: 'είναι ίσο ή μετά',
  filterOperatorBefore: 'είναι πριν',
  filterOperatorOnOrBefore: 'είναι ίσο ή πριν',
  filterOperatorIsEmpty: 'είναι κενό',
  filterOperatorIsNotEmpty: 'δεν είναι κενό',
  // filterOperatorIsAnyOf: 'is any of',

  // Filter values text
  // filterValueAny: 'any',
  // filterValueTrue: 'true',
  // filterValueFalse: 'false',

  // Column menu text
  columnMenuLabel: 'Μενού',
  columnMenuShowColumns: 'Εμφάνιση στηλών',
  columnMenuFilter: 'Φίλτρο',
  columnMenuHideColumn: 'Απόκρυψη',
  columnMenuUnsort: 'Απενεργοποίηση ταξινόμησης',
  columnMenuSortAsc: 'Ταξινόμηση σε αύξουσα σειρά',
  columnMenuSortDesc: 'Ταξινόμηση σε φθίνουσα σειρά',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} ενεργά φίλτρα` : `${count} ενεργό φίλτρο`,
  columnHeaderFiltersLabel: 'Εμφάνιση φίλτρων',
  columnHeaderSortIconLabel: 'Ταξινόμηση',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} επιλεγμένες γραμμές`
      : `${count.toLocaleString()} επιλεγμένη γραμμή`,

  // Total row amount footer text
  footerTotalRows: 'Σύνολο Γραμμών:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} από ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  // checkboxSelectionHeaderName: 'Checkbox selection',
  // checkboxSelectionSelectAllRows: 'Select all rows',
  // checkboxSelectionUnselectAllRows: 'Unselect all rows',
  // checkboxSelectionSelectRow: 'Select row',
  // checkboxSelectionUnselectRow: 'Unselect row',

  // Boolean cell text
  // booleanCellTrueLabel: 'yes',
  // booleanCellFalseLabel: 'no',

  // Actions cell more text
  actionsCellMore: 'περισσότερα',

  // Column pinning text
  // pinToLeft: 'Pin to left',
  // pinToRight: 'Pin to right',
  // unpin: 'Unpin',

  // Tree Data
  // treeDataGroupingHeaderName: 'Group',
  // treeDataExpand: 'see children',
  // treeDataCollapse: 'hide children',

  // Grouping columns
  // groupingColumnHeaderName: 'Group',
  // groupColumn: name => `Group by ${name}`,
  // unGroupColumn: name => `Stop grouping by ${name}`,

  // Master/detail
  // expandDetailPanel: 'Expand',
  // collapseDetailPanel: 'Collapse',

  // Row reordering text
  // rowReorderingHeaderName: 'Row reordering',
};

export const elGR: Localization = getGridLocalization(elGRGrid);
