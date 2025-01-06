import { fiFI as fiFICore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const fiFIGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Ei rivejä',
  noResultsOverlayLabel: 'Ei tuloksia.',

  // Density selector toolbar button text
  toolbarDensity: 'Tiiveys',
  toolbarDensityLabel: 'Tiiveys',
  toolbarDensityCompact: 'Kompakti',
  toolbarDensityStandard: 'Vakio',
  toolbarDensityComfortable: 'Mukava',

  // Columns selector toolbar button text
  toolbarColumns: 'Sarakkeet',
  toolbarColumnsLabel: 'Valitse sarakkeet',

  // Filters toolbar button text
  toolbarFilters: 'Suodattimet',
  toolbarFiltersLabel: 'Näytä suodattimet',
  toolbarFiltersTooltipHide: 'Piilota suodattimet',
  toolbarFiltersTooltipShow: 'Näytä suodattimet',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktiivista suodatinta` : `${count} aktiivinen suodatin`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Hae…',
  toolbarQuickFilterLabel: 'Hae',
  toolbarQuickFilterDeleteIconLabel: 'Tyhjennä',

  // Prompt toolbar field
  // toolbarPromptControlPlaceholder: 'Type a prompt…',
  // toolbarPromptControlWithRecordingPlaceholder: 'Type or record a prompt…',
  // toolbarPromptControlRecordingPlaceholder: 'Listening for prompt…',
  // toolbarPromptControlLabel: 'Prompt input',
  // toolbarPromptControlRecordButtonDefaultLabel: 'Record',
  // toolbarPromptControlRecordButtonActiveLabel: 'Stop recording',
  // toolbarPromptControlSendActionLabel: 'Send',
  // toolbarPromptControlSendActionAriaLabel: 'Send prompt',
  // toolbarPromptControlErrorMessage: 'An error occurred while processing the request. Please try again with a different prompt.',

  // Export selector toolbar button text
  toolbarExport: 'Vie',
  toolbarExportLabel: 'Vie',
  toolbarExportCSV: 'Lataa CSV-muodossa',
  toolbarExportPrint: 'Tulosta',
  toolbarExportExcel: 'Lataa Excel-muodossa',

  // Columns management text
  columnsManagementSearchTitle: 'Hae',
  columnsManagementNoColumns: 'Ei sarakkeita näytettäväksi',
  columnsManagementShowHideAllText: 'Näytä/Piilota kaikki',
  columnsManagementReset: 'Palauta',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Lisää suodatin',
  filterPanelRemoveAll: 'Poista kaikki',
  filterPanelDeleteIconLabel: 'Poista',
  filterPanelLogicOperator: 'Logiikkaoperaattori',
  filterPanelOperator: 'Operaattorit',
  filterPanelOperatorAnd: 'Ja',
  filterPanelOperatorOr: 'Tai',
  filterPanelColumns: 'Sarakkeet',
  filterPanelInputLabel: 'Arvo',
  filterPanelInputPlaceholder: 'Suodattimen arvo',

  // Filter operators text
  filterOperatorContains: 'sisältää',
  // filterOperatorDoesNotContain: 'does not contain',
  filterOperatorEquals: 'on yhtä suuri kuin',
  // filterOperatorDoesNotEqual: 'does not equal',
  filterOperatorStartsWith: 'alkaa',
  filterOperatorEndsWith: 'päättyy',
  filterOperatorIs: 'on',
  filterOperatorNot: 'ei ole',
  filterOperatorAfter: 'on jälkeen',
  filterOperatorOnOrAfter: 'on sama tai jälkeen',
  filterOperatorBefore: 'on ennen',
  filterOperatorOnOrBefore: 'on sama tai ennen',
  filterOperatorIsEmpty: 'on tyhjä',
  filterOperatorIsNotEmpty: 'ei ole tyhjä',
  filterOperatorIsAnyOf: 'on mikä tahansa seuraavista',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Sisältää',
  // headerFilterOperatorDoesNotContain: 'Does not contain',
  headerFilterOperatorEquals: 'On yhtä suuri kuin',
  // headerFilterOperatorDoesNotEqual: 'Does not equal',
  headerFilterOperatorStartsWith: 'Alkaa',
  headerFilterOperatorEndsWith: 'Päättyy',
  headerFilterOperatorIs: 'On',
  headerFilterOperatorNot: 'Ei ole',
  headerFilterOperatorAfter: 'On jälkeen',
  headerFilterOperatorOnOrAfter: 'On sama tai jälkeen',
  headerFilterOperatorBefore: 'On ennen',
  headerFilterOperatorOnOrBefore: 'On sama tai ennen',
  headerFilterOperatorIsEmpty: 'On tyhjä',
  headerFilterOperatorIsNotEmpty: 'Ei ole tyhjä',
  headerFilterOperatorIsAnyOf: 'On mikä tahansa seuraavista',
  'headerFilterOperator=': 'On yhtä suuri kuin',
  'headerFilterOperator!=': 'Ei ole yhtä suuri kuin',
  'headerFilterOperator>': 'Enemmän kuin',
  'headerFilterOperator>=': 'Enemmän tai yhtä paljon kuin',
  'headerFilterOperator<': 'Vähemmän kuin',
  'headerFilterOperator<=': 'Vähemmän tai yhtä paljon kuin',

  // Filter values text
  filterValueAny: 'mikä tahansa',
  filterValueTrue: 'tosi',
  filterValueFalse: 'epätosi',

  // Column menu text
  columnMenuLabel: 'Valikko',
  columnMenuShowColumns: 'Näytä sarakkeet',
  columnMenuManageColumns: 'Hallitse sarakkeita',
  columnMenuFilter: 'Suodata',
  columnMenuHideColumn: 'Piilota',
  columnMenuUnsort: 'Poista järjestys',
  columnMenuSortAsc: 'Järjestä nousevasti',
  columnMenuSortDesc: 'Järjestä laskevasti',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktiivista suodatinta` : `${count} aktiivinen suodatin`,
  columnHeaderFiltersLabel: 'Näytä suodattimet',
  columnHeaderSortIconLabel: 'Järjestä',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} riviä valittu`
      : `${count.toLocaleString()} rivi valittu`,

  // Total row amount footer text
  footerTotalRows: 'Rivejä yhteensä:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Valintaruutu',
  checkboxSelectionSelectAllRows: 'Valitse kaikki rivit',
  checkboxSelectionUnselectAllRows: 'Poista kaikkien rivien valinta',
  checkboxSelectionSelectRow: 'Valitse rivi',
  checkboxSelectionUnselectRow: 'Poista rivin valinta',

  // Boolean cell text
  booleanCellTrueLabel: 'tosi',
  booleanCellFalseLabel: 'epätosi',

  // Actions cell more text
  actionsCellMore: 'lisää',

  // Column pinning text
  pinToLeft: 'Kiinnitä vasemmalle',
  pinToRight: 'Kiinnitä oikealle',
  unpin: 'Irrota kiinnitys',

  // Tree Data
  treeDataGroupingHeaderName: 'Ryhmä',
  treeDataExpand: 'Laajenna',
  treeDataCollapse: 'Supista',

  // Grouping columns
  groupingColumnHeaderName: 'Ryhmä',
  groupColumn: (name) => `Ryhmittelyperuste ${name}`,
  unGroupColumn: (name) => `Poista ryhmittelyperuste ${name}`,

  // Master/detail
  detailPanelToggle: 'Yksityiskohtapaneelin vaihto',
  expandDetailPanel: 'Laajenna',
  collapseDetailPanel: 'Tiivistä',

  // Row reordering text
  rowReorderingHeaderName: 'Rivien uudelleenjärjestely',

  // Aggregation
  aggregationMenuItemHeader: 'Koostaminen',
  aggregationFunctionLabelSum: 'summa',
  aggregationFunctionLabelAvg: 'ka.',
  aggregationFunctionLabelMin: 'min.',
  aggregationFunctionLabelMax: 'maks.',
  aggregationFunctionLabelSize: 'koko',
};

export const fiFI: Localization = getGridLocalization(fiFIGrid, fiFICore);
