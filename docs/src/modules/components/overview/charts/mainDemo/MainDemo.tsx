import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { statCardData } from './data';
import StatCard from './StatCard';
import PieChartDemo from './PieChartDemo';

export default function MainDemo() {
  return (
    <Stack spacing={1} pb={8}>
      <Paper
        component="div"
        variant="outlined"
        sx={(theme) => ({
          mb: 8,
          height: { md: 640 },
          overflow: 'hidden',
          p: 1,
          background: theme.palette.gradients.linearSubtle,
        })}
      >
        <Stack direction="row" spacing={1}>
          <Stack direction="column" spacing={1} flexBasis="65%">
            <Stack direction="row" spacing={1}>
              {statCardData.map((card, index) => (
                <StatCard key={index} {...card} />
              ))}
            </Stack>
          </Stack>
          <Stack direction="column" spacing={1} flexBasis="35%">
            <Paper component="div" variant="outlined">
              <PieChartDemo />
            </Paper>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
