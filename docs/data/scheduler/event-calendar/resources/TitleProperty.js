import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { initialEvents, defaultVisibleDate } from '../../datasets/personal-agenda';

const resources = [
  { name: 'Work', id: 'work', eventColor: 'purple' },
  { name: 'Holidays', id: 'holidays', eventColor: 'red' },
  { name: 'Workout', id: 'workout', eventColor: 'teal' },
  { name: 'Birthdays', id: 'birthdays', eventColor: 'lime' },
  { name: 'Personal', id: 'personal', eventColor: 'orange' },
  { name: 'Medical', id: 'medical', eventColor: 'indigo' },
];

const resourceModelStructure = {
  title: {
    getter: (event) => event.name,
  },
};

export default function TitleProperty() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        onEventsChange={setEvents}
        defaultVisibleDate={defaultVisibleDate}
        resourceModelStructure={resourceModelStructure}
        resources={resources}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
