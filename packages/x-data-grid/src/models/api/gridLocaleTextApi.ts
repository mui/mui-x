import * as React from 'react';
import type { GridColDef } from '../colDef';

/**
 * Set the types of the texts in the grid.
 */
export interface GridLocaleText {
  // Root
  noRowsLabel: string;
  noResultsOverlayLabel: string;
  noColumnsOverlayLabel: string;
  noColumnsOverlayManageColumns: string;
  emptyPivotOverlayLabel: string;

  // Density selector toolbar button text
  toolbarDensity: React.ReactNode;
  toolbarDensityLabel: string;
  toolbarDensityCompact: string;
  toolbarDensityStandard: string;
  toolbarDensityComfortable: string;

  // Columns selector toolbar button text
  toolbarColumns: React.ReactNode;
  toolbarColumnsLabel: string;

  // Filters toolbar button text
  toolbarFilters: React.ReactNode;
  toolbarFiltersLabel: string;
  toolbarFiltersTooltipHide: React.ReactNode;
  toolbarFiltersTooltipShow: React.ReactNode;
  toolbarFiltersTooltipActive: (count: number) => React.ReactNode;

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: string;
  toolbarQuickFilterLabel: string;
  toolbarQuickFilterDeleteIconLabel: string;

  // Export selector toolbar button text
  toolbarExport: React.ReactNode;
  toolbarExportLabel: string;
  toolbarExportCSV: React.ReactNode;
  toolbarExportPrint: React.ReactNode;
  toolbarExportExcel: string;

  // Toolbar pivot button
  toolbarPivot: string;

  // Toolbar AI Assistant button
  toolbarAssistant: React.ReactNode;

  // Columns management text
  columnsManagementSearchTitle: string;
  columnsManagementNoColumns: string;
  columnsManagementShowHideAllText: string;
  columnsManagementReset: string;
  columnsManagementDeleteIconLabel: string;

  // Filter panel text
  filterPanelAddFilter: React.ReactNode;
  filterPanelRemoveAll: React.ReactNode;
  filterPanelDeleteIconLabel: string;
  filterPanelLogicOperator: string;
  filterPanelOperator: React.ReactNode;
  filterPanelOperatorAnd: React.ReactNode;
  filterPanelOperatorOr: React.ReactNode;
  filterPanelColumns: React.ReactNode;
  filterPanelInputLabel: string;
  filterPanelInputPlaceholder: string;

  // Filter operators text
  filterOperatorContains: string;
  filterOperatorDoesNotContain: string;
  filterOperatorEquals: string;
  filterOperatorDoesNotEqual: string;
  filterOperatorStartsWith: string;
  filterOperatorEndsWith: string;
  filterOperatorIs: string;
  filterOperatorNot: string;
  filterOperatorAfter: string;
  filterOperatorOnOrAfter: string;
  filterOperatorBefore: string;
  filterOperatorOnOrBefore: string;
  filterOperatorIsEmpty: string;
  filterOperatorIsNotEmpty: string;
  filterOperatorIsAnyOf: string;
  'filterOperator=': string;
  'filterOperator!=': string;
  'filterOperator>': string;
  'filterOperator>=': string;
  'filterOperator<': string;
  'filterOperator<=': string;

  // Header filter operators text
  headerFilterOperatorContains: string;
  headerFilterOperatorDoesNotContain: string;
  headerFilterOperatorEquals: string;
  headerFilterOperatorDoesNotEqual: string;
  headerFilterOperatorStartsWith: string;
  headerFilterOperatorEndsWith: string;
  headerFilterOperatorIs: string;
  headerFilterOperatorNot: string;
  headerFilterOperatorAfter: string;
  headerFilterOperatorOnOrAfter: string;
  headerFilterOperatorBefore: string;
  headerFilterOperatorOnOrBefore: string;
  headerFilterOperatorIsEmpty: string;
  headerFilterOperatorIsNotEmpty: string;
  headerFilterOperatorIsAnyOf: string;
  'headerFilterOperator=': string;
  'headerFilterOperator!=': string;
  'headerFilterOperator>': string;
  'headerFilterOperator>=': string;
  'headerFilterOperator<': string;
  'headerFilterOperator<=': string;
  headerFilterClear: string;

  // Filter values text
  filterValueAny: string;
  filterValueTrue: string;
  filterValueFalse: string;

  // Column menu text
  columnMenuLabel: string;
  columnMenuAriaLabel: (columnName: string) => string;
  columnMenuShowColumns: React.ReactNode;
  columnMenuManageColumns: React.ReactNode;
  columnMenuFilter: React.ReactNode;
  columnMenuHideColumn: React.ReactNode;
  columnMenuUnsort: React.ReactNode;
  columnMenuSortAsc: React.ReactNode | ((colDef: GridColDef) => React.ReactNode);
  columnMenuSortDesc: React.ReactNode | ((colDef: GridColDef) => React.ReactNode);
  columnMenuManagePivot: string;

