import * as React from 'react';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { LinePlot } from '@mui/x-charts/LineChart';
import { useLineSeries, useXAxis, useXScale, useYScale } from '@mui/x-charts/hooks';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function ExtremaLabels({ seriesIndex }) {
  const lineSeries = useLineSeries();
  const xAxis = useXAxis('x');

  if (!lineSeries) {
    return null;
  }

  const seriesId = lineSeries.seriesOrder[seriesIndex];
  const series = lineSeries.series[seriesId];

  const min = series.data.reduce(
    (a, b) => Math.min(a ?? Infinity, b ?? Infinity),
    Infinity,
  );
  const max = series.data.reduce(
    (a, b) => Math.max(a ?? -Infinity, b ?? -Infinity),
    -Infinity,
  );

  return (
    <React.Fragment>
      {series.data.map((y, index) => {
        const x = xAxis.data?.[index];

        if (x == null || y == null) {
          return null;
        }

        if (y !== min && y !== max) {
          return null;
        }

        return (
          <PointLabel
            x={x}
            y={y}
            placement={y === min ? 'below' : 'above'}
            color={series.color}
          />
        );
      })}
    </React.Fragment>
  );
}

function PointLabel({ x, y, placement, color }) {
  const xAxisScale = useXScale();
  const yAxisScale = useYScale();

  const left = xAxisScale(x) ?? 0;
  const top = (yAxisScale(y) ?? 0) + (placement === 'below' ? 20 : -20);

  return (
    <Box
      sx={{
        position: 'absolute',
        left,
        top,
        translate: '-50% -50%',
        background: color,
        borderRadius: 1,
        px: 1,
      }}
    >
      <Typography variant="caption" sx={{ mixBlendMode: 'difference' }}>
        {y}
      </Typography>
    </Box>
  );
}

export default function SeriesDemo() {
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <ChartDataProvider
        xAxis={[{ id: 'x', data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          { type: 'line', data: [4, 6, 4, 9, 3, 5] },
          { type: 'line', data: [3, 9, 8, 2, 4, 9] },
        ]}
        yAxis={[{ min: 0, max: 10 }]}
        height={300}
      >
        <ChartsSurface>
          <LinePlot />
          <ChartsXAxis />
          <ChartsYAxis />
        </ChartsSurface>
        <ExtremaLabels seriesIndex={0} />
        <ExtremaLabels seriesIndex={1} />
      </ChartDataProvider>
    </Box>
  );
}
