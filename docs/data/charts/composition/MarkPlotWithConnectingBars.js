import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { MarkPlot } from '@mui/x-charts/LineChart';
import { useXScale, useYScale } from '@mui/x-charts/hooks';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';

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
    type: 'line',
    label: 'Min Heart Rate',
    dataKey: 'min',
    color: '#2E96FF',
    yAxisId: 'heartRateAxis',
    xAxisId: 'dayAxis',
  },
  {
    type: 'line',
    label: 'Max Heart Rate',
    dataKey: 'max',
    color: '#FF6464',
    yAxisId: 'heartRateAxis',
    xAxisId: 'dayAxis',
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

export default function MarkPlotWithConnectingBars() {
  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Weekly Heart Rate Summary
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Minimum and Maximum heart rate per day
      </Typography>
      <ChartDataProvider
        dataset={weeklyHeartRateData}
        series={series}
        width={700}
        height={400}
        xAxis={[
          {
            id: 'dayAxis',
            scaleType: 'band',
            dataKey: 'day',
            triggerTooltip: 'true',
          },
        ]}
        yAxis={[{ id: 'heartRateAxis', min: 40, width: 60 }]}
      >
        <ChartsSurface>
          <ChartsXAxis axisId="dayAxis" label="Day of the week" height="60" />
          <ChartsYAxis axisId="heartRateAxis" label="Heart Rate (bpm)" />
          <MarkPlot />
          {/* <LinePlot /> */}
          <ConnectingBars />
          <ChartsAxisHighlight x="line" />
        </ChartsSurface>
        <ChartsLegend />
        <ChartsTooltip trigger="axis" />
      </ChartDataProvider>
    </Box>
  );
}
