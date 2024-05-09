import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

import { ScatterChart } from '@mui/x-charts/ScatterChart';

import { HighlightedCode } from '@mui/docs/HighlightedCode';

const scatterChartsParams = {
  series: [
    {
      id: 'series-1',
      data: [
        { x: 6.5e-2, y: -1.3, id: 0 },
        { x: -2.1, y: -7.0e-1, id: 1 },
        { x: -7.6e-1, y: -6.7e-1, id: 2 },
        { x: -1.5e-2, y: -2.0e-1, id: 3 },
        { x: -1.4, y: -9.9e-1, id: 4 },
        { x: -1.1, y: -1.5, id: 5 },
        { x: -7.0e-1, y: -2.7e-1, id: 6 },
        { x: -5.1e-1, y: -8.8e-1, id: 7 },
        { x: -4.0e-3, y: -1.4, id: 8 },
        { x: -1.3, y: -2.2, id: 9 },
      ],
      label: 'A',
      highlightScope: {
        highlighted: 'item',
      },
    },
    {
      id: 'series-2',
      data: [
        { x: 1.8, y: -1.7e-2, id: 0 },
        { x: 7.1e-1, y: 2.6e-1, id: 1 },
        { x: -1.2, y: 9.8e-1, id: 2 },
        { x: 2.0, y: -2.0e-1, id: 3 },
        { x: 9.4e-1, y: -2.7e-1, id: 4 },
        { x: -4.8e-1, y: -1.6e-1, id: 5 },
        { x: -1.5, y: 1.1, id: 6 },
        { x: 1.3, y: 3.4e-1, id: 7 },
        { x: -4.2e-1, y: 1.0e-1, id: 8 },
        { x: 5.4e-2, y: 4.0e-1, id: 9 },
      ],
      label: 'B',
      highlightScope: {
        highlighted: 'item',
      },
    },
  ],
  height: 400,
};

export default function ScatterClickNoSnap() {
  const [data, setData] = React.useState();

  const { axis, item, ...other } = data ?? {};
  const dataDisplayed = data && {
    ...(item
      ? {
          item: {
            dataIndex: item.dataIndex,
            series: {
              id: item.series.id,
              toReplace: '',
            },
          },
        }
      : undefined),
    ...(axis ? { axis } : undefined),
    ...other,
  };
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <ScatterChart
          {...scatterChartsParams}
          onItemClick={(event, d) => setData(d)}
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
              setData(null);
            }}
          >
            <UndoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <HighlightedCode
          code={
            dataDisplayed
              ? JSON.stringify(dataDisplayed, null, 1).replace(
                  '"toReplace": ""',
                  '// ... (entire series definition)',
                )
              : '// The data will appear here'
          }
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}
