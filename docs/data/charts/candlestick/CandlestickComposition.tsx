import * as React from 'react';
import useId from '@mui/utils/useId';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { CandlestickPlot } from '@mui/x-charts-premium/CandlestickChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { OHLCValueType } from '@mui/x-charts-premium/models';
import { ChartsSurface } from '@mui/x-charts-premium/ChartsSurface';
import { ChartDataProviderPremium } from '@mui/x-charts-premium/ChartDataProviderPremium';
import { ChartsWrapper } from '@mui/x-charts-premium/ChartsWrapper';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import sp500ohlcv from '../dataset/sp500-2025-ohlcv.json'; // Source: Yahoo Finance

const xData = sp500ohlcv.map((entry) => new Date(Date.parse(entry.date)));

const ohlcData: Array<OHLCValueType> = sp500ohlcv.map((entry) => [
  entry.open,
  entry.high,
  entry.low,
  entry.close,
]);

// Extract volume data
const volumeData = sp500ohlcv.map((entry) => entry.volume);

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

const formatAsDollar = (value: number) =>
  value.toLocaleString('en-US', {
    currency: 'USD',
    style: 'currency',
    maximumFractionDigits: 0,
  });

const volumeBarColorGetter = ({ dataIndex }: { dataIndex: number }) => {
  if (dataIndex === 0) {
    return 'green';
  }

  // Color the volume bar green if the closing price is higher than or equal to the previous day's close,
  // red otherwise. This is how Yahoo Finance colors their volume bars.
  return sp500ohlcv[dataIndex].close >= sp500ohlcv[dataIndex - 1].close
    ? 'green'
    : 'red';
};

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
          label: '20-day Moving Average',
          color: '#42a5f5',
        },
        {
          type: 'bar',
          data: volumeData,
          label: 'Volume',
          colorGetter: volumeBarColorGetter,
          yAxisId: 'volume',
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
      yAxis={[
        { id: 'price', valueFormatter: formatAsDollar, width: 48 },
        {
          id: 'volume',
          // Ensures that volume bars only take up to 20% of the chart height
          domainLimit: (min, max) => ({ min: 0, max: max * 5 }),
        },
      ]}
      height={400}
    >
      <ChartsWrapper>
        <ChartsSurface>
          <CandlestickPlot />
          <g clipPath={`url(#${clipPathId})`}>
            <LinePlot />
            <BarPlot renderer="svg-batch" />
            <ChartsAxisHighlight x="line" y="line" />
          </g>
          <ChartsClipPath id={clipPathId} />
          <ChartsXAxis />
          <ChartsYAxis axisId="price" />
          <ChartsYAxis axisId="volume" />
          <ChartsTooltip />
          <ChartsLegend />
        </ChartsSurface>
      </ChartsWrapper>
    </ChartDataProviderPremium>
  );
}
