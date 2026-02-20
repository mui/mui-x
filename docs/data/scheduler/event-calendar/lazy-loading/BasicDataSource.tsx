import * as React from 'react';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import {
  resources,
  defaultVisibleDate,
  getEvents,
  updateEvents,
} from './fakeServer';

export default function BasicDataSource() {
  return (
    <div style={{ height: '700px', width: '100%' }}>
      <EventCalendarPremium
        events={[]}
        dataSource={{ getEvents, updateEvents }}
        resources={resources}
        areEventsDraggable
        defaultVisibleDate={defaultVisibleDate}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
