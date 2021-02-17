import { RowId } from '../../../models/rows';
import { SortModel } from '../../../models/sortModel';

export interface GridSortingState {
  sortedRows: RowId[];
  sortModel: SortModel;
}

export function getInitialGridSortingState(): GridSortingState {
  return { sortedRows: [], sortModel: [] };
}
