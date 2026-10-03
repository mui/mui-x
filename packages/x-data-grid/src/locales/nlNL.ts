import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization } from '../utils/getGridLocalization';
import type { Localization } from '../utils/getGridLocalization';

const nlNLGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Geen resultaten.',
  noResultsOverlayLabel: 'Geen resultaten gevonden.',
  noColumnsOverlayLabel: 'Geen kolommen',
  noColumnsOverlayManageColumns: 'Kolommen beheren',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',

  // Density selector toolbar button text
  toolbarDensity: 'Grootte',
  toolbarDensityLabel: 'Grootte',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Normaal',
  toolbarDensityComfortable: 'Breed',

  // Undo/redo toolbar button text
  toolbarUndo: 'Ongedaan maken',
  toolbarRedo: 'Opnieuw',

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

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Toolbar charts button
  // toolbarCharts: 'Charts',

  // Toolbar AI Assistant button
  // toolbarAssistant: 'AI Assistant',

  // Formula bar (Premium formulas)
  // formulaBarLabel: 'Formula bar',
  // formulaBarInputLabel: 'Formula',
  // formulaBarAddressLabel: 'Active cell',

  // Computed columns (Premium)
  // columnMenuAddComputedColumn: 'Add computed column',
  // columnMenuEditComputedColumn: 'Edit computed column',
  // columnMenuRemoveComputedColumn: 'Remove computed column',
  // toolbarComputedColumns: 'Computed columns',
  // computedColumnsPanelTitle: 'Computed columns',
  // computedColumnsPanelCloseButton: 'Close computed columns panel',
  // computedColumnsPanelBackButton: 'Back to the list',
  // computedColumnsPanelEmpty: 'No computed columns yet',
  // computedColumnsPanelAddButton: 'Add computed column',
  // computedColumnsPanelItemMenuLabel: 'Computed column actions',
  // computedColumnEditorNewTitle: 'New computed column',
  // computedColumnEditorEditTitle: 'Edit computed column',
  // computedColumnNameLabel: 'Name',
  // computedColumnFieldLabel: 'Field',
  // computedColumnFormulaLabel: 'Formula',
  // computedColumnTypeLabel: 'Result type',
  // computedColumnTypeNumber: 'Number',
  // computedColumnTypeString: 'Text',
  // computedColumnTypeBoolean: 'Boolean',
  // computedColumnTypeDate: 'Date',
  // computedColumnTypeDateTime: 'Date and time',
  // computedColumnFormatLabel: 'Format',
  // computedColumnFormatStyleDecimal: 'Number',
  // computedColumnFormatStylePercent: 'Percent',
  // computedColumnFormatStyleCurrency: 'Currency',
  // computedColumnFormatCurrencyLabel: 'Currency code',
  // computedColumnFormatDecimalsLabel: 'Decimals',
  // computedColumnFormatGroupingLabel: 'Thousands separator',
  // computedColumnPreviewLabel: 'Preview',
  // computedColumnPreviewRow: rowIndex => `Row ${rowIndex}`,
  // computedColumnPreviewNoRows: 'No rows to preview',
  // computedColumnReferenceTitle: 'Insert',
  // computedColumnReferenceColumns: 'Columns',
  // computedColumnReferenceFunctions: 'Functions',
  // computedColumnReferenceSearchPlaceholder: 'Search',
  // computedColumnReferenceNoResults: 'No matches',
  // computedColumnApplyButton: 'Apply',
  // computedColumnAddButton: 'Add column',
  // computedColumnCancelButton: 'Cancel',
  // computedColumnDeleteButton: 'Delete column',
  // computedColumnHeaderLabel: 'Computed column',
  // computedColumnHeaderInvalidLabel: 'Computed column with an invalid formula',
  // computedColumnErrorNameRequired: 'Enter a name.',
  // computedColumnErrorFieldRequired: 'Enter a field name.',
  // computedColumnErrorFieldInvalid: 'Use letters, digits and underscores, starting with a letter or an underscore.',
  // computedColumnErrorFieldExists: field => `A column with the field "${field}" already exists.`,
  // computedColumnErrorFieldA1Like: 'This field name reads as a cell address. Choose a longer name.',
  // computedColumnErrorFormulaRequired: 'Enter a formula.',
  // computedColumnErrorParse: message => `Formula error: ${message}`,
  // computedColumnErrorUnknownFunction: name => `Unknown function ${name}.`,
  // computedColumnErrorUnsupportedReference: 'Computed columns can only reference columns of the same row. Use bare field names.',
  // computedColumnErrorUnknownField: field => `Column "${field}" does not exist.`,
  // computedColumnErrorSelfReference: 'A computed column cannot reference itself.',
  // computedColumnErrorCycle: path => `Circular reference: ${path}.`,
  // computedCellErrorDivByZero: 'Division by zero in this row. Wrap the division in IFERROR(…, 0) to provide a fallback.',
  // computedCellErrorValue: 'A value in this row has the wrong type for this operation.',
  // computedCellErrorRef: 'A referenced column does not exist.',
  // computedCellErrorName: 'The formula uses an unknown function.',
  // computedCellErrorCycle: 'The formula depends on itself.',
  // computedCellErrorGeneric: 'The formula could not be evaluated for this row.',

  // Columns management text
  columnsManagementSearchTitle: 'Zoeken',
  columnsManagementNoColumns: 'Geen kolommen',
  columnsManagementShowHideAllText: 'Toon/Verberg Alle',
  columnsManagementReset: 'Reset',
  columnsManagementDeleteIconLabel: 'Verwijderen',

  // Filter panel text
  filterPanelAddFilter: 'Filter toevoegen',
  filterPanelRemoveAll: 'Alles verwijderen',
  filterPanelDeleteIconLabel: 'Verwijderen',
  filterPanelLogicOperator: 'Logische operator',
  filterPanelOperator: 'Operatoren',
  filterPanelOperatorAnd: 'En',
  filterPanelOperatorOr: 'Of',
  filterPanelColumn: 'Kolommen',
  filterPanelInputLabel: 'Waarde',
  filterPanelInputPlaceholder: 'Filter waarde',

  // Filter operators text
  filterOperatorContains: 'bevat',
  filterOperatorDoesNotContain: 'bevat niet',
  filterOperatorEquals: 'gelijk aan',
  filterOperatorDoesNotEqual: 'niet gelijk aan',
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
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Bevat',
  headerFilterOperatorDoesNotContain: 'Bevat niet',
  headerFilterOperatorEquals: 'Gelijk aan',
  headerFilterOperatorDoesNotEqual: 'Niet gelijk aan',
  headerFilterOperatorStartsWith: 'Begint met',
  headerFilterOperatorEndsWith: 'Eindigt met',
  headerFilterOperatorIs: 'Is',
  headerFilterOperatorNot: 'Is niet',
  headerFilterOperatorAfter: 'Is na',
  headerFilterOperatorOnOrAfter: 'Is op of na',
  headerFilterOperatorBefore: 'Is voor',
  headerFilterOperatorOnOrBefore: 'Is op of voor',
  headerFilterOperatorIsEmpty: 'Is leeg',
  headerFilterOperatorIsNotEmpty: 'Is niet leeg',
  headerFilterOperatorIsAnyOf: 'Is een van',
  'headerFilterOperator=': 'Gelijk aan',
  'headerFilterOperator!=': 'Niet gelijk aan',
  'headerFilterOperator>': 'Is groter dan',
  'headerFilterOperator>=': 'Is groter dan of gelijk aan',
  'headerFilterOperator<': 'Is kleiner dan',
  'headerFilterOperator<=': 'Is kleiner dan of gelijk aan',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'alles',
  filterValueTrue: 'waar',
  filterValueFalse: 'onwaar',

  // Column menu text
  columnMenuLabel: 'Menu',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Toon kolommen',
  columnMenuManageColumns: 'Kolommen beheren',
  columnMenuFilter: 'Filteren',
  columnMenuHideColumn: 'Verbergen',
  columnMenuUnsort: 'Annuleer sortering',
  columnMenuSortAsc: 'Oplopend sorteren',
  columnMenuSortDesc: 'Aflopend sorteren',
  // columnMenuManagePivot: 'Manage pivot',
  // columnMenuManageCharts: 'Manage charts',

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

  // Long text cell
  longTextCellExpandLabel: 'Uitklappen',
  longTextCellCollapseLabel: 'Inklappen',

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

  // Pagination
  paginationRowsPerPage: 'Regels per pagina:',
  // paginationDisplayedRows: ({
  //   from,
  //   to,
  //   count,
  //   estimated
  // }) => {
  //   const unknownRowCount = count == null || count === -1;
  //   if (!estimated) {
  //     return `${formatNumber(from)}–${formatNumber(to)} of ${!unknownRowCount ? formatNumber(count) : `more than ${formatNumber(to)}`}`;
  //   }
  //   const estimatedLabel = estimated && estimated > to ? `around ${formatNumber(estimated)}` : `more than ${formatNumber(to)}`;
  //   return `${formatNumber(from)}–${formatNumber(to)} of ${!unknownRowCount ? formatNumber(count) : estimatedLabel}`;
  // },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Ga naar eerste pagina';
    }
    if (type === 'last') {
      return 'Ga naar laatste pagina';
    }
    if (type === 'next') {
      return 'Ga naar volgende pagina';
    }
    // if (type === 'previous') {
    return 'Ga naar vorige pagina';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Rijen hersorteren',

  // Aggregation
  aggregationMenuItemHeader: 'Aggregatie',
  // aggregationFunctionLabelNone: 'none',
  aggregationFunctionLabelSum: 'som',
  aggregationFunctionLabelAvg: 'gem',
  aggregationFunctionLabelMin: 'min',
  aggregationFunctionLabelMax: 'max',
  aggregationFunctionLabelSize: 'grootte',

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

  // Charts configuration panel
  // chartsNoCharts: 'There are no charts available',
  // chartsChartNotSelected: 'Select a chart type to configure its options',
  // chartsTabChart: 'Chart',
  // chartsTabFields: 'Fields',
  // chartsTabCustomize: 'Customize',
  // chartsCloseButton: 'Close charts configuration',
  // chartsSyncButtonLabel: 'Sync chart',
  // chartsSearchPlaceholder: 'Search fields',
  // chartsSearchLabel: 'Search fields',
  // chartsSearchClear: 'Clear search',
  // chartsNoFields: 'No fields',
  // chartsFieldBlocked: 'This field cannot be added to any section',
  // chartsCategories: 'Categories',
  // chartsSeries: 'Series',
  // chartsMenuAddToDimensions: (dimensionLabel: string) => `Add to ${dimensionLabel}`,
  // chartsMenuAddToValues: (valuesLabel: string) => `Add to ${valuesLabel}`,
  // chartsMenuMoveUp: 'Move up',
  // chartsMenuMoveDown: 'Move down',
  // chartsMenuMoveToTop: 'Move to top',
  // chartsMenuMoveToBottom: 'Move to bottom',
  // chartsMenuOptions: 'Field options',
  // chartsMenuRemove: 'Remove',
  // chartsDragToDimensions: (dimensionLabel: string) => `Drag here to use column as ${dimensionLabel}`,
  // chartsDragToValues: (valuesLabel: string) => `Drag here to use column as ${valuesLabel}`,

  // AI Assistant panel
  // aiAssistantPanelTitle: 'AI Assistant',
  // aiAssistantPanelClose: 'Close AI Assistant',
  // aiAssistantPanelNewConversation: 'New conversation',
  // aiAssistantPanelConversationHistory: 'Conversation history',
  // aiAssistantPanelEmptyConversation: 'No prompt history',
  // aiAssistantSuggestions: 'Suggestions',

  // Prompt field
  // promptFieldLabel: 'Prompt',
  // promptFieldPlaceholder: 'Type a prompt…',
  // promptFieldPlaceholderWithRecording: 'Type or record a prompt…',
  // promptFieldPlaceholderListening: 'Listening for prompt…',
  // promptFieldSpeechRecognitionNotSupported: 'Speech recognition is not supported in this browser',
  // promptFieldSend: 'Send',
  // promptFieldRecord: 'Record',
  // promptFieldStopRecording: 'Stop recording',

  // Prompt
  // promptRerun: 'Run again',
  // promptProcessing: 'Processing…',
  // promptAppliedChanges: 'Applied changes',

  // Prompt changes
  // promptChangeGroupDescription: (column: string) => `Group by ${column}`,
  // promptChangeAggregationLabel: (column: string, aggregation: string) => `${column} (${aggregation})`,
  // promptChangeAggregationDescription: (column: string, aggregation: string) => `Aggregate ${column} (${aggregation})`,
  // promptChangeFilterLabel: (column: string, operator: string, value: string) => {
  //   if (operator === 'is any of') {
  //     return `${column} is any of: ${value}`;
  //   }
  //   return `${column} ${operator} ${value}`;
  // },
  // promptChangeFilterDescription: (column: string, operator: string, value: string) => {
  //   if (operator === 'is any of') {
  //     return `Filter where ${column} is any of: ${value}`;
  //   }
  //   return `Filter where ${column} ${operator} ${value}`;
  // },
  // promptChangeSortDescription: (column: string, direction: string) => `Sort by ${column} (${direction})`,
  // promptChangePivotEnableLabel: 'Pivot',
  // promptChangePivotEnableDescription: 'Enable pivot',
  // promptChangePivotColumnsLabel: (count: number) => `Columns (${count})`,
  // promptChangePivotColumnsDescription: (column: string, direction: string) => `${column}${direction ? ` (${direction})` : ''}`,
  // promptChangePivotRowsLabel: (count: number) => `Rows (${count})`,
  // promptChangePivotValuesLabel: (count: number) => `Values (${count})`,
  // promptChangePivotValuesDescription: (column: string, aggregation: string) => `${column} (${aggregation})`,
  // promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) => `Dimensions (${dimensionsCount}), Values (${valuesCount})`,
};

export const nlNL: Localization = getGridLocalization(nlNLGrid);
