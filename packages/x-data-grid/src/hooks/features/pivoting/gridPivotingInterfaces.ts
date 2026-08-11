import type { GridRowModelUpdate, GridRowReplaceUpdate } from '@mui/x-data-grid';
import type { GridColDef } from '../../../models/colDef';

export interface GridPivotingStatePartial {
  active: boolean;
  initialColumns: Map<string, GridColDef> | undefined;
}

export interface GridPivotingPrivateApiCommunity {
  updateNonPivotRows: (
    rows: ReadonlyArray<GridRowModelUpdate | GridRowReplaceUpdate>,
    keepPreviousRows?: boolean,
  ) => void;
  updateNonPivotColumns: (columns: readonly GridColDef[], keepPreviousColumns?: boolean) => void;
}
