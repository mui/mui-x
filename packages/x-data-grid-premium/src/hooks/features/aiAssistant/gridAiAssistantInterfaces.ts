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
  id: string;
  title: string;
  prompts: Prompt[];
};

export type GridAiAssistantState = {
  panelOpen: boolean;
  activeConversationId: string;
  conversations: Conversation[];
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
  conversationId: string;
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
     * Adds the prompt to the current conversation.
     * Updates the grid state based on the prompt response.
     * @param {string} value The prompt to process
     * @returns {Promise<PromptResponse | Error>} The grid state updates or a processing error
     */
    processPrompt: (value: string) => Promise<PromptResponse | Error>;
    /**
     * Sets whether the AI Assistant panel is open.
     * @param {boolean | ((prev: boolean) => boolean)} open The new value of the AI Assistant panel open state.
     */
    setAiAssistantPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    /**
     * Creates a new conversation.
     */
    createAiAssistantConversation: () => void;
    /**
     * Gets the conversation with the given id.
     * @param {string} id The id of the conversation.
     * @returns {Conversation | undefined} The conversation or undefined if it does not exist.
     */
    getAiAssistantConversation: (id: string) => Conversation | undefined;
    /**
     * Sets the prompts of a conversation.
     * @param {string} id The id of the conversation.
     * @param {Prompt[] | ((prevPrompts: Prompt[]) => Prompt[])} prompts The new prompts of the conversation.
     */
    setAiAssistantConversation: (
      id: string,
      prompts: Prompt[] | ((prevPrompts: Prompt[]) => Prompt[]),
    ) => void;
    /**
     * Sets the active conversation id.
     * @param {string} id The id of the conversation.
     */
    setAiAssistantActiveConversationId: (id: string) => void;
  };
}
