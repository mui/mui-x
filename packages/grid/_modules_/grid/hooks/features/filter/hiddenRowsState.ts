import { RowId } from '../../../models/rows';

export interface FilterItem {
  id?: number;
  columnField?: string;
  value?: any;
  operator?: any; // Contains...
}

export interface FilterModelState {
  items: FilterItem[];
  linkOperator?: any; // And / or
}

export interface HiddenRowsState {
  hiddenRows: RowId[];
}

export const getInitialHiddenRowsState: () => HiddenRowsState = () => ({
  hiddenRows: [],
});

export const getInitialFilterState: () => FilterModelState = () => ({
  items: [],
});
