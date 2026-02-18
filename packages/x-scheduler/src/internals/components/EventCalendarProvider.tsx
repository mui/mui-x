'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { EventCalendarProvider as HeadlessEventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';
import { EventCalendarStyledContext } from '../../event-calendar/EventCalendarStyledContext';
import { EventDialogStyledContext } from './event-dialog/EventDialogStyledContext';
import { EVENT_CALENDAR_DEFAULT_LOCALE_TEXT } from '../constants/defaultLocaleText';
import { schedulerTokens } from '../utils/tokens';

/**
 * Root wrapper for standalone views that provides CSS variable tokens.
 * This ensures event colors work correctly outside of EventCalendar.
 */
const StandaloneViewRoot = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'StandaloneViewRoot',
})(({ theme }) => ({
  ...schedulerTokens,
  display: 'contents',
  fontFamily: theme.typography.fontFamily,
}));

const calendarStyledValue = {
  classes: eventCalendarClasses,
  localeText: EVENT_CALENDAR_DEFAULT_LOCALE_TEXT,
};
const dialogStyledValue = {
  classes: eventCalendarClasses,
  localeText: EVENT_CALENDAR_DEFAULT_LOCALE_TEXT,
};

export function EventCalendarProvider<TEvent extends object, TResource extends object>(
  props: HeadlessEventCalendarProvider.Props<TEvent, TResource>,
) {
  const { children, ...other } = props;

  return (
    <HeadlessEventCalendarProvider {...other}>
      <EventCalendarStyledContext.Provider value={calendarStyledValue}>
        <EventDialogStyledContext.Provider value={dialogStyledValue}>
          <StandaloneViewRoot>{children}</StandaloneViewRoot>
        </EventDialogStyledContext.Provider>
      </EventCalendarStyledContext.Provider>
    </HeadlessEventCalendarProvider>
  );
}
