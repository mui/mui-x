/**
 * Set the types of the texts in the grid.
 */
export interface LocaleText {
  // Root
  rootGridLabel: string;

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
  toolbarFiltersTooltipActive: React.ReactNode;

  // Columns panel text
  columnsPanelTextFieldLabel: string;
  columnsPanelTextFieldPlaceholder: string;
  columnsPanelDragIconTitle: string;
  columnsPanelDragIconLabel: string;
  columnsPanelShowAllButton: React.ReactNode;
  columnsPanelHideAllButton: React.ReactNode;

  // Filter panel text
  filterPanelAddFilter: React.ReactNode;
  filterPanelDeleteIconTitle: string;
  filterPanelDeleteIconLabel: string;
  filterPanelOperators: React.ReactNode;
  filterPanelOperatorAnd: React.ReactNode;
  filterPanelOperatorOr: React.ReactNode;
  filterPanelColumns: React.ReactNode;

  // Column menu text
  columnMenuTitle: string;
  columnMenuLabel: string;
  columnMenuShowColumns: React.ReactNode;
  columnMenuFilter: React.ReactNode;
  columnMenuHideColumn: React.ReactNode;
  columnMenuUnsort: React.ReactNode;
  columnMenuSortAsc: React.ReactNode;
  columnMenuSortDesc: React.ReactNode;

  // Column header text
  columnHeaderFiltersTooltipActive: React.ReactNode;
  columnHeaderFiltersLabel: string;
  columnHeaderSortIconTitle: string;
  columnHeaderSortIconLabel: string;

  // Rows selected footer text
  footerRowSelected: React.ReactNode;
  footerRowSelectedPlural: React.ReactNode;

  // Total rows footer text
  footerTotalRows: React.ReactNode;

  // Pagination footer text
  footerPaginationRowsPerPage: React.ReactNode;
}

export type LocaleTextValue = string | React.ReactNode | Function;

export type TranslationKeys = keyof LocaleText;

/**
 * The grid localeText API [[apiRef]].
 */
export interface LocaleTextApi {
  /**
   * Get grid text.
   * @param key
   * @returns LocaleTextValue
   */
  getLocaleText: <T extends TranslationKeys>(key: T) => LocaleText[T];
}
