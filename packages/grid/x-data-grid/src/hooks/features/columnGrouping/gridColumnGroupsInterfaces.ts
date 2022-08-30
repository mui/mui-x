import { GridColumnGroup } from '../../../models/gridColumnGrouping';

export type GridColumnGroupLookup = {
  [field: string]: Omit<GridColumnGroup, 'children'>;
};

export type GridGroupingStructure = {
  groupId: null | string;
  columnFields: string[];
};

export interface GridColumnsGroupingState {
  lookup: GridColumnGroupLookup;
  headerStructure: GridGroupingStructure[][];
}
