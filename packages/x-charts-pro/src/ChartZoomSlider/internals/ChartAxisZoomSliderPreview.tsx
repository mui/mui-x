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
import useId from '@mui/utils/useId';
import { selectorChartAxisZoomData } from '../../internals/plugins/useChartProZoom';

const PreviewBackgroundRect = styled('rect')(({ theme }) => ({
  rx: 4,
  ry: 4,
  stroke: theme.palette.grey[700],
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
      <PreviewRectangles {...props} axisId={axisId} />
      <rect {...props} fill="transparent" rx={4} ry={4} />
      <ScatterPreview {...props} />
    </g>
  );
}

function PreviewRectangles({
  axisId,
  x,
  y,
  height,
  width,
}: {
  axisId: AxisId;
  x: number;
  y: number;
  height: number;
  width: number;
}) {
  const store = useStore();
  const zoomData = useSelector(store, selectorChartAxisZoomData, axisId);
  const id = useId();

  if (!zoomData) {
    return null;
  }

  const maskId = `zoom-preview-mask-${axisId}-${id}`;

  return (
    <React.Fragment>
      <mask id={maskId}>
        <rect x={x} y={y} width={width} height={height} fill="white" />
        <rect
          x={x + (zoomData.start / 100) * width}
          y={y}
          width={((zoomData.end - zoomData.start) / 100) * width}
          height={height}
          fill="black"
          rx={4}
          ry={4}
        />
      </mask>
      <PreviewBackgroundRect x={x} y={y} width={width} height={height} mask={`url(#${maskId})`} />
    </React.Fragment>
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
