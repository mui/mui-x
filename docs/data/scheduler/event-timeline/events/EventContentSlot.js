import * as React from 'react';
import FlagRounded from '@mui/icons-material/FlagRounded';
import BuildRounded from '@mui/icons-material/BuildRounded';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

import { defaultVisibleDate } from '../../datasets/company-roadmap';

const resources = [
  { id: 'web-app', title: 'Web App', eventColor: 'purple' },
  { id: 'api-team', title: 'API Team', eventColor: 'green' },
];

const initialEvents = [
  {
    id: 'web-1',
    start: '2025-07-01T00:00:00',
    end: '2025-07-11T00:00:00',
    title: 'Dashboard redesign',
    resource: 'web-app',
    allDay: true,
    kind: 'task',
    code: 'WEB-101',
  },
  {
    id: 'web-2',
    start: '2025-07-11T00:00:00',
    end: '2025-07-12T00:00:00',
    title: 'Beta release',
    resource: 'web-app',
    allDay: true,
    kind: 'milestone',
    code: 'WEB-102',
  },
  {
    id: 'api-1',
    start: '2025-07-03T00:00:00',
    end: '2025-07-15T00:00:00',
    title: 'Rate limiting',
    resource: 'api-team',
    allDay: true,
    kind: 'task',
    code: 'API-207',
  },
];

const eventLookup = new Map(initialEvents.map((event) => [event.id, event]));

// Defined at module scope: an inline slot component remounts whenever the timeline's owner rerenders.
function EventContent({ occurrence }) {
  const event = eventLookup.get(occurrence.id);
  const Icon = event?.kind === 'milestone' ? FlagRounded : BuildRounded;

  return (
    <React.Fragment>
      <Icon fontSize="inherit" aria-hidden style={{ verticalAlign: 'middle' }} />{' '}
      {occurrence.title}
      {event && <span style={{ opacity: 0.7 }}> · {event.code}</span>}
    </React.Fragment>
  );
}

export default function EventContentSlot() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '300px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreset="dayAndMonth"
        slots={{ timelineEventContent: EventContent }}
      />
    </div>
  );
}
