import * as React from 'react';
import { type ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import {
  type D3ContinuousScale,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
  useStore,
} from '@mui/x-charts/internals';
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { useTheme } from '@mui/material/styles';
import { seriesPreviewPlotMap, type PreviewPlotProps } from '@mui/x-charts-pro/internals';
import { useOHLCSeriesContext } from '../../../hooks/useOHLCSeries';

seriesPreviewPlotMap.set('ohlc', CandlestickPreviewPlot);

export function CandlestickPreviewPlot(props: PreviewPlotProps) {
  const { axisId } = props;

  const store = useStore();
  const seriesData = useOHLCSeriesContext();
  const xAxes = store.use(selectorChartPreviewComputedXAxis, axisId);
  const yAxes = store.use(selectorChartPreviewComputedYAxis, axisId);
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];
  const theme = useTheme();

  if (seriesData === undefined) {
    return null;
  }

  const { series, seriesOrder } = seriesData;

  return (
    <React.Fragment>
      {seriesOrder.map((seriesId) => {
        const { xAxisId, yAxisId, data } = series[seriesId];

        const xAxis = xAxes[xAxisId ?? defaultXAxisId];
        const yAxis = yAxes[yAxisId ?? defaultYAxisId];

        if (xAxis?.id !== axisId && yAxis?.id !== axisId) {
          return null;
        }

        const xScale = xAxis.scale as ScaleBand<{ toString(): string }>;
        const yScale = yAxis.scale as D3ContinuousScale;
        const xDomain = xScale.domain();
        const candleWidth = xScale.bandwidth();
        const bullishColor = theme.palette.success.main;
        const bearishColor = theme.palette.error.main;
        const wickColor = theme.palette.text.primary;

        return (
          <g key={seriesId} data-series={seriesId}>
            {data?.map((datum, dataIndex) => {
              if (datum === null) {
                return null;
              }

              const scaledX = xScale(xDomain[dataIndex]);
              if (scaledX === undefined) {
                return null;
              }

              const [open, high, low, close] = datum;

              const cx = scaledX + candleWidth / 2;
              const scaledOpen = yScale(open);
              const scaledClose = yScale(close);
              const scaledHigh = yScale(high);
              const scaledLow = yScale(low);

              const candleTop = Math.min(scaledOpen, scaledClose);
              const candleBottom = Math.max(scaledOpen, scaledClose);
              const candleHeight = candleBottom - candleTop;
              const isBullish = close >= open;
              const color = isBullish ? bullishColor : bearishColor;

              // Ensure at least 1px candle body
              const renderedCandleHeight = Math.max(candleHeight, 1);

              return (
                <g key={dataIndex}>
                  {/* Wick */}
                  <line
                    x1={cx}
                    x2={cx}
                    y1={scaledHigh}
                    y2={scaledLow}
                    stroke={wickColor}
                    strokeWidth={1}
                  />
                  {/* Body */}
                  <rect
                    x={scaledX}
                    y={candleTop}
                    width={candleWidth}
                    height={renderedCandleHeight}
                    fill={color}
                  />
                </g>
              );
            })}
          </g>
        );
      })}
    </React.Fragment>
  );
}
