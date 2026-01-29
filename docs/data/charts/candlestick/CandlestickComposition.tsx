import * as React from 'react';
import useId from '@mui/utils/useId';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { CandlestickPlot } from '@mui/x-charts-premium/CandlestickChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { OHLCValueType } from '@mui/x-charts-premium/models';
import { ChartsSurface } from '@mui/x-charts-premium/ChartsSurface';
import { ChartDataProviderPremium } from '@mui/x-charts-premium/ChartDataProviderPremium';
import { ChartsWrapper } from '@mui/x-charts-premium/ChartsWrapper';
import sp500ohlcv from '../dataset/sp500-2025-ohlcv.json'; // Source: Yahoo Finance

const xData = sp500ohlcv.map((entry) => new Date(Date.parse(entry.date)));

const ohlcData: Array<OHLCValueType> = sp500ohlcv.map((entry) => [
  entry.open,
  entry.high,
  entry.low,
  entry.close,
]);

// Calculate 20-day moving average from closing prices
const movingAverage: number[] = [];
const windowSize = 20;
for (let i = 0; i < sp500ohlcv.length; i += 1) {
  if (i < windowSize - 1) {
    movingAverage.push(null as any);
  } else {
    const sum = sp500ohlcv
      .slice(i - windowSize + 1, i + 1)
      .reduce((acc, entry) => acc + entry.close, 0);
    movingAverage.push(sum / windowSize);
  }
}

export default function CandlestickComposition() {
  const id = useId();
  const clipPathId = `${id}-clip-path`;

  return (
    <ChartDataProviderPremium
      series={[
        {
          type: 'ohlc',
          data: ohlcData,
          label: 'S&P 500',
        },
        {
          type: 'line',
          data: movingAverage,
          label: '20-day MA',
          color: '#42a5f5',
        },
      ]}
      xAxis={[
        {
          data: xData,
          scaleType: 'band',
          ordinalTimeTicks: [
            'years',
            'quarterly',
            'months',
            'biweekly',
            'weeks',
            'days',
          ],
          valueFormatter: (value: Date) =>
            value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          zoom: { filterMode: 'discard' },
        },
      ]}
      height={400}
      margin={{ top: 10, right: 10, bottom: 30, left: 60 }}
    >
      <ChartsWrapper>
        <ChartsSurface>
          <CandlestickPlot />
          <g clipPath={`url(#${clipPathId})`}>
            <LinePlot />
          </g>
          <ChartsClipPath id={clipPathId} />
          <ChartsXAxis />
          <ChartsYAxis />
          <ChartsTooltip />
          <ChartsLegend />
        </ChartsSurface>
      </ChartsWrapper>
    </ChartDataProviderPremium>
  );
}
