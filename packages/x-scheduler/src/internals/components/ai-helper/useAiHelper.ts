'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { schedulerAiHelperSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { processEvent } from '@mui/x-scheduler-headless/process-event';
import type { AiHelperState, SchedulerEventOccurrence } from '@mui/x-scheduler-headless/models';
import type { UseAiHelperProps, UseAiHelperReturn } from './AiHelperCommandPalette.types';
import { buildContext, parseEventWithLLM, type AiEventParseResponse } from './llmClient';

const INITIAL_STATE: AiHelperState = {
  status: 'closed',
  prompt: '',
  parsedResponse: null,
  occurrence: null,
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
  const { apiKey, provider = 'openai', model, defaultDuration = 60, extraContext = '' } = props;

  const store = useSchedulerStoreContext();
  const state = useStore(store, schedulerAiHelperSelectors.aiHelper);

  const open = React.useCallback(() => {
    store.set('aiHelper', { ...INITIAL_STATE, status: 'prompting' });
  }, [store]);

  const close = React.useCallback(() => {
    store.set('aiHelper', INITIAL_STATE);
  }, [store]);

  const submit = React.useCallback(
    async (prompt: string) => {
      if (!apiKey && provider !== 'gemini-nano') {
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
        const response = await parseEventWithLLM(prompt, context, apiKey ?? '', provider, model);
        const validated = validateAndNormalize(
          response,
          store.state.adapter,
          defaultDuration,
          store.state.displayTimezone,
        );

        // Check if LLM returned an error
        if (validated.error || !validated.event) {
          store.set('aiHelper', {
            ...store.state.aiHelper,
            status: 'error',
            parsedResponse: validated,
          });
        } else {
          // Create the event immediately and generate occurrence for the edit dialog
          const { adapter, displayTimezone } = store.state;
          const parsedEvent = validated.event;
          const start = adapter.date(parsedEvent.start, displayTimezone);
          const end = parsedEvent.end
            ? adapter.date(parsedEvent.end, displayTimezone)
            : adapter.addMinutes(start, defaultDuration);

          const eventId = store.createEvent({
            title: parsedEvent.title,
            start,
            end,
            description: parsedEvent.description,
            allDay: parsedEvent.allDay,
            color: parsedEvent.color as any,
            rrule: parsedEvent.rrule as any,
          });

          store.set('visibleDate', start);

          // Generate occurrence directly from the event data
          const eventWithId = {
            title: parsedEvent.title,
            start,
            end,
            description: parsedEvent.description,
            allDay: parsedEvent.allDay,
            color: parsedEvent.color as any,
            rrule: parsedEvent.rrule as any,
            id: eventId,
          };
          const processedEvent = processEvent(eventWithId, displayTimezone, adapter);
          const occurrence: SchedulerEventOccurrence = {
            ...processedEvent,
            key: String(eventId),
          };

          store.set('aiHelper', {
            ...store.state.aiHelper,
            status: 'confirming',
            parsedResponse: validated,
            occurrence,
          });
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
    // Event was already created in submit(), just close
    close();
  }, [close]);

  const retry = React.useCallback(() => {
    store.set('aiHelper', {
      ...store.state.aiHelper,
      status: 'prompting',
      parsedResponse: null,
      occurrence: null,
    });
  }, [store]);

  return { state, open, close, submit, confirm, retry };
}
