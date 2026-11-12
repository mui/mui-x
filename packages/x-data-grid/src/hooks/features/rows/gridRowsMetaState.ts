import type { RowsMetaState } from '@mui/x-virtualizer/models';

/**
 * The grid rows total height and row positions.
 */
export interface GridRowsMetaState extends RowsMetaState {
  /**
   * The total height of the pinned top rows.
   * @deprecated Use `topPinnedHeight` instead.
   */
  pinnedTopRowsTotalHeight: number;
  /**
   * The total height of the pinned bottom rows.
   * @deprecated Use `bottomPinnedHeight` instead.
   */
  pinnedBottomRowsTotalHeight: number;
}
