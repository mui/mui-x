'use client';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { EventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
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
import { EventCalendarRoot } from './EventCalendarRoot';

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

  const { translations, ...other } = forwardedProps;

  return (
    <EventCalendarStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        <TranslationsProvider translations={translations}>
          <EventCalendarClassesContext.Provider value={classes}>
            <EventDraggableDialogProvider>
              <EventCalendarRoot className={className} {...other} ref={forwardedRef} />
            </EventDraggableDialogProvider>
          </EventCalendarClassesContext.Provider>
        </TranslationsProvider>
      </SchedulerStoreContext.Provider>
    </EventCalendarStoreContext.Provider>
  );
}) as EventCalendarComponent;

type EventCalendarComponent = <TEvent extends object, TResource extends object>(
  props: EventCalendarProps<TEvent, TResource> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.JSX.Element;
