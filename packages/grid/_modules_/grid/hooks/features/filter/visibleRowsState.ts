import { FilterOperator } from '../../../models/colDef/stringColDef';
import { RowId } from '../../../models/rows';

export interface FilterItem {
  id?: number;
  columnField?: string;
  value?: string;
  operator?: FilterOperator; // Contains...
}

export enum LinkOperator {
  And = 'and',
  Or = 'or',
}

export interface FilterModelState {
  items: FilterItem[];
  linkOperator: LinkOperator;
}

export interface VisibleRowsState {
  visibleRowsLookup: Record<RowId, boolean>;

  visibleRows: RowId[];
}

export const getInitialVisibleRowsState: () => VisibleRowsState = () => ({
  visibleRows: [],
  visibleRowsLookup: {},
});

export const getInitialFilterState: () => FilterModelState = () => ({
  items: [],
  linkOperator: LinkOperator.And,
});
