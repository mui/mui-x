import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

type Size = 'sm' | 'md' | 'lg';

const MAX_WIDTHS: Record<Size, number> = {
  sm: 480,
  md: 720,
  lg: 1000,
};

export default function ResponsiveTypographyDemo() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);
  const [size, setSize] = React.useState<Size>('md');

  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start', width: '100%' }}>
      <ToggleButtonGroup
        value={size}
        exclusive
        size="small"
        onChange={(_, value: Size | null) => {
          if (value !== null) {
            setSize(value);
          }
        }}
      >
        <ToggleButton value="sm">sm (480px)</ToggleButton>
        <ToggleButton value="md">md (720px)</ToggleButton>
        <ToggleButton value="lg">lg (1000px)</ToggleButton>
      </ToggleButtonGroup>
      <div
        style={{
          height: '500px',
          width: '100%',
          maxWidth: MAX_WIDTHS[size],
        }}
      >
        <StandaloneWeekView
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
        />
      </div>
    </Stack>
  );
}
