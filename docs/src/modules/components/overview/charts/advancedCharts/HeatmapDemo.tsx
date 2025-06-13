import * as React from 'react';
import { interpolateBlues } from 'd3-scale-chromatic';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { HeatmapValueType } from '@mui/x-charts-pro/models';
import DemoWrapper from '../../DemoWrapper';

const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: 'January',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: 'February',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: 'March',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: 'April',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: 'May',
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: 'June',
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: 'July',
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    seoul: 249,
    month: 'August',
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    seoul: 131,
    month: 'September',
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    seoul: 55,
    month: 'October',
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    seoul: 48,
    month: 'November',
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: 'December',
  },
];

const data = dataset.flatMap(
  ({ london, paris, newYork, seoul }, monthIndex): HeatmapValueType[] => [
    [0, monthIndex, london],
    [1, monthIndex, paris],
    [2, monthIndex, newYork],
    [3, monthIndex, seoul],
  ],
);

const xData = ['London', 'Paris', 'NewYork', 'Seoul'];
const yData = dataset.flatMap(({ month }) => month);

const xAxis = [{ data: xData }];
const yAxis = [{ data: yData, width: 80 }];
function HeatmapDemoContent() {
  return (
    <Heatmap
      xAxis={xAxis}
      yAxis={yAxis}
      series={[{ data }]}
      zAxis={[
        {
          min: 20,
          max: 300,
          colorMap: {
            type: 'continuous',
            color: interpolateBlues,
          },
        },
      ]}
    />
  );
}
export default function HeatmapDemo() {
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  return (
    <DemoWrapper link="/x/react-charts/bar/">
      <Stack spacing={1} sx={{ width: '100%', padding: 2 }} justifyContent="space-between">
        <Box
          sx={{
            height: 300,
            overflow: 'auto',
            minWidth: 260,
            padding: 0,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <ThemeProvider theme={theme}>
            <HeatmapDemoContent />
          </ThemeProvider>
        </Box>

        <HighlightedCode
          code={`
<Heatmap zAxis={[{
  min: 20,
  max: 300,
  colorMap: {
    type: 'continuous',
    color: interpolateBlues,
  },
}]} />`}
          language="js"
          sx={{ overflowX: 'hidden' }}
        />
      </Stack>
    </DemoWrapper>
  );
}
