import * as React from 'react';

import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { initialEvents, resources } from '../../datasets/company-roadmap';

const defaultPreferences = {
  ampm: false,
  weekStartsOn: 1,
};

export default function PreferencesMenu() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
      <EventTimelinePremium
        events={events}
        resources={resources}
        defaultPreferences={defaultPreferences}
        onEventsChange={setEvents}
        defaultPreset="dayAndWeek"
      />
    </div>
  );
}
