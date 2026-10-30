import * as React from 'react';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { defaultVisibleDate } from '../../datasets/company-roadmap';

const events = [
  {
    id: 'order-1042',
    start: '2025-07-02T00:00:00',
    end: '2025-07-03T00:00:00',
    allDay: true,
    title: 'Order 1042',
    resource: 'line-1',
    href: '#order-1042',
  },
  {
    id: 'order-1043',
    start: '2025-07-02T00:00:00',
    end: '2025-07-02T00:00:00',
    allDay: true,
    title: 'Order 1043',
    resource: 'line-2',
    href: '#order-1043',
  },
  {
    id: 'order-1044',
    start: '2025-07-04T00:00:00',
    end: '2025-07-05T00:00:00',
    allDay: true,
    title: 'Order 1044',
    resource: 'line-1',
    href: '#order-1044',
  },
];

const resources = [
  { id: 'line-1', title: 'Line 1' },
  { id: 'line-2', title: 'Line 2' },
];

export default function HrefProperty() {
  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        defaultPreset="dayAndMonth"
        readOnly
      />
    </div>
  );
}
