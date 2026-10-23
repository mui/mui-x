import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TimelineAutoScheduling from 'docs/data/experiments/scheduler/TimelineAutoScheduling';

export default function TimelineAutoSchedulingExperiment() {
  return (
    <Stack spacing={2}>
      <Typography>
        Drag Plan past the start of Build to move its successors forward as one change. Moving Plan
        within the slack before Build leaves later events where they are. Moving a predecessor
        earlier never pulls its successors back.
      </Typography>
      <Typography>
        The Design branches join at Integrate, which starts after both branches. Audit is read-only,
        so a move that would require changing it is rejected.
      </Typography>
      <Typography>
        Drag a successor before its predecessor to see it snap to the first valid position. Existing
        violations remain until an edit makes the constraint stricter. All-day dependencies move in
        whole days. Creating a cycle is rejected.
      </Typography>
      <TimelineAutoScheduling />
    </Stack>
  );
}
