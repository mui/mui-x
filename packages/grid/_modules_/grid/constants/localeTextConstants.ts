import { LocaleText } from '../models/api/localeTextApi';

export const DEFAULT_LOCALE_TEXT: LocaleText = {
  // Root
  rootGridLabel: 'grid',

  // Density selector toolbar button text
  toolbarDensity: 'Density',
  toolbarDensityLabel: 'Density',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Comfortable',

  // Columns selector toolbar button text
  toolbarColumns: 'Columns',
  toolbarColumnsLabel: 'Show Column Selector',

  // Filters toolbar button text
  toolbarFilters: 'Filters',
  toolbarFiltersLabel: 'Show Filters',
  toolbarFiltersTooltipHide: 'Hide Filters',
  toolbarFiltersTooltipShow: 'Show Filters',
  toolbarFiltersTooltipActive: 'active filter(s)',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Find column',
  columnsPanelTextFieldPlaceholder: 'Column title',
  columnsPanelDragIconTitle: 'Reorder Column',
  columnsPanelDragIconLabel: 'Drag to reorder column',
  columnsPanelShowAllButton: 'Show All',
  columnsPanelHideAllButton: 'Hide All',

  // Filter panel text
  filterPanelAddFilter: 'Add Filter',
  filterPanelDeleteIconTitle: 'Delete',
  filterPanelDeleteIconLabel: 'Delete',
  filterPanelOperators: 'Operators',
  filterPanelOperatorAnd: 'And',
  filterPanelOperatorOr: 'Or',
  filterPanelColumns: 'Columns',

  // Column menu text
  columnMenuTitle: 'Menu',
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Show columns',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Hide',
  columnMenuUnsort: 'Unsort',
  columnMenuSortAsc: 'Sort by Asc',
  columnMenuSortDesc: 'Sort by Desc',

  // Column header text
  columnHeaderFiltersTooltipActive: 'active filter(s)',
  columnHeaderFiltersLabel: 'Show Filters',
  columnHeaderSortIconTitle: 'Sort',
  columnHeaderSortIconLabel: 'Sort',

  // Rows selected footer text
  footerRowSelected: 'row selected',
  footerRowSelectedPlural: 'rows selected',

  // Total rows footer text
  footerTotalRows: 'Total Rows:',

  // Pagination footer text
  footerPaginationRowsPerPage: 'Rows per page:',
};
