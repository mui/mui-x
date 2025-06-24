/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import { interpolateBlues } from 'd3-scale-chromatic';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { HeatmapValueType } from '@mui/x-charts-pro/models';
import bikeData from './ParisBycicle.json';
import ChartDemoWrapper from '../ChartDemoWrapper';

const days = [
  '24/02/2025',
  '25/02/2025',
  '26/02/2025',
  '27/02/2025',
  '28/02/2025',
  '01/03/2025',
  '02/03/2025',
];
const hours = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
];
function HeatmapDemoContent() {
  return (
    <Stack sx={{ height: '100%' }}>
      <Typography>Bycicle count: Paris - Rivoli street (West-Est)</Typography>
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <Heatmap
          margin={{ left: 2 }}
          xAxis={[
            {
              data: days,
              label: 'Day',
              valueFormatter: (value, context) =>
                context.location === 'tick' ? value.slice(0, 5) : value,
              tickLabelStyle: { angle: 45 },
              height: 70,
            },
          ]}
          yAxis={[
            {
              data: hours,
              label: 'Hour of the day',
              tickLabelInterval: (_, index) => index % 2 === 0,
              valueFormatter: (value) => `${value}h`,
              width: 60,
            },
          ]}
          series={[{ data: bikeData as unknown as HeatmapValueType[], label: 'Bycicle count' }]}
          zAxis={[
            {
              colorMap: {
                max: 700,
                type: 'continuous',

                color: (t: number) => interpolateBlues(Math.sqrt(t)),
              },
            },
          ]}
        />
      </div>
      <Typography variant="caption" textAlign="end">
        Data from{' '}
        <a href="https://parisdata.opendatasoft.com/explore/dataset/comptage-velo-donnees-compteurs/">
          Paris Data
        </a>
      </Typography>
    </Stack>
  );
}

export default function HeatmapDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/heatmap/">
      <HeatmapDemoContent />
    </ChartDemoWrapper>
  );
}
