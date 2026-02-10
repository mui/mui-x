import * as React from 'react';
import { startOfWeek } from 'date-fns/startOfWeek';
import { setDay } from 'date-fns/setDay';
import { setHours } from 'date-fns/setHours';
import { setMinutes } from 'date-fns/setMinutes';
import { format } from 'date-fns/format';
import {
  RecurringEventRecurrenceRule,
  SchedulerEventModelStructure,
} from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../datasets/personal-agenda';

const START_OF_FIRST_WEEK = startOfWeek(defaultVisibleDate);

/**
 * Converts a Date to a wall-time ISO string (no trailing Z).
 */
const str = (date: Date): string => format(date, "yyyy-MM-dd'T'HH:mm:ss");

interface CustomEvent {
  id: string;
  start: string;
  end: string;
  name: string;
  rrule: RecurringEventRecurrenceRule;
}

const initialEvents: CustomEvent[] = [
  {
    id: 'work-daily-standup',
    start: str(setMinutes(setHours(setDay(START_OF_FIRST_WEEK, 3), 9), 0)),
    end: str(setMinutes(setHours(setDay(START_OF_FIRST_WEEK, 3), 9), 30)),
    name: 'Daily Standup',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] },
  },
  {
    id: 'work-retro',
    start: str(setHours(setDay(START_OF_FIRST_WEEK, 2), 16)),
    end: str(setHours(setDay(START_OF_FIRST_WEEK, 2), 17)),
    name: 'Team Retrospective',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TU'] },
  },
];

const eventModelStructure: SchedulerEventModelStructure<CustomEvent> = {
  title: {
    getter: (event) => event.name,
    setter: (event, newValue) => {
      event.name = newValue;
      return event;
    },
  },
};

export default function TitleProperty() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        eventModelStructure={eventModelStructure}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
