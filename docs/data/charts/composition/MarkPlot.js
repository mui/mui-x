import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ScatterPlot } from '@mui/x-charts/ScatterChart';
import { useXScale, useYScale } from '@mui/x-charts/hooks';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

const weeklyHeartRateData = [
  { day: 'Mon', min: 65, max: 140 },
  { day: 'Tue', min: 70, max: 155 },
  { day: 'Wed', min: 68, max: 148 },
  { day: 'Thu', min: 72, max: 160 },
  { day: 'Fri', min: 66, max: 152 },
  { day: 'Sat', min: 80, max: 170 },
  { day: 'Sun', min: 75, max: 165 },
];



const series = [
  {
    type: 'scatter',
    label: 'Min Heart Rate',
    data: weeklyHeartRateData.map((d) => ({ x: d.day, y: d.min, id: `${d.day}-min` })),
    color: '#2E96FF',
    yAxisId: 'heartRateAxis',
    xAxisId: 'dayAxis',
    markerSize: 10,
    valueFormatter: (v) => v.y,
  },
  {
    type: 'scatter',
    label: 'Max Heart Rate',
    data: weeklyHeartRateData.map((d) => ({ x: d.day, y: d.max, id: `${d.day}-max` })),
    color: '#FF6464',
    yAxisId: 'heartRateAxis',
    xAxisId: 'dayAxis',
    markerSize: 10,
    valueFormatter: (v) => v.y,
  },
];

function ConnectingBars() {
  const xScale = useXScale('dayAxis');
  const yScale = useYScale('heartRateAxis');

  
  const bandwidth = xScale.bandwidth();
  
  return (
    <g>
      {weeklyHeartRateData.map(({ day, min, max }) => {
        const x = xScale(day) + bandwidth / 2;
        const y1 = yScale(min);
        const y2 = yScale(max);
        
        return (
          <line
            key={day}
            x1={x}
            y1={y1}
            x2={x}
            y2={y2}
            stroke="rgba(128, 128, 128, 0.3)"
            strokeWidth={24}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

export default function MarkPlot() {
  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Weekly Heart Rate Summary
      </Typography>
      <ChartDataProvider
        series={series}
        width={600}
        height={400}
        xAxis={[
          {
            id: 'dayAxis',
            scaleType: 'band',
            data: weeklyHeartRateData.map((d) => d.day),
            height: 50,
            triggerTooltip: true
          },
        ]}
        yAxis={[{ id: 'heartRateAxis', min: 40, width: 60  }]}
      >
      <ChartsSurface>
        <ChartsXAxis axisId="dayAxis" label="Day of the week" />
        <ChartsYAxis axisId="heartRateAxis" label="Heart Rate (bpm)" />
        <ScatterPlot />
        <ConnectingBars />
      </ChartsSurface>
        <ChartsLegend />
        <ChartsTooltip trigger="axis" />
      </ChartDataProvider>
    </Box>
  );
}