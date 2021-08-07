import { GridFilterItem, GridLinkOperator } from './gridFilterItem';

export interface GridFilterModel {
  items: GridFilterItem[];
  linkOperator?: GridLinkOperator;
}
