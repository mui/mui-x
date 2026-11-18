import * as React from 'react';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import {
  resources,
  defaultVisibleDate,
  getEvents,
  persistEvents,
} from './fakeServer';

const features = { recurringEvents: recurringEventsFeature };

export default function BasicDataSource() {
  return (
    <div style={{ height: '700px', width: '100%' }}>
      <EventCalendarPremium
        features={features}
        dataSource={{ getEvents, persistEvents }}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
