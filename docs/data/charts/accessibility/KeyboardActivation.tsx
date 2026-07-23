import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import type { ChartsAxisData, LineItemIdentifier } from '@mui/x-charts/models';

export default function KeyboardActivation() {
  const [itemData, setItemData] = React.useState<LineItemIdentifier | null>(null);
  const [axisData, setAxisData] = React.useState<ChartsAxisData | null>(null);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <LineChart
          height={300}
          series={[
            { id: 'series-1', data: [3, 4, 1, 6, 5], label: 'A' },
            { id: 'series-2', data: [4, 3, 1, 5, 8], label: 'B' },
          ]}
          xAxis={[{ data: [0, 3, 6, 9, 12], scaleType: 'linear' }]}
          experimentalFeatures={{ keyboardActivation: true }}
          onMarkClick={(event, data) => setItemData(data)}
          onAxisClick={(event, data) => setAxisData(data)}
        />
      </Box>
      <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
        <Typography>
          Focus the chart with <kbd className="key">Tab</kbd>, move with the arrow
          keys, then press <kbd className="key">Enter</kbd> or{' '}
          <kbd className="key">Space</kbd>.
        </Typography>
        <Typography component="pre" variant="caption">
          {`onMarkClick: ${itemData ? JSON.stringify(itemData) : '—'}
onAxisClick: ${axisData ? JSON.stringify(axisData) : '—'}`}
        </Typography>
      </Stack>
    </Stack>
  );
}
