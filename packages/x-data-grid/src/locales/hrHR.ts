import { hrHR as hrHRCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization } from '../utils/getGridLocalization';

const hrHRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Nema redova',
  noResultsOverlayLabel: 'Nema rezultata.',

  // Density selector toolbar button text
  toolbarDensity: 'Gustoća',
  toolbarDensityLabel: 'Gustoća',
  toolbarDensityCompact: 'Kompaktno',
  toolbarDensityStandard: 'Standardno',
  toolbarDensityComfortable: 'Udobno',

  // Columns selector toolbar button text
  toolbarColumns: 'Stupci',
  toolbarColumnsLabel: 'Odaberite stupce',

  // Filters toolbar button text
  toolbarFilters: 'Filteri',
  toolbarFiltersLabel: 'Prikaži filtere',
  toolbarFiltersTooltipHide: 'Sakrij filtere',
  toolbarFiltersTooltipShow: 'Prikaži filtere',
  toolbarFiltersTooltipActive: (count) => {
    if (count === 1) {
      return `${count} aktivan filter`;
    }
    if (count < 5) {
      return `${count} aktivna filtera`;
    }
    return `${count} aktivnih filtera`;
  },

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Traži…',
  toolbarQuickFilterLabel: 'traži',
  toolbarQuickFilterDeleteIconLabel: 'Obriši',

  // Prompt toolbar field
  // toolbarPromptControlPlaceholder: 'Type a prompt…',
  // toolbarPromptControlWithRecordingPlaceholder: 'Type or record a prompt…',
  // toolbarPromptControlRecordingPlaceholder: 'Listening for prompt…',
  // toolbarPromptControlLabel: 'Prompt input',
  // toolbarPromptControlDeleteIconLabel: 'Clear',
  // toolbarPromptControlRecordButtonDefaultLabel: 'Record',
  // toolbarPromptControlRecordButtonActiveLabel: 'Stop recording',
  // toolbarPromptControlSendActionLabel: 'Send',
  // toolbarPromptControlSendActionAriaLabel: 'Send prompt',
  // toolbarPromptControlErrorMessage: 'An error occurred while processing the request. Please try again with a different prompt.',

  // Export selector toolbar button text
  toolbarExport: 'Izvoz',
  toolbarExportLabel: 'Izvoz',
  toolbarExportCSV: 'Preuzmi kao CSV',
  toolbarExportPrint: 'Štampaj',
  toolbarExportExcel: 'Preuzmi kao Excel',

  // Columns management text
  columnsManagementSearchTitle: 'Traži',
  columnsManagementNoColumns: 'Nema stupaca',
  columnsManagementShowHideAllText: 'Prikaži/Sakrij sve',
  columnsManagementReset: 'Ponovno namjesti',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Dodaj filter',
  filterPanelRemoveAll: 'Ukloni sve',
  filterPanelDeleteIconLabel: 'Obriši',
  filterPanelLogicOperator: 'Logički operator',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'I',
  filterPanelOperatorOr: 'Ili',
  filterPanelColumns: 'Stupac',
  filterPanelInputLabel: 'Vrijednost',
  filterPanelInputPlaceholder: 'Vrijednost filtera',

  // Filter operators text
  filterOperatorContains: 'sadrži',
  filterOperatorDoesNotContain: 'ne sadrži',
  filterOperatorEquals: 'je jednak',
  filterOperatorDoesNotEqual: 'nije jednak',
  filterOperatorStartsWith: 'počinje sa',
  filterOperatorEndsWith: 'završava sa',
  filterOperatorIs: 'je',
  filterOperatorNot: 'nije',
  filterOperatorAfter: 'je poslije',
  filterOperatorOnOrAfter: 'je na ili poslije',
  filterOperatorBefore: 'je prije',
  filterOperatorOnOrBefore: 'je na ili prije',
  filterOperatorIsEmpty: 'je prazno',
  filterOperatorIsNotEmpty: 'nije prazno',
  filterOperatorIsAnyOf: 'je bilo koji od',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Sadrži',
  headerFilterOperatorDoesNotContain: 'Ne sadrži',
  headerFilterOperatorEquals: 'Jednako',
  headerFilterOperatorDoesNotEqual: 'Nije jednako',
  headerFilterOperatorStartsWith: 'Počinje sa',
  headerFilterOperatorEndsWith: 'Završava sa',
  headerFilterOperatorIs: 'Je',
  headerFilterOperatorNot: 'Nije',
  headerFilterOperatorAfter: 'Je poslije',
  headerFilterOperatorOnOrAfter: 'Je uključeno ili poslije',
  headerFilterOperatorBefore: 'Je prije',
  headerFilterOperatorOnOrBefore: 'Je uključeno ili prije',
  headerFilterOperatorIsEmpty: 'Je prazno',
  headerFilterOperatorIsNotEmpty: 'Nije prazno',
  headerFilterOperatorIsAnyOf: 'Je bilo koji od',
  'headerFilterOperator=': 'Jednako',
  'headerFilterOperator!=': 'Nije jednako',
  'headerFilterOperator>': 'Veći od',
  'headerFilterOperator>=': 'Veće ili jednako',
  'headerFilterOperator<': 'Manje od',
  'headerFilterOperator<=': 'Manje od ili jednako',

  // Filter values text
  filterValueAny: 'bilo koji',
  filterValueTrue: 'tačno',
  filterValueFalse: 'netačno',

  // Column menu text
  columnMenuLabel: 'Izbornik',
  columnMenuShowColumns: 'Prikaži stupce',
  columnMenuManageColumns: 'Upravljanje stupcima',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Sakrij stupac',
  columnMenuUnsort: 'Poništi sortiranje',
  columnMenuSortAsc: 'Poredaj uzlazno',
  columnMenuSortDesc: 'Poredaj silazno',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => {
    if (count === 1) {
      return `${count} aktivan filter`;
    }
    if (count < 5) {
      return `${count} aktivna filtera`;
    }
    return `${count} aktivnih filtera`;
  },
  columnHeaderFiltersLabel: 'Prikaži filtere',
  columnHeaderSortIconLabel: 'Poredaj',

  // Rows selected footer text
  footerRowSelected: (count) => {
    if (count === 1) {
      return `Odabran je ${count.toLocaleString()} redak`;
    }
    if (count < 5) {
      return `Odabrana su ${count.toLocaleString()} retka`;
    }
    return `Odabrano je ${count.toLocaleString()} redaka`;
  },

  // Total row amount footer text
  footerTotalRows: 'Ukupno redaka:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} od ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Odabir redaka',
  checkboxSelectionSelectAllRows: 'Odaberite sve retke',
  checkboxSelectionUnselectAllRows: 'Poništi odabir svih redaka',
  checkboxSelectionSelectRow: 'Odaberite redak',
  checkboxSelectionUnselectRow: 'Poništi odabir retka',

  // Boolean cell text
  booleanCellTrueLabel: 'Da',
  booleanCellFalseLabel: 'Ne',

  // Actions cell more text
  actionsCellMore: 'više',

  // Column pinning text
  pinToLeft: 'Prikvači lijevo',
  pinToRight: 'Prikvači desno',
  unpin: 'Otkvači',

  // Tree Data
  treeDataGroupingHeaderName: 'Skupina',
  treeDataExpand: 'vidjeti djecu',
  treeDataCollapse: 'sakriti djecu',

  // Grouping columns
  groupingColumnHeaderName: 'Skupina',
  groupColumn: (name) => `Grupiraj prema ${name}`,
  unGroupColumn: (name) => `Zaustavi grupiranje prema ${name}`,

  // Master/detail
  detailPanelToggle: 'Prebacivanje ploče s detaljima',
  expandDetailPanel: 'Proširiti',
  collapseDetailPanel: 'Skupiti',

  // Row reordering text
  rowReorderingHeaderName: 'Promjena redoslijeda',

  // Aggregation
  aggregationMenuItemHeader: 'Agregacija',
  aggregationFunctionLabelSum: 'iznos',
  aggregationFunctionLabelAvg: 'prosj',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'veličina',
};

export const hrHR = getGridLocalization(hrHRGrid, hrHRCore);
