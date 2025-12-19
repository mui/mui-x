import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { interpolateGreens } from 'd3-scale-chromatic';
import {
  Heatmap,
  HeatmapCellProps,
  HeatmapCellProps,
} from '@mui/x-charts-pro/Heatmap';
import {
  AxisValueFormatterContext,
  HeatmapValueType,
} from '@mui/x-charts-pro/models';
import data from '../dataset/muiXCommits2024.json';

const seriesData: HeatmapValueType[] = [];

let min = Infinity;
let max = 0;

const firstWeekDay = new Date('2024-01-01').getTime();
for (const datum of data) {
  const date = new Date(datum.date);
  const weekNumber = Math.floor(
    (date.getTime() - firstWeekDay) / (7 * 24 * 60 * 60 * 1000),
  );
  const weekDay = date.getDay();
  const value = datum.count;
  seriesData.push([weekNumber, weekDay, value]);

  min = Math.min(min, value);
  max = Math.max(max, value);
}

const weeks = Array.from({ length: 53 }).map((_, i) => new Date(2024, 0, 1 + i * 7));
const weekDays = Array.from({ length: 7 }).map((_, i) => i);

export default function ZoomHeatmap() {
  return (
    <Stack width="100%">
      <Typography variant="h6" align="center" gutterBottom>
        Daily Commit Count to MUI X Repo (2024)
      </Typography>
      <Heatmap
        height={160}
        xAxis={[
          {
            data: weeks,
            valueFormatter: (date) => {
              if (date.getDate() < 8) {
                return date.toLocaleString('en-US', { month: 'short' });
              }

              return '';
            },
            tickSize: 0,
            ordinalTimeTicks: ['months', 'weeks'],
            position: 'top',
            zoom: true,
            disableLine: true,
          },
        ]}
        yAxis={[
          {
            data: weekDays,
            tickSize: 0,
            valueFormatter: formatWeekDay,
            disableLine: true,
          },
        ]}
        zAxis={[
          {
            min,
            max,
            colorMap: { min, max, type: 'continuous', color: interpolateGreens },
          },
        ]}
        series={[{ data: seriesData }]}
        hideLegend={false}
        slots={{ cell: HeatmapCell }}
      />
      <Typography variant="caption">Source: GitHub</Typography>
    </Stack>
  );
}

const formattedWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatWeekDay(value: number, context: AxisValueFormatterContext): string {
  if (context.location === 'tick') {
    switch (value) {
      case 1:
      case 3:
      case 5:
        return formattedWeekDays[value];
      default:
        return '';
    }
  }

  return formattedWeekDays[value];
}

function HeatmapCell({
  ownerState,
  x,
  y,
  width,
  height,
  ...props
}: HeatmapCellProps) {
  return (
    <rect
      x={x + 1}
      y={y + 1}
      width={width - 2}
      height={height - 2}
      {...props}
      rx={4}
      ry={4}
      fill={ownerState.color}
    />
  );
}
