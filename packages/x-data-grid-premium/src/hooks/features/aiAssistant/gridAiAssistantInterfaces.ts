export type Prompt = {
  value: string;
  createdAt: Date;
  response?: PromptResponse;
  variant?: 'success' | 'error' | 'processing';
  helperText?: string;
};

export type PromptSuggestion = {
  value: string;
};

export type Conversation = {
  id?: string;
  title?: string;
  prompts: Prompt[];
};

export type GridAiAssistantState = {
  activeConversationIndex: number;
  conversations: Conversation[];
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

type Chart = {
  dimensions: string[];
  values: string[];
};

export type PromptResponse = {
  conversationId: string;
  select: number;
  filters: ColumnFilter[];
  filterOperator?: 'and' | 'or';
  aggregation: Aggregation;
  sorting: ColumnSort[];
  grouping: Grouping[];
  pivoting: Pivoting;
  chart: Chart | null;
};

export type PromptResolverOptions = {
  /**
   * By default, MUI's prompt resolver service stores the queries made to the service to analyze potential errors and improve the service (data is never stored). Enable private mode to make the service only keep track of the token count, without any query related data.
   * @default false
   */
  privateMode?: boolean;
  /**
   * Additional context to make the processing results more accurate.
   */
  additionalContext?: string;
  /**
   * Additional metadata to track the usage for each unique user.
   */
  metadata?: {
    /**
     * The reference ID that would be stored for you to identify the entity that made the request and then to be able to track the usage for each unique user/entity.
     */
    referenceId?: string;
  };
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
     * Adds the prompt to the current conversation.
     * Updates the grid state based on the prompt response.
     * @param {string} value The prompt to process
     * @returns {Promise<PromptResponse | Error>} The grid state updates or a processing error
     */
    processPrompt: (value: string) => Promise<PromptResponse | Error>;
    /**
     * Sets the conversations.
     * @param {Conversation[] | ((prevConversations: Conversation[]) => Conversation[])} conversations The new conversations.
     */
    setConversations: (
      conversations: Conversation[] | ((prevConversations: Conversation[]) => Conversation[]),
    ) => void;
    /**
     * Sets the active conversation index.
     * @param {number} index The index of the conversation that should become active.
     * @returns {Conversation} The active conversation.
     * @throws {Error} If the conversation index does not exist.
     */
    setActiveConversationIndex: (index: number) => Conversation;
  };
}
