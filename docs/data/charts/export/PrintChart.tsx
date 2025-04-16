import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { ChartProApi } from '@mui/x-charts-pro/ChartContainerPro';
import { data } from './randomData';

export default function PrintChart() {
  const apiRef = React.useRef<ChartProApi>(undefined);

  return (
    <Stack width="100%">
      <ScatterChartPro
        apiRef={apiRef}
        height={300}
        series={[
          {
            label: 'Series A',
            data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
          },
          {
            label: 'Series B',
            data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
          },
        ]}
      />
      <Button onClick={() => apiRef.current?.exportAsPrint()}>Print</Button>
    </Stack>
  );
}
