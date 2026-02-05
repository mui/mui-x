'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { schedulerAiHelperSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import type { AiHelperState } from '@mui/x-scheduler-headless/models';
import type { UseAiHelperProps, UseAiHelperReturn } from './AiHelperCommandPalette.types';
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
      color: data.event.color,
      rrule: data.event.rrule,
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

  const store = useSchedulerStoreContext();
  const state = useStore(store, schedulerAiHelperSelectors.aiHelper);

  const open = React.useCallback(() => {
    store.set('aiHelper', { ...store.state.aiHelper, status: 'prompting' });
  }, [store]);

  const close = React.useCallback(() => {
    store.set('aiHelper', INITIAL_STATE);
  }, [store]);

  const submit = React.useCallback(
    async (prompt: string) => {
      if (!apiKey) {
        store.set('aiHelper', {
          ...store.state.aiHelper,
          status: 'error',
          prompt,
          parsedResponse: {
            summary: '',
            event: null,
            confidence: 0,
            error: 'API key is required',
          },
        });
        return;
      }

      store.set('aiHelper', { ...store.state.aiHelper, status: 'processing', prompt });

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
          store.set('aiHelper', { ...store.state.aiHelper, status: 'error', parsedResponse: validated });
        } else {
          store.set('aiHelper', { ...store.state.aiHelper, status: 'confirming', parsedResponse: validated });
        }
      } catch (error: any) {
        store.set('aiHelper', {
          ...store.state.aiHelper,
          status: 'error',
          parsedResponse: {
            summary: '',
            event: null,
            confidence: 0,
            error: error.message || 'Failed to parse event',
          },
        });
      }
    },
    [apiKey, provider, model, defaultDuration, extraContext, store],
  );

  const confirm = React.useCallback(() => {
    const { parsedResponse } = store.state.aiHelper;
    if (parsedResponse?.event) {
      const { event } = parsedResponse;

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
          color: event.color as any,
          rrule: event.rrule as any,
        });

        // eslint-disable-next-line no-console
        console.log('AI Helper: Event created', createdEvent);
      } catch (error) {
        console.error('AI Helper: Failed to create event', error);
      }

      close();
    }
  }, [store, close, defaultDuration]);

  const edit = React.useCallback(() => {
    const { parsedResponse } = store.state.aiHelper;
    if (parsedResponse?.event) {
      const { event } = parsedResponse;
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
  }, [store, close, defaultDuration]);

  const retry = React.useCallback(() => {
    store.set('aiHelper', { ...store.state.aiHelper, status: 'prompting', parsedResponse: null });
  }, [store]);

  return { state, open, close, submit, confirm, edit, retry };
}
