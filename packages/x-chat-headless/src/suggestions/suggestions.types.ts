export interface ChatSuggestion {
  /** The value to pre-fill into the composer when the suggestion is clicked. */
  value: string;
  /** Display label. Falls back to `value` if omitted. */
  label?: string;
}

export interface SuggestionsRootOwnerState {
  isEmpty: boolean;
  suggestionCount: number;
}

export interface SuggestionItemOwnerState {
  value: string;
  label: string;
  index: number;
}
