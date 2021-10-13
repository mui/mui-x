import { ComponentsPropsList } from '@mui/material/styles';

/**
 * Set the types of the texts in the grid.
 */
export interface GridLocaleText {
  // Root
  noRowsLabel: string;
  noResultsOverlayLabel: string;
  errorOverlayDefaultLabel: string;

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

  // Export selector toolbar button text
  toolbarExport: React.ReactNode;
  toolbarExportLabel: string;
  toolbarExportCSV: React.ReactNode;
  toolbarExportPrint: React.ReactNode;

  // Columns panel text
  columnsPanelTextFieldLabel: string;
  columnsPanelTextFieldPlaceholder: string;
  columnsPanelDragIconLabel: string;
  columnsPanelShowAllButton: React.ReactNode;
  columnsPanelHideAllButton: React.ReactNode;

  // Filter panel text
  filterPanelAddFilter: React.ReactNode;
  filterPanelDeleteIconLabel: string;
  filterPanelOperators: React.ReactNode;
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

  // Filter values text
  filterValueAny: string;
  filterValueTrue: string;
  filterValueFalse: string;

  // Column menu text
  columnMenuLabel: string;
  columnMenuShowColumns: React.ReactNode;
  columnMenuFilter: React.ReactNode;
  columnMenuHideColumn: React.ReactNode;
  columnMenuUnsort: React.ReactNode;
  columnMenuSortAsc: React.ReactNode;
  columnMenuSortDesc: React.ReactNode;

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

  // Boolean cell text
  booleanCellTrueLabel: string;
  booleanCellFalseLabel: string;

  // Actions cell more text
  actionsCellMore: string;

  // Tree data
  treeDataGroupingHeaderName: string;
  treeDataExpand: string;
  treeDataCollapse: string;

  // Used core components translation keys
  MuiTablePagination: Omit<
    ComponentsPropsList['MuiTablePagination'],
    'page' | 'count' | 'onChangePage' | 'rowsPerPage' | 'onPageChange'
  >;
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
