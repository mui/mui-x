export type Sort = {
  column: string;
  direction: 'asc' | 'desc';
};

export type Grouping = {
  column: string;
};

export type Filter = {
  operator: string;
  value: string | number | boolean;
  column: string;
};

export type Response = {
  filters: Filter[];
  filterOperator?: 'and' | 'or';
  sorting: Sort[];
  grouping: Grouping[];
  error: string | null;
};
