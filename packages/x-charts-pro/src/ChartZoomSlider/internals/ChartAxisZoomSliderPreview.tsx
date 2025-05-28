import * as React from 'react';
import {
  AxisId,
  selectorChartRawAxis,
  selectorChartXAxis,
  selectorChartYAxis,
  useChartContext,
  useSelector,
  useStore,
} from '@mui/x-charts/internals';
import {
  ChartDrawingArea,
  getValueToPositionMapper,
  ScatterMarker,
  useScatterSeriesContext,
  useXAxes,
  useYAxes,
  useZAxes,
} from '@mui/x-charts';
import getColor from '@mui/x-charts/ScatterChart/seriesConfig/getColor';

interface ChartAxisZoomSliderPreviewProps {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
  reverse: boolean;
  x: number;
  y: number;
  height: number;
  width: number;
}

export function ChartAxisZoomSliderPreview({
  axisId,
  axisDirection,
  reverse,
  ...props
}: ChartAxisZoomSliderPreviewProps) {
  return (
    <g {...props}>
      <ScatterPreview {...props} />
    </g>
  );
}

function ScatterPreview({
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
  const { axis: xAxis, axisIds: xAxisIds } = useSelector(store, selectorChartXAxis, drawingArea);
  const { axis: yAxis, axisIds: yAxisIds } = useSelector(store, selectorChartYAxis, drawingArea);
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

        const colorGetter = getColor(
          allSeries[seriesId],
          xAxis[xAxisId ?? defaultXAxisId],
          yAxis[yAxisId ?? defaultYAxisId],
          zAxis[zAxisId ?? defaultZAxisId],
        );

        const xScale = xAxis[xAxisId ?? defaultXAxisId].scale;
        const yScale = yAxis[yAxisId ?? defaultYAxisId].scale;
        console.log({ xScale, yScale });
        const getXPosition = getValueToPositionMapper(xScale);
        const getYPosition = getValueToPositionMapper(yScale);

        const temp: React.ReactNode[] = [];

        for (let i = 0; i < series.data.length; i += 1) {
          const scatterPoint = series.data[i];

          const x = getXPosition(scatterPoint.x);
          const y = getYPosition(scatterPoint.y);

          temp.push(
            <ScatterMarker
              key={scatterPoint.id}
              dataIndex={i}
              color={colorGetter ? colorGetter(i) : color}
              x={x}
              y={y}
              seriesId={series.id}
              size={series.markerSize}
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
