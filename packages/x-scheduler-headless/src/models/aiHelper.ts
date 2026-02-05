import type { SchedulerEventOccurrence } from './event';

/**
 * Status of the AI helper state machine.
 */
export type AiHelperStatus = 'closed' | 'prompting' | 'processing' | 'error' | 'confirming';

/**
 * Parsed event data returned by the LLM.
 */
export interface AiHelperParsedResponse {
  /** Human-readable summary of what the AI understood */
  summary: string;
  /** Parsed event data (null if parsing failed) */
  event: {
    title: string;
    start: string;
    end?: string;
    description?: string;
    allDay?: boolean;
    color?: string;
    rrule?: Record<string, unknown> | string;
  } | null;
  /** Confidence score from 0 to 1 */
  confidence: number;
  /** Error description if parsing failed */
  error: string;
}

/**
 * State of the AI helper.
 */
export interface AiHelperState {
  /** Current status */
  status: AiHelperStatus;
  /** The prompt entered by the user */
  prompt: string;
  /** The parsed response from the LLM */
  parsedResponse: AiHelperParsedResponse | null;
  /** The occurrence of the created event (available in confirming state) */
  occurrence: SchedulerEventOccurrence | null;
}
