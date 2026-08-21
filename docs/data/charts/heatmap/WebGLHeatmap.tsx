import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { interpolateOrRd } from 'd3-scale-chromatic';
import {
  HeatmapPremium,
  HeatmapPremiumProps,
} from '@mui/x-charts-premium/HeatmapPremium';
import data from '../dataset/nyc-yellow-taxi-2024-trip-count.json';

const seriesData = data as [number, number, number][];
const max = Math.max(...seriesData.map(([, , value]) => value));
const xData = Array.from({ length: 366 }, (_, i) => {
  const date = new Date(2024, 0, 1);

  date.setDate(i + 1);

  return date;
});
const yData = Array.from({ length: 24 }, (_, i) => i);

const settings: HeatmapPremiumProps = {
  xAxis: [
    {
      data: xData,
      ordinalTimeTicks: ['months', 'biweekly', 'weeks', 'days'],
      valueFormatter: (date: Date) =>
        date.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
      zoom: { minSpan: 3 },
    },
  ],
  yAxis: [{ data: yData, valueFormatter: (hour: number) => `${hour}:00` }],
  zAxis: [
    {
      min: 0,
      max,
      colorMap: {
        type: 'continuous',
        color: interpolateOrRd,
        max,
      },
    },
  ],
  series: [{ data: seriesData }],
  height: 450,
};

export default function WebGLHeatmap() {
  const [N, setN] = React.useState(100);

  return (
    <Stack sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ alignSelf: 'center', textAlign: 'center' }}>
        Yellow Taxi Trip Count - 2024
      </Typography>

      <Typography variant="body2" sx={{ alignSelf: 'center', textAlign: 'center' }}>
        Number of colors in the color map: {N}
      </Typography>
      <Slider
        value={N}
        min={1}
        max={200}
        step={1}
        onChange={(event, value: any) => setN(value as number)}
      />
      <HeatmapPremium
        renderer="webgl"
        {...settings}
        zAxis={[
          {
            min: 0,
            max,
            colorMap: {
              type: 'continuous',
              color: (t: number) => interpolateOrRd(Math.floor(t * N) / N),
              max,
            },
          },
        ]}
      />
      <Typography variant="caption">Source: NYC.gov</Typography>
    </Stack>
  );
}
