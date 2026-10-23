import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ExperimentLayout } from 'docs/src/modules/components/ExperimentLayout';

export default function Experiments() {
  return (
    <Box sx={{ pt: '30vh', textAlign: 'center' }}>
      <Typography>Choose an experiment from the sidebar.</Typography>
    </Box>
  );
}

Experiments.getLayout = (page) => <ExperimentLayout>{page}</ExperimentLayout>;
