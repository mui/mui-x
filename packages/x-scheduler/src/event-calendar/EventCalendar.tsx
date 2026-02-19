'use client';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  useEventCalendar,
  useExtractEventCalendarParameters,
} from '@mui/x-scheduler-headless/use-event-calendar';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useInitializeApiRef } from '@mui/x-scheduler-headless/internals';
import { EventCalendarProps } from './EventCalendar.types';
import { EventDialogProvider } from '../internals/components/event-dialog';
import { useEventCalendarUtilityClasses } from './eventCalendarClasses';
import { EventCalendarStyledContext } from './EventCalendarStyledContext';
import { EventDialogStyledContext } from '../internals/components/event-dialog/EventDialogStyledContext';
import { EVENT_CALENDAR_DEFAULT_LOCALE_TEXT } from '../internals/constants/defaultLocaleText';
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

  const { localeText, apiRef, ...other } = forwardedProps;
  useInitializeApiRef(store, apiRef);

  const mergedLocaleText = React.useMemo(
    () => ({ ...EVENT_CALENDAR_DEFAULT_LOCALE_TEXT, ...localeText }),
    [localeText],
  );

  const calendarStyledContextValue = React.useMemo(
    () => ({ classes, localeText: mergedLocaleText }),
    [classes, mergedLocaleText],
  );

  const dialogStyledContextValue = React.useMemo(
    () => ({ classes, localeText: mergedLocaleText }),
    [classes, mergedLocaleText],
  );

  return (
    <SchedulerStoreContext.Provider value={store as any}>
      <EventCalendarStyledContext.Provider value={calendarStyledContextValue}>
        <EventDialogStyledContext.Provider value={dialogStyledContextValue}>
          <EventDialogProvider>
            <EventCalendarRoot className={className} {...other} ref={forwardedRef} />
          </EventDialogProvider>
        </EventDialogStyledContext.Provider>
      </EventCalendarStyledContext.Provider>
    </SchedulerStoreContext.Provider>
  );
}) as EventCalendarComponent;

type EventCalendarComponent = <TEvent extends object, TResource extends object>(
  props: EventCalendarProps<TEvent, TResource> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.JSX.Element;
