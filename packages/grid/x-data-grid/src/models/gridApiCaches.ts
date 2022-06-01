import { GridRowsInternalCache } from '../hooks/features/rows/gridRowsInterfaces';
import { GridColumnsInternalCache } from '../hooks/features/columns/gridColumnsInterfaces';

export interface GridApiCaches {
  rows: GridRowsInternalCache;
  columns: GridColumnsInternalCache;
}
