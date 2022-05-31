import { GridRowsInternalCache } from '../hooks/features/rows/gridRowsState';
import { GridColumnsInternalCache } from '../hooks/features/columns/gridColumnsInterfaces';

export interface GridApiCaches {
  rows: GridRowsInternalCache;
  columns: GridColumnsInternalCache;
}
