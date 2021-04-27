export interface GridFilterItem {
  id?: number;
  columnField?: string;
  value?: string;
  operatorValue?: string;
  operatorLabel?: string;
}

export enum GridLinkOperator {
  And = 'and',
  Or = 'or',
}
