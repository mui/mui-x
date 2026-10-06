import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { defaultVisibleDate } from '../../datasets/personal-agenda';

const initialEvents = [
  {
    id: 'morning-shift',
    title: 'Morning shift',
    start: '2025-07-01T06:00:00',
    end: '2025-07-01T14:00:00',
  },
  {
    id: 'evening-shift',
    title: 'Evening shift',
    start: '2025-07-01T14:00:00',
    end: '2025-07-01T22:00:00',
  },
  {
    id: 'night-shift',
    title: 'Night shift',
    start: '2025-07-01T22:00:00',
    end: '2025-07-02T06:00:00',
  },
  {
    id: 'late-shift',
    title: 'Late shift',
    start: '2025-07-03T16:00:00',
    end: '2025-07-04T00:00:00',
  },
  {
    id: 'line-maintenance',
    title: 'Line maintenance',
    start: '2025-07-04T08:00:00',
    end: '2025-07-05T14:00:00',
  },
];

export default function TimeGridEvents() {
  const [events, setEvents] = React.useState(initialEvents);
  const [timeGridEvents, setTimeGridEvents] = React.useState('shorter-than-one-day');

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <ToggleButtonGroup
        value={timeGridEvents}
        exclusive
        size="small"
        onChange={(_, value) => {
          if (value !== null) {
            setTimeGridEvents(value);
          }
        }}
      >
        <ToggleButton value="shorter-than-one-day">
          shorter-than-one-day
        </ToggleButton>
        <ToggleButton value="same-day-only">same-day-only</ToggleButton>
      </ToggleButtonGroup>
      <div style={{ height: '600px', width: '100%' }}>
        <StandaloneWeekView
          events={events}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          viewConfig={{ week: { timeGridEvents, initialScrollTime: 14 } }}
        />
      </div>
    </Stack>
  );
}
