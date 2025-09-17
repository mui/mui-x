import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ScatterPlot } from '@mui/x-charts/ScatterChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsLegend, PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { useLegend } from '@mui/x-charts/hooks';
import { ChartsLabelMark } from '@mui/x-charts/ChartsLabel';
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

function CustomLegend() {
  const { items } = useLegend();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        spacing: 5,
      }}
    >
      {items.map((item) => {
        const { label, color, markType, seriesId } = item;
        return seriesId === 'bar' ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <ChartsLegend
              slots={{ legend: PiecewiseColorLegend }}
              slotProps={{
                legend: {
                  axisDirection: 'x',
                  direction: 'horizontal',
                  markType: 'square',
                  labelPosition: 'extremes',
                  sx: { padding: 0 },
                },
              }}
            />
            <Typography variant="caption">{`${label}`}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              marginLeft: 3,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <ChartsLabelMark type={markType} color={color} />
            <Typography variant="caption">{`${label}`}</Typography>
          </Box>
        );
      })}
    </Box>
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
        <CustomLegend />
        <ChartsTooltip />
        <ChartsSurface>
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
