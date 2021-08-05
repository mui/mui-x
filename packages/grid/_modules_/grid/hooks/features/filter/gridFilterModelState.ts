import { GridLinkOperator } from '../../../models/gridFilterItem';
import { GridFilterModel } from '../../../models/gridFilterModel';

export const getInitialGridFilterState: () => GridFilterModel = () => ({
  items: [],
  linkOperator: GridLinkOperator.And,
});
