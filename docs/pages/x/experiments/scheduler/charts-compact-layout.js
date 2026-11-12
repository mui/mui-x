import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChartsCompactLayout from 'docs/data/experiments/scheduler/ChartsCompactLayout';

export default function ChartsCompactLayoutExperiment() {
  return (
    <Stack spacing={3}>
      <Typography>
        The charts cards in the side panel drawer of the compact layout. Pick a width, open the
        drawer from the menu button and click a slice: the highlight stays once the drawer closes.
      </Typography>
      <ChartsCompactLayout />
    </Stack>
  );
}
