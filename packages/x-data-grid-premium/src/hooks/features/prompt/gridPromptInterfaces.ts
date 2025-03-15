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

/**
 * The prompt API interface that is available in the grid [[apiRef]].
 */
export interface GridPromptApi {
  /**
   * Collects sample data from the grid that can be used to improve the prompt context.
   * It takes random values for all columns but from different rows to make the samples more random.
   * @param {number} sampleCount The number of samples (randomized rows) to collect.
   * Default is 5. Maximum is 20.
   * If the number of rows in the grid is less than the sample count, all rows are used.
   * @returns {Record<string, any[]>} The sample data.
   */
  unstable_collectSampleData: (sampleCount?: number) => Record<string, any[]>;
  /**
   * Get the context for the prompt.
   * @param {Record<string, any[]>} examples Column examples to be used to make the context more detailed and the response more accurate.
   * @returns {string} The context for the prompt.
   */
  unstable_getPromptContext: (examples?: Record<string, any[]>) => string;
  /**
   * Use the prompt processing result to update all relevant parts of the grid state.
   * @param {PromptResponse} result The result of the prompt.
   */
  unstable_applyPromptResult: (result: PromptResponse) => void;
}
