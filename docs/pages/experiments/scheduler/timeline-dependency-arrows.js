import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TimelineDependencyArrows from 'docs/data/experiments/scheduler/TimelineDependencyArrows';
import { ExperimentLayout } from 'docs/src/modules/components/ExperimentLayout';

export default function TimelineDependencyArrowsExperiment() {
  return (
    <Stack spacing={2}>
      <Typography>
        Drag or resize events to inspect the four dependency types. Hover an event to reveal its
        terminals, then drag between terminals to create a link. The start or end terminals you
        connect determine its type.
      </Typography>
      <Typography>
        Click a link to select it, then use its delete button or Delete/Backspace to remove it.
        Double-click to edit its type and lag, or right-click for Edit and Delete. Escape or
        clicking empty space clears the selection. Duplicate links and cycles are rejected.
      </Typography>
      <Typography>
        Sync appears in three resource rows, so its dependencies appear in each row. Two links have
        a 30-minute lag. Creating a violated link or tightening a constraint moves successors as
        needed. Links to events outside the visible date range continue to the timeline edge.
      </Typography>
      <TimelineDependencyArrows />
    </Stack>
  );
}

TimelineDependencyArrowsExperiment.getLayout = (page) => (
  <ExperimentLayout>{page}</ExperimentLayout>
);
