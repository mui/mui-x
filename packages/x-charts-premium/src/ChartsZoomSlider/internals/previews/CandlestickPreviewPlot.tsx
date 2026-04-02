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
import { type PreviewPlotProps } from '@mui/x-charts-pro/internals';
import { useOHLCSeriesContext } from '../../../hooks/useOHLCSeries';

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
        const bandWidth = xScale.bandwidth();

        // Build a line path from the close prices
        let d = '';
        data?.forEach((datum, dataIndex) => {
          if (datum === null) {
            return;
          }

          const scaledX = xScale(xDomain[dataIndex]);
          if (scaledX === undefined) {
            return;
          }

          const close = datum[3];
          const cx = scaledX + bandWidth / 2;
          const cy = yScale(close);

          d += d === '' ? `M ${cx},${cy}` : ` L ${cx},${cy}`;
        });

        return (
          <path
            key={seriesId}
            data-series={seriesId}
            d={d}
            stroke={theme.palette.text.primary}
            strokeWidth={1}
            fill="none"
          />
        );
      })}
    </React.Fragment>
  );
}
