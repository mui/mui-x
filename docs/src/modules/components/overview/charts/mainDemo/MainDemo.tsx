import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { statCardData } from './data';
import StatCard from './StatCard';
import PieChartDemo from './PieChartDemo';
import BarChartDemo from './BarChartDemo';
import HeatmapDemo from './HeatmapDemo';
import DownloadDemo from './DownloadDemo';

export default function MainDemo() {
  return (
    <Paper
      component="div"
      variant="outlined"
      sx={(theme) => ({
        mb: 8,
        maxWidth: 1200,
        margin: 'auto',
        height: { md: 640 },
        overflow: 'hidden',
        p: 1,
        background: theme.palette.gradients.linearSubtle,
      })}
    >
      <Stack direction="row" alignItems="stretch" spacing={1}>
        <Stack direction="column" spacing={1} flexBasis="65%" maxHeight="800px">
          <Stack direction="row" spacing={1}>
            {statCardData.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </Stack>
          <Box component="div" sx={{ flexGrow: 1 }}>
            <DownloadDemo />
          </Box>
        </Stack>
        <Stack direction="column" spacing={1} flexBasis="35%">
          <Paper component="div" variant="outlined" sx={{ p: 1 }}>
            <PieChartDemo />
          </Paper>
          <Paper component="div" variant="outlined" sx={{ p: 1 }}>
            <BarChartDemo />
          </Paper>
          <Paper component="div" variant="outlined" sx={{ p: 1 }}>
            <HeatmapDemo />
          </Paper>
        </Stack>
      </Stack>
    </Paper>
  );
}
