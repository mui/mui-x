import { GridState } from '../../hooks/features/core/gridState';

export interface GridStateChangeParams {
  state: GridState;
  api: import('../api/gridApi').GridApi;
}
