import type { GridColDef } from '../../../models/colDef';

export interface GridPivotingStatePartial {
  active: boolean;
  panelOpen: boolean;
  initialColumns: Map<string, GridColDef> | undefined;
}
