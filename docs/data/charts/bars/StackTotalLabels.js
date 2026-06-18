import * as React from 'react';
import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { useBarSeries, useXScale, useYScale } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

export default function StackTotalLabels() {
  return (
    <ChartsContainer
      xAxis={[{ scaleType: 'band', data: ['Q1', 'Q2', 'Q3'] }]}
      series={[
        {
          type: 'bar',
          id: 'a',
          stack: 'total',
          data: [5, 17, 11],
          barLabel: 'value',
        },
        { type: 'bar', id: 'b', stack: 'total', data: [4, 8, 6], barLabel: 'value' },
      ]}
      height={400}
      yAxis={[{ width: 30 }]}
      margin={{ left: 0, right: 10, top: 30 }}
    >
      <BarPlot />
      <StackTotals />
      <ChartsXAxis />
      <ChartsYAxis />
    </ChartsContainer>
  );
}

function StackTotals() {
  const xScale = useXScale();
  const yScale = useYScale();
  const barSeries = useBarSeries();

  const categories = xScale.domain();
  const bandWidth = xScale.bandwidth();

  return (
    <React.Fragment>
      {categories.map((category, dataIndex) => {
        const total = barSeries.reduce(
          (acc, series) =>
            acc + (series.stack === 'total' ? (series.data[dataIndex] ?? 0) : 0),
          0,
        );

        const cx = (xScale(category) ?? 0) + bandWidth / 2;
        const cy = yScale(total) ?? 0;

        return (
          <TotalLabel key={String(category)} x={cx} y={cy - 8}>
            {total}
          </TotalLabel>
        );
      })}
    </React.Fragment>
  );
}

const TotalLabel = styled('text')(({ theme }) => ({
  ...theme?.typography?.body2,
  fontWeight: 600,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  textAnchor: 'middle',
  dominantBaseline: 'auto',
  pointerEvents: 'none',
}));
