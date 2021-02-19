import { GridLocaleText } from '../models/api/gridLocaleTextApi';

export const GRID_DEFAULT_LOCALE_TEXT: GridLocaleText = {
  // Root
  rootGridLabel: 'grid',
  noRowsLabel: 'No rows',
  errorOverlayDefaultLabel: 'An error occurred.',

  // Density selector toolbar button text
  toolbarDensity: 'Density',
  toolbarDensityLabel: 'Density',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Comfortable',

  // GridColumns selector toolbar button text
  toolbarColumns: 'GridColumns',
  toolbarColumnsLabel: 'Show Column Selector',

  // Filters toolbar button text
  toolbarFilters: 'Filters',
  toolbarFiltersLabel: 'Show Filters',
  toolbarFiltersTooltipHide: 'Hide Filters',
  toolbarFiltersTooltipShow: 'Show Filters',
  toolbarFiltersTooltipActive: (count) => `${count} active filter(s)`,

  // GridColumns panel text
  columnsPanelTextFieldLabel: 'Find column',
  columnsPanelTextFieldPlaceholder: 'Column title',
  columnsPanelDragIconLabel: 'Reorder Column',
  columnsPanelShowAllButton: 'Show All',
  columnsPanelHideAllButton: 'Hide All',

  // Filter panel text
  filterPanelAddFilter: 'Add Filter',
  filterPanelDeleteIconLabel: 'Delete',
  filterPanelOperators: 'Operators',
  filterPanelOperatorAnd: 'And',
  filterPanelOperatorOr: 'Or',
  filterPanelColumns: 'GridColumns',
  filterPanelInputLabel: 'Value',
  filterPanelInputPlaceholder: 'Filter value',

  // Filter operators text
  filterOperatorContains: 'contains',
  filterOperatorEquals: 'equals',
  filterOperatorStartsWith: 'starts with',
  filterOperatorEndsWith: 'ends with',
  filterOperatorIs: 'is',
  filterOperatorNot: 'is not',
  filterOperatorOnOrAfter: 'is on or after',
  filterOperatorBefore: 'is before',
  filterOperatorOnOrBefore: 'is on or before',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Show columns',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Hide',
  columnMenuUnsort: 'Unsort',
  columnMenuSortAsc: 'Sort by Asc',
  columnMenuSortDesc: 'Sort by Desc',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} active filter(s)`,
  columnHeaderFiltersLabel: 'Show Filters',
  columnHeaderSortIconLabel: 'Sort',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} rows selected`
      : `${count.toLocaleString()} row selected`,

  // Total rows footer text
  footerTotalRows: 'Total Rows:',

  // Pagination footer text
  footerPaginationRowsPerPage: 'Rows per page:',
};
