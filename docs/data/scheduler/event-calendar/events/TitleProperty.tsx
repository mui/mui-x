import * as React from 'react';
import { SchedulerEventModelStructure } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../../datasets/personal-agenda';

interface CustomEvent {
  id: string;
  start: string;
  end: string;
  name: string;
  rrule: string;
}

const initialEvents: CustomEvent[] = [
  {
    id: 'work-daily-standup',
    start: '2025-07-02T09:00:00',
    end: '2025-07-02T09:30:00',
    name: 'Daily Standup',
    rrule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
  },
  {
    id: 'work-retro',
    start: '2025-07-01T16:00:00',
    end: '2025-07-01T17:00:00',
    name: 'Team Retrospective',
    rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TU',
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
