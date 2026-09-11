import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { TimelineResourceTitleProps } from '@mui/x-scheduler-premium/models';
import { defaultVisibleDate } from '../../datasets/company-roadmap';

const resourceDetails: Record<string, { code: string; owner: string }> = {
  'web-app': { code: 'WEB', owner: 'Alice' },
  'api-team': { code: 'API', owner: 'Bob' },
};

const resources: SchedulerResource[] = [
  { id: 'web-app', title: 'Web App', eventColor: 'purple' },
  { id: 'api-team', title: 'API Team', eventColor: 'green' },
];

const initialEvents: SchedulerEvent[] = [
  {
    id: 'web-1',
    start: '2025-07-01T00:00:00',
    end: '2025-07-11T00:00:00',
    title: 'Dashboard redesign',
    resource: 'web-app',
    allDay: true,
  },
  {
    id: 'api-1',
    start: '2025-07-03T00:00:00',
    end: '2025-07-15T00:00:00',
    title: 'Rate limiting',
    resource: 'api-team',
    allDay: true,
  },
];

// Defined at module scope: an inline slot component remounts whenever the timeline's owner rerenders.
function ResourceTitle({ resource }: TimelineResourceTitleProps) {
  const details = resourceDetails[resource.id];

  return (
    // `describeChild` keeps the tooltip out of the accessible name of the events in the row.
    <Tooltip title={details ? `Owner: ${details.owner}` : ''} describeChild>
      <span>
        <Link href={`#${resource.id}`} underline="hover" color="inherit">
          {resource.title}
        </Link>
        {details && <span style={{ opacity: 0.7 }}> · {details.code}</span>}
      </span>
    </Tooltip>
  );
}

export default function ResourceTitleSlot() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '300px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        defaultPreset="dayAndMonth"
        slots={{ timelineResourceTitle: ResourceTitle }}
      />
    </div>
  );
}
