import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';

export interface FilterModelState {
  items: GridFilterItem[];
  linkOperator?: GridLinkOperator;
}

export type FilterModel = FilterModelState;

export const getInitialGridFilterState: () => FilterModelState = () => ({
  items: [],
  linkOperator: GridLinkOperator.And,
});
