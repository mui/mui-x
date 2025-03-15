import { GridRowsInternalCache } from '../hooks/features/rows/gridRowsInterfaces';
import { GridRowsMetaInternalCache } from '../hooks/features/rows/gridRowsMetaInterfaces';

export interface GridApiCaches {
  rows: GridRowsInternalCache;
  rowsMeta: GridRowsMetaInternalCache;
}
