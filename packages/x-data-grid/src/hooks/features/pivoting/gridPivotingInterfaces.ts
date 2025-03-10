import type { GridColDef } from '../../../models/colDef';

export interface GridPivotingStatePartial {
  enabled: boolean;
  panelOpen: boolean;
  initialColumns: GridColDef[] | undefined;
}