  // Column header text
  columnHeaderFiltersTooltipActive: (count: number) => React.ReactNode;
  columnHeaderFiltersLabel: string;
  columnHeaderSortIconLabel: string;

  // Rows selected footer text
  footerRowSelected: (count: number) => React.ReactNode;

  // Total rows footer text
  footerTotalRows: React.ReactNode;

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount: number, totalCount: number) => React.ReactNode;

  // Checkbox selection text
  checkboxSelectionHeaderName: string;
  checkboxSelectionSelectAllRows: string;
  checkboxSelectionUnselectAllRows: string;
  checkboxSelectionSelectRow: string;
  checkboxSelectionUnselectRow: string;

  // Boolean cell text
  booleanCellTrueLabel: string;
  booleanCellFalseLabel: string;

  // Actions cell more text
  actionsCellMore: string;

  // Column pinning text
  pinToLeft: string;
  pinToRight: string;
  unpin: string;

  // Tree Data
  treeDataGroupingHeaderName: string;
  treeDataExpand: string;
  treeDataCollapse: string;

  // Grouping columns
  groupingColumnHeaderName: string;
  groupColumn: (name: string) => string;
  unGroupColumn: (name: string) => string;

  // Master/detail
  detailPanelToggle: string;
  expandDetailPanel: string;
  collapseDetailPanel: string;

  // Row reordering text
  rowReorderingHeaderName: string;

  // Aggregation
  aggregationMenuItemHeader: string;
  aggregationFunctionLabelSum: string;
  aggregationFunctionLabelAvg: string;
  aggregationFunctionLabelMin: string;
  aggregationFunctionLabelMax: string;
  aggregationFunctionLabelSize: string;

  // Pagination
  paginationRowsPerPage: string;
  paginationDisplayedRows: (params: {
    from: number;
    to: number;
    count: number;
    estimated: number | undefined;
  }) => string;
  paginationItemAriaLabel: (type: 'first' | 'last' | 'previous' | 'next') => string;

  // Pivot
  pivotToggleLabel: string;
  pivotCloseButton: string;
  pivotSearchButton: string;
  pivotSearchControlPlaceholder: string;
  pivotSearchControlLabel: string;
  pivotSearchControlClear: string;
  pivotNoFields: string;
  pivotRows: string;
  pivotColumns: string;
  pivotValues: string;
  pivotMenuMoveUp: string;
  pivotMenuMoveDown: string;
  pivotMenuMoveToTop: string;
  pivotMenuMoveToBottom: string;
  pivotMenuRows: string;
  pivotMenuColumns: string;
  pivotMenuValues: string;
  pivotMenuOptions: string;
  pivotMenuAddToRows: string;
  pivotMenuAddToColumns: string;
  pivotMenuAddToValues: string;
  pivotMenuRemove: string;
  pivotDragToRows: string;
  pivotDragToColumns: string;
  pivotDragToValues: string;
  pivotYearColumnHeaderName: string;
  pivotQuarterColumnHeaderName: string;

  // AI Assistant panel
  aiAssistantPanelTitle: string;
  aiAssistantPanelClose: string;
  aiAssistantPanelConversationHistory: string;
  aiAssistantPanelNewConversation: string;
  aiAssistantPanelEmptyConversation: string;
  aiAssistantSuggestions: string;

  // Prompt
  promptRerun: string;
  promptProcessing: string;
  promptAppliedChanges: string;

  // Prompt changes
  promptChangeGroupDescription: (column: string) => string;
  promptChangeAggregationLabel: (column: string, aggregation: string) => string;
  promptChangeAggregationDescription: (column: string, aggregation: string) => string;
  promptChangeFilterLabel: (column: string, operator: string, value: string) => string;
  promptChangeFilterDescription: (column: string, operator: string, value: string) => string;
  promptChangeSortDescription: (column: string, direction: string) => string;
  promptChangePivotEnableLabel: string;
  promptChangePivotEnableDescription: string;
  promptChangePivotColumnsLabel: (count: number) => string;
  promptChangePivotColumnsDescription: (column: string, direction: string) => string;
  promptChangePivotRowsLabel: (count: number) => string;
  promptChangePivotValuesLabel: (count: number) => string;
  promptChangePivotValuesDescription: (column: string, aggregation: string) => string;

  // Prompt field
  promptFieldLabel: string;
  promptFieldPlaceholder: string;
  promptFieldPlaceholderWithRecording: string;
  promptFieldPlaceholderListening: string;
  promptFieldSpeechRecognitionNotSupported: string;
  promptFieldSend: string;
  promptFieldRecord: string;
  promptFieldStopRecording: string;
}

export type GridTranslationKeys = keyof GridLocaleText;

/**
 * The grid locale text API [[apiRef]].
 */
export interface GridLocaleTextApi {
  /**
   * Returns the translation for the `key`.
   * @param {T} key One of the keys in [[GridLocaleText]].
   * @returns {GridLocaleText[T]} The translated value.
   */
  getLocaleText: <T extends GridTranslationKeys>(key: T) => GridLocaleText[T];
}
