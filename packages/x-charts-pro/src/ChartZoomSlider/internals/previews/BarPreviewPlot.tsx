import * as React from 'react';
import {
  AxisId,
  selectorChartComputedXAxes,
  selectorChartComputedYAxes,
  useBarPlotData,
  useSelector,
  useStore,
  ZoomMap,
} from '@mui/x-charts/internals';
import { ChartDrawingArea } from '@mui/x-charts/hooks';
import { BarElement } from '@mui/x-charts/BarChart';

interface BarPreviewPlotProps {
  axisId: AxisId;
  x: number;
  y: number;
  height: number;
  width: number;
  zoomMap: ZoomMap;
}

export function BarPreviewPlot(props: BarPreviewPlotProps) {
  const drawingArea: ChartDrawingArea = {
    left: props.x,
    top: props.y,
    width: props.width,
    height: props.height,
    right: props.x + props.width,
    bottom: props.y + props.height,
  };

  const { completedData } = useBarPreviewData(props.axisId, drawingArea, props.zoomMap);

  return (
    <g>
      {completedData.map(({ seriesId, data }) => (
        <g key={seriesId}>
          {data.map(({ dataIndex, color, layout, x, xOrigin, y, yOrigin, width, height }) => {
            return (
              <BarElement
                key={dataIndex}
                id={seriesId}
                dataIndex={dataIndex}
                color={color}
                skipAnimation
                layout={layout ?? 'vertical'}
                x={x}
                xOrigin={xOrigin}
                y={y}
                yOrigin={yOrigin}
                width={width}
                height={height}
              />
            );
          })}
        </g>
      ))}
    </g>
  );
}

function useBarPreviewData(axisId: AxisId, drawingArea: ChartDrawingArea, zoomMap: ZoomMap) {
  const store = useStore();

  let xAxes = useSelector(store, selectorChartComputedXAxes, [{ drawingArea, zoomMap }]).axis;
  let yAxes = useSelector(store, selectorChartComputedYAxes, [{ drawingArea, zoomMap }]).axis;

  /* We only want to show the data represented in this axis. */
  if (axisId in xAxes) {
    xAxes = { [axisId]: xAxes[axisId] };
  } else if (axisId in yAxes) {
    yAxes = { [axisId]: yAxes[axisId] };
  }

  return useBarPlotData(drawingArea, xAxes, yAxes);
}
