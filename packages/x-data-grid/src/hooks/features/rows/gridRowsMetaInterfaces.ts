import { GridRowId } from '../../../models/gridRows';

export type HeightEntry = {
  content: number;
  spacingTop: number;
  spacingBottom: number;
  detail: number;

  isResized: boolean;
  autoHeight: boolean; // Determines if the row has dynamic height
  needsFirstMeasurement: boolean; // Determines if the row was never measured. If true, use the estimated height as row height.
};

export type HeightCache = Map<GridRowId, HeightEntry>;

export interface GridRowsMetaInternalCache {
  /**
   * Map of height cache entries.
   */
  heights: HeightCache;
}
