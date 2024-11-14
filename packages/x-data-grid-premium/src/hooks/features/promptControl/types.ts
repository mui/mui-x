export type Sort = {
  column: string;
  direction: 'asc' | 'desc';
};

export type Grouping = {
  column: string;
};

export type Filter = {
  operator: string;
  value: string | number | boolean | string[] | number[];
  column: string;
};

export type AggregationFunction = 'avg' | 'sum' | 'min' | 'max' | 'size';
export type Aggregation = {
  [column: string]: AggregationFunction;
};

export type PromptResponse = {
  select: number;
  filters: Filter[];
  filterOperator?: 'and' | 'or';
  aggregation: Aggregation;
  sorting: Sort[];
  grouping: Grouping[];
  error: string | null;
};
