import Typography from '@mui/material/Typography';
import { RangeBarPlot } from '@mui/x-charts-premium/BarChartPremium';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartContainerPremium } from '@mui/x-charts-premium/ChartContainerPremium';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import * as React from 'react';
import {
  useDataset,
  useDrawingArea,
  useXScale,
  useYScale,
} from '@mui/x-charts/hooks';
import { useTheme, styled } from '@mui/system';
import { ChartsTooltipContainer, useAxesTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';

import { niceDomain } from '@mui/x-charts/utils';
import originalDataset from '../dataset/sp500-intraday.json'; // Source: Yahoo Finance

const dataset = originalDataset.map((datum) => ({
  ...datum,
  date: new Date(datum.date),
}));

const tickLabelDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});
const tooltipDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
const tickLabelDollarFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const tooltipDollarFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const min = dataset.reduce((acc, cur) => Math.min(acc, cur.low), Infinity);
const max = dataset.reduce((acc, cur) => Math.max(acc, cur.high), -Infinity);
const yDomain = niceDomain('linear', [min, max]);

const xAxis = [
  {
    id: 'x',
    scaleType: 'band',
    dataKey: 'date',
    zoom: { minSpan: 10, filterMode: 'discard' },
    valueFormatter: (date, context) => {
      const formatter =
        context.location === 'tick' ? tickLabelDateFormatter : tooltipDateFormatter;

      return formatter.format(Date.parse(date));
    },
    ordinalTimeTicks: ['years', 'quarterly', 'months', 'biweekly', 'weeks', 'days'],
  },
];

const yAxis = [
  {
    id: 'y',
    scaleType: 'linear',
    domainLimit: () => ({ min: yDomain[0], max: yDomain[1] }),
    valueFormatter: (value) => tickLabelDollarFormatter.format(value),
  },
];

const series = [
  {
    type: 'rangeBar',
    datasetKeys: { start: 'open', end: 'close' },
    xAxisId: 'x',
    yAxisId: 'y',
    colorGetter: (data) => {
      const value = dataset[data.dataIndex];

      return value.close > value.open ? 'green' : 'red';
    },
  },
];

export default function RangeBarCandlestick() {
  const clipPathId = React.useId();

  return (
    <ChartContainerPremium
      dataset={dataset}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={300}
    >
      <ChartsXAxis />
      <ChartsYAxis />
      <ChartsClipPath id={clipPathId} />
      <g clipPath={`url(#${clipPathId})`}>
        <HighLowPlot />
        <RangeBarPlot skipAnimation />
        <ChartsAxisHighlight x="band" />
      </g>
      <ChartsTooltipContainer>
        <TooltipContent />
      </ChartsTooltipContainer>
    </ChartContainerPremium>
  );
}

function HighLowPlot() {
  const chartDataset = useDataset();
  const xScale = useXScale('x');
  const yScale = useYScale('y');
  const drawingArea = useDrawingArea();
  const theme = useTheme();

  return (
    <g>
      {chartDataset.map((d, index) => {
        const x = xScale(d.date) + xScale.bandwidth() / 2;
        const high = yScale(d.high);
        const low = yScale(d.low);

        if (x < drawingArea.left || x > drawingArea.left + drawingArea.width) {
          return null;
        }

        return (
          <line
            key={index}
            x1={x}
            y1={high}
            x2={x}
            y2={low}
            stroke={theme.palette.mode === 'dark' ? 'white' : 'black'}
            strokeWidth={0.5}
          />
        );
      })}
    </g>
  );
}

const TooltipContainer = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

function TooltipContent() {
  const chartDataset = useDataset();
  const tooltipData = useAxesTooltip();
  const dataIndex = tooltipData?.[0]?.dataIndex;

  if (dataIndex === undefined) {
    return null;
  }

  const { date, open, close, high, low } = chartDataset[dataIndex];

  return (
    <TooltipContainer>
      <Typography fontWeight="bold">{tooltipDateFormatter.format(date)}</Typography>
      <Typography>Open: {tooltipDollarFormatter.format(open)}</Typography>
      <Typography>Close: {tooltipDollarFormatter.format(close)}</Typography>
      <Typography>Low: {tooltipDollarFormatter.format(low)}</Typography>
      <Typography>High: {tooltipDollarFormatter.format(high)}</Typography>
    </TooltipContainer>
  );
}
