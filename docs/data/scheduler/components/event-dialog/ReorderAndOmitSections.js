import * as React from 'react';
import Divider from '@mui/material/Divider';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  EventDialogDateTimeSection,
  EventDialogDescriptionSection,
} from '@mui/x-scheduler/event-dialog';

// The description is rendered first and the resource section is omitted entirely.
// Defined at module scope: an inline slot component remounts whenever the calendar's owner rerenders.
function ReorderedGeneralTab() {
  return (
    <React.Fragment>
      <EventDialogDescriptionSection />
      <Divider />
      <EventDialogDateTimeSection />
    </React.Fragment>
  );
}

const defaultVisibleDate = new Date('2025-07-01T00:00:00');

const initialEvents = [
  {
    id: 'team-sync',
    title: 'Team Sync',
    description: 'Weekly review of the sprint board',
    start: '2025-07-01T09:00:00',
    end: '2025-07-01T10:00:00',
    resource: 'work',
  },
  {
    id: 'lunch',
    title: 'Lunch with Sarah',
    start: '2025-07-02T12:00:00',
    end: '2025-07-02T13:00:00',
    resource: 'personal',
  },
];

const resources = [
  { id: 'work', title: 'Work', eventColor: 'purple' },
  { id: 'personal', title: 'Personal', eventColor: 'teal' },
];

export default function ReorderAndOmitSections() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreferences={{ isSidePanelOpen: false }}
        slots={{ eventDialogGeneralTab: ReorderedGeneralTab }}
      />
    </div>
  );
}
