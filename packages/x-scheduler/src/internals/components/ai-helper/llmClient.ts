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
  /** Schema description for event properties */
  eventSchema: Record<string, string>;
  /** Additional context provided by the user */
  extraContext: string;
}

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
    eventSchema: {
      title: 'string (required)',
      start: 'ISO8601 datetime (required)',
      end: 'ISO8601 datetime (optional)',
      description: 'string (optional)',
      allDay: 'boolean (optional, default false)',
    },
    extraContext,
  };
}

/**
 * Build the system prompt for the LLM.
 */
export function buildSystemPrompt(context: LLMContext): string {
  return `You parse natural language into calendar events.

Current context:
- Now: ${context.currentDateTime}
- Timezone: ${context.defaultTimezone}
- Default duration: ${context.defaultDurationMinutes} minutes
${context.extraContext ? `- Additional context: ${context.extraContext}` : ''}

Return ONLY valid JSON (no markdown):
{
  "summary": "Brief description of what you understood",
  "event": {
    "title": "required string",
    "start": "ISO8601 datetime",
    "end": "ISO8601 datetime (optional, use default duration if missing)",
    "description": "optional",
    "allDay": false
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
}`;
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
