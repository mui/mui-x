import * as React from 'react';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import {
  resources,
  defaultVisibleDate,
  getEvents,
  persistEvents,
} from './fakeServer';

export default function BasicDataSource() {
  return (
    <div style={{ height: '700px', width: '100%' }}>
      <EventCalendarPremium
        dataSource={{ getEvents, persistEvents }}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
