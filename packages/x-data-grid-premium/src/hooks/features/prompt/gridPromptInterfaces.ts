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
   * The AI assistant API.
   */
  unstable_aiAssistant: {
    /**
     * Get the context for the prompt.
     * @param {boolean} allowDataSampling Whether to use grid data as examples in the context.
     * If true, random cell values from each column are used to make the context more detailed and the response more accurate.
     * If false, the samples are only generated from the unstable_examples property of the column(s).
     * Default is false.
     * @returns {string} The context for the prompt.
     */
    getPromptContext: (allowDataSampling?: boolean) => string;
    /**
     * Use the prompt processing result to update all relevant parts of the grid state.
     * @param {PromptResponse} result The result of the prompt.
     */
    applyPromptResult: (result: PromptResponse) => void;
  };
}
