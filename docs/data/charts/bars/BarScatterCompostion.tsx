import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ScatterPlot } from '@mui/x-charts/ScatterChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { legendClasses, ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { GDPdata } from '../dataset/gdpGrowth';

const chartSetting = {
  xAxis: [
    {
      id: 'bar',
      label: 'GDP growth rate',
      dataKey: '2024',
      colorMap: {
        type: 'piecewise' as const,
        thresholds: [0],
        colors: ['#ff4d4f', '#1976d2'],
      },
    },
    {
      id: 'scatter',
      label: '2010-19 Average',
      dataKey: '2010_19',
      color: '#FFFF00',
    },
  ],
  height: 800,
};

const valueFormatter = (value: number | null) =>
  value ? `${value.toFixed(2)}%` : '';

const scatterValueFormatter = (value: { x: number } | null) =>
  value ? `${value.x.toFixed(2)}%` : '';

function Gradient() {
  return (
    <linearGradient id="diagonalGradient" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stopColor="#ff4d4f" />
      <stop offset="50%" stopColor="#ff4d4f" />
      <stop offset="50%" stopColor="#1976d2" />
      <stop offset="100%" stopColor="#1976d2" />
    </linearGradient>
  );
}

export default function BarScatterCompostion() {
  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6">
        GDP growth rate comparison (2024 vs 2010-19 Avg)
      </Typography>
      <ChartDataProvider
        dataset={GDPdata}
        series={[
          {
            id: 'bar',
            type: 'bar',
            layout: 'horizontal',
            dataKey: '2024',
            label: '2024 ',
            valueFormatter,
          },
          {
            id: 'scatter',
            type: 'scatter',
            datasetKeys: { id: 'country', x: '2010_19', y: 'country' },
            label: '2010-19 Average',
            valueFormatter: scatterValueFormatter,
            markerSize: 4,
            xAxisId: 'scatter',
          },
        ]}
        yAxis={[{ scaleType: 'band', dataKey: 'country', width: 100 }]}
        {...chartSetting}
      >
        <ChartsLegend
          sx={{
            [`[data-series="bar"] .${legendClasses.mark} rect`]: {
              fill: 'url(#diagonalGradient)',
            },
          }}
        />
        <ChartsTooltip />
        <ChartsSurface>
          <Gradient />
          <ChartsGrid vertical />
          <BarPlot />
          <ScatterPlot />
          <ChartsXAxis axisId="bar" />
          <ChartsYAxis />
        </ChartsSurface>
      </ChartDataProvider>
    </Box>
  );
}
