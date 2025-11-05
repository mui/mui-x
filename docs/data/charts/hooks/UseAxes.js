import * as React from 'react';
import { useYAxes, useXAxis, useLineSeries } from '@mui/x-charts/hooks';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { findMinMax } from '@mui/x-charts/internals';

const dataset = [
  { month: 'Jan', temperature: 5, rainfall: 45 },
  { month: 'Feb', temperature: 7, rainfall: 38 },
  { month: 'Mar', temperature: 12, rainfall: 42 },
  { month: 'Apr', temperature: 16, rainfall: 35 },
  { month: 'May', temperature: 21, rainfall: 28 },
  { month: 'Jun', temperature: 25, rainfall: 22 },
];

function AxisRangeIndicators() {
  const { yAxis, yAxisIds } = useYAxes();
  const xAxis = useXAxis();
  const allSeries = useLineSeries();

  const xDomain = xAxis.scale.domain();
  const xStart = xAxis.scale(xDomain[0]) ?? 0;
  const xEnd = xAxis.scale(xDomain[xDomain.length - 1]) ?? 0;

  return (
    <g>
      {allSeries.map((series, index) => {
        const axis = yAxis[series.yAxisId ?? yAxisIds[0]];
        const [seriesMin, seriesMax] = findMinMax(
          series.data.filter((v) => v != null),
        );
        const yMin = axis.scale(seriesMin) ?? 0;
        const yMax = axis.scale(seriesMax) ?? 0;

        const color = series.color ?? (index === 0 ? '#1976d2' : '#dc004e');

        return (
          <g key={series.id}>
            {/* Min value horizontal line */}
            <line
              x1={xStart}
              x2={xEnd}
              y1={yMin}
              y2={yMin}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              opacity={0.6}
            />
            {/* Max value horizontal line */}
            <line
              x1={xStart}
              x2={xEnd}
              y1={yMax}
              y2={yMax}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              opacity={0.6}
            />
            {/* Min value label */}
            <text
              x={xEnd + 5}
              y={yMin}
              fontSize="11"
              fill={color}
              fontWeight="bold"
              alignmentBaseline="middle"
            >
              min: {seriesMin}
            </text>
            {/* Max value label */}
            <text
              x={xEnd + 5}
              y={yMax}
              fontSize="11"
              fill={color}
              fontWeight="bold"
              alignmentBaseline="middle"
            >
              max: {seriesMax}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function UseAxes() {
  return (
    <div style={{ width: '100%' }}>
      <ChartDataProvider
        dataset={dataset}
        xAxis={[
          {
            id: 'months',
            scaleType: 'point',
            dataKey: 'month',
          },
        ]}
        yAxis={[
          {
            id: 'temperature',
            scaleType: 'linear',
            min: 0,
            max: 30,
            position: 'left',
          },
          {
            id: 'rainfall',
            scaleType: 'linear',
            min: 0,
            max: 50,
            position: 'right',
          },
        ]}
        series={[
          {
            type: 'line',
            dataKey: 'temperature',
            label: 'Temperature (°C)',
            yAxisId: 'temperature',
            color: '#1976d2',
          },
          {
            type: 'line',
            dataKey: 'rainfall',
            label: 'Rainfall (mm)',
            yAxisId: 'rainfall',
            color: '#dc004e',
          },
        ]}
        height={300}
      >
        <ChartsSurface>
          <LinePlot />
          <ChartsXAxis />
          <ChartsYAxis axisId="temperature" />
          <ChartsYAxis axisId="rainfall" />
          <AxisRangeIndicators />
        </ChartsSurface>
      </ChartDataProvider>
    </div>
  );
}
