import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MonthViewOverflowContinuation from 'docs/data/experiments/scheduler/MonthViewOverflowContinuation';
import MonthViewOverflowPersist from 'docs/data/experiments/scheduler/MonthViewOverflowPersist';
import MonthViewOverflowButtonOverlap from 'docs/data/experiments/scheduler/MonthViewOverflowButtonOverlap';
import { ExperimentLayout } from 'docs/src/modules/components/ExperimentLayout';

export default function MonthViewMultiDayOverflowExperiment() {
  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography>
          A spanning event initially hidden in &quot;+N more&quot; should return as a continuous bar
          once a later day has a free row, with a continuation arrow.
        </Typography>
        <MonthViewOverflowContinuation />
      </Stack>
      <Stack spacing={1}>
        <Typography>
          An event with no free row must stay counted in &quot;+N more&quot; on every day it
          crosses.
        </Typography>
        <MonthViewOverflowPersist />
      </Stack>
      <Stack spacing={1}>
        <Typography>
          When &quot;+N more&quot; interrupts a spanning event, the button must remain visible and
          the event must continue after it.
        </Typography>
        <MonthViewOverflowButtonOverlap />
      </Stack>
    </Stack>
  );
}

MonthViewMultiDayOverflowExperiment.getLayout = (page) => (
  <ExperimentLayout>{page}</ExperimentLayout>
);
