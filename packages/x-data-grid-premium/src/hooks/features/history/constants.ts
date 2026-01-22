import type { GridEvents } from '@mui/x-data-grid-pro';

export const DEFAULT_HISTORY_VALIDATION_EVENTS = [
  'columnsChange',
  'rowsSet',
  'sortedRowsSet',
  'filteredRowsSet',
  'paginationModelChange',
] as GridEvents[];
