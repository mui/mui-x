import type { GridRowsInternalCache } from '../hooks/features/rows/gridRowsInterfaces';
import type { GridRowsMetaInternalCache } from '../hooks/features/rows/gridRowsMetaInterfaces';
import type { GridColumnGroupingInternalCache } from '../hooks/features/columnGrouping/gridColumnGroupsInterfaces';
import type { GridColDef } from './colDef';

export interface GridApiCaches {
  columns: { lastColumnsProp: readonly GridColDef[] };
  columnGrouping: GridColumnGroupingInternalCache;
  rows: GridRowsInternalCache;
  rowsMeta: GridRowsMetaInternalCache;
}
