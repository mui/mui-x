import * as React from 'react';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { createChartsFeature } from '@mui/x-scheduler-premium/charts';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from 'docs/data/scheduler/datasets/personal-agenda';

const features = { charts: createChartsFeature({ cards: ['hoursPerDay'] }) };

export default function ChartsInsightsHoursPerDay() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '760px', width: '100%' }}>
      <EventCalendarPremium
        features={features}
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
