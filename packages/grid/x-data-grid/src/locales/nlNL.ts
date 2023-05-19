import { nlNL as nlNLCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const nlNLGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Geen resultaten.',
  noResultsOverlayLabel: 'Geen resultaten gevonden.',

  // Density selector toolbar button text
  toolbarDensity: 'Grootte',
  toolbarDensityLabel: 'Grootte',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Normaal',
  toolbarDensityComfortable: 'Breed',

  // Columns selector toolbar button text
  toolbarColumns: 'Kolommen',
  toolbarColumnsLabel: 'Kies kolommen',

  // Filters toolbar button text
  toolbarFilters: 'Filters',
  toolbarFiltersLabel: 'Toon filters',
  toolbarFiltersTooltipHide: 'Verberg filters',
  toolbarFiltersTooltipShow: 'Toon filters',
  toolbarFiltersTooltipActive: (count) =>
    count > 1 ? `${count} actieve filters` : `${count} filter actief`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Zoeken…',
  toolbarQuickFilterLabel: 'Zoeken',
  toolbarQuickFilterDeleteIconLabel: 'Wissen',

  // Export selector toolbar button text
  toolbarExport: 'Exporteren',
  toolbarExportLabel: 'Exporteren',
  toolbarExportCSV: 'Exporteer naar CSV',
  toolbarExportPrint: 'Print',
  toolbarExportExcel: 'Downloaden als Excel-bestand',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Zoek kolom',
  columnsPanelTextFieldPlaceholder: 'Kolomtitel',
  columnsPanelDragIconLabel: 'Kolom herschikken',
  columnsPanelShowAllButton: 'Alles tonen',
  columnsPanelHideAllButton: 'Alles verbergen',

  // Filter panel text
  filterPanelAddFilter: 'Filter toevoegen',
  filterPanelRemoveAll: 'Alles verwijderen',
  filterPanelDeleteIconLabel: 'Verwijderen',
  filterPanelLogicOperator: 'Logische operator',
  filterPanelOperator: 'Operatoren',
  filterPanelOperatorAnd: 'En',
  filterPanelOperatorOr: 'Of',
  filterPanelColumns: 'Kolommen',
  filterPanelInputLabel: 'Waarde',
  filterPanelInputPlaceholder: 'Filter waarde',

  // Filter operators text
  filterOperatorContains: 'bevat',
  filterOperatorEquals: 'gelijk aan',
  filterOperatorStartsWith: 'begint met',
  filterOperatorEndsWith: 'eindigt met',
  filterOperatorIs: 'is',
  filterOperatorNot: 'is niet',
  filterOperatorAfter: 'is na',
  filterOperatorOnOrAfter: 'is gelijk of er na',
  filterOperatorBefore: 'is voor',
  filterOperatorOnOrBefore: 'is gelijk of er voor',
  filterOperatorIsEmpty: 'is leeg',
  filterOperatorIsNotEmpty: 'is niet leeg',
  filterOperatorIsAnyOf: 'is een van',
  // filterOperator=: '=',
  // filterOperator!=: '!=',
  // filterOperator>: '>',
  // filterOperator>=: '>=',
  // filterOperator<: '<',
  // filterOperator<=: '<=',

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
  // headerFilterOperator=: 'Equals',
  // headerFilterOperator!=: 'Not equals',
  // headerFilterOperator>: 'Is greater than',
  // headerFilterOperator>=: 'Is greater than or equal to',
  // headerFilterOperator<: 'Is less than',
  // headerFilterOperator<=: 'Is less than or equal to',

  // Filter values text
  filterValueAny: 'alles',
  filterValueTrue: 'waar',
  filterValueFalse: 'onwaar',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Toon kolommen',
  columnMenuManageColumns: 'Kolommen beheren',
  columnMenuFilter: 'Filteren',
  columnMenuHideColumn: 'Verbergen',
  columnMenuUnsort: 'Annuleer sortering',
  columnMenuSortAsc: 'Oplopend sorteren',
  columnMenuSortDesc: 'Aflopend sorteren',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} actieve filters` : `${count} filter actief`,
  columnHeaderFiltersLabel: 'Toon filters',
  columnHeaderSortIconLabel: 'Sorteren',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count > 1
      ? `${count.toLocaleString()} rijen geselecteerd`
      : `${count.toLocaleString()} rij geselecteerd`,

  // Total row amount footer text
  footerTotalRows: 'Totaal:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} van ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Checkbox selectie',
  checkboxSelectionSelectAllRows: 'Alle rijen selecteren',
  checkboxSelectionUnselectAllRows: 'Alle rijen de-selecteren',
  checkboxSelectionSelectRow: 'Rij selecteren',
  checkboxSelectionUnselectRow: 'Rij de-selecteren',

  // Boolean cell text
  booleanCellTrueLabel: 'waar',
  booleanCellFalseLabel: 'onwaar',

  // Actions cell more text
  actionsCellMore: 'meer',

  // Column pinning text
  pinToLeft: 'Links vastzetten',
  pinToRight: 'Rechts vastzetten',
  unpin: 'Losmaken',

  // Tree Data
  treeDataGroupingHeaderName: 'Groep',
  treeDataExpand: 'Uitvouwen',
  treeDataCollapse: 'Inklappen',

  // Grouping columns
  groupingColumnHeaderName: 'Groep',
  groupColumn: (name) => `Groepeer op ${name}`,
  unGroupColumn: (name) => `Stop groeperen op ${name}`,

  // Master/detail
  detailPanelToggle: 'Detailmenu in- of uitklappen',
  expandDetailPanel: 'Uitklappen',
  collapseDetailPanel: 'Inklappen',

  // Row reordering text
  rowReorderingHeaderName: 'Rijen hersorteren',

  // Aggregation
  aggregationMenuItemHeader: 'Aggregatie',
  aggregationFunctionLabelSum: 'som',
  aggregationFunctionLabelAvg: 'gem',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'grootte',
};

export const nlNL: Localization = getGridLocalization(nlNLGrid, nlNLCore);
