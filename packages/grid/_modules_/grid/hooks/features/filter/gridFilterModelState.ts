import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';

export interface GridFilterModelState {
  items: GridFilterItem[];
  linkOperator?: GridLinkOperator;
}

export type GridFilterModel = GridFilterModelState;

export const getInitialGridFilterState: () => GridFilterModelState = () => ({
  items: [],
  linkOperator: GridLinkOperator.And,
});
