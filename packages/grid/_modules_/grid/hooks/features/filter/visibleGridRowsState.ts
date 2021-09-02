import { GridRowId } from '../../../models/gridRows';

export interface VisibleGridRowsState {
  visibleRowsLookup: Record<GridRowId, boolean>;
  visibleRows?: GridRowId[];
}
