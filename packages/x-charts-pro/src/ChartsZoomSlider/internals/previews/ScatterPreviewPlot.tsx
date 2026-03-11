import * as React from 'react';
import {
  useStore,
  type D3Scale,
  type ColorGetter,
  useScatterPlotData,
  scatterSeriesConfig,
  selectorChartPreviewComputedXAxis,
  selectorChartPreviewComputedYAxis,
} from '@mui/x-charts/internals';
import { useScatterSeriesContext, useXAxes, useYAxes, useZAxes } from '@mui/x-charts/hooks';
import { ScatterMarker } from '@mui/x-charts/ScatterChart';
import { type DefaultizedScatterSeriesType } from '@mui/x-charts/models';
import { type PreviewPlotProps } from './PreviewPlot.types';

interface ScatterPreviewPlotProps extends PreviewPlotProps {
  x: number;
  y: number;
  height: number;
  width: number;
}

export function ScatterPreviewPlot({ axisId, x, y, height, width }: ScatterPreviewPlotProps) {
  const store = useStore();
  const seriesData = useScatterSeriesContext();
  const xAxes = store.use(selectorChartPreviewComputedXAxis, axisId);
  const yAxes = store.use(selectorChartPreviewComputedYAxis, axisId);
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];
  const { zAxis: zAxes, zAxisIds } = useZAxes();
  const defaultZAxisId = zAxisIds[0];

  if (seriesData === undefined) {
    return null;
  }

  const { series, seriesOrder } = seriesData;

  return (
    <React.Fragment>
      {seriesOrder.map((seriesId) => {
        const { id, xAxisId, yAxisId, zAxisId, color } = series[seriesId];

        const xAxis = xAxes[xAxisId ?? defaultXAxisId];
        const yAxis = yAxes[yAxisId ?? defaultYAxisId];

        // This series is not attached to the current axis, skip it.
        if (xAxis?.id !== axisId && yAxis?.id !== axisId) {
          return null;
        }

        const colorGetter = scatterSeriesConfig.colorProcessor(
          series[seriesId],
          xAxis,
          yAxis,
          zAxes[zAxisId ?? defaultZAxisId],
        );
        const xScale = xAxis.scale;
        const yScale = yAxis.scale;

        return (
          <ScatterPreviewItems
            key={id}
            xScale={xScale}
            yScale={yScale}
            color={color}
            colorGetter={colorGetter}
            series={series[seriesId]}
            x={x}
            y={y}
            height={height}
            width={width}
          />
        );
      })}
    </React.Fragment>
  );
}

interface ScatterPreviewItemsProps {
  series: DefaultizedScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  color: string;
  colorGetter?: ColorGetter<'scatter'>;
  x: number;
  y: number;
  height: number;
  width: number;
}

function ScatterPreviewItems(props: ScatterPreviewItemsProps) {
  const { series, xScale, yScale, color, colorGetter, x, y, width, height } = props;

  const isPointInside = React.useCallback(
    (px: number, py: number) => px >= x && px <= x + width && py >= y && py <= y + height,
    [height, width, x, y],
  );

  const scatterPlotData = useScatterPlotData(series, xScale, yScale, isPointInside);

  return (
    <g data-series={series.id}>
      {scatterPlotData.map((dataPoint, i) => {
        return (
          <ScatterMarker
            key={dataPoint.id ?? dataPoint.dataIndex}
            dataIndex={dataPoint.dataIndex}
            color={colorGetter ? colorGetter(i) : color}
            x={dataPoint.x}
            y={dataPoint.y}
            seriesId={series.id}
            size={series.preview.markerSize}
            isHighlighted={false}
            isFaded={false}
          />
        );
      })}
    </g>
  );
}
