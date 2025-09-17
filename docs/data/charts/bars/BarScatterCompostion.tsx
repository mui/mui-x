import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ScatterPlot } from '@mui/x-charts/ScatterChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { GDPdata } from '../dataset/gdpGrowth';

const chartSetting = {
  xAxis: [
    {
      label: 'Value',
      colorMap: {
        type: 'piecewise' as const,
        thresholds: [0],
        colors: ['#ff4d4f', '#1976d2'],
      },
    },
  ],
  height: 800,
};

const valueFormatter = (value: number | null) =>
  value ? `${value.toFixed(2)}%` : '';

const scatterValueFormatter = (value: { x: number } | null) =>
  value ? `${value.x.toFixed(2)}%` : '';

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
        Average annual real GDP growth (2024 vs 2010-19 Avg)
      </Typography>
      <ChartDataProvider
        dataset={GDPdata}
        series={[
          {
            type: 'bar',
            layout: 'horizontal',
            dataKey: '2024',
            label: '2024 ',
            valueFormatter,
          },
          {
            type: 'scatter',
            datasetKeys: { id: 'country', x: '2010_19', y: 'country' },
            label: '2010-19 Average',
            valueFormatter: scatterValueFormatter,
            markerSize: 5,
          },
        ]}
        yAxis={[{ scaleType: 'band', dataKey: 'country', width: 100 }]}
        {...chartSetting}
      >
        <ChartsLegend />
        <ChartsTooltip />
        <ChartsSurface>
          <ChartsGrid vertical />
          <BarPlot />
          <ScatterPlot />
          <ChartsXAxis />
          <ChartsYAxis />
        </ChartsSurface>
      </ChartDataProvider>
    </Box>
  );
}
