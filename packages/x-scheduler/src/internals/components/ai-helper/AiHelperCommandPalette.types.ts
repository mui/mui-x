import type { AiEventParseResponse } from './llmClient';

/**
 * Status of the AI helper state machine.
 */
export type AiHelperStatus = 'closed' | 'prompting' | 'processing' | 'error' | 'confirming';

/**
 * State of the AI helper.
 */
export interface AiHelperState {
  /** Current status */
  status: AiHelperStatus;
  /** The prompt entered by the user */
  prompt: string;
  /** The parsed response from the LLM */
  parsedResponse: AiEventParseResponse | null;
}

/**
 * Props for the AI helper hook.
 */
export interface UseAiHelperProps {
  /** API key for the LLM provider */
  apiKey?: string;
  /** LLM provider to use */
  provider?: 'openai' | 'anthropic';
  /** Model to use */
  model?: string;
  /** Default event duration in minutes */
  defaultDuration?: number;
  /** Additional context to provide to the LLM */
  extraContext?: string;
}

/**
 * Return type for the AI helper hook.
 */
export interface UseAiHelperReturn {
  /** Current state */
  state: AiHelperState;
  /** Open the AI helper modal */
  open: () => void;
  /** Close the AI helper modal */
  close: () => void;
  /** Submit a prompt to the LLM */
  submit: (prompt: string) => Promise<void>;
  /** Confirm and create the parsed event */
  confirm: () => void;
  /** Open the edit dialog with parsed event data */
  edit: () => void;
  /** Retry after an error */
  retry: () => void;
}

/**
 * Props for the AiHelperCommandPalette component.
 */
export interface AiHelperCommandPaletteProps {
  /** API key for the LLM provider */
  apiKey?: string;
  /** LLM provider to use */
  provider?: 'openai' | 'anthropic';
  /** Model to use */
  model?: string;
  /** Default event duration in minutes */
  defaultDuration?: number;
  /** Additional context to provide to the LLM */
  extraContext?: string;
}

/**
 * Ref handle for the AiHelperCommandPalette component.
 */
export interface AiHelperCommandPaletteHandle {
  /** Open the AI helper modal */
  open: () => void;
}
