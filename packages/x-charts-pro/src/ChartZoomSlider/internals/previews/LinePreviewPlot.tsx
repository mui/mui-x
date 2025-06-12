import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  AxisId,
  selectorChartComputedXAxes,
  selectorChartComputedYAxes,
  useSelector,
  useStore,
  useLinePlotData,
} from '@mui/x-charts/internals';
import { ChartDrawingArea } from '@mui/x-charts/hooks';
import { LineElement } from '@mui/x-charts/LineChart';

const LinePlotRoot = styled('g', {
  name: 'MuiAreaPlot',
  slot: 'Root',
})();

export function LinePreviewPlot({
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
  const drawingArea: ChartDrawingArea = {
    left: x,
    top: y,
    width,
    height,
    right: x + width,
    bottom: y + height,
  };

  const completedData = useLinePreviewData(axisId, drawingArea);
  return (
    <LinePlotRoot>
      {completedData.map(({ d, seriesId, color, gradientId }) => {
        return (
          <LineElement
            key={seriesId}
            id={seriesId}
            d={d}
            color={color}
            gradientId={gradientId}
            skipAnimation
          />
        );
      })}
    </LinePlotRoot>
  );
}

function useLinePreviewData(axisId: AxisId, drawingArea: ChartDrawingArea) {
  const store = useStore();

  let xAxis = useSelector(store, selectorChartComputedXAxes, {
    drawingArea,
    zoomMap: undefined,
  }).axis;
  let yAxis = useSelector(store, selectorChartComputedYAxes, {
    drawingArea,
    zoomMap: undefined,
  }).axis;

  /* We only want to show the data represented in this axis. */
  if (axisId in xAxis) {
    xAxis = { [axisId]: xAxis[axisId] };
  } else if (axisId in yAxis) {
    yAxis = { [axisId]: yAxis[axisId] };
  }

  return useLinePlotData(xAxis, yAxis);
}
