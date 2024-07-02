import { nnNO as nnNOCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const nnNOGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Ingen rader',
  noResultsOverlayLabel: 'Fann ingen resultat.',

  // Density selector toolbar button text
  toolbarDensity: 'Tettheit',
  toolbarDensityLabel: 'Tettheit',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Komfortabelt',

  // Columns selector toolbar button text
  toolbarColumns: 'Kolonner',
  toolbarColumnsLabel: 'Vel kolonner',

  // Filters toolbar button text
  toolbarFilters: 'Filter',
  toolbarFiltersLabel: 'Vis filter',
  toolbarFiltersTooltipHide: 'Skjul filter',
  toolbarFiltersTooltipShow: 'Vis filter',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive filter` : `${count} aktivt filter`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Søk…',
  toolbarQuickFilterLabel: 'Søk',
  toolbarQuickFilterDeleteIconLabel: 'Slett',

  // Export selector toolbar button text
  toolbarExport: 'Eksporter',
  toolbarExportLabel: 'Eksporter',
  toolbarExportCSV: 'Last ned som CSV',
  toolbarExportPrint: 'Skriv ut',
  toolbarExportExcel: 'Last ned som Excel',

  // Columns management text
  columnsManagementSearchTitle: 'Søk',
  columnsManagementNoColumns: 'Ingen kolonner',
  columnsManagementShowHideAllText: 'Vis/skjul alle',
  columnsManagementReset: 'Nullstill',

  // Filter panel text
  filterPanelAddFilter: 'Legg til filter',
  filterPanelRemoveAll: 'Fjern alle',
  filterPanelDeleteIconLabel: 'Slett',
  filterPanelLogicOperator: 'Logisk operator',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'Og',
  filterPanelOperatorOr: 'Eller',
  filterPanelColumns: 'Kolonner',
  filterPanelInputLabel: 'Verdi',
  filterPanelInputPlaceholder: 'Filter verdi',

  // Filter operators text
  filterOperatorContains: 'inneheld',
  filterOperatorEquals: 'er lik',
  filterOperatorStartsWith: 'startar med',
  filterOperatorEndsWith: 'sluttar med',
  filterOperatorIs: 'er',
  filterOperatorNot: 'er ikkje',
  filterOperatorAfter: 'er etter',
  filterOperatorOnOrAfter: 'er på eller etter',
  filterOperatorBefore: 'er før',
  filterOperatorOnOrBefore: 'er på eller før',
  filterOperatorIsEmpty: 'er tom',
  filterOperatorIsNotEmpty: 'er ikkje tom',
  filterOperatorIsAnyOf: 'er ein av',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Inneheld',
  headerFilterOperatorEquals: 'Lik',
  headerFilterOperatorStartsWith: 'Startar på',
  headerFilterOperatorEndsWith: 'Sluttar på',
  headerFilterOperatorIs: 'Er',
  headerFilterOperatorNot: 'Er ikkje',
  headerFilterOperatorAfter: 'Er etter',
  headerFilterOperatorOnOrAfter: 'Er på eller etter',
  headerFilterOperatorBefore: 'Er før',
  headerFilterOperatorOnOrBefore: 'Er på eller før',
  headerFilterOperatorIsEmpty: 'Er tom',
  headerFilterOperatorIsNotEmpty: 'Er ikkje tom',
  headerFilterOperatorIsAnyOf: 'Er ein av',
  'headerFilterOperator=': 'Lik',
  'headerFilterOperator!=': 'Ikkje lik',
  'headerFilterOperator>': 'Større enn',
  'headerFilterOperator>=': 'Større enn eller lik',
  'headerFilterOperator<': 'Mindre enn',
  'headerFilterOperator<=': 'Mindre enn eller lik',

  // Filter values text
  filterValueAny: 'nokon',
  filterValueTrue: 'sant',
  filterValueFalse: 'usant',

  // Column menu text
  columnMenuLabel: 'Meny',
  columnMenuShowColumns: 'Vis kolonner',
  columnMenuManageColumns: 'Administrer kolonner',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Skjul',
  columnMenuUnsort: 'Usorter',
  columnMenuSortAsc: 'Sorter AUKANDE',
  columnMenuSortDesc: 'Sorter SYNKANDE',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive filter` : `${count} aktivt filter`,
  columnHeaderFiltersLabel: 'Vis filter',
  columnHeaderSortIconLabel: 'Sorter',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `${count.toLocaleString()} rader valt` : `${count.toLocaleString()} rad valt`,

  // Total row amount footer text
  footerTotalRows: 'Totalt tal rader:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} av ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Avmerkingsboks',
  checkboxSelectionSelectAllRows: 'Vel alle rader',
  checkboxSelectionUnselectAllRows: 'Vel vekk alle rader',
  checkboxSelectionSelectRow: 'Vel rad',
  checkboxSelectionUnselectRow: 'Vel vekk rad',

  // Boolean cell text
  booleanCellTrueLabel: 'sant',
  booleanCellFalseLabel: 'usant',

  // Actions cell more text
  actionsCellMore: 'meir',

  // Column pinning text
  pinToLeft: 'Fest til venstre',
  pinToRight: 'Fest til høgre',
  unpin: 'Lausne',

  // Tree Data
  treeDataGroupingHeaderName: 'Grupper',
  treeDataExpand: 'vis barn',
  treeDataCollapse: 'skjul barn',

  // Grouping columns
  groupingColumnHeaderName: 'Grupper',
  groupColumn: (name) => `Grupper på ${name}`,
  unGroupColumn: (name) => `Slutt å grupper på ${name}`,

  // Master/detail
  detailPanelToggle: 'Utvid/kollaps detalj panel',
  expandDetailPanel: 'Utvid',
  collapseDetailPanel: 'Kolaps',

  // Row reordering text
  rowReorderingHeaderName: 'Radreorganisering',

  // Aggregation
  aggregationMenuItemHeader: 'Aggregering',
  aggregationFunctionLabelSum: 'sum',
  aggregationFunctionLabelAvg: 'snitt',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'maks',
  aggregationFunctionLabelSize: 'størrelse',
};

export const nnNO: Localization = getGridLocalization(nnNOGrid, nnNOCore);
