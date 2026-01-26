import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LineHighlightPlot, LinePlot } from '@mui/x-charts/LineChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { BarSeriesType, LineSeriesType } from '@mui/x-charts/models';
import ChartDemoWrapper from '../ChartDemoWrapper';

const dataset = [
  { min: -12, max: -4, precip: 79, month: 'January' },
  { min: -11, max: -3, precip: 66, month: 'February' },
  { min: -6, max: 2, precip: 76, month: 'March' },
  { min: 1, max: 9, precip: 106, month: 'April' },
  { min: 8, max: 17, precip: 105, month: 'May' },
  { min: 15, max: 24, precip: 114, month: 'June' },
  { min: 18, max: 26, precip: 106, month: 'July' },
  { min: 17, max: 26, precip: 105, month: 'August' },
  { min: 13, max: 21, precip: 100, month: 'September' },
  { min: 6, max: 13, precip: 116, month: 'October' },
  { min: 0, max: 6, precip: 93, month: 'November' },
  { min: -8, max: -1, precip: 93, month: 'December' },
];

const series: (BarSeriesType | LineSeriesType)[] = [
  {
    type: 'bar',
    label: 'Precipitation',
    dataKey: 'precip',
    color: '#bfdbf7',
    yAxisId: 'rightAxis',
    valueFormatter: (value: number | null) => (value === null ? '' : `${value}mm`),
  },
  {
    type: 'line',
    label: 'Temperature min',
    dataKey: 'min',
    color: '#577399',
    valueFormatter: (value: number | null) => (value === null ? '' : `${value}°C`),
  },
  {
    type: 'line',
    label: 'Temperature max',
    dataKey: 'max',
    color: '#fe5f55',
    valueFormatter: (value: number | null) => (value === null ? '' : `${value}°C`),
  },
];

function MultiAxes() {
  return (
    <Stack height="100%">
      <Typography align="center">Weather stats for Quebec city</Typography>
      <ChartContainer
        series={series}
        xAxis={[
          {
            scaleType: 'band',
            height: 50,
            dataKey: 'month',
            label: 'Month',
            valueFormatter: (value, context) =>
              context.location === 'tick' ? value.slice(0, 3) : value,
            tickLabelStyle: { fontWeight: 400 },
          },
        ]}
        yAxis={[
          { id: 'leftAxis', width: 54, tickLabelStyle: { fontWeight: 400 } },
          { id: 'rightAxis', position: 'right', width: 54, tickLabelStyle: { fontWeight: 400 } },
        ]}
        dataset={dataset}
      >
        <ChartsGrid horizontal />
        <BarPlot />
        <ChartsAxisHighlight x="band" />
        <LinePlot />
        <LineHighlightPlot />
        <ChartsXAxis />
        <ChartsYAxis axisId="leftAxis" label="Temperature (°C)" />
        <ChartsYAxis axisId="rightAxis" label="Precipitation (mm)" />
        <ChartsTooltip />
      </ChartContainer>
    </Stack>
  );
}

export default function MultiAxesDemo() {
  return (
    <ChartDemoWrapper link="/x/react-charts/axis/">
      <MultiAxes />
    </ChartDemoWrapper>
  );
}
