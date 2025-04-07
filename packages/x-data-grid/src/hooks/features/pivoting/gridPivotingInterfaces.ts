import type { GridRowModelUpdate } from '@mui/x-data-grid';
import type { GridColDef } from '../../../models/colDef';

export interface GridPivotingStatePartial {
  active: boolean;
  panelOpen: boolean;
  initialColumns: Map<string, GridColDef> | undefined;
}

export interface GridPivotingPrivateApiCommunity {
  updateNonPivotData: (rows: GridRowModelUpdate[], keepPreviousRows?: boolean) => void;
}
