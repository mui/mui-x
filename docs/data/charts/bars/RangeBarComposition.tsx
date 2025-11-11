import { BarRangePlot, BarRangeSeries } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartContainerPro } from '@mui/x-charts-pro/ChartContainerPro';
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
import { XAxis, YAxis } from '@mui/x-charts/models';
import { niceDomain } from '@mui/x-charts/utils';
import originalDataset from '../dataset/sp500-intraday.json'; // Source: Yahoo Finance

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

const min = originalDataset.reduce((acc, cur) => Math.min(acc, cur.low), Infinity);
const max = originalDataset.reduce((acc, cur) => Math.max(acc, cur.high), -Infinity);

const xAxis = [
  {
    id: 'x',
    scaleType: 'band',
    dataKey: 'date',
    zoom: { minSpan: 1, filterMode: 'discard' },
    valueFormatter: (date, context) => {
      const formatter =
        context.location === 'tick' ? tickLabelDateFormatter : tooltipDateFormatter;

      return formatter.format(Date.parse(date));
    },
  },
] satisfies XAxis[];
const yAxis = [
  {
    id: 'y',
    scaleType: 'linear',
    domainLimit: () => {
      const domain = niceDomain('linear', [min, max]);

      return { min: domain[0].valueOf(), max: domain[1].valueOf() };
    },
    valueFormatter: (value) => tickLabelDollarFormatter.format(value),
  },
] satisfies YAxis[];
const series = [
  {
    type: 'barRange',
    datasetKeys: { start: 'open', end: 'close' },
    xAxisId: 'x',
    yAxisId: 'y',
    colorGetter: (data) => {
      const value = originalDataset[data.dataIndex];

      return value.close > value.open ? 'green' : 'red';
    },
  },
] satisfies BarRangeSeries[];

export default function RangeBarComposition() {
  const clipPathId = React.useId();

  return (
    <ChartContainerPro
      dataset={originalDataset}
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
        <BarRangePlot skipAnimation />
        <ChartsAxisHighlight x="band" />
      </g>
      <ChartsTooltipContainer>
        <TooltipContent />
      </ChartsTooltipContainer>
    </ChartContainerPro>
  );
}

function HighLowPlot() {
  const dataset = useDataset<typeof originalDataset>()!;
  const xScale = useXScale<'band'>('x');
  const yScale = useYScale<'linear'>('y');
  const drawingArea = useDrawingArea();
  const theme = useTheme();

  return (
    <g>
      {dataset.map((d, index) => {
        const x = xScale(d.date)! + xScale.bandwidth() / 2;
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
            strokeWidth={1}
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
  const dataset = useDataset<typeof originalDataset>();
  const tooltipData = useAxesTooltip();
  const dataIndex = tooltipData?.[0]?.dataIndex;

  if (dataIndex === undefined) {
    return null;
  }

  const { date, open, close, high, low } = dataset![dataIndex];

  return (
    <TooltipContainer>
      <div>{tooltipDateFormatter.format(Date.parse(date))}</div>
      <div>Open: {tooltipDollarFormatter.format(open)}</div>
      <div>Close: {tooltipDollarFormatter.format(close)}</div>
      <div>Low: {tooltipDollarFormatter.format(low)}</div>
      <div>High: {tooltipDollarFormatter.format(high)}</div>
    </TooltipContainer>
  );
}
