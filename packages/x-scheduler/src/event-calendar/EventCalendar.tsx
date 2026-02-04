'use client';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  useEventCalendar,
  useExtractEventCalendarParameters,
} from '@mui/x-scheduler-headless/use-event-calendar';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
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
  type AiHelperCommandPaletteHandle,
  type AiHelperContextValue,
} from '../internals/components/ai-helper';

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

  const aiHelperRef = React.useRef<AiHelperCommandPaletteHandle>(null);

  // Keyboard shortcut: Cmd/Ctrl + K to open AI helper
  React.useEffect(() => {
    if (!aiHelper) {
      return undefined;
    }

    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        aiHelperRef.current?.open();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [aiHelper]);

  const aiHelperContextValue = React.useMemo<AiHelperContextValue | null>(
    () =>
      aiHelper
        ? {
            open: () => aiHelperRef.current?.open(),
            isEnabled: true,
          }
        : null,
    [aiHelper],
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
                    ref={aiHelperRef}
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
