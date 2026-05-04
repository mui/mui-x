'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useId } from '@base-ui/utils/useId';
import { EventCalendarProvider as UnstyledEventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';
import { EventCalendarStyledContext } from '../../event-calendar/EventCalendarStyledContext';
import { EventDialogStyledContext } from './event-dialog/EventDialogStyledContext';
import { EVENT_CALENDAR_DEFAULT_LOCALE_TEXT } from '../constants/defaultLocaleText';

/**
 * Root wrapper for standalone views that provides CSS variable tokens.
 * This ensures event colors work correctly outside of EventCalendar.
 */
const StandaloneViewRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'StandaloneViewRoot',
})(({ theme }) => ({
  display: 'contents',
  fontFamily: theme.typography.fontFamily,
  boxSizing: 'border-box',
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
}));

export function EventCalendarProvider<TEvent extends object, TResource extends object>(
  props: UnstyledEventCalendarProvider.Props<TEvent, TResource>,
) {
  const { children, ...other } = props;
  const schedulerId = useId();

  const calendarStyledValue = React.useMemo(
    () => ({
      schedulerId,
      classes: eventCalendarClasses,
      localeText: EVENT_CALENDAR_DEFAULT_LOCALE_TEXT,
    }),
    [schedulerId],
  );
  const dialogStyledValue = React.useMemo(
    () => ({
      schedulerId,
      classes: eventCalendarClasses,
      localeText: EVENT_CALENDAR_DEFAULT_LOCALE_TEXT,
    }),
    [schedulerId],
  );

  return (
    <UnstyledEventCalendarProvider {...other}>
      <EventCalendarStyledContext.Provider value={calendarStyledValue}>
        <EventDialogStyledContext.Provider value={dialogStyledValue}>
          <StandaloneViewRoot>{children}</StandaloneViewRoot>
        </EventDialogStyledContext.Provider>
      </EventCalendarStyledContext.Provider>
    </UnstyledEventCalendarProvider>
  );
}
