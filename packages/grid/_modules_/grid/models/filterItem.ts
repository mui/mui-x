export interface FilterItem {
  id?: number;
  columnField?: string;
  value?: string;
  operatorValue?: string;
}

export enum LinkOperator {
  And = 'and',
  Or = 'or',
}
