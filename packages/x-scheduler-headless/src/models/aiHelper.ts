import type {
  SchedulerEventOccurrence,
  SchedulerEventCreationProperties,
  SchedulerEventColor,
} from './event';
import type { RecurringEventRecurrenceRule } from './recurringEvent';

/**
 * Status of the AI helper state machine.
 */
export type AiHelperStatus = 'closed' | 'prompting' | 'processing' | 'error' | 'confirming';

/**
 * Event data as returned by the LLM (with string dates instead of temporal objects).
 * This is converted to SchedulerEventCreationProperties before creating the event.
 */
export type AiHelperParsedEvent = Omit<SchedulerEventCreationProperties, 'start' | 'end' | 'rrule' | 'color'> & {
  /** Start datetime as ISO string (without Z suffix) */
  start: string;
  /** End datetime as ISO string (without Z suffix) */
  end?: string;
  /** Event color */
  color?: SchedulerEventColor;
  /** Recurrence rule */
  rrule?: RecurringEventRecurrenceRule;
};

/**
 * Parsed event data returned by the LLM.
 */
export interface AiHelperParsedResponse {
  /** Human-readable summary of what the AI understood */
  summary: string;
  /** Parsed event data (null if parsing failed) */
  event: AiHelperParsedEvent | null;
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
