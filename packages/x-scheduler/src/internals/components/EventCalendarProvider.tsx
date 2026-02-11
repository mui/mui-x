'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { EventCalendarProvider as HeadlessEventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';
import { EventCalendarClassesContext } from '../../event-calendar/EventCalendarClassesContext';
import { EventDialogClassesContext } from './event-dialog/EventDialogClassesContext';
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

export function EventCalendarProvider<TEvent extends object, TResource extends object>(
  props: HeadlessEventCalendarProvider.Props<TEvent, TResource>,
) {
  const { children, ...other } = props;

  return (
    <HeadlessEventCalendarProvider {...other}>
      <EventCalendarClassesContext.Provider value={eventCalendarClasses}>
        <EventDialogClassesContext.Provider value={eventCalendarClasses}>
          <StandaloneViewRoot>{children}</StandaloneViewRoot>
        </EventDialogClassesContext.Provider>
      </EventCalendarClassesContext.Provider>
    </HeadlessEventCalendarProvider>
  );
}
