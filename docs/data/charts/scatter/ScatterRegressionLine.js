import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ChartsClipPath, useSeries, useXScale, useYScale } from '@mui/x-charts';
import useId from '@mui/utils/useId';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { diamonds } from '../dataset/diamonds';

const dollarFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function ScatterRegressionLine() {
  return (
    <Stack width="100%">
      <Typography variant="h6" component="span" textAlign="center">
        Relation between Weight (in carats) and Price of Diamonds (USD)
      </Typography>
      <ScatterChart
        dataset={diamonds}
        height={300}
        xAxis={[{ min: 0 }]}
        yAxis={[
          {
            min: 0,
            width: 56,
            valueFormatter: (value) => dollarFormatter.format(value),
          },
        ]}
        series={[
          {
            id: 'diamonds',
            datasetKeys: { x: 'carat', y: 'price' },
            markerSize: 2,
          },
        ]}
      >
        <LinearRegression seriesId="diamonds" />
      </ScatterChart>

      <Typography variant="caption">Source: OpenML</Typography>
    </Stack>
  );
}

function LinearRegression({ seriesId }) {
  const allSeries = useSeries();
  const series = allSeries?.scatter?.series[seriesId];
  const xScale = useXScale(series.xAxisId);
  const yScale = useYScale(series.yAxisId);
  const clipPathId = `linear-regression-clip-${useId()}`;

  const { m, b } = linearRegression(series?.data ?? []);

  const xDomain = xScale.domain();
  const x1 = xScale(xDomain[0]);
  const x2 = xScale(xDomain[1]);
  const y1 = yScale(m * xDomain[0] + b);
  const y2 = yScale(m * xDomain[1] + b);

  return (
    <React.Fragment>
      <ChartsClipPath id={clipPathId} />
      <g clipPath={`url(#${clipPathId})`}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="red"
          fill="red"
          strokeWidth={2}
        />
      </g>
    </React.Fragment>
  );
}

function linearRegression(points) {
  const n = points.length;

  // Calculate sums
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;

  for (let i = 0; i < n; i += 1) {
    const x = points[i].x;
    const y = points[i].y;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  // Calculate slope (m) and intercept (b)
  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  return { m, b };
}
