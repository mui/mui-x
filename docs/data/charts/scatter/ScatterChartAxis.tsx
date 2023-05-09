import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

export default function ScatterChartAxis() {
  return (
    <ScatterChart
      width={600}
      height={400}
      yAxis={[
        {
          id: 'leftAxis',
          min: -10,
          max: 3.5,
        },
      ]}
      series={[
        {
          id: 's1',
          yAxisKey: 'leftAxis',
          markerSize: 5,
          data: [
            { x: 0, y: 0, id: 0 },
            { x: 1, y: 1, id: 1 },
            { x: 2, y: 2, id: 2 },
            { x: 3, y: 3, id: 3 },
            { x: 4, y: 4, id: 4 },
          ],
        },
        {
          id: 's2',
          markerSize: 5,
          data: [
            { x: 0, y: 1, id: 0 },
            { x: -1, y: 0, id: 1 },
            { x: -2, y: -1, id: 2 },
            { x: -3, y: -2, id: 3 },
            { x: -4, y: -3, id: 4 },
          ],
        },
      ]}
    />
  );
}
