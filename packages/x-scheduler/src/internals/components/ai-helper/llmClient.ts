import type { SchedulerState } from '@mui/x-scheduler-headless/internals';
import type { AiHelperParsedResponse } from '@mui/x-scheduler-headless/models';

export type AiEventParseResponse = AiHelperParsedResponse;

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

export type AIProvider = 'openai' | 'anthropic' | 'gemini-nano';

/**
 * The full TypeScript data model for event creation.
 * This is sent to the LLM so it understands all available fields.
 */
const EVENT_CREATION_SCHEMA = `
// Properties to create a new event (id is auto-generated)
interface SchedulerEventCreationProperties {
  // Required fields
  title: string;                    // The title of the event
  start: string;                    // datetime string WITHOUT Z suffix
  end: string;                      // datetime string WITHOUT Z suffix

  // Optional fields
  description?: string;             // The description of the event
  allDay?: boolean;                 // Whether the event is an all-day event (default: false)
  color?: SchedulerEventColor;      // The color of the event

  // Recurrence rule (for recurring events)
  rrule?: RecurringEventRecurrenceRule;
}

// Available event colors
type SchedulerEventColor =
  | 'primary' | 'mauve' | 'violet' | 'cyan' | 'jade'
  | 'red' | 'lime' | 'orange' | 'yellow' | 'pink' | 'indigo' | 'blue';

// Recurrence rule for recurring events (subset of RFC 5545 RRULE)
// IMPORTANT: Only the combinations below are supported!
interface RecurringEventRecurrenceRule {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';  // Required: base frequency
  interval?: number;              // At which intervals the rule repeats (default: 1)
  byDay?: string[];               // ONLY for WEEKLY and MONTHLY frequency
  byMonthDay?: number[];          // ONLY for MONTHLY frequency (cannot use with byDay)
  until?: string;                 // datetime to end recurrence (exclusive with count)
  count?: number;                 // Number of occurrences (exclusive with until)
}

// SUPPORTED RECURRING PATTERNS (use ONLY these):

// DAILY frequency:
// - Every day: { freq: "DAILY" }
// - Every N days: { freq: "DAILY", interval: N }

// WEEKLY frequency:
// - Every week (same day as start): { freq: "WEEKLY" }
// - Every week on specific days: { freq: "WEEKLY", byDay: ["MO", "WE", "FR"] }
// - Every N weeks: { freq: "WEEKLY", interval: N, byDay: ["TU"] }
// - Weekday codes: "MO", "TU", "WE", "TH", "FR", "SA", "SU"

// MONTHLY frequency (use EITHER byMonthDay OR byDay, NOT both):
// - Every month on day N: { freq: "MONTHLY", byMonthDay: [15] }
// - Every month on Nth weekday: { freq: "MONTHLY", byDay: ["2TU"] } // 2nd Tuesday
// - Last weekday of month: { freq: "MONTHLY", byDay: ["-1FR"] } // last Friday
// - Ordinal format: "1MO" (1st Monday), "2TU" (2nd Tuesday), "-1FR" (last Friday)

// YEARLY frequency:
// - Every year (same date as start): { freq: "YEARLY" }
// - Every N years: { freq: "YEARLY", interval: N }
// - NOTE: byMonth, byMonthDay, byDay are NOT supported for yearly frequency

// END BOUNDARIES (optional):
// - After N occurrences: { freq: "DAILY", count: 10 }
// - Until a date: { freq: "WEEKLY", byDay: ["TU"], until: "2025-12-31T23:59:59" }
`.trim();

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
  // Parse the current date for clearer display
  const now = new Date(context.currentDateTime);
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `You parse natural language into calendar events for a scheduler application.

## IMPORTANT: Current Date, Time, and Timezone
TODAY IS: ${formattedDate}
CURRENT TIME: ${formattedTime}
CURRENT YEAR: ${now.getFullYear()}
USER'S TIMEZONE: ${context.defaultTimezone}

CRITICAL TIMEZONE RULES:
- When the user says a time like "3pm", they mean 3pm in THEIR timezone (${context.defaultTimezone}), NOT UTC.
- Return datetime strings WITHOUT the "Z" suffix - use format: "YYYY-MM-DDTHH:mm:ss" (no timezone indicator)
- Example: If user says "meeting at 3pm" and their timezone is America/New_York, return "2026-02-05T15:00:00" (NOT "2026-02-05T15:00:00Z")
- The scheduler will interpret these times in the user's display timezone.

You MUST use ${now.getFullYear()} as the year for all events unless the user explicitly specifies a different year.
When the user says "tomorrow", "next week", "next Monday", etc., calculate dates relative to TODAY (${formattedDate}).

## Other Context
- Default event duration: ${context.defaultDurationMinutes} minutes
${context.extraContext ? `- Additional context: ${context.extraContext}` : ''}

## Data Model (TypeScript)
${EVENT_CREATION_SCHEMA}

## Response Format
Return ONLY valid JSON (no markdown, no code blocks):
{
  "summary": "Brief description of what you understood",
  "event": {
    "title": "string (REQUIRED - if unclear, use 'New Event' or infer from context)",
    "start": "datetime WITHOUT Z suffix, e.g. 2026-02-05T15:00:00 (required)",
    "end": "datetime WITHOUT Z suffix (use default duration if not specified)",
    "description": "string (optional)",
    "allDay": false,
    "color": "optional color from SchedulerEventColor",
    "rrule": "optional RecurringEventRecurrenceRule object"
  },
  "confidence": 0.95,
  "error": ""
}

IMPORTANT RULES:
1. The "title" field is REQUIRED. Always provide a title:
   - Use the event name if mentioned (e.g., "Meeting with John" → title: "Meeting with John")
   - Infer from context (e.g., "lunch at noon" → title: "Lunch")
   - If completely unclear, use "New Event" as placeholder

2. Return ONLY ONE event. If the user asks for multiple events (e.g., "5 meetings"), create ONE event with a recurrence rule instead:
   - "5 daily meetings" → ONE event with rrule: { freq: "DAILY", count: 5 }
   - "3 weekly syncs" → ONE event with rrule: { freq: "WEEKLY", count: 3 }

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
- "team sync every 2nd Monday of the month" → rrule: { freq: "MONTHLY", byDay: ["2MO"] }
- "pay rent last Friday of every month" → rrule: { freq: "MONTHLY", byDay: ["-1FR"] }
- "birthday party on Dec 25" → no rrule (single event), use CURRENT YEAR (${now.getFullYear()})
- "daily standup for 2 weeks" → rrule: { freq: "DAILY", count: 14 }
- "anniversary every year" → rrule: { freq: "YEARLY" }
- "meeting tomorrow at 3pm" → no rrule, calculate tomorrow from TODAY (${formattedDate})`;
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
  const systemPrompt = buildSystemPrompt(context);
  const payload = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  };

  // eslint-disable-next-line no-console
  console.log('AI Helper [OpenAI] - System Prompt:', systemPrompt);
  // eslint-disable-next-line no-console
  console.log('AI Helper [OpenAI] - User Prompt:', prompt);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0].message.content;

  // eslint-disable-next-line no-console
  console.log('AI Helper [OpenAI] - Raw Response:', rawContent);

  try {
    const result = JSON.parse(rawContent);
    // eslint-disable-next-line no-console
    console.log('AI Helper [OpenAI] - Parsed Result:', result);
    return result;
  } catch (parseError) {
    // eslint-disable-next-line no-console
    console.error('AI Helper [OpenAI] - JSON Parse Error:', parseError);
    // Return a user-friendly error response
    return {
      summary: '',
      event: null,
      confidence: 0,
      error:
        'I can only create one event at a time. Please describe a single event, or use recurrence for repeating events (e.g., "daily standup for 5 days").',
    };
  }
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
  const systemPrompt = buildSystemPrompt(context);

  // eslint-disable-next-line no-console
  console.log('AI Helper [Anthropic] - System Prompt:', systemPrompt);
  // eslint-disable-next-line no-console
  console.log('AI Helper [Anthropic] - User Prompt:', prompt);

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
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data = await response.json();
  const rawContent = data.content[0].text;

  // eslint-disable-next-line no-console
  console.log('AI Helper [Anthropic] - Raw Response:', rawContent);

  try {
    const result = JSON.parse(rawContent);
    // eslint-disable-next-line no-console
    console.log('AI Helper [Anthropic] - Parsed Result:', result);
    return result;
  } catch (parseError) {
    // eslint-disable-next-line no-console
    console.error('AI Helper [Anthropic] - JSON Parse Error:', parseError);
    // Return a user-friendly error response
    return {
      summary: '',
      event: null,
      confidence: 0,
      error:
        'I can only create one event at a time. Please describe a single event, or use recurrence for repeating events (e.g., "daily standup for 5 days").',
    };
  }
}

/**
 * Parse a natural language prompt into an event using Chrome's built-in Prompt API (Gemini Nano).
 */
export async function parseEventWithGeminiNano(
  prompt: string,
  context: LLMContext,
): Promise<AiEventParseResponse> {
  const session = await (globalThis as any).LanguageModel.create({
    initialPrompts: [{ role: 'system', content: buildSystemPrompt(context) }],
  });

  try {
    const result: string = await session.prompt(prompt);
    // The response may contain markdown code blocks, so strip them
    const jsonStr = result
      .replace(/```json?\n?/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(jsonStr);
  } finally {
    session.destroy();
  }
}

/**
 * Parse a natural language prompt into an event using the specified provider.
 */
export async function parseEventWithLLM(
  prompt: string,
  context: LLMContext,
  apiKey: string,
  provider: AIProvider = 'openai',
  model?: string,
): Promise<AiEventParseResponse> {
  if (provider === 'gemini-nano') {
    return parseEventWithGeminiNano(prompt, context);
  }
  if (provider === 'anthropic') {
    return parseEventWithAnthropic(prompt, context, apiKey, model);
  }
  return parseEventWithOpenAI(prompt, context, apiKey, model);
}
