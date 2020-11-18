import { FilterItem, LinkOperator } from '../../../models/filterItem';

export interface FilterModelState {
  items: FilterItem[];
  linkOperator: LinkOperator;
}

export const getInitialFilterState: () => FilterModelState = () => ({
  items: [],
  linkOperator: LinkOperator.And,
});
