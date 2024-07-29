import * as React from 'react';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import { dataset } from './tempAnomaly';

export default function BasicColorLegend() {
  return (
    <div style={{ width: '100%' }}>
      <Typography variant="body1">
        Global temperature anomaly relative to 1961-1990 average
      </Typography>
      <LineChart
        dataset={dataset}
        series={[
          {
            label: 'Global temperature anomaly relative to 1961-1990',
            dataKey: 'anomaly',
            showMark: false,
            valueFormatter: (value) => `${value?.toFixed(2)}°`,
          },
        ]}
        xAxis={[
          {
            scaleType: 'time',
            dataKey: 'year',
            disableLine: true,
            valueFormatter: (value) => value.getFullYear().toString(),
            colorMap: {
              type: 'piecewise',
              thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
              colors: ['blue', 'gray', 'red'],
            },
          },
        ]}
        yAxis={[
          {
            disableLine: true,
            disableTicks: true,
            valueFormatter: (value) => `${value}°`,
          },
        ]}
        grid={{ horizontal: true }}
        height={300}
        margin={{ top: 30, right: 150 }}
        slotProps={{ legend: { hidden: true } }}
      >
        <PiecewiseColorLegend
          axisDirection="x"
          position={{ vertical: 'top', horizontal: 'right' }}
          direction="column"
        />
        <ChartsReferenceLine y={0} />
      </LineChart>
    </div>
  );
}
