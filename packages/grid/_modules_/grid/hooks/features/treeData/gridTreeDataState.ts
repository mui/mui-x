import { GridRowId } from '../../../models/gridRows';

export interface GridTreeDataState {
  expandedRows: Record<GridRowId, boolean>;
}
