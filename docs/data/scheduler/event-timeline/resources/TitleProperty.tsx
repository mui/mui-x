import * as React from 'react';
import {
  SchedulerEventColor,
  SchedulerResourceModelStructure,
} from '@mui/x-scheduler/models';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { initialEvents, defaultVisibleDate } from '../../datasets/company-roadmap';

interface CustomResource {
  id: string;
  name: string;
  eventColor: SchedulerEventColor;
}

const resources: CustomResource[] = [
  { name: 'Product', id: 'product', eventColor: 'purple' },
  { name: 'Design', id: 'design', eventColor: 'pink' },
  { name: 'Engineering', id: 'engineering', eventColor: 'blue' },
  { name: 'QA', id: 'qa', eventColor: 'teal' },
  { name: 'DevOps', id: 'devops', eventColor: 'green' },
  { name: 'Marketing', id: 'marketing', eventColor: 'orange' },
  { name: 'Sales', id: 'sales', eventColor: 'lime' },
  { name: 'Customer Success', id: 'customer-success', eventColor: 'indigo' },
  { name: 'HR', id: 'hr', eventColor: 'red' },
  { name: 'Finance', id: 'finance', eventColor: 'grey' },
];

const resourceModelStructure: SchedulerResourceModelStructure<CustomResource> = {
  title: {
    getter: (event) => event.name,
  },
};

export default function TitleProperty() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        onEventsChange={setEvents}
        defaultVisibleDate={defaultVisibleDate}
        resourceModelStructure={resourceModelStructure}
        resources={resources}
        defaultView="months"
      />
    </div>
  );
}
