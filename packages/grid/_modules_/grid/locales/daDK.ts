import { daDK as daDKCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const daDKGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Ingen rækker',
  noResultsOverlayLabel: 'Ingen resultater',
  errorOverlayDefaultLabel: 'Der skete en fejl.',

  // Density selector toolbar button text
  // toolbarDensity: 'Density',
  toolbarDensityLabel: 'Tæthed',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Luftig',

  // Columns selector toolbar button text
  toolbarColumns: 'Kolonne',
  toolbarColumnsLabel: 'Vælg kolonne',

  // Filters toolbar button text
  // toolbarFilters: 'Filters',
  toolbarFiltersLabel: 'Vis filtre',
  toolbarFiltersTooltipHide: 'Skjul filtre',
  toolbarFiltersTooltipShow: 'Vis filtre',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive filtre` : `${count} aktivt filter`,

  // Export selector toolbar button text
  // toolbarExport: 'Export',
  toolbarExportLabel: 'Eksporter',
  toolbarExportCSV: 'Download som CSV',
  // toolbarExportPrint: 'Print',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Find kolonne',
  columnsPanelTextFieldPlaceholder: 'Kolonne titel',
  columnsPanelDragIconLabel: 'Reorder kolonne',
  columnsPanelShowAllButton: 'Vis alle',
  columnsPanelHideAllButton: 'Skjul alle',

  // Filter panel text
  filterPanelAddFilter: 'Tilføj filter',
  filterPanelDeleteIconLabel: 'Slet',
  filterPanelOperators: 'Operatorer',
  // filterPanelOperatorAnd: 'And',
  // filterPanelOperatorOr: 'Or',
  filterPanelColumns: 'Kolonne',
  filterPanelInputLabel: 'Værdi',
  filterPanelInputPlaceholder: 'Filter værdi',

  // Filter operators text
  filterOperatorContains: 'Indeholder',
  filterOperatorEquals: 'Lig med',
  filterOperatorStartsWith: 'Begynder med',
  filterOperatorEndsWith: 'Ender med',
  filterOperatorIs: 'På',
  filterOperatorNot: 'Ikke på',
  filterOperatorAfter: 'Efter',
  filterOperatorOnOrAfter: 'På eller efter',
  filterOperatorBefore: 'Før',
  filterOperatorOnOrBefore: 'På eller før',
  filterOperatorIsEmpty: 'Indeholder data',
  filterOperatorIsNotEmpty: 'Indeholder ikke data',
  // filterOperatorIsAnyOf: 'is any of',

  // Filter values text
  // filterValueAny: 'any',
  // filterValueTrue: 'true',
  // filterValueFalse: 'false',

  // Column menu text
  // columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Vis Kolonner',
  // columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Skjul',
  columnMenuUnsort: 'Fjern sortering',
  columnMenuSortAsc: 'Sorter stigende',
  columnMenuSortDesc: 'Sorter faldende',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive filtre` : `${count} aktivt filter`,
  columnHeaderFiltersLabel: 'Vis filtre',
  columnHeaderSortIconLabel: 'Sorter',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} rækker valgt`
      : `${count.toLocaleString()} række valgt`,

  // Total rows footer text
  footerTotalRows: 'Totale rækker:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} af ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Afkrydsningsvalg',

  // Boolean cell text
  // booleanCellTrueLabel: 'true',
  // booleanCellFalseLabel: 'false',

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
  // groupingColumnHeaderName: 'Group',
  // groupColumn: name => `Group by ${name}`,
  // unGroupColumn: name => `Stop grouping by ${name}`,
};

export const daDK: Localization = getGridLocalization(daDKGrid, daDKCore);
