'use client';
import * as React from 'react';
import { EventCalendarProvider as HeadlessEventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { eventCalendarClasses } from '../../event-calendar/eventCalendarClasses';
import { EventCalendarClassesContext } from '../../event-calendar/EventCalendarClassesContext';
import { EventDialogClassesContext } from './event-draggable-dialog/EventDialogClassesContext';

export function EventCalendarProvider<TEvent extends object, TResource extends object>(
  props: HeadlessEventCalendarProvider.Props<TEvent, TResource>,
) {
  const { children, ...other } = props;

  return (
    <HeadlessEventCalendarProvider {...other}>
      <EventCalendarClassesContext.Provider value={eventCalendarClasses}>
        <EventDialogClassesContext.Provider value={eventCalendarClasses}>
          {children}
        </EventDialogClassesContext.Provider>
      </EventCalendarClassesContext.Provider>
    </HeadlessEventCalendarProvider>
  );
}
