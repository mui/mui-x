import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import {
  AxisValueFormatterContext,
  HeatmapValueType,
  XAxis,
  YAxis,
} from '@mui/x-charts-pro/models';
import { useTheme } from '@mui/system';
import { ChartsTooltipContainer, useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import data from '../dataset/muiXCommits2024.json';

const seriesData: HeatmapValueType[] = [];

let maxContributions = 0;

const firstWeekDay = new Date('2023-12-31').getTime();
for (const datum of data) {
  const date = new Date(datum.date);
  const weekNumber = Math.floor(
    (date.getTime() - firstWeekDay) / (7 * 24 * 60 * 60 * 1000),
  );
  const weekDay = date.getDay();
  const value = datum.count;
  seriesData.push([weekNumber, weekDay, value]);

  maxContributions = Math.max(maxContributions, value);
}

const weeks = Array.from({ length: 53 }).map(
  (_, i) => new Date(2023, 11, 31 + i * 7),
);
const weekDays = Array.from({ length: 7 }).map((_, i) => i);

const darkThemeColors = ['#151b23', '#033a16', '#196c2e', '#2ea043', '#56d364'];
const lightThemeColors = ['#eff2f5', '#aceebb', '#4ac26b', '#2da44e', '#116329'];

const xAxis = {
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
  disableLine: true,
  categoryGapRatio: 0.1,
} satisfies XAxis<'band'>;

const yAxis = {
  data: weekDays,
  tickSize: 0,
  valueFormatter: formatWeekDay,
  disableLine: true,
  categoryGapRatio: 0.1,
} satisfies YAxis<'band'>;

export default function ZoomHeatmap() {
  const theme = useTheme();

  return (
    <Stack width="100%">
      <Typography variant="h6" align="center">
        Daily Commit Count to MUI X Repo (2024)
      </Typography>
      <Heatmap
        height={160}
        xAxis={[{ ...xAxis, zoom: { minSpan: 60 } }]}
        yAxis={[yAxis]}
        zAxis={[
          {
            min: 0,
            max: maxContributions,
            colorMap: {
              type: 'piecewise',
              thresholds: [0.01, 0.33, 0.66, 1].map((v) => v * maxContributions),
              colors:
                theme.palette.mode === 'light' ? lightThemeColors : darkThemeColors,
            },
          },
        ]}
        series={[{ data: seriesData }]}
        borderRadius={4}
        slots={{ tooltip: Tooltip }}
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

function Tooltip() {
  return (
    <ChartsTooltipContainer trigger="item" position="top">
      <TooltipContent />
    </ChartsTooltipContainer>
  );
}

function TooltipContent() {
  const tooltipData = useItemTooltip<'heatmap'>();

  if (!tooltipData) {
    return null;
  }

  const { value } = tooltipData;

  const date = new Date(2023, 11, 31 + value[0] * 7 + value[1]);

  return (
    <Stack
      sx={(theme) => ({
        background: theme.palette.background.paper,
        borderRadius: 2,
        paddingX: 1,
        paddingY: 0.5,
      })}
    >
      <Typography>
        {value[2]} contribution{value[2] === 1 ? '' : 's'} on{' '}
        {date.toLocaleString('en-US', { month: 'long', day: 'numeric' })}
      </Typography>
    </Stack>
  );
}
