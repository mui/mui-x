import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LineHighlightPlot, LinePlot } from '@mui/x-charts/LineChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { BarSeriesType, LineSeriesType } from '@mui/x-charts/models';
import DemoWrapper from '../../DemoWrapper';

const dataset = [
  { min: -12, max: -4, precip: 79, month: 'Jan' },
  { min: -11, max: -3, precip: 66, month: 'Feb' },
  { min: -6, max: 2, precip: 76, month: 'Mar' },
  { min: 1, max: 9, precip: 106, month: 'Apr' },
  { min: 8, max: 17, precip: 105, month: 'Mai' },
  { min: 15, max: 24, precip: 114, month: 'Jun' },
  { min: 18, max: 26, precip: 106, month: 'Jul' },
  { min: 17, max: 26, precip: 105, month: 'Aug' },
  { min: 13, max: 21, precip: 100, month: 'Sept' },
  { min: 6, max: 13, precip: 116, month: 'Oct' },
  { min: 0, max: 6, precip: 93, month: 'Nov' },
  { min: -8, max: -1, precip: 93, month: 'Dec' },
];

const series: (BarSeriesType | LineSeriesType)[] = [
  {
    type: 'bar',
    label: 'precipitation',
    dataKey: 'precip',
    color: '#bfdbf7',
    yAxisId: 'rightAxis',
    valueFormatter: (value: number | null) => (value === null ? '' : `${value}mm`),
  },
  {
    type: 'line',
    label: 'temperature min',
    dataKey: 'min',
    color: '#577399',
    valueFormatter: (value: number | null) => (value === null ? '' : `${value}°C`),
  },
  {
    type: 'line',
    label: 'temperature max',
    dataKey: 'max',
    color: '#fe5f55',
    valueFormatter: (value: number | null) => (value === null ? '' : `${value}°C`),
  },
];

function MultiAxes() {
  return (
    <ChartContainer
      series={series}
      xAxis={[
        {
          scaleType: 'band',
          dataKey: 'month',
          label: 'Month',
        },
      ]}
      yAxis={[
        { id: 'leftAxis', width: 50 },
        { id: 'rightAxis', position: 'right', width: 50 },
      ]}
      dataset={dataset}
    >
      <ChartsGrid horizontal />
      <BarPlot />
      <ChartsAxisHighlight x="band" />
      <LinePlot />
      <LineHighlightPlot />
      <ChartsXAxis />
      <ChartsYAxis axisId="leftAxis" label="temperature (°C)" />
      <ChartsYAxis axisId="rightAxis" label="precipitation (mm)" />
      <ChartsTooltip />
    </ChartContainer>
  );
}

export default function MultiAxesDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  return (
    <DemoWrapper link="/x/react-charts/bar/">
      <Stack sx={{ width: '100%', padding: 2, minHeight: '600px' }} justifyContent="space-between">
        <Box
          sx={{
            height: 300,
            overflow: 'auto',
            minWidth: 260,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <MultiAxes />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={`
<ChartContainer
  series={[precipitations, minTemperature, maxTemperature]}
  xAxis={[monthsAxis]}
  yAxis={[temperatureAxis, precipitationsAxis]}
>
  <BarPlot />
  <LinePlot />
  <ChartsXAxis />
  <ChartsYAxis axisId="leftAxis" label="temperature (°C)" />
  <ChartsYAxis axisId="rightAxis" label="precipitation (mm)" />
  <ChartsTooltip />
</ChartContainer>`}
          language="js"
          sx={{ overflowX: 'hidden' }}
        />
      </Stack>
    </DemoWrapper>
  );
}
