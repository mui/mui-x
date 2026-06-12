import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { StandaloneCompactDayView } from '@mui/x-scheduler/compact-day-view';
import { StandaloneCompactThreeDayView } from '@mui/x-scheduler/compact-three-day-view';
import { StandaloneCompactWeekView } from '@mui/x-scheduler/compact-week-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

export default function CompactWeekView() {
  const [events, setEvents] = React.useState(initialEvents);
  const [dayCount, setDayCount] = React.useState(3);

  const sharedProps = {
    events,
    resources,
    defaultVisibleDate,
    onEventsChange: setEvents,
  };

  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <ToggleButtonGroup
        value={dayCount}
        exclusive
        size="small"
        onChange={(_, value) => {
          if (value !== null) {
            setDayCount(value);
          }
        }}
      >
        <ToggleButton value={1}>1 day</ToggleButton>
        <ToggleButton value={3}>3 days</ToggleButton>
        <ToggleButton value={7}>7 days</ToggleButton>
      </ToggleButtonGroup>
      <div style={{ height: '600px', width: '375px', maxWidth: '100%' }}>
        {dayCount === 1 && <StandaloneCompactDayView {...sharedProps} />}
        {dayCount === 3 && <StandaloneCompactThreeDayView {...sharedProps} />}
        {dayCount === 7 && <StandaloneCompactWeekView {...sharedProps} />}
      </div>
    </Stack>
  );
}
