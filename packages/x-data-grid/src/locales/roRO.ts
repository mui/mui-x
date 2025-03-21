import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const roROGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Lipsă date',
  noResultsOverlayLabel: 'Nu au fost găsite rezultate.',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Înălțime rând',
  toolbarDensityLabel: 'Înălțime rând',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Lat',

  // Columns selector toolbar button text
  toolbarColumns: 'Coloane',
  toolbarColumnsLabel: 'Afișează selecție coloane',

  // Filters toolbar button text
  toolbarFilters: 'Filtru',
  toolbarFiltersLabel: 'Afișează filtru',
  toolbarFiltersTooltipHide: 'Ascunde filtru',
  toolbarFiltersTooltipShow: 'Afișează filtru',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtru activ` : `${count} filtru activ`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Căutare…',
  toolbarQuickFilterLabel: 'Căutare',
  toolbarQuickFilterDeleteIconLabel: 'Ștergere',

  // Prompt toolbar field
  toolbarPromptControlPlaceholder: 'Scrie un prompt…',
  toolbarPromptControlWithRecordingPlaceholder: 'Scrie sau înregistrează un prompt…',
  toolbarPromptControlRecordingPlaceholder: 'Ascultare prompt…',
  toolbarPromptControlLabel: 'Introducere prompt',
  toolbarPromptControlRecordButtonDefaultLabel: 'Înregistrează',
  toolbarPromptControlRecordButtonActiveLabel: 'Oprește înregistrare',
  toolbarPromptControlSendActionLabel: 'Trimite',
  toolbarPromptControlSendActionAriaLabel: 'Trimite prompt',
  toolbarPromptControlErrorMessage:
    'A apărut o eroare la procesare. Încercați din nou cu un alt prompt.',

  // Export selector toolbar button text
  toolbarExport: 'Export',
  toolbarExportLabel: 'Export',
  toolbarExportCSV: 'Download în format CSV',
  toolbarExportPrint: 'Printare',
  toolbarExportExcel: 'Download în format Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Columns management text
  columnsManagementSearchTitle: 'Caută',
  columnsManagementNoColumns: 'Nicio coloană',
  columnsManagementShowHideAllText: 'Arată/Ascunde tot',
  columnsManagementReset: 'Resetează',
  columnsManagementDeleteIconLabel: 'Șterge',

  // Filter panel text
  filterPanelAddFilter: 'Adăugare filtru',
  filterPanelRemoveAll: 'Șterge tot',
  filterPanelDeleteIconLabel: 'Ștergere',
  filterPanelLogicOperator: 'Operatori logici',
  filterPanelOperator: 'Operatori',
  filterPanelOperatorAnd: 'Și',
  filterPanelOperatorOr: 'Sau',
  filterPanelColumns: 'Coloane',
  filterPanelInputLabel: 'Valoare',
  filterPanelInputPlaceholder: 'Filtrare valoare',

  // Filter operators text
  filterOperatorContains: 'conține',
  filterOperatorDoesNotContain: 'nu conține',
  filterOperatorEquals: 'este egal cu',
  filterOperatorDoesNotEqual: 'nu este egal cu',
  filterOperatorStartsWith: 'începe cu',
  filterOperatorEndsWith: 'se termină cu',
  filterOperatorIs: 'este',
  filterOperatorNot: 'nu este',
  filterOperatorAfter: 'este după',
  filterOperatorOnOrAfter: 'este la sau după',
  filterOperatorBefore: 'este înainte de',
  filterOperatorOnOrBefore: 'este la sau înainte de',
  filterOperatorIsEmpty: 'este gol',
  filterOperatorIsNotEmpty: 'nu este gol',
  filterOperatorIsAnyOf: 'este una din valori',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Conține',
  headerFilterOperatorDoesNotContain: 'Nu conține',
  headerFilterOperatorEquals: 'Egal cu',
  headerFilterOperatorDoesNotEqual: 'Nu este egal cu',
  headerFilterOperatorStartsWith: 'Începe cu',
  headerFilterOperatorEndsWith: 'Se termină cu',
  headerFilterOperatorIs: 'Este',
  headerFilterOperatorNot: 'Nu este',
  headerFilterOperatorAfter: 'Este după',
  headerFilterOperatorOnOrAfter: 'Este la sau după',
  headerFilterOperatorBefore: 'Este înainte de',
  headerFilterOperatorOnOrBefore: 'este la sau înainte de',
  headerFilterOperatorIsEmpty: 'Este gol',
  headerFilterOperatorIsNotEmpty: 'Nu este gol',
  headerFilterOperatorIsAnyOf: 'Este una din valori',
  'headerFilterOperator=': 'Egal cu',
  'headerFilterOperator!=': 'Nu este egal cu',
  'headerFilterOperator>': 'Mai mare decât',
  'headerFilterOperator>=': 'Mai mare sau egal cu',
  'headerFilterOperator<': 'Mai mic decât',
  'headerFilterOperator<=': 'Mai mic sau egal cu',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'Aleatoriu',
  filterValueTrue: 'Da',
  filterValueFalse: 'Nu',

  // Column menu text
  columnMenuLabel: 'Meniu',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Afișează toate coloanele',
  columnMenuManageColumns: 'Gestionează coloane',
  columnMenuFilter: 'Filtru',
  columnMenuHideColumn: 'Ascunde',
  columnMenuUnsort: 'Dezactivare sortare',
  columnMenuSortAsc: 'Sortează crescător',
  columnMenuSortDesc: 'Sortează descrescător',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtru activ` : `${count} filtru activ`,
  columnHeaderFiltersLabel: 'Afișează filtru',
  columnHeaderSortIconLabel: 'Sortare',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} Înregistrări selectate`
      : `${count.toLocaleString()} Înregistrare selectată`,

  // Total row amount footer text
  footerTotalRows: 'Total:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} din ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Checkbox Selecție',
  checkboxSelectionSelectAllRows: 'Selectare toate rândurile',
  checkboxSelectionUnselectAllRows: 'Deselectare toate rândurile',
  checkboxSelectionSelectRow: 'Selectare rând',
  checkboxSelectionUnselectRow: 'Deselectare rând',

  // Boolean cell text
  booleanCellTrueLabel: 'Da',
  booleanCellFalseLabel: 'Nu',

  // Actions cell more text
  actionsCellMore: 'Mai multe',

  // Column pinning text
  pinToLeft: 'Fixare în stânga',
  pinToRight: 'Fixare în dreapta',
  unpin: 'Anulare fixare',

  // Tree Data
  treeDataGroupingHeaderName: 'Grup',
  treeDataExpand: 'Afișare copii',
  treeDataCollapse: 'Ascundere copii',

  // Grouping columns
  groupingColumnHeaderName: 'Grupare',
  groupColumn: (name) => `Grupare după ${name}`,
  unGroupColumn: (name) => `Anulare Grupare după ${name}`,

  // Master/detail
  detailPanelToggle: 'Comutare panou detalii',
  expandDetailPanel: 'Extindere',
  collapseDetailPanel: 'Restrângere',

  // Pagination
  paginationRowsPerPage: 'Rânduri pe pagină:',
  // paginationDisplayedRows: ({
  //   from,
  //   to,
  //   count,
  //   estimated
  // }) => {
  //   if (!estimated) {
  //     return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
  //   }
  //   const estimatedLabel = estimated && estimated > to ? `around ${estimated}` : `more than ${to}`;
  //   return `${from}–${to} of ${count !== -1 ? count : estimatedLabel}`;
  // },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Mergi la prima pagină';
    }
    if (type === 'last') {
      return 'Mergi la ultima pagină';
    }
    if (type === 'next') {
      return 'Mergi la pagina următoare';
    }
    // if (type === 'previous') {
    return 'Mergi la pagina precedentă';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Reordonare rânduri',

  // Aggregation
  aggregationMenuItemHeader: 'Agregare',
  aggregationFunctionLabelSum: 'Sumă',
  aggregationFunctionLabelAvg: 'Medie',
  aggregationFunctionLabelMin: 'Minim',
  aggregationFunctionLabelMax: 'Maxim',
  aggregationFunctionLabelSize: 'Numărul elementelor',

  // Pivot panel
  // pivotToggleLabel: 'Pivot',
  // pivotRows: 'Rows',
  // pivotColumns: 'Columns',
  // pivotValues: 'Values',
  // pivotCloseButton: 'Close pivot settings',
  // pivotSearchButton: 'Search fields',
  // pivotSearchControlPlaceholder: 'Search fields',
  // pivotSearchControlLabel: 'Search fields',
  // pivotSearchControlClear: 'Clear search',
  // pivotNoFields: 'No fields',
  // pivotMenuMoveUp: 'Move up',
  // pivotMenuMoveDown: 'Move down',
  // pivotMenuMoveToTop: 'Move to top',
  // pivotMenuMoveToBottom: 'Move to bottom',
  // pivotMenuRows: 'Rows',
  // pivotMenuColumns: 'Columns',
  // pivotMenuValues: 'Values',
  // pivotMenuOptions: 'Field options',
  // pivotMenuAddToRows: 'Add to Rows',
  // pivotMenuAddToColumns: 'Add to Columns',
  // pivotMenuAddToValues: 'Add to Values',
  // pivotMenuRemove: 'Remove',
  // pivotDragToRows: 'Drag here to create rows',
  // pivotDragToColumns: 'Drag here to create columns',
  // pivotDragToValues: 'Drag here to create values',
  // pivotYearColumnHeaderName: '(Year)',
  // pivotQuarterColumnHeaderName: '(Quarter)',
};

export const roRO: Localization = getGridLocalization(roROGrid);
