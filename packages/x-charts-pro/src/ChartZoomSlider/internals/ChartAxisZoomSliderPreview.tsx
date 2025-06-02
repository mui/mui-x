import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  AxisId,
  selectorChartComputedXAxes,
  selectorChartComputedYAxes,
  useSelector,
  useStore,
} from '@mui/x-charts/internals';
import { alpha } from '@mui/system';
import {
  ChartDrawingArea,
  getValueToPositionMapper,
  useScatterSeriesContext,
  useZAxes,
} from '@mui/x-charts/hooks';
import { ScatterMarker } from '@mui/x-charts/ScatterChart';
import { seriesConfig } from '@mui/x-charts/ScatterChart/seriesConfig';

const PreviewBackgroundRect = styled('rect')(({ theme }) => ({
  rx: 4,
  ry: 4,
  stroke: theme.palette.grey[700],
  // TODO: Use masks to make it look like the designs: https://stackoverflow.com/questions/22579508/subtract-one-circle-from-another-in-svg
  fill: alpha(theme.palette.grey[700], 0.4),
}));

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
      <PreviewBackgroundRect {...props} />
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
              key={scatterPoint.id}
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
