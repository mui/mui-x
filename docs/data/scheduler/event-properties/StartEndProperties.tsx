import * as React from 'react';
import { DateTime } from 'luxon';
import { RRuleSpec, SchedulerEventModelStructure } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../datasets/personal-agenda';

const START_OF_FIRST_WEEK = defaultVisibleDate.startOf('week');

interface CustomEvent {
  id: string;
  start: string;
  end: string;
  title: string;
  rrule: RRuleSpec;
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
    getter: (event) => DateTime.fromISO(event.start),
    setter: (event, newValue) => {
      event.start = newValue.toISO()!;
      return event;
    },
  },
  end: {
    getter: (event) => DateTime.fromISO(event.end),
    setter: (event, newValue) => {
      event.end = newValue.toISO()!;
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
        preferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
