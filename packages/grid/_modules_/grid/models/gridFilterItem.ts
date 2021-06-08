export interface GridFilterItem {
  id?: number;
  columnField?: string;
  value?: any;
  operatorValue?: string;
}

export enum GridLinkOperator {
  And = 'and',
  Or = 'or',
}
