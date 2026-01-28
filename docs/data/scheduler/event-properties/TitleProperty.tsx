import * as React from 'react';
import { startOfWeek } from 'date-fns/startOfWeek';
import { setDay } from 'date-fns/setDay';
import { setHours } from 'date-fns/setHours';
import { setMinutes } from 'date-fns/setMinutes';
import {
  RecurringEventRecurrenceRule,
  SchedulerEventModelStructure,
} from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../datasets/personal-agenda';

const START_OF_FIRST_WEEK = startOfWeek(defaultVisibleDate);

interface CustomEvent {
  id: string;
  start: Date;
  end: Date;
  name: string;
  rrule: RecurringEventRecurrenceRule;
}

const initialEvents: CustomEvent[] = [
  {
    id: 'work-daily-standup',
    start: setMinutes(setHours(setDay(START_OF_FIRST_WEEK, 3), 9), 0),
    end: setMinutes(setHours(setDay(START_OF_FIRST_WEEK, 3), 9), 30),
    name: 'Daily Standup',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] },
  },
  {
    id: 'work-retro',
    start: setHours(setDay(START_OF_FIRST_WEEK, 2), 16),
    end: setHours(setDay(START_OF_FIRST_WEEK, 2), 17),
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
