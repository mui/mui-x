import { RowId } from '../../../models/rows';

export interface VisibleRowsState {
  visibleRowsLookup: Record<RowId, boolean>;

  visibleRows: RowId[];
}

export const getInitialVisibleRowsState: () => VisibleRowsState = () => ({
  visibleRows: [],
  visibleRowsLookup: {},
});
