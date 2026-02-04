import type { SchedulerState } from '@mui/x-scheduler-headless/internals';

/**
 * Context sent to the LLM for parsing natural language into events.
 */
export interface LLMContext {
  /** Current datetime in ISO format */
  currentDateTime: string;
  /** Default timezone (e.g., "America/New_York") */
  defaultTimezone: string;
  /** Default event duration in minutes */
  defaultDurationMinutes: number;
  /** Additional context provided by the user */
  extraContext: string;
}

/**
 * The full TypeScript data model for event creation.
 * This is sent to the LLM so it understands all available fields.
 */
const EVENT_CREATION_SCHEMA = `
// Properties to create a new event (id is auto-generated)
interface SchedulerEventCreationProperties {
  // Required fields
  title: string;                    // The title of the event
  start: string;                    // ISO8601 datetime string
  end: string;                      // ISO8601 datetime string

  // Optional fields
  description?: string;             // The description of the event
  allDay?: boolean;                 // Whether the event is an all-day event (default: false)
  timezone?: string;                // The timezone of the event dates (e.g., "America/New_York")
  color?: SchedulerEventColor;      // The color of the event

  // Recurrence rule (for recurring events)
  rrule?: RecurringEventRecurrenceRule | string;  // Can be object or RFC5545 RRULE string
}

// Available event colors
type SchedulerEventColor =
  | 'primary' | 'mauve' | 'violet' | 'cyan' | 'jade'
  | 'red' | 'lime' | 'orange' | 'yellow' | 'pink' | 'indigo' | 'blue';

// Recurrence rule for recurring events (subset of RFC 5545 RRULE)
interface RecurringEventRecurrenceRule {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';  // Required: base frequency
  interval?: number;              // At which intervals the rule repeats (default: 1)
  byDay?: string[];               // Days the event occurs on
                                  // Weekly: weekday codes like "MO", "TU", "WE", "TH", "FR", "SA", "SU"
                                  // Monthly: ordinal + weekday like "2TU" (2nd Tuesday), "-1FR" (last Friday)
  byMonthDay?: number[];          // Days of the month (1-31)
  byMonth?: number[];             // Months of the year (1-12)
  until?: string;                 // ISO8601 datetime to end recurrence (exclusive with count)
  count?: number;                 // Number of occurrences (exclusive with until)
}

// Examples of rrule:
// - Daily: { freq: "DAILY" }
// - Every weekday: { freq: "WEEKLY", byDay: ["MO", "TU", "WE", "TH", "FR"] }
// - Weekly on Tuesdays: { freq: "WEEKLY", byDay: ["TU"] }
// - Monthly on the 15th: { freq: "MONTHLY", byMonthDay: [15] }
// - Monthly on 2nd Tuesday: { freq: "MONTHLY", byDay: ["2TU"] }
// - Yearly on March 15: { freq: "YEARLY", byMonth: [3], byMonthDay: [15] }
// - Every 2 weeks: { freq: "WEEKLY", interval: 2 }
// - Daily for 10 occurrences: { freq: "DAILY", count: 10 }
// - As RFC5545 string: "FREQ=WEEKLY;BYDAY=MO,WE,FR"
`.trim();

/**
 * Response from the LLM after parsing a natural language prompt.
 */
export interface AiEventParseResponse {
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
 * Build context from scheduler state for the LLM.
 */
export function buildContext(
  storeState: SchedulerState<object>,
  defaultDuration: number,
  extraContext: string = '',
): LLMContext {
  const { adapter, displayTimezone } = storeState;

  return {
    currentDateTime: adapter.now(displayTimezone).toISOString(),
    defaultTimezone: displayTimezone,
    defaultDurationMinutes: defaultDuration,
    extraContext,
  };
}

/**
 * Build the system prompt for the LLM.
 */
export function buildSystemPrompt(context: LLMContext): string {
  return `You parse natural language into calendar events for a scheduler application.

## Current Context
- Current datetime: ${context.currentDateTime}
- Timezone: ${context.defaultTimezone}
- Default event duration: ${context.defaultDurationMinutes} minutes
${context.extraContext ? `- Additional context: ${context.extraContext}` : ''}

## Data Model (TypeScript)
${EVENT_CREATION_SCHEMA}

## Response Format
Return ONLY valid JSON (no markdown, no code blocks):
{
  "summary": "Brief description of what you understood",
  "event": {
    "title": "string (required)",
    "start": "ISO8601 datetime string (required)",
    "end": "ISO8601 datetime string (use default duration if not specified)",
    "description": "string (optional)",
    "allDay": false,
    "color": "optional color from SchedulerEventColor",
    "rrule": "optional RecurringEventRecurrenceRule object or RFC5545 string"
  },
  "confidence": 0.95,
  "error": ""
}

If you cannot parse the input or it's not a valid event description, return:
{
  "summary": "",
  "event": null,
  "confidence": 0,
  "error": "Description of what went wrong"
}

## Examples
- "standup every weekday at 9am" → rrule: { freq: "WEEKLY", byDay: ["MO", "TU", "WE", "TH", "FR"] }
- "team meeting every Tuesday at 2pm" → rrule: { freq: "WEEKLY", byDay: ["TU"] }
- "dentist on the 15th of every month" → rrule: { freq: "MONTHLY", byMonthDay: [15] }
- "birthday party on Dec 25" → no rrule (single event)
- "vacation next week" → allDay: true, no rrule`;
}

/**
 * Parse a natural language prompt into an event using OpenAI API.
 */
export async function parseEventWithOpenAI(
  prompt: string,
  context: LLMContext,
  apiKey: string,
  model: string = 'gpt-4o-mini',
): Promise<AiEventParseResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt(context) },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

/**
 * Parse a natural language prompt into an event using Anthropic API.
 */
export async function parseEventWithAnthropic(
  prompt: string,
  context: LLMContext,
  apiKey: string,
  model: string = 'claude-3-haiku-20240307',
): Promise<AiEventParseResponse> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: buildSystemPrompt(context),
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content[0].text;
  return JSON.parse(content);
}

/**
 * Parse a natural language prompt into an event using the specified provider.
 */
export async function parseEventWithLLM(
  prompt: string,
  context: LLMContext,
  apiKey: string,
  provider: 'openai' | 'anthropic' = 'openai',
  model?: string,
): Promise<AiEventParseResponse> {
  if (provider === 'anthropic') {
    return parseEventWithAnthropic(prompt, context, apiKey, model);
  }
  return parseEventWithOpenAI(prompt, context, apiKey, model);
}
