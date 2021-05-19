export interface GridFilterItem {
  id?: string;
  columnField?: string;
  value?: string;
  operatorValue?: string;
}

export enum GridLinkOperator {
  And = 'and',
  Or = 'or',
}
