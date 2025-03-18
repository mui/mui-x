import type { GridColDef } from '../../../models/colDef';

export interface GridPivotingStatePartial {
  enabled: boolean;
  panelOpen: boolean;
  initialColumns: Map<string, GridColDef> | undefined;
}
