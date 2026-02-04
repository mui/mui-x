import { interpolateBlues } from 'd3-scale-chromatic';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { HeatmapValueType } from '@mui/x-charts-pro/models';
import bikeData from 'docsx/data/charts/dataset/ParisBicycle.json';
import ChartDemoWrapper from '../ChartDemoWrapper';

const days = [
  new Date(2025, 1, 24),
  new Date(2025, 1, 25),
  new Date(2025, 1, 26),
  new Date(2025, 1, 27),
  new Date(2025, 1, 28),
  new Date(2025, 2, 1),
  new Date(2025, 2, 2),
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

const shortDayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format;
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format;

function HeatmapDemoContent() {
  return (
    <Stack height="100%">
      <Typography align="center" sx={{ width: '100%', mb: 1 }}>
        Bicycle count: Paris - Rivoli street (West-East)
      </Typography>
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <Heatmap
          margin={{ left: 2 }}
          xAxis={[
            {
              data: days,
              label: 'Day',
              valueFormatter: (value: Date, context) => {
                return context.location === 'tick'
                  ? shortDayFormatter(value)
                  : dateFormatter(value);
              },
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
          series={[{ data: bikeData as unknown as HeatmapValueType[], label: 'Bicycle count' }]}
          zAxis={[
            {
              colorMap: {
                max: 700,
                type: 'continuous',

                color: (t: number) => interpolateBlues(Math.sqrt(t)),
              },
            },
          ]}
          hideLegend={false}
          slotProps={{
            legend: {
              direction: 'vertical',
              position: { vertical: 'top' },
              sx: { height: 200 },
            },
          }}
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
