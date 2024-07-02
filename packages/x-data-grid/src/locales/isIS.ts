import { isIS as isISCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const isISGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Engar raðir',
  noResultsOverlayLabel: 'Engar niðurstöður',

  // Density selector toolbar button text
  toolbarDensity: 'Þéttleiki',
  toolbarDensityLabel: 'Þéttleiki',
  toolbarDensityCompact: 'Þétt',
  toolbarDensityStandard: 'Staðlað',
  toolbarDensityComfortable: 'Rúmlegt',

  // Columns selector toolbar button text
  toolbarColumns: 'Dálkar',
  toolbarColumnsLabel: 'Veldu dálka',

  // Filters toolbar button text
  toolbarFilters: 'Sía',
  toolbarFiltersLabel: 'Sjá síur',
  toolbarFiltersTooltipHide: 'Fela síur',
  toolbarFiltersTooltipShow: 'Sjá síur',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} virk sía` : `${count} virkar síur`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Leita…',
  toolbarQuickFilterLabel: 'Leita',
  toolbarQuickFilterDeleteIconLabel: 'Eyða',

  // Export selector toolbar button text
  toolbarExport: 'Flytja út',
  toolbarExportLabel: 'Flytja út',
  toolbarExportCSV: 'Hlaða niður sem CSV',
  toolbarExportPrint: 'Prenta',
  toolbarExportExcel: 'Hlaða niður sem Excel',

  // Columns management text
  // columnsManagementSearchTitle: 'Search',
  // columnsManagementNoColumns: 'No columns',
  // columnsManagementShowHideAllText: 'Show/Hide All',
  // columnsManagementReset: 'Reset',

  // Filter panel text
  filterPanelAddFilter: 'Bæta síu',
  filterPanelRemoveAll: 'Fjarlægja alla',
  filterPanelDeleteIconLabel: 'Eyða',
  filterPanelLogicOperator: 'Rökvirkir',
  filterPanelOperator: 'Virkir',
  filterPanelOperatorAnd: 'Og',
  filterPanelOperatorOr: 'Eða',
  filterPanelColumns: 'Dálkar',
  filterPanelInputLabel: 'Gildi',
  filterPanelInputPlaceholder: 'Síu gildi',

  // Filter operators text
  filterOperatorContains: 'inniheldur',
  filterOperatorEquals: 'jafnt og',
  filterOperatorStartsWith: 'byrjar með',
  filterOperatorEndsWith: 'endar með',
  filterOperatorIs: 'er líka með',
  filterOperatorNot: 'er ekki líka með',
  filterOperatorAfter: 'eftir',
  filterOperatorOnOrAfter: 'á eða eftir',
  filterOperatorBefore: 'fyrir',
  filterOperatorOnOrBefore: 'á eða fyrir',
  filterOperatorIsEmpty: 'inniheldur ekki gögn',
  filterOperatorIsNotEmpty: 'inniheldur gögn',
  filterOperatorIsAnyOf: 'inniheldur einn af',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Inniheldur',
  headerFilterOperatorEquals: 'Jafnt og',
  headerFilterOperatorStartsWith: 'Byrjar með',
  headerFilterOperatorEndsWith: 'Endar með',
  headerFilterOperatorIs: 'Er jafnt og',
  headerFilterOperatorNot: 'Er ekki jafnt og',
  headerFilterOperatorAfter: 'Eftir',
  headerFilterOperatorOnOrAfter: 'Á eða eftir',
  headerFilterOperatorBefore: 'Fyrir',
  headerFilterOperatorOnOrBefore: 'Á eða fyrir',
  headerFilterOperatorIsEmpty: 'Inniheldur ekki gögn',
  headerFilterOperatorIsNotEmpty: 'Inniheldur gögn',
  headerFilterOperatorIsAnyOf: 'Inniheldur einn af',
  'headerFilterOperator=': 'Jafnt og',
  'headerFilterOperator!=': 'Ekki jafnt og',
  'headerFilterOperator>': 'Stærra en',
  'headerFilterOperator>=': 'Stærra en eða jafnt og',
  'headerFilterOperator<': 'Minna en',
  'headerFilterOperator<=': 'Minna en eða jafnt og',

  // Filter values text
  filterValueAny: 'hvað sem er',
  filterValueTrue: 'satt',
  filterValueFalse: 'falskt',

  // Column menu text
  columnMenuLabel: 'Valmynd',
  columnMenuShowColumns: 'Sýna dálka',
  columnMenuManageColumns: 'Stjórna dálkum',
  columnMenuFilter: 'Síur',
  columnMenuHideColumn: 'Fela dálka',
  columnMenuUnsort: 'Fjarlægja röðun',
  columnMenuSortAsc: 'Raða hækkandi',
  columnMenuSortDesc: 'Raða lækkandi',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} virkar síur` : `Ein virk sía`,
  columnHeaderFiltersLabel: 'Sýna síur',
  columnHeaderSortIconLabel: 'Raða',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1 ? `${count.toLocaleString()} raðir valdar` : `Ein röð valin`,

  // Total row amount footer text
  footerTotalRows: 'Heildarfjöldi lína:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} af ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Val á gátreit',
  checkboxSelectionSelectAllRows: 'Velja allar raðir',
  checkboxSelectionUnselectAllRows: 'Afvelja allar raðir',
  checkboxSelectionSelectRow: 'Velja röð',
  checkboxSelectionUnselectRow: 'Afvelja röð',

  // Boolean cell text
  booleanCellTrueLabel: 'já',
  booleanCellFalseLabel: 'nei',

  // Actions cell more text
  actionsCellMore: 'meira',

  // Column pinning text
  pinToLeft: 'Festa til vinstri',
  pinToRight: 'Festa til hægri',
  unpin: 'Losa um',

  // Tree Data
  treeDataGroupingHeaderName: 'Hópur',
  treeDataExpand: 'Sýna undirliði',
  treeDataCollapse: 'Fela undirliði',

  // Grouping columns
  groupingColumnHeaderName: 'Hópur',
  groupColumn: (name) => `Hópa eftir ${name}`,
  unGroupColumn: (name) => `Fjarlægja hópun eftir ${name}`,

  // Master/detail
  detailPanelToggle: 'Stækka/minnka smáatriðaspjald',
  expandDetailPanel: 'Stækka',
  collapseDetailPanel: 'Minnka',

  // Row reordering text
  rowReorderingHeaderName: 'Endurröðun raða',

  // Aggregation
  aggregationMenuItemHeader: 'Samsafn',
  aggregationFunctionLabelSum: 'sum',
  aggregationFunctionLabelAvg: 'avg',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'stærð',
};

export const isIS: Localization = getGridLocalization(isISGrid, isISCore);
