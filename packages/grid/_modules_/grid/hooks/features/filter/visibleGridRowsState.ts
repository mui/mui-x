import { RowId } from '../../../models/rows';

export interface VisibleGridRowsState {
  visibleRowsLookup: Record<RowId, boolean>;

  visibleRows?: RowId[];
}

export const getInitialVisibleGridRowsState: () => VisibleGridRowsState = () => ({
  visibleRowsLookup: {},
});
