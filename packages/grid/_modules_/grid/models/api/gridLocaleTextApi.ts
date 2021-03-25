/**
 * Set the types of the texts in the grid.
 */
export interface GridLocaleText {
  // Root
  rootGridLabel: string;
  noRowsLabel: string;
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
}

export type TranslationKeys = keyof GridLocaleText;

/**
 * The grid localeText API [[apiRef]].
 */
export interface LocaleTextApi {
  /**
   * Get grid text.
   * @param key T
   * @returns GridLocaleText[T]
   */
  getLocaleText: <T extends TranslationKeys>(key: T) => GridLocaleText[T];
}
