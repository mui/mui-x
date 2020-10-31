import { RowId } from '../../../models/rows';

export interface FilterState {
  hiddenRows: RowId[];
}

export const getInitialFilterState: () => FilterState = () => ({
  hiddenRows: [],
});
