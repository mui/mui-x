import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { randomData } from './randomData';

const lineAxis = [
  {
    zoom: true,
    scaleType: 'point',
    id: 'shared-x-axis',
    data: randomData.map((v, i) => i),
  },
];

const barAxis = [
  {
    zoom: true,
    scaleType: 'band',
    id: 'shared-x-axis',
    data: randomData.map((v, i) => i),
  },
];

const initialZoomData = [
  {
    axisId: 'shared-x-axis',
    start: 20,
    end: 40,
  },
];

export default function ZoomControlled() {
  const [zoomData, setZoomData] = React.useState(initialZoomData);

  return (
    <Stack direction={'column'} alignItems={'center'}>
      <LineChartPro
        {...chartProps}
        onZoomChange={(newZoomData) => setZoomData(newZoomData)}
        zoomData={zoomData}
        xAxis={lineAxis}
      />
      <BarChartPro
        {...chartProps}
        onZoomChange={(newZoomData) => setZoomData(newZoomData)}
        zoomData={zoomData}
        xAxis={barAxis}
      />
      <pre>{JSON.stringify(zoomData, null, 2)}</pre>
      <Button
        variant="contained"
        onClick={() =>
          setZoomData([{ axisId: 'shared-x-axis', start: 0, end: 100 }])
        }
      >
        Reset zoom
      </Button>
    </Stack>
  );
}

const chartProps = {
  width: 600,
  height: 300,
  series: [
    {
      label: 'Series A',
      data: randomData.map((v) => v.y1),
    },
    {
      label: 'Series B',
      data: randomData.map((v) => v.y2),
    },
  ],
};
