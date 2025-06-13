import { GridRowsInternalCache } from '../hooks/features/rows/gridRowsInterfaces';
import { GridRowsMetaInternalCache } from '../hooks/features/rows/gridRowsMetaInterfaces';
import type { GridColumnGroupingInternalCache } from '../hooks/features/columnGrouping/gridColumnGroupsInterfaces';

export interface GridApiCaches {
  columnGrouping: GridColumnGroupingInternalCache;
  rows: GridRowsInternalCache;
  rowsMeta: GridRowsMetaInternalCache;
}
