import * as React from 'react';
import {
  RecurringEventRecurrenceRule,
  SchedulerEventModelStructure,
} from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../datasets/personal-agenda';

interface CustomEvent {
  id: string;
  begins: string;
  finishes: string;
  title: string;
  rrule: RecurringEventRecurrenceRule;
}

const initialEvents: CustomEvent[] = [
  {
    id: 'work-daily-standup',
    begins: '2025-07-02T09:00:00',
    finishes: '2025-07-02T09:30:00',
    title: 'Daily Standup',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] },
  },
  {
    id: 'work-retro',
    begins: '2025-07-02T16:00:00',
    finishes: '2025-07-02T17:00:00',
    title: 'Team Retrospective',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TU'] },
  },
];

const eventModelStructure: SchedulerEventModelStructure<CustomEvent> = {
  start: {
    getter: (event) => event.begins,
    setter: (event, newValue) => {
      event.begins = newValue;
      return event;
    },
  },
  end: {
    getter: (event) => event.finishes,
    setter: (event, newValue) => {
      event.finishes = newValue;
      return event;
    },
  },
};

export default function StartEndProperties() {
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
