import * as React from 'react';
import { DateTime } from 'luxon';
import { RRuleSpec, SchedulerEventModelStructure } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../datasets/personal-agenda';

const START_OF_FIRST_WEEK = defaultVisibleDate.startOf('week');

interface CustomEvent {
  id: string;
  start: DateTime;
  end: DateTime;
  name: string;
  rrule: RRuleSpec;
}

const initialEvents: CustomEvent[] = [
  {
    id: 'work-daily-standup',
    start: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 9, minute: 0 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 3, hour: 9, minute: 30 }),
    name: 'Daily Standup',
    rrule: { freq: 'WEEKLY', interval: 1, byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] },
  },
  {
    id: 'work-retro',
    start: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 16 }),
    end: START_OF_FIRST_WEEK.set({ weekday: 2, hour: 17 }),
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
        preferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
