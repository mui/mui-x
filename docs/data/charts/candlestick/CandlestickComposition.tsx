import * as React from 'react';
import Stack from '@mui/material/Stack';
import useId from '@mui/utils/useId';
import { ChartsClipPath } from '@mui/x-charts-premium/ChartsClipPath';
import { CandlestickPlot } from '@mui/x-charts-premium/CandlestickChart';
import { LinePlot } from '@mui/x-charts-premium/LineChart';
import { BarPlot } from '@mui/x-charts-premium/BarChart';
import { ChartsXAxis } from '@mui/x-charts-premium/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts-premium/ChartsYAxis';
import { SeriesItem, useAxesTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { ChartsLegend } from '@mui/x-charts-premium/ChartsLegend';
import { OHLCValueType } from '@mui/x-charts-premium/models';
import { ChartDataProviderPremium } from '@mui/x-charts-premium/ChartDataProviderPremium';
import { ChartsWrapper } from '@mui/x-charts-premium/ChartsWrapper';
import { ChartsAxisHighlight } from '@mui/x-charts-premium/ChartsAxisHighlight';
import { ChartsGrid } from '@mui/x-charts-premium/ChartsGrid';
import { useDrawingArea } from '@mui/x-charts-premium/hooks';
import { ChartsWebGlLayer } from '@mui/x-charts/ChartsWebGlLayer';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
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

const formatVolume = (value: number) =>
  value.toLocaleString('en-US', {
    maximumSignificantDigits: 3,
    notation: 'compact',
    compactDisplay: 'short',
  });

const formatTooltipDollarValue = (value: number) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

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
          id: 'ohlc',
          type: 'ohlc',
          data: ohlcData,
          label: 'S&P 500',
        },
        {
          id: 'moving-average',
          type: 'line',
          data: movingAverage,
          label: '20-day Moving Average',
          color: '#42a5f5',
        },
        {
          id: 'volume',
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
        {
          id: 'price',
          valueFormatter: formatAsDollar,
          width: 48,
          position: 'right',
        },
        {
          id: 'volume',
          // Ensures that volume bars only take up to 20% of the chart height
          domainLimit: (min, max) => ({ min: 0, max: max * 5 }),
        },
      ]}
      height={400}
    >
      <ChartsWrapper>
        <ChartsLayerContainer>
          <ChartsSvgLayer>
            <ChartsGrid horizontal vertical />
          </ChartsSvgLayer>
          <ChartsWebGlLayer>
            <CandlestickPlot />
          </ChartsWebGlLayer>
          <ChartsSvgLayer>
            <g clipPath={`url(#${clipPathId})`}>
              <BarPlot renderer="svg-batch" />
              <LinePlot />
              <ChartsAxisHighlight x="line" y="line" />
            </g>
            <ChartsClipPath id={clipPathId} />
            <ChartsXAxis />
            <ChartsYAxis axisId="price" />
            <ChartsYAxis axisId="volume" />
            <CandlestickTooltip />
            <ChartsLegend />
          </ChartsSvgLayer>
        </ChartsLayerContainer>
      </ChartsWrapper>
    </ChartDataProviderPremium>
  );
}

function CandlestickTooltip() {
  const drawingArea = useDrawingArea();
  const axesTooltipData = useAxesTooltip({ directions: ['x'] });

  const tooltipData = axesTooltipData?.[0];

  if (!tooltipData) {
    return null;
  }

  const ohlcItem = tooltipData.seriesItems.find(
    (item) => item.seriesId === 'ohlc',
  ) as SeriesItem<'ohlc'>;
  const movingAverageItem = tooltipData.seriesItems.find(
    (item) => item.seriesId === 'moving-average',
  ) as SeriesItem<'line'>;
  const volumeItem = tooltipData.seriesItems.find(
    (item) => item.seriesId === 'volume',
  ) as SeriesItem<'bar'>;

  return (
    <foreignObject
      x={drawingArea.left}
      y={drawingArea.top}
      width={drawingArea.width}
      height={drawingArea.height}
    >
      <Stack
        direction="column"
        gap={0.5}
        sx={(theme) => ({
          ...theme.typography.caption,
          pointerEvents: 'none',
          marginLeft: theme.spacing(1),
          marginTop: theme.spacing(1),
        })}
      >
        <Stack
          direction="row"
          gap={1}
          sx={(theme) => ({
            width: 'min-content',
            paddingX: theme.spacing(1),
            paddingY: theme.spacing(0.5),
            background: theme.palette.background.paper,
          })}
        >
          <span>O:{formatTooltipDollarValue(ohlcItem.value![0])}</span>
          <span>H:{formatTooltipDollarValue(ohlcItem.value![1])}</span>
          <span>L:{formatTooltipDollarValue(ohlcItem.value![2])}</span>
          <span>C:{formatTooltipDollarValue(ohlcItem.value![3])}</span>
          <span>V:{formatVolume(volumeItem.value!)}</span>
        </Stack>
        {movingAverageItem.value != null && (
          <Stack
            sx={(theme) => ({
              width: 'min-content',
              paddingX: theme.spacing(1),
              paddingY: theme.spacing(0.5),
              background: theme.palette.background.paper,
            })}
          >
            <span>MA:{formatTooltipDollarValue(movingAverageItem.value)}</span>
          </Stack>
        )}
      </Stack>
    </foreignObject>
  );
}
