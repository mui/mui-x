import { RowId } from '../../../models/rows';
import { SortModel } from '../../../models/sortModel';

export interface SortingState {
  sortedRows: RowId[];
  sortModel: SortModel;
}

export function getInitialSortingState(): SortingState {
  return { sortedRows: [], sortModel: [] };
}
