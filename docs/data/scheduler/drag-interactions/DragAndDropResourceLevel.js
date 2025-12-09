import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { initialEvents, defaultVisibleDate } from '../datasets/personal-agenda';

// Resources with only 'work' marked as draggable and resizable
const resources = [
  {
    title: 'Work',
    id: 'work',
    eventColor: 'violet',
    areEventsDraggable: true,
    areEventsResizable: true,
    children: [
      {
        title: 'eXplore Team',
        id: 'explore',
        eventColor: 'pink',
        children: [
          { title: 'Design meetings', id: 'design-meetings', eventColor: 'mauve' },
        ],
      },
      { title: 'Data Grid Team', id: 'data-grid', eventColor: 'blue' },
    ],
  },
  { title: 'Holidays', id: 'holidays', eventColor: 'red' },
  { title: 'Workout', id: 'workout', eventColor: 'jade' },
  { title: 'Birthdays', id: 'birthdays', eventColor: 'lime' },
  { title: 'Personal', id: 'personal', eventColor: 'orange' },
  { title: 'Medical', id: 'medical', eventColor: 'indigo' },
];

export default function DragAndDropResourceLevel() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
