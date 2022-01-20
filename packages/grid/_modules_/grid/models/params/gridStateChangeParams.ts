import { GridState } from '../gridState';
import { GridApi } from '../api';

export interface GridStateChangeParams {
  state: GridState;
  api: GridApi;
}
