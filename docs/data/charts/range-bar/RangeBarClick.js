import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';
import { HighlightedCode } from '@mui/docs/HighlightedCode';

const barChartsParams = {
  series: [
    {
      type: 'rangeBar',
      id: 'series-1',
      data: [
        [3, 5],
        [4, 6],
        [1, 4],
        [6, 8],
        [5, 6],
      ],
      label: 'A',
      highlightScope: {
        highlight: 'item',
      },
    },
    {
      type: 'rangeBar',
      id: 'series-2',
      data: [
        [4, 6],
        [1, 4],
        [6, 8],
        [5, 6],
        [3, 5],
      ],
      label: 'B',
      highlightScope: {
        highlight: 'item',
      },
    },
  ],
  xAxis: [{ data: ['0', '3', '6', '9', '12'], id: 'axis1' }],
  height: 400,
  margin: { left: 0 },
};

export default function RangeBarClick() {
  const [itemData, setItemData] = React.useState();
  const [axisData, setAxisData] = React.useState();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <BarChartPremium
          {...barChartsParams}
          onItemClick={(event, d) => setItemData(d)}
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
          <Typography>Click on the chart</Typography>
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
