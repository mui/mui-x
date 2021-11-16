export interface GridFilterItem {
  id?: number | string;
  columnField: string;
  value?: any;
  operatorValue?: string;
}

export enum GridLinkOperator {
  And = 'and',
  Or = 'or',
}
