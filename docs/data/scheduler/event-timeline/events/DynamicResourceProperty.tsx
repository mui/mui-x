import * as React from 'react';
import { setHours } from 'date-fns/setHours';
import { setMinutes } from 'date-fns/setMinutes';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import capitalize from '@mui/utils/capitalize';
import {
  SchedulerResource,
  SchedulerEventModelStructure,
} from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../../datasets/company-roadmap';

interface CustomEvent {
  id: string;
  start: Date;
  end: Date;
  room: string;
  teacher: string;
}

const initialEvents: CustomEvent[] = [
  // July 1, 2025 (defaultVisibleDate) - Tuesday schedule

  // 8:00-9:30 AM slots
  {
    id: 'math-1-room-a',
    start: setMinutes(setHours(defaultVisibleDate, 8), 0),
    end: setMinutes(setHours(defaultVisibleDate, 9), 30),
    room: 'Room A',
    teacher: 'french',
  },
  {
    id: 'science-1-room-b',
    start: setMinutes(setHours(defaultVisibleDate, 8), 0),
    end: setMinutes(setHours(defaultVisibleDate, 9), 30),
    room: 'Room B',
    teacher: 'science',
  },
  {
    id: 'english-1-room-c',
    start: setMinutes(setHours(defaultVisibleDate, 8), 0),
    end: setMinutes(setHours(defaultVisibleDate, 9), 30),
    room: 'Room C',
    teacher: 'english',
  },

  // 10:00-11:30 AM slots
  {
    id: 'history-1-room-a',
    start: setMinutes(setHours(defaultVisibleDate, 10), 0),
    end: setMinutes(setHours(defaultVisibleDate, 11), 30),
    room: 'Room A',
    teacher: 'history',
  },
  {
    id: 'math-2-room-b',
    start: setMinutes(setHours(defaultVisibleDate, 10), 0),
    end: setMinutes(setHours(defaultVisibleDate, 11), 30),
    room: 'Room B',
    teacher: 'french',
  },
  {
    id: 'science-2-room-c',
    start: setMinutes(setHours(defaultVisibleDate, 10), 0),
    end: setMinutes(setHours(defaultVisibleDate, 11), 30),
    room: 'Room C',
    teacher: 'science',
  },

  // 12:00-1:30 PM slots
  {
    id: 'english-2-room-a',
    start: setMinutes(setHours(defaultVisibleDate, 12), 0),
    end: setMinutes(setHours(defaultVisibleDate, 13), 30),
    room: 'Room A',
    teacher: 'english',
  },
  {
    id: 'history-2-room-b',
    start: setMinutes(setHours(defaultVisibleDate, 12), 0),
    end: setMinutes(setHours(defaultVisibleDate, 13), 30),
    room: 'Room B',
    teacher: 'history',
  },
  {
    id: 'math-3-room-c',
    start: setMinutes(setHours(defaultVisibleDate, 12), 0),
    end: setMinutes(setHours(defaultVisibleDate, 13), 30),
    room: 'Room C',
    teacher: 'french',
  },

  // 2:00-3:30 PM slots
  {
    id: 'science-3-room-a',
    start: setMinutes(setHours(defaultVisibleDate, 14), 0),
    end: setMinutes(setHours(defaultVisibleDate, 15), 30),
    room: 'Room A',
    teacher: 'science',
  },
  {
    id: 'english-3-room-b',
    start: setMinutes(setHours(defaultVisibleDate, 14), 0),
    end: setMinutes(setHours(defaultVisibleDate, 15), 30),
    room: 'Room B',
    teacher: 'english',
  },
  {
    id: 'history-3-room-c',
    start: setMinutes(setHours(defaultVisibleDate, 14), 0),
    end: setMinutes(setHours(defaultVisibleDate, 15), 30),
    room: 'Room C',
    teacher: 'history',
  },
];

const rooms: SchedulerResource[] = [
  { id: 'Room A', title: 'Room A', eventColor: 'purple' },
  { id: 'Room B', title: 'Room B', eventColor: 'teal' },
  { id: 'Room C', title: 'Room C', eventColor: 'lime' },
];

const classes: SchedulerResource[] = [
  { id: 'french', title: 'French', eventColor: 'orange' },
  { id: 'science', title: 'Science', eventColor: 'teal' },
  { id: 'english', title: 'English', eventColor: 'pink' },
  { id: 'history', title: 'History', eventColor: 'indigo' },
];

export default function DynamicResourceProperty() {
  const [resourceProperty, setResourceProperty] = React.useState<'room' | 'teacher'>(
    'room',
  );
  const [events, setEvents] = React.useState<CustomEvent[]>(initialEvents);

  const eventModelStructure: SchedulerEventModelStructure<CustomEvent> =
    React.useMemo(
      () => ({
        title: {
          getter: (event) => `${capitalize(event.teacher)} (${event.room})`,
        },
        resource: {
          getter: (event) => event[resourceProperty],
          setter: (event, newValue) => {
            if (newValue == null) {
              delete event[resourceProperty];
            } else {
              event[resourceProperty] = newValue;
            }
            return event;
          },
        },
      }),
      [resourceProperty],
    );

  return (
    <Stack spacing={2} style={{ width: '100%' }}>
      <ToggleButtonGroup
        exclusive
        onChange={(event, newResourceProperty) => {
          if (newResourceProperty !== null) {
            setResourceProperty(newResourceProperty);
          }
        }}
        value={resourceProperty}
      >
        <ToggleButton value="room">Group by Room</ToggleButton>
        <ToggleButton value="teacher">Group by Teacher</ToggleButton>
      </ToggleButtonGroup>
      <div style={{ height: '600px', width: '100%' }}>
        <EventCalendar
          events={events}
          eventModelStructure={eventModelStructure}
          resources={resourceProperty === 'room' ? rooms : classes}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          view="day"
          views={['day']}
        />
      </div>
    </Stack>
  );
}
