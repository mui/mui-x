import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RecurringEventsStressTest from 'docs/data/experiments/scheduler/RecurringEventsStressTest';

export default function RecurringEventsStressTestExperiment() {
  return (
    <Stack spacing={2}>
      <Typography>
        A company with offices in 8 timezones shares one calendar. Each team has a standup, sprint
        ceremonies, 1:1s, quarterly offsites, birthdays and part-time days off, as recurring series
        that started as early as 2019. Every event uses the timezone of its office. The standups
        exclude the office holidays, and some series end with a COUNT or an UNTIL in the past.
      </Typography>
      <Typography>
        The live updates mimic a calendar sync. They cancel and move occurrences, split series like
        a &quot;this and following&quot; edit, create series and events, and rename events in the
        two weeks starting with the visible week. The update time runs from the change to the next
        frame after the calendar renders it.
      </Typography>
      <RecurringEventsStressTest />
    </Stack>
  );
}
