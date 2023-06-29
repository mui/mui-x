import { daDK as daDKCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const daDKGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Ingen rækker',
  noResultsOverlayLabel: 'Ingen resultater',

  // Density selector toolbar button text
  toolbarDensity: 'Tæthed',
  toolbarDensityLabel: 'Tæthed',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Luftig',

  // Columns selector toolbar button text
  toolbarColumns: 'Kolonne',
  toolbarColumnsLabel: 'Vælg kolonne',

  // Filters toolbar button text
  toolbarFilters: 'Filtre',
  toolbarFiltersLabel: 'Vis filtre',
  toolbarFiltersTooltipHide: 'Skjul filtre',
  toolbarFiltersTooltipShow: 'Vis filtre',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive filtre` : `${count} aktivt filter`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Søg…',
  toolbarQuickFilterLabel: 'Søg',
  toolbarQuickFilterDeleteIconLabel: 'Ryd',

  // Export selector toolbar button text
  toolbarExport: 'Eksport',
  toolbarExportLabel: 'Eksporter',
  toolbarExportCSV: 'Download som CSV',
  toolbarExportPrint: 'Print',
  toolbarExportExcel: 'Download som Excel',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Find kolonne',
  columnsPanelTextFieldPlaceholder: 'Kolonne titel',
  columnsPanelDragIconLabel: 'Reorder kolonne',
  columnsPanelShowAllButton: 'Vis alle',
  columnsPanelHideAllButton: 'Skjul alle',

  // Filter panel text
  filterPanelAddFilter: 'Tilføj filter',
  filterPanelRemoveAll: 'Fjern alle',
  filterPanelDeleteIconLabel: 'Slet',
  filterPanelLogicOperator: 'Logisk operator',
  filterPanelOperator: 'Operatorer',
  filterPanelOperatorAnd: 'Og',
  filterPanelOperatorOr: 'Eller',
  filterPanelColumns: 'Kolonne',
  filterPanelInputLabel: 'Værdi',
  filterPanelInputPlaceholder: 'Filter værdi',

  // Filter operators text
  filterOperatorContains: 'Indeholder',
  filterOperatorEquals: 'Lig med',
  filterOperatorStartsWith: 'Begynder med',
  filterOperatorEndsWith: 'Ender med',
  filterOperatorIs: 'Er lig med',
  filterOperatorNot: 'Er ikke lig med',
  filterOperatorAfter: 'Efter',
  filterOperatorOnOrAfter: 'På eller efter',
  filterOperatorBefore: 'Før',
  filterOperatorOnOrBefore: 'På eller før',
  filterOperatorIsEmpty: 'Indeholder ikke data',
  filterOperatorIsNotEmpty: 'Indeholder data',
  filterOperatorIsAnyOf: 'indeholder en af',
  // 'filterOperator=': '=',
  // 'filterOperator!=': '!=',
  // 'filterOperator>': '>',
  // 'filterOperator>=': '>=',
  // 'filterOperator<': '<',
  // 'filterOperator<=': '<=',

  // Header filter operators text
  // headerFilterOperatorContains: 'Contains',
  // headerFilterOperatorEquals: 'Equals',
  // headerFilterOperatorStartsWith: 'Starts with',
  // headerFilterOperatorEndsWith: 'Ends with',
  // headerFilterOperatorIs: 'Is',
  // headerFilterOperatorNot: 'Is not',
  // headerFilterOperatorAfter: 'Is after',
  // headerFilterOperatorOnOrAfter: 'Is on or after',
  // headerFilterOperatorBefore: 'Is before',
  // headerFilterOperatorOnOrBefore: 'Is on or before',
  // headerFilterOperatorIsEmpty: 'Is empty',
  // headerFilterOperatorIsNotEmpty: 'Is not empty',
  // headerFilterOperatorIsAnyOf: 'Is any of',
  // 'headerFilterOperator=': 'Equals',
  // 'headerFilterOperator!=': 'Not equals',
  // 'headerFilterOperator>': 'Greater than',
  // 'headerFilterOperator>=': 'Greater than or equal to',
  // 'headerFilterOperator<': 'Less than',
  // 'headerFilterOperator<=': 'Less than or equal to',

  // Filter values text
  filterValueAny: 'hvilken som helst',
  filterValueTrue: 'positiv',
  filterValueFalse: 'negativ',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Vis Kolonner',
  columnMenuManageColumns: 'Administrer kolonner',
  columnMenuFilter: 'Filtre',
  columnMenuHideColumn: 'Skjul',
  columnMenuUnsort: 'Fjern sortering',
  columnMenuSortAsc: 'Sorter stigende',
  columnMenuSortDesc: 'Sorter faldende',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive filtre` : `Ét aktivt filter`,
  columnHeaderFiltersLabel: 'Vis filtre',
  columnHeaderSortIconLabel: 'Sorter',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `${count.toLocaleString()} rækker valgt` : `Én række valgt`,

  // Total row amount footer text
  footerTotalRows: 'Antal rækker i alt:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} af ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Afkrydsningsvalg',
  checkboxSelectionSelectAllRows: 'Vælg alle rækker',
  checkboxSelectionUnselectAllRows: 'Fravælg alle rækker',
  checkboxSelectionSelectRow: 'Vælg række',
  checkboxSelectionUnselectRow: 'Fravælg række',

  // Boolean cell text
  booleanCellTrueLabel: 'ja',
  booleanCellFalseLabel: 'nej',

  // Actions cell more text
  actionsCellMore: 'mere',

  // Column pinning text
  pinToLeft: 'Fastgør til venstre',
  pinToRight: 'Fastgør til højre',
  unpin: 'Frigiv',

  // Tree Data
  treeDataGroupingHeaderName: 'Gruppering',
  treeDataExpand: 'Vis underelementer',
  treeDataCollapse: 'Skjul underelementer',

  // Grouping columns
  groupingColumnHeaderName: 'Gruppér',
  groupColumn: (name) => `Gruppér efter ${name}`,
  unGroupColumn: (name) => `Fjern gruppéring efter ${name}`,

  // Master/detail
  detailPanelToggle: 'Udvid/kollaps detaljepanel',
  expandDetailPanel: 'Udvid',
  collapseDetailPanel: 'Kollaps',

  // Row reordering text
  rowReorderingHeaderName: 'Omarrangering af rækker',

  // Aggregation
  aggregationMenuItemHeader: 'Aggregation',
  aggregationFunctionLabelSum: 'sum',
  aggregationFunctionLabelAvg: 'gns',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'størrelse',
};

export const daDK: Localization = getGridLocalization(daDKGrid, daDKCore);
