export type PromptHistory = {
  value: string;
  createdAt: Date;
  response?: PromptResponse;
  variant?: 'success' | 'error' | 'processing';
  helperText?: string;
}[];

export type PromptSuggestion = {
  value: string;
};

export type GridAiAssistantState = {
  panelOpen: boolean;
  history: PromptHistory;
  suggestions: PromptSuggestion[];
};

export type GridAiAssistantInitialState = Partial<GridAiAssistantState>;

type ColumnSort = {
  column: string;
  direction: 'asc' | 'desc';
};

type ColumnFilter = {
  operator: string;
  value: string | number | boolean | string[] | number[];
  column: string;
};

type Grouping = {
  column: string;
};

type AggregationFunction = 'avg' | 'sum' | 'min' | 'max' | 'size';
type Aggregation = {
  [column: string]: AggregationFunction;
};

type Pivoting =
  | {
      columns: ColumnSort[];
      rows: string[];
      values: Aggregation[];
    }
  | {};

export type PromptResponse = {
  select: number;
  filters: ColumnFilter[];
  filterOperator?: 'and' | 'or';
  aggregation: Aggregation;
  sorting: ColumnSort[];
  grouping: Grouping[];
  pivoting: Pivoting;
};

/**
 * The prompt API interface that is available in the grid [[apiRef]].
 */
export interface GridAiAssistantApi {
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
    /**
     * Sets whether the AI Assistant panel is open.
     * @param {boolean | ((prev: boolean) => boolean)} open - The new value of the AI Assistant panel open state.
     */
    setAiAssistantPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    /**
     * Sets the history of the AI Assistant.
     * @param {PromptHistory | ((prevHistory: PromptHistory) => PromptHistory)} history - The new history of the AI Assistant.
     */
    setAiAssistantHistory: (
      history: PromptHistory | ((prevHistory: PromptHistory) => PromptHistory),
    ) => void;
  };
}
