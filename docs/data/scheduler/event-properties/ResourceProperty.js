import * as React from 'react';

import capitalize from '@mui/utils/capitalize';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../datasets/personal-agenda';

const initialEvents = [
  // July 1, 2025 (defaultVisibleDate) - Tuesday schedule

  // 8:00-9:30 AM slots
  {
    id: 'math-1-room-a',
    start: defaultVisibleDate.set({ hour: 8, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 9, minute: 30 }),
    room: 'Room A',
    teacher: 'french',
  },
  {
    id: 'science-1-room-b',
    start: defaultVisibleDate.set({ hour: 8, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 9, minute: 30 }),
    room: 'Room B',
    teacher: 'science',
  },
  {
    id: 'english-1-room-c',
    start: defaultVisibleDate.set({ hour: 8, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 9, minute: 30 }),
    room: 'Room C',
    teacher: 'english',
  },
  // 10:00-11:30 AM slots
  {
    id: 'history-1-room-a',
    start: defaultVisibleDate.set({ hour: 10, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 11, minute: 30 }),
    room: 'Room A',
    teacher: 'history',
  },
  {
    id: 'math-2-room-b',
    start: defaultVisibleDate.set({ hour: 10, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 11, minute: 30 }),
    room: 'Room B',
    teacher: 'french',
  },
  {
    id: 'science-2-room-c',
    start: defaultVisibleDate.set({ hour: 10, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 11, minute: 30 }),
    room: 'Room C',
    teacher: 'science',
  },
  // 12:00-1:30 PM slots
  {
    id: 'english-2-room-a',
    start: defaultVisibleDate.set({ hour: 12, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 13, minute: 30 }),
    room: 'Room A',
    teacher: 'english',
  },
  {
    id: 'history-2-room-b',
    start: defaultVisibleDate.set({ hour: 12, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 13, minute: 30 }),
    room: 'Room B',
    teacher: 'history',
  },
  {
    id: 'math-3-room-c',
    start: defaultVisibleDate.set({ hour: 12, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 13, minute: 30 }),
    room: 'Room C',
    teacher: 'french',
  },
  // 2:00-3:30 PM slots
  {
    id: 'science-3-room-a',
    start: defaultVisibleDate.set({ hour: 14, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 15, minute: 30 }),
    room: 'Room A',
    teacher: 'science',
  },
  {
    id: 'english-3-room-b',
    start: defaultVisibleDate.set({ hour: 14, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 15, minute: 30 }),
    room: 'Room B',
    teacher: 'english',
  },
  {
    id: 'history-3-room-c',
    start: defaultVisibleDate.set({ hour: 14, minute: 0 }),
    end: defaultVisibleDate.set({ hour: 15, minute: 30 }),
    room: 'Room C',
    teacher: 'history',
  },
];

const rooms = [
  { id: 'Room A', title: 'Room A', eventColor: 'violet' },
  { id: 'Room B', title: 'Room B', eventColor: 'jade' },
  { id: 'Room C', title: 'Room C', eventColor: 'lime' },
];

const classes = [
  { id: 'french', title: 'French', eventColor: 'orange' },
  { id: 'science', title: 'Science', eventColor: 'cyan' },
  { id: 'english', title: 'English', eventColor: 'pink' },
  { id: 'history', title: 'History', eventColor: 'indigo' },
];

export default function ResourceProperty() {
  const [resourceProperty, setResourceProperty] = React.useState('room');
  const [events, setEvents] = React.useState(initialEvents);

  const eventModelStructure = React.useMemo(
    () => ({
      title: {
        getter: (event) => `${capitalize(event.teacher)} (${event.room})`,
      },
      resource: {
        getter: (event) => event[resourceProperty],
        setter: (event, newValue) => {
          event[resourceProperty] = newValue;
          return event;
        },
      },
    }),
    [resourceProperty],
  );

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setResourceProperty('room')}
          disabled={resourceProperty === 'room'}
          type="button"
        >
          Group by Room
        </button>
        <button
          onClick={() => setResourceProperty('teacher')}
          disabled={resourceProperty === 'teacher'}
          type="button"
        >
          Group by Teacher
        </button>
      </div>
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
    </div>
  );
}
