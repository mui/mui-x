import { nlNL as nlNLCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const nlNLGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Geen resultaten.',
  noResultsOverlayLabel: 'Geen resultaten gevonden.',
  errorOverlayDefaultLabel: 'Er deed zich een fout voor.',

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

  // Export selector toolbar button text
  toolbarExport: 'Exporteren',
  toolbarExportLabel: 'Exporteren',
  toolbarExportCSV: 'Exporteer naar CSV',
  toolbarExportPrint: 'Print',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Zoek kolom',
  columnsPanelTextFieldPlaceholder: 'Kolomtitel',
  columnsPanelDragIconLabel: 'Kolom herschikken',
  columnsPanelShowAllButton: 'Alles tonen',
  columnsPanelHideAllButton: 'Alles verbergen',

  // Filter panel text
  filterPanelAddFilter: 'Filter toevoegen',
  filterPanelDeleteIconLabel: 'Verwijderen',
  filterPanelOperators: 'Operatoren',
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

  // Filter values text
  filterValueAny: 'alles',
  filterValueTrue: 'waar',
  filterValueFalse: 'onwaar',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Toon kolommen',
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

  // Total rows footer text
  footerTotalRows: 'Totaal:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} van ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Checkbox selectie',

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
  // groupingColumnHeaderName: 'Group',
  // groupColumn: name => `Group by ${name}`,
  // unGroupColumn: name => `Stop grouping by ${name}`,
};

export const nlNL: Localization = getGridLocalization(nlNLGrid, nlNLCore);
