import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TimelineDependencyEdgeCases from 'docs/data/experiments/scheduler/TimelineDependencyEdgeCases';

export default function TimelineDependencyEdgeCasesExperiment() {
  return (
    <Stack spacing={2}>
      <Typography>
        Each dependency type and arrow shape appears once: the short arrow between adjacent events,
        the straight arrow in a row, the elbow across rows, the wraps of Start to start and Finish
        to finish, and the backward route of a broken dependency.
      </Typography>
      <Typography>
        Sync is in three resource rows, so its dependency starts from each of them. Two links have a
        30-minute lag. The Planning row links to events outside the visible date range, so those
        arrows continue to the timeline edge.
      </Typography>
      <TimelineDependencyEdgeCases />
    </Stack>
  );
}
