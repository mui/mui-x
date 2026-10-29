import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RecurringEventsStressTest from 'docs/data/experiments/scheduler/RecurringEventsStressTest';

export default function RecurringEventsStressTestExperiment() {
  return (
    <Stack spacing={2}>
      <Typography>
        A company with offices in 8 timezones shares one calendar. Each team has a standup, sprint
        ceremonies, a monthly sync and lunch, 1:1s and birthdays, and some have quarterly offsites
        and part-time days off, as recurring series that started as early as 2019. Every event uses
        the timezone of its office. The standups exclude the office holidays, and some series end
        with a COUNT or an UNTIL, usually in the past.
      </Typography>
      <Typography>
        The live updates mimic a calendar sync. In the two weeks starting with the visible week,
        they cancel, move and restore occurrences, split series like a &quot;this and
        following&quot; edit, and create series and events. They also rename and delete events, and
        delete the series they created, anywhere in the calendar. The update time runs from the
        change to the next frame after the calendar renders it.
      </Typography>
      <Typography>
        The dataset is built around October 29, 2026, and the calendar opens on that week, so the
        numbers stay comparable from one day to the next.
      </Typography>
      <RecurringEventsStressTest />
    </Stack>
  );
}
