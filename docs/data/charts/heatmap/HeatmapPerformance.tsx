import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { interpolateRdBu } from 'd3-scale-chromatic';
import { Heatmap, HeatmapSeries } from '@mui/x-charts-pro/Heatmap';
import data from '../dataset/averageWorldTemperatureAnomalies.json';

export default function ZoomHeatmap() {
  return (
    <Stack width="100%">
      <Typography variant="h6" align="center" gutterBottom>
        Average World Temperature Anomalies (1850 - 2024)
      </Typography>
      <Heatmap
        height={400}
        xAxis={[
          {
            data: [...new Set(data.map((d) => d.year.toString()))],
            tickSpacing: 50,
            zoom: true,
          },
        ]}
        yAxis={[
          {
            data: Array.from({ length: 12 })
              .map((_, i) => i)
              .reverse(),
            valueFormatter: (value) => {
              const month = parseInt(value, 10);
              return new Date(0, month).toLocaleString('en-US', { month: 'short' });
            },
          },
        ]}
        zAxis={[
          {
            min: -2,
            max: 2,
            colorMap: {
              min: -2,
              max: 2,
              type: 'continuous',
              color: (t) => interpolateRdBu(1 - t),
            },
          },
        ]}
        series={series}
        hideLegend={false}
      />
      <Typography variant="caption">Source: HadCRUT5</Typography>
    </Stack>
  );
}

const series = [
  {
    data: data.map((d) => [d.year - 1850, d.month - 1, d.value]),
    valueFormatter: (value) => `${value[2].toFixed(2)} °C`,
  },
] satisfies HeatmapSeries[];
