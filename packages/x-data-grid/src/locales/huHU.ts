import { huHU as huHUCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const huHUGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Nincsenek sorok',
  noResultsOverlayLabel: 'Nincs találat.',

  // Density selector toolbar button text
  toolbarDensity: 'Sormagasság',
  toolbarDensityLabel: 'Sormagasság',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Normál',
  toolbarDensityComfortable: 'Kényelmes',

  // Columns selector toolbar button text
  toolbarColumns: 'Oszlopok',
  toolbarColumnsLabel: 'Oszlopok kiválasztása',

  // Filters toolbar button text
  toolbarFilters: 'Szűrők',
  toolbarFiltersLabel: 'Szűrők megjelenítése',
  toolbarFiltersTooltipHide: 'Szűrők elrejtése',
  toolbarFiltersTooltipShow: 'Szűrők megjelenítése',
  toolbarFiltersTooltipActive: (count) => `${count} aktív szűrő`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Keresés…',
  toolbarQuickFilterLabel: 'Keresés',
  toolbarQuickFilterDeleteIconLabel: 'Törlés',

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
  toolbarExport: 'Exportálás',
  toolbarExportLabel: 'Exportálás',
  toolbarExportCSV: 'Mentés CSV fájlként',
  toolbarExportPrint: 'Nyomtatás',
  toolbarExportExcel: 'Mentés Excel fájlként',

  // Columns management text
  columnsManagementSearchTitle: 'Keresés',
  columnsManagementNoColumns: 'Nincsenek oszlopok',
  columnsManagementShowHideAllText: 'Összes',
  columnsManagementReset: 'Visszavon',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Szűrő hozzáadása',
  filterPanelRemoveAll: 'Összes törlése',
  filterPanelDeleteIconLabel: 'Törlés',
  filterPanelLogicOperator: 'Logikai operátor',
  filterPanelOperator: 'Operátorok',
  filterPanelOperatorAnd: 'És',
  filterPanelOperatorOr: 'Vagy',
  filterPanelColumns: 'Oszlopok',
  filterPanelInputLabel: 'Érték',
  filterPanelInputPlaceholder: 'Érték szűrése',

  // Filter operators text
  filterOperatorContains: 'tartalmazza:',
  // filterOperatorDoesNotContain: 'does not contain',
  filterOperatorEquals: 'egyenlő ezzel:',
  // filterOperatorDoesNotEqual: 'does not equal',
  filterOperatorStartsWith: 'ezzel kezdődik:',
  filterOperatorEndsWith: 'ezzel végződik:',
  filterOperatorIs: 'a következő:',
  filterOperatorNot: 'nem a következő:',
  filterOperatorAfter: 'ezutáni:',
  filterOperatorOnOrAfter: 'ekkori vagy ezutáni:',
  filterOperatorBefore: 'ezelőtti:',
  filterOperatorOnOrBefore: 'ekkori vagy ezelőtti:',
  filterOperatorIsEmpty: 'üres',
  filterOperatorIsNotEmpty: 'nem üres',
  filterOperatorIsAnyOf: 'a következők egyike:',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Tartalmazza:',
  // headerFilterOperatorDoesNotContain: 'Does not contain',
  headerFilterOperatorEquals: 'Egyenlő ezzel:',
  // headerFilterOperatorDoesNotEqual: 'Does not equal',
  headerFilterOperatorStartsWith: 'Ezzel kezdődik:',
  headerFilterOperatorEndsWith: 'Ezzel végződik:',
  // headerFilterOperatorIs: 'Is',
  // headerFilterOperatorNot: 'Is not',
  headerFilterOperatorAfter: 'Ezutáni:',
  headerFilterOperatorOnOrAfter: 'Ekkori vagy ezutáni:',
  headerFilterOperatorBefore: 'Ezelőtti:',
  headerFilterOperatorOnOrBefore: 'Ekkori vagy ezelőtti:',
  headerFilterOperatorIsEmpty: 'Üres',
  headerFilterOperatorIsNotEmpty: 'Nem üres',
  headerFilterOperatorIsAnyOf: 'A következők egyike:',
  'headerFilterOperator=': 'Egyenlő',
  'headerFilterOperator!=': 'Nem egyenlő',
  'headerFilterOperator>': 'Nagyobb mint',
  'headerFilterOperator>=': 'Nagyobb vagy egyenlő',
  'headerFilterOperator<': 'Kisebb mint',
  'headerFilterOperator<=': 'Kisebb vagy egyenlő',

  // Filter values text
  filterValueAny: 'bármilyen',
  filterValueTrue: 'igaz',
  filterValueFalse: 'hamis',

  // Column menu text
  columnMenuLabel: 'Menü',
  columnMenuShowColumns: 'Oszlopok megjelenítése',
  columnMenuManageColumns: 'Oszlopok kezelése',
  columnMenuFilter: 'Szűrők',
  columnMenuHideColumn: 'Elrejtés',
  columnMenuUnsort: 'Sorrend visszaállítása',
  columnMenuSortAsc: 'Növekvő sorrendbe',
  columnMenuSortDesc: 'Csökkenő sorrendbe',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} aktív szűrő`,
  columnHeaderFiltersLabel: 'Szűrők megjelenítése',
  columnHeaderSortIconLabel: 'Átrendezés',

  // Rows selected footer text
  footerRowSelected: (count) => `${count.toLocaleString()} sor kiválasztva`,

  // Total row amount footer text
  footerTotalRows: 'Összesen:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} (összesen: ${totalCount.toLocaleString()})`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Jelölőnégyzetes kijelölés',
  checkboxSelectionSelectAllRows: 'Minden sor kijelölése',
  checkboxSelectionUnselectAllRows: 'Minden sor kijelölésének törlése',
  checkboxSelectionSelectRow: 'Sor kijelölése',
  checkboxSelectionUnselectRow: 'Sor kijelölésének törlése',

  // Boolean cell text
  booleanCellTrueLabel: 'igen',
  booleanCellFalseLabel: 'nem',

  // Actions cell more text
  actionsCellMore: 'további',

  // Column pinning text
  pinToLeft: 'Rögzítés balra',
  pinToRight: 'Rögzítés jobbra',
  unpin: 'Rögzítés törlése',

  // Tree Data
  treeDataGroupingHeaderName: 'Csoport',
  treeDataExpand: 'gyermekek megjelenítése',
  treeDataCollapse: 'gyermekek elrejtése',

  // Grouping columns
  groupingColumnHeaderName: 'Csoportosítás',
  groupColumn: (name) => `Csoportosítás ${name} szerint`,
  unGroupColumn: (name) => `${name} szerinti csoportosítás törlése`,

  // Master/detail
  detailPanelToggle: 'Részletek panel váltása',
  expandDetailPanel: 'Kibontás',
  collapseDetailPanel: 'Összecsukás',

  // Row reordering text
  rowReorderingHeaderName: 'Sorok újrarendezése',

  // Aggregation
  aggregationMenuItemHeader: 'Összesítés',
  aggregationFunctionLabelSum: 'Összeg',
  aggregationFunctionLabelAvg: 'Átlag',
  aggregationFunctionLabelMin: 'Minimum',
  aggregationFunctionLabelMax: 'Maximum',
  aggregationFunctionLabelSize: 'Darabszám',
};

export const huHU: Localization = getGridLocalization(huHUGrid, huHUCore);
