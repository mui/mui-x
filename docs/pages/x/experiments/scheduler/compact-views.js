import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CompactDayView from 'docs/data/experiments/scheduler/demos/compact-day-view/CompactDayView';
import CompactThreeDayView from 'docs/data/experiments/scheduler/demos/compact-three-day-view/CompactThreeDayView';
import CompactWeekView from 'docs/data/experiments/scheduler/demos/compact-week-view/CompactWeekView';

export default function CompactViewsExperiment() {
  return (
    <Stack spacing={3}>
      <Typography>
        These touch views show a fixed number of days at a phone width. Events display their titles
        without times.
      </Typography>
      <Stack spacing={1}>
        <Typography>1 day</Typography>
        <CompactDayView />
      </Stack>
      <Stack spacing={1}>
        <Typography>3 days</Typography>
        <CompactThreeDayView />
      </Stack>
      <Stack spacing={1}>
        <Typography>7 days</Typography>
        <CompactWeekView />
      </Stack>
    </Stack>
  );
}
