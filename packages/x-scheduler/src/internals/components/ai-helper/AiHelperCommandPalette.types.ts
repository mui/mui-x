import type { AiHelperState } from '@mui/x-scheduler-headless/models';
import { AIProvider } from './llmClient';

export type { AiHelperState, AiHelperStatus } from '@mui/x-scheduler-headless/models';

/**
 * Props for the AI helper hook.
 */
export interface UseAiHelperProps {
  /** API key for the LLM provider */
  apiKey?: string;
  /** LLM provider to use */
  provider?: AIProvider;
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
  /** Confirm the created event and close */
  confirm: () => void;
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
  provider?: AIProvider;
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
