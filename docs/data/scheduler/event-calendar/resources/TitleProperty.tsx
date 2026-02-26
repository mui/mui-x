import * as React from 'react';
import {
  SchedulerEventColor,
  SchedulerResourceModelStructure,
} from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { initialEvents, defaultVisibleDate } from '../../datasets/personal-agenda';

interface CustomResource {
  id: string;
  name: string;
  eventColor: SchedulerEventColor;
}

const resources: CustomResource[] = [
  { name: 'Work', id: 'work', eventColor: 'purple' },
  { name: 'Health', id: 'health', eventColor: 'teal' },
  { name: 'Social', id: 'social', eventColor: 'orange' },
  { name: 'Personal', id: 'personal', eventColor: 'lime' },
  { name: 'Travel', id: 'travel', eventColor: 'blue' },
  { name: 'Family', id: 'family', eventColor: 'pink' },
];

const resourceModelStructure: SchedulerResourceModelStructure<CustomResource> = {
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
