import type { HeightEntry } from '@mui/x-virtualizer/models';
import type { GridRowId } from '../../../models/gridRows';

export type { HeightEntry } from '@mui/x-virtualizer/models';

export type HeightCache = Map<GridRowId, HeightEntry>;

export interface GridRowsMetaInternalCache {
  /**
   * Map of height cache entries.
   */
  heights: HeightCache;
}
