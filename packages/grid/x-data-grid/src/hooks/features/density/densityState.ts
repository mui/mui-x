import { GridDensity } from '../../../models/gridDensity';

export interface GridDensityState {
  value: GridDensity;
  rowHeight: number;
  headerHeight: number;
  headerGroupingRowHeight: number;
  headerGroupingMaxDepth: number;
  factor: number;
}
