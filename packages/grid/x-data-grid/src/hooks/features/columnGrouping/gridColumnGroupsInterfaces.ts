import { GridColumnGroup } from '../../../models/gridColumnGrouping';

export type GridColumnGroupLookup = {
  [field: string]: Omit<GridColumnGroup, 'children'>;
};

export interface GridColumnsGroupingState {
  lookup: GridColumnGroupLookup;
}
