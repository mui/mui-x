import * as React from 'react';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { createChartsFeature } from '@mui/x-scheduler-premium/charts';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from 'docs/data/scheduler/datasets/software-company';

const features = {
  charts: createChartsFeature({
    renderer: ChartsRenderer,
    cards: ['shareByResource'],
    metric: 'count',
  }),
};

export default function NestedResources() {
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
