import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { createChartsFeature } from '@mui/x-scheduler-premium/charts';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from 'docs/data/scheduler/datasets/personal-agenda';

const features = { charts: createChartsFeature({ renderer: ChartsRenderer }) };

export default function ConfiguredCards() {
  const [events, setEvents] = React.useState(initialEvents);
  const [metric, setMetric] = React.useState('hours');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={metric}
        onChange={(_event, value) => value && setMetric(value)}
      >
        <ToggleButton value="hours">Hours</ToggleButton>
        <ToggleButton value="count">Events</ToggleButton>
      </ToggleButtonGroup>
      <div style={{ height: '760px', width: '100%' }}>
        <EventCalendarPremium
          features={features}
          charts={{ cards: ['byDay', 'byResource'], metric }}
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
        />
      </div>
    </div>
  );
}
