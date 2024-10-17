import { GridRowId } from '../../../models/gridRows';

export type HeightEntry = {
  content: number;
  spacingTop: number;
  spacingBottom: number;
  detail: number;

  autoHeight: boolean;
  needsFirstMeasurement: boolean;
};

export type HeightCache = Map<GridRowId, HeightEntry>;

export interface GridRowsMetaInternalCache {
  /**
   * Map of height cache entries.
   */
  heights: HeightCache;
}
