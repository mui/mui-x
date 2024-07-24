import * as React from 'react';
import type { ComponentsPropsList } from '@mui/material/styles';
import type { WrappedLabelDisplayedRows } from '../../components/GridPagination';
import type { GridColDef } from '../colDef';

export type MuiTablePaginationLocalizedProps = Omit<
  ComponentsPropsList['MuiTablePagination'],
  'page' | 'count' | 'onChangePage' | 'rowsPerPage' | 'onPageChange' | 'labelDisplayedRows'
> & {
  labelDisplayedRows?: WrappedLabelDisplayedRows;
};

/**
 * Set the types of the texts in the grid.
 */
export interface GridLocaleText {
  // Root
  noRowsLabel: string;
  noResultsOverlayLabel: string;

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

  // Columns management text
  columnsManagementSearchTitle: string;
  columnsManagementNoColumns: string;
  columnsManagementShowHideAllText: string;
  columnsManagementReset: string;

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
  filterOperatorEquals: string;
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
  headerFilterOperatorEquals: string;
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

  // Filter values text
  filterValueAny: string;
  filterValueTrue: string;
  filterValueFalse: string;

  // Column menu text
  columnMenuLabel: string;
  columnMenuShowColumns: React.ReactNode;
  columnMenuManageColumns: React.ReactNode;
  columnMenuFilter: React.ReactNode;
  columnMenuHideColumn: React.ReactNode;
  columnMenuUnsort: React.ReactNode;
  columnMenuSortAsc: React.ReactNode | ((colDef: GridColDef) => React.ReactNode);
  columnMenuSortDesc: React.ReactNode | ((colDef: GridColDef) => React.ReactNode);

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

  // Used core components translation keys
  MuiTablePagination: MuiTablePaginationLocalizedProps;
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
