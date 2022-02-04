import { GridRowId } from '../../../models/gridRows';

export interface GridDetailPanelState {
  expandedRowIds: GridRowId[];
  contentCache: Record<GridRowId, React.ReactNode>;
  heightCache: Record<GridRowId, number>;
}

export type GridDetailPanelInitialState = Pick<GridDetailPanelState, 'expandedRowIds'>;
