import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

import { LineChart } from '@mui/x-charts/LineChart';

import { HighlightedCode } from '@mui/internal-core-docs/HighlightedCode';
import { ChartsAxisData, LineItemIdentifier } from '@mui/x-charts/models';

const lineChartsParams = {
  series: [
    { id: 'series-1', data: [3, 4, 1, 6, 5], label: 'A' },
    { id: 'series-2', data: [4, 3, 1, 5, 8], label: 'B' },
  ],
  xAxis: [{ data: [0, 3, 6, 9, 12], scaleType: 'linear' }],
  height: 400,
} as const;

export default function KeyboardActivation() {
  const [itemData, setItemData] = React.useState<LineItemIdentifier>();
  const [axisData, setAxisData] = React.useState<ChartsAxisData | null>();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <LineChart
          {...lineChartsParams}
          experimentalFeatures={{ keyboardActivation: true }}
          onMarkClick={(event, d) => setItemData(d)}
          onAxisClick={(event, d) => setAxisData(d)}
        />
      </Box>

      <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography>
            Focus the chart, then press <kbd className="key">Enter</kbd>
          </Typography>
          <IconButton
            aria-label="reset"
            size="small"
            onClick={() => {
              setItemData(undefined);
              setAxisData(null);
            }}
          >
            <UndoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <HighlightedCode
          code={`// Data from item click
${itemData ? JSON.stringify(itemData, null, 2) : '// The data will appear here'}

// Data from axis click
${axisData ? JSON.stringify(axisData, null, 2) : '// The data will appear here'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}
