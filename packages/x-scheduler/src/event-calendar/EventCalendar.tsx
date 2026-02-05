'use client';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  useEventCalendar,
  useExtractEventCalendarParameters,
} from '@mui/x-scheduler-headless/use-event-calendar';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import type { AiHelperState } from '@mui/x-scheduler-headless/models';
import { EventCalendarProps } from './EventCalendar.types';
import { TranslationsProvider } from '../internals/utils/TranslationsContext';
import { EventDraggableDialogProvider } from '../internals/components/event-draggable-dialog';
import { useEventCalendarUtilityClasses } from './eventCalendarClasses';
import { EventCalendarClassesContext } from './EventCalendarClassesContext';
import { EventDialogClassesContext } from '../internals/components/event-draggable-dialog/EventDialogClassesContext';
import { EventCalendarRoot } from './EventCalendarRoot';
import {
  AiHelperCommandPalette,
  AiHelperContext,
  type AiHelperContextValue,
} from '../internals/components/ai-helper';

const INITIAL_AI_HELPER_STATE: AiHelperState = {
  status: 'closed',
  prompt: '',
  parsedResponse: null,
  occurrence: null,
};

export const EventCalendar = React.forwardRef(function EventCalendar<
  TEvent extends object,
  TResource extends object,
>(
  inProps: EventCalendarProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiEventCalendar' });

  const {
    parameters,
    forwardedProps: { className, classes: classesProp, ...forwardedProps },
  } = useExtractEventCalendarParameters<TEvent, TResource, typeof props>(props);
  const store = useEventCalendar(parameters);
  const classes = useEventCalendarUtilityClasses(classesProp);

  const {
    translations,
    aiHelper,
    aiHelperApiKey,
    aiHelperProvider,
    aiHelperModel,
    aiHelperDefaultDuration,
    aiHelperExtraContext,
    ...other
  } = forwardedProps;

  const openAiHelper = React.useCallback(() => {
    store.set('aiHelper', { ...INITIAL_AI_HELPER_STATE, status: 'prompting' });
  }, [store]);

  // Keyboard shortcut: Cmd/Ctrl + K to open AI helper
  React.useEffect(() => {
    if (!aiHelper) {
      return undefined;
    }

    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        openAiHelper();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [aiHelper, openAiHelper]);

  const aiHelperContextValue = React.useMemo<AiHelperContextValue | null>(
    () =>
      aiHelper
        ? {
            open: openAiHelper,
            isEnabled: true,
          }
        : null,
    [aiHelper, openAiHelper],
  );

  return (
    <SchedulerStoreContext.Provider value={store as any}>
      <TranslationsProvider translations={translations}>
        <EventCalendarClassesContext.Provider value={classes}>
          <EventDialogClassesContext.Provider value={classes}>
            <AiHelperContext.Provider value={aiHelperContextValue}>
              <EventDraggableDialogProvider>
                <EventCalendarRoot className={className} {...other} ref={forwardedRef} />
                {aiHelper && (
                  <AiHelperCommandPalette
                    apiKey={aiHelperApiKey}
                    provider={aiHelperProvider}
                    model={aiHelperModel}
                    defaultDuration={aiHelperDefaultDuration}
                    extraContext={aiHelperExtraContext}
                  />
                )}
              </EventDraggableDialogProvider>
            </AiHelperContext.Provider>
          </EventDialogClassesContext.Provider>
        </EventCalendarClassesContext.Provider>
      </TranslationsProvider>
    </SchedulerStoreContext.Provider>
  );
}) as EventCalendarComponent;

type EventCalendarComponent = <TEvent extends object, TResource extends object>(
  props: EventCalendarProps<TEvent, TResource> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.JSX.Element;
