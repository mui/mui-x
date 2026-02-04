'use client';
import * as React from 'react';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import type {
  AiHelperState,
  UseAiHelperProps,
  UseAiHelperReturn,
} from './AiHelperCommandPalette.types';
import { buildContext, parseEventWithLLM, type AiEventParseResponse } from './llmClient';

const INITIAL_STATE: AiHelperState = {
  status: 'closed',
  prompt: '',
  parsedResponse: null,
};

/**
 * Validate and normalize the LLM response.
 */
function validateAndNormalize(
  response: unknown,
  adapter: any,
  defaultDuration: number,
  displayTimezone: string,
): AiEventParseResponse {
  const data = typeof response === 'string' ? JSON.parse(response) : response;

  // If LLM returned an error, pass it through
  if (data.error || !data.event) {
    return {
      summary: data.summary || '',
      event: null,
      confidence: 0,
      error: data.error || 'No event data returned',
    };
  }

  // Validate required fields
  if (!data.event.title) {
    return {
      summary: '',
      event: null,
      confidence: 0,
      error: 'Missing event title',
    };
  }

  if (!data.event.start) {
    return {
      summary: '',
      event: null,
      confidence: 0,
      error: 'Missing start time',
    };
  }

  // Parse ISO strings using the adapter's date method
  const start = adapter.date(data.event.start, displayTimezone);
  const end = data.event.end
    ? adapter.date(data.event.end, displayTimezone)
    : adapter.addMinutes(start, defaultDuration);

  return {
    summary: data.summary || `Creating: ${data.event.title}`,
    confidence: Math.max(0, Math.min(1, data.confidence ?? 0.5)),
    error: '',
    event: {
      title: data.event.title,
      start: data.event.start,
      end: data.event.end || adapter.toJsDate(end).toISOString(),
      description: data.event.description,
      allDay: data.event.allDay ?? false,
    },
  };
}

/**
 * Hook for managing the AI helper state and actions.
 */
export function useAiHelper(props: UseAiHelperProps): UseAiHelperReturn {
  const {
    apiKey,
    provider = 'openai',
    model,
    defaultDuration = 60,
    extraContext = '',
  } = props;

  const [state, setState] = React.useState<AiHelperState>(INITIAL_STATE);
  const store = useSchedulerStoreContext();

  const open = React.useCallback(() => {
    setState((s) => ({ ...s, status: 'prompting' }));
  }, []);

  const close = React.useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const submit = React.useCallback(
    async (prompt: string) => {
      if (!apiKey) {
        setState((s) => ({
          ...s,
          status: 'error',
          prompt,
          parsedResponse: {
            summary: '',
            event: null,
            confidence: 0,
            error: 'API key is required',
          },
        }));
        return;
      }

      setState((s) => ({ ...s, status: 'processing', prompt }));

      try {
        const context = buildContext(store.state, defaultDuration, extraContext);
        const response = await parseEventWithLLM(prompt, context, apiKey, provider, model);
        const validated = validateAndNormalize(
          response,
          store.state.adapter,
          defaultDuration,
          store.state.displayTimezone,
        );

        // Check if LLM returned an error
        if (validated.error || !validated.event) {
          setState((s) => ({ ...s, status: 'error', parsedResponse: validated }));
        } else {
          setState((s) => ({ ...s, status: 'confirming', parsedResponse: validated }));
        }
      } catch (error: any) {
        setState((s) => ({
          ...s,
          status: 'error',
          parsedResponse: {
            summary: '',
            event: null,
            confidence: 0,
            error: error.message || 'Failed to parse event',
          },
        }));
      }
    },
    [apiKey, provider, model, defaultDuration, extraContext, store],
  );

  const confirm = React.useCallback(() => {
    if (state.parsedResponse?.event) {
      const { event } = state.parsedResponse;

      try {
        // Convert ISO strings back to temporal objects using the adapter
        const { adapter, displayTimezone } = store.state;
        const start = adapter.date(event.start, displayTimezone);
        const end = event.end
          ? adapter.date(event.end, displayTimezone)
          : adapter.addMinutes(start, defaultDuration);

        const createdEvent = store.createEvent({
          title: event.title,
          start,
          end,
          description: event.description,
          allDay: event.allDay,
        });

        // eslint-disable-next-line no-console
        console.log('AI Helper: Event created', createdEvent);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('AI Helper: Failed to create event', error);
      }

      close();
    }
  }, [state.parsedResponse, store, close, defaultDuration]);

  const edit = React.useCallback(() => {
    if (state.parsedResponse?.event) {
      const { event } = state.parsedResponse;
      const { adapter, displayTimezone } = store.state;

      const start = adapter.date(event.start, displayTimezone);
      const end = event.end
        ? adapter.date(event.end, displayTimezone)
        : adapter.addMinutes(start, defaultDuration);

      store.setOccurrencePlaceholder({
        type: 'creation',
        surfaceType: event.allDay ? 'day-grid' : 'time-grid',
        start,
        end,
        resourceId: null,
      });
      close();
    }
  }, [state.parsedResponse, store, close, defaultDuration]);

  const retry = React.useCallback(() => {
    setState((s) => ({ ...s, status: 'prompting', parsedResponse: null }));
  }, []);

  return { state, open, close, submit, confirm, edit, retry };
}
