import * as React from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate } from '../../datasets/personal-agenda';

const events = [
  {
    id: 'order-1042',
    start: '2025-07-01T09:00:00',
    end: '2025-07-01T10:30:00',
    title: 'Order 1042',
    href: '#order-1042',
  },
  {
    id: 'order-1043',
    start: '2025-07-01T13:00:00',
    end: '2025-07-01T14:00:00',
    title: 'Order 1043',
    href: '#order-1043',
  },
  {
    id: 'order-1044',
    start: '2025-07-02T11:00:00',
    end: '2025-07-02T12:30:00',
    title: 'Order 1044',
    href: '#order-1044',
  },
  {
    id: 'order-1045',
    start: '2025-07-03T10:00:00',
    end: '2025-07-03T11:00:00',
    title: 'Order 1045',
    href: '#order-1045',
  },
];

export default function HrefProperty() {
  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        defaultVisibleDate={defaultVisibleDate}
        defaultPreferences={{ isSidePanelOpen: false }}
        readOnly
      />
    </div>
  );
}
