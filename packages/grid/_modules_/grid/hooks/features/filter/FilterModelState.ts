import { FilterItem, GridLinkOperator } from '../../../models/filterItem';

export interface FilterModelState {
  items: FilterItem[];
  linkOperator?: GridLinkOperator;
}

export type FilterModel = FilterModelState;

export const getInitialGridFilterState: () => FilterModelState = () => ({
  items: [],
  linkOperator: GridLinkOperator.And,
});
