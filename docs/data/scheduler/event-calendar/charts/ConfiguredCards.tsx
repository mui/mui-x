import * as React from 'react';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import type { EventCalendarPremiumChartsMetric } from '@mui/x-scheduler-premium/charts';
import { createChartsFeature } from '@mui/x-scheduler-premium/charts';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from 'docs/data/scheduler/datasets/personal-agenda';

const features = { charts: createChartsFeature({ renderer: ChartsRenderer }) };

export default function ConfiguredCards() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);
  const [metric, setMetric] =
    React.useState<EventCalendarPremiumChartsMetric>('hours');

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
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
