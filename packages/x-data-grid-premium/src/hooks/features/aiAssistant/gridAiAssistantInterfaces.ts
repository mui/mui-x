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
  aiAssistant: {
    /**
     * Calls the `onPrompt()` callback to evaluate the prompt and get the necessary updates to the grid state.
     * Adds the prompt to the history.
     * Updates the grid state based on the prompt response.
     * @param {string} value The prompt to process
     * @returns {Promise<PromptResponse | Error>} The grid state updates or a processing error
     */
    processPrompt: (value: string) => Promise<PromptResponse | Error>;
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
