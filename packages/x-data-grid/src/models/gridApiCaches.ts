import { GridRowsInternalCache } from '../hooks/features/rows/gridRowsInterfaces';
import { GridRowsMetaInternalCache } from '../hooks/features/rows/gridRowsMetaInterfaces';
import type { GridColumnGroupingInternalCache } from '../hooks/features/columnGrouping/gridColumnGroupsInterfaces';
import { GridColumnsInternalCache } from '../hooks';

export interface GridApiCaches {
  columns: GridColumnsInternalCache;
  columnGrouping: GridColumnGroupingInternalCache;
  rows: GridRowsInternalCache;
  rowsMeta: GridRowsMetaInternalCache;
}
