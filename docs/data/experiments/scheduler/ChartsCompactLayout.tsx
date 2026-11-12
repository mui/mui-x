import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { createChartsFeature } from '@mui/x-scheduler-premium/charts';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from 'docs/data/scheduler/datasets/school-calendar';

const features = { charts: createChartsFeature({ renderer: ChartsRenderer }) };

const WIDTHS = { phone: 390, tablet: 720, desktop: 1100 } as const;
type Size = keyof typeof WIDTHS;

export default function ChartsCompactLayout() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);
  const [size, setSize] = React.useState<Size>('phone');

  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start', width: '100%' }}>
      <ToggleButtonGroup
        value={size}
        exclusive
        size="small"
        onChange={(_event, value: Size | null) => {
          if (value !== null) {
            setSize(value);
          }
        }}
      >
        {Object.entries(WIDTHS).map(([key, width]) => (
          <ToggleButton key={key} value={key}>
            {key} ({width}px)
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div style={{ height: '720px', width: '100%', maxWidth: WIDTHS[size] }}>
        <EventCalendarPremium
          features={features}
          charts={{ cards: ['byDay', 'byResource'], metric: 'hours' }}
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
        />
      </div>
    </Stack>
  );
}
