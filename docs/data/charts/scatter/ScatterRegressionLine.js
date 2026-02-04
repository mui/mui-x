import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { useSeries, useXScale, useYScale } from '@mui/x-charts/hooks';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import useId from '@mui/utils/useId';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { rainbowSurgePalette } from '@mui/x-charts/colorPalettes';
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
        Relation between Weight and Price of Diamonds
      </Typography>
      <ScatterChart
        dataset={diamonds}
        height={300}
        xAxis={[{ min: 0, label: 'Weight (carats)' }]}
        yAxis={[
          {
            min: 0,
            width: 80,
            valueFormatter: (value) => dollarFormatter.format(value),
            label: 'Price (USD)',
          },
        ]}
        series={[
          {
            id: 'diamonds',
            datasetKeys: { x: 'carat', y: 'price' },
            markerSize: 2,
            valueFormatter: (v) => `${dollarFormatter.format(v.y)} for ${v.x} carat`,
          },
        ]}
      >
        <RegressionLine seriesId="diamonds" />
      </ScatterChart>

      <Typography variant="caption">Source: OpenML</Typography>
    </Stack>
  );
}

function RegressionLine({ seriesId }) {
  const theme = useTheme();
  const palette = rainbowSurgePalette(theme.palette.mode);
  const stroke = palette[2];
  const allSeries = useSeries();
  const series = allSeries.scatter.series[seriesId];
  const xScale = useXScale(series.xAxisId);
  const yScale = useYScale(series.yAxisId);
  const clipPathId = `linear-regression-clip-${useId()}`;

  const { m, b } = linearRegression(series.data ?? []);

  const xDomain = xScale.domain();
  const x1 = xScale(xDomain[0]);
  const x2 = xScale(xDomain[1]);
  const y1 = yScale(m * xDomain[0] + b);
  const y2 = yScale(m * xDomain[1] + b);

  return (
    <React.Fragment>
      <ChartsClipPath id={clipPathId} />
      <g clipPath={`url(#${clipPathId})`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={2} />
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
