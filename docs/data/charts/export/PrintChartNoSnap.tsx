import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { ChartProApi } from '@mui/x-charts-pro/ChartContainerPro';
import { data } from './randomData';

const series = [
  {
    label: 'Series A',
    data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
  },
  {
    label: 'Series B',
    data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
  },
];

export default function PrintChartNoSnap() {
  const apiRef = React.useRef<ChartProApi>(undefined);

  return (
    <Stack width="100%" sx={{ display: 'block' }}>
      <Button
        onClick={() => apiRef.current!.exportAsPrint()}
        variant="contained"
        sx={{ mb: 1 }}
      >
        Print
      </Button>
      <ScatterChartPro apiRef={apiRef} height={300} series={series} />
    </Stack>
  );
}
