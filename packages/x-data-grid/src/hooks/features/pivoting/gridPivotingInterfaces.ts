import type { GridRowModelUpdate } from '../../../models';
import type { GridColDef } from '../../../models/colDef';

export interface GridPivotingStatePartial {
  active: boolean;
  initialColumns: Map<string, GridColDef> | undefined;
}

export interface GridPivotingPrivateApiCommunity {
  updateNonPivotRows: (rows: readonly GridRowModelUpdate[], keepPreviousRows?: boolean) => void;
  updateNonPivotColumns: (columns: readonly GridColDef[], keepPreviousColumns?: boolean) => void;
}
