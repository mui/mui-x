import * as React from 'react';
import { parseISO } from 'date-fns/parseISO';
import { formatISO } from 'date-fns/formatISO';
import {
  RecurringEventRecurrenceRule,
  SchedulerEventModelStructure,
} from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../../datasets/personal-agenda';

interface CustomEvent {
  id: string;
  start: string;
  end: string;
  title: string;
  rrule: RecurringEventRecurrenceRule;
}

const initialEvents: CustomEvent[] = [
  {
    id: 'work-daily-standup',
    start: '2025-07-02T09:00:00',
    end: '2025-07-02T09:30:00',
    title: 'Daily Standup',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] },
  },
  {
    id: 'work-retro',
    start: '2025-07-02T16:00:00',
    end: '2025-07-02T17:00:00',
    title: 'Team Retrospective',
    rrule: { freq: 'WEEKLY', interval: 2, byDay: ['TU'] },
  },
];

const eventModelStructure: SchedulerEventModelStructure<CustomEvent> = {
  start: {
    getter: (event) => parseISO(event.start),
    setter: (event, newValue) => {
      event.start = formatISO(newValue);
      return event;
    },
  },
  end: {
    getter: (event) => parseISO(event.end),
    setter: (event, newValue) => {
      event.end = formatISO(newValue);
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
