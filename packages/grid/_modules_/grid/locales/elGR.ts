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

  // Columns panel text
  columnsPanelTextFieldLabel: 'Εύρεση στήλης',
  columnsPanelTextFieldPlaceholder: 'Επικεφαλίδα στήλης',
  columnsPanelDragIconLabel: 'Αναδιάταξη στήλης',
  columnsPanelShowAllButton: 'Προβολή όλων',
  columnsPanelHideAllButton: 'Απόκρυψη όλων',

  // Filter panel text
  filterPanelAddFilter: 'Προσθήκη φίλτρου',
  filterPanelDeleteIconLabel: 'Διαγραφή',
  filterPanelOperators: 'Τελεστές',
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

  // Total rows footer text
  footerTotalRows: 'Σύνολο Γραμμών:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} από ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  // checkboxSelectionHeaderName: 'Checkbox selection',

  // Boolean cell text
  // booleanCellTrueLabel: 'true',
  // booleanCellFalseLabel: 'false',

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
};

export const elGR: Localization = getGridLocalization(elGRGrid);
