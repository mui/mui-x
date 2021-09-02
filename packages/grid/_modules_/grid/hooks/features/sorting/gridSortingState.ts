import { GridRowId } from '../../../models/gridRows';
import { GridSortModel } from '../../../models/gridSortModel';

export interface GridSortingState {
  sortedRows: GridRowId[];
  sortModel: GridSortModel;
}
