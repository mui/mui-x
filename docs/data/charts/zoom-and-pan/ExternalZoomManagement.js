import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { randomData } from './randomData';

const initialZoomData = [
  {
    axisId: 'my-x-axis',
    start: 20,
    end: 40,
  },
];

export default function ExternalZoomManagement() {
  const apiRef = React.useRef(undefined);

  const [zoomData, setZoomData] = React.useState(initialZoomData);

  return (
    <Stack direction={'column'} alignItems={'center'}>
      <LineChartPro
        {...chartProps}
        initialZoom={initialZoomData}
        apiRef={apiRef}
        onZoomChange={(newZoomData) => setZoomData(newZoomData)}
        xAxis={[
          {
            zoom: true,
            scaleType: 'point',
            id: 'my-x-axis',
            data: randomData.map((v, i) => i),
          },
        ]}
      />
      <pre>{JSON.stringify(zoomData, null, 2)}</pre>
      <Button
        variant="contained"
        onClick={() =>
          apiRef.current.setZoomData([{ axisId: 'my-x-axis', start: 0, end: 100 }])
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
