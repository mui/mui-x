import * as React from 'react';
import {
  selectorChartComputedXAxes,
  selectorChartComputedYAxes,
  useSelector,
  useStore,
} from '@mui/x-charts/internals';
import {
  ChartDrawingArea,
  getValueToPositionMapper,
  useScatterSeriesContext,
  useZAxes,
} from '@mui/x-charts/hooks';
import { ScatterMarker } from '@mui/x-charts/ScatterChart';
import { seriesConfig } from '@mui/x-charts/ScatterChart/seriesConfig';

export function ScatterPreview({
  x,
  y,
  height,
  width,
}: {
  x: number;
  y: number;
  height: number;
  width: number;
}) {
  const seriesData = useScatterSeriesContext();
  const store = useStore();
  const drawingArea: ChartDrawingArea = {
    left: x,
    top: y,
    width,
    height,
    right: x + width,
    bottom: y + height,
  };
  const { axis: xAxis, axisIds: xAxisIds } = useSelector(store, selectorChartComputedXAxes, {
    drawingArea,
    zoomMap: undefined,
  });
  const { axis: yAxis, axisIds: yAxisIds } = useSelector(store, selectorChartComputedYAxes, {
    drawingArea,
    zoomMap: undefined,
  });
  const { zAxis, zAxisIds } = useZAxes();

  if (seriesData === undefined) {
    return null;
  }

  const { series: allSeries, seriesOrder } = seriesData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  const defaultZAxisId = zAxisIds[0];

  return (
    <React.Fragment>
      {seriesOrder.map((seriesId) => {
        const series = allSeries[seriesId];
        const { xAxisId, yAxisId, zAxisId, color } = series;

        const colorGetter = seriesConfig.colorProcessor(
          allSeries[seriesId],
          xAxis[xAxisId ?? defaultXAxisId],
          yAxis[yAxisId ?? defaultYAxisId],
          zAxis[zAxisId ?? defaultZAxisId],
        );

        const xScale = xAxis[xAxisId ?? defaultXAxisId].scale;
        const yScale = yAxis[yAxisId ?? defaultYAxisId].scale;
        const getXPosition = getValueToPositionMapper(xScale);
        const getYPosition = getValueToPositionMapper(yScale);

        const temp: React.ReactNode[] = [];

        for (let i = 0; i < series.data.length; i += 1) {
          const scatterPoint = series.data[i];

          temp.push(
            <ScatterMarker
              key={scatterPoint.id ?? i}
              dataIndex={i}
              color={colorGetter ? colorGetter(i) : color}
              x={getXPosition(scatterPoint.x)}
              y={getYPosition(scatterPoint.y)}
              seriesId={series.id}
              size={1}
              isHighlighted={false}
              isFaded={false}
            />,
          );
        }

        return temp;
      })}
    </React.Fragment>
  );
}
