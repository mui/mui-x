import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  AxisId,
  selectorChartComputedXAxes,
  selectorChartComputedYAxes,
  useSelector,
  useStore,
  useAreaPlotData,
} from '@mui/x-charts/internals';
import { ChartDrawingArea } from '@mui/x-charts/hooks';
import { AreaElement } from '@mui/x-charts/LineChart';

const AreaPlotRoot = styled('g', {
  name: 'MuiAreaPlot',
  slot: 'Root',
})();

export function AreaPreviewPlot({
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

  const completedData = useAreaPreviewData(axisId, drawingArea);
  return (
    <AreaPlotRoot>
      {completedData.map(
        ({ d, seriesId, color, area, gradientId }) =>
          !!area && (
            <AreaElement
              key={seriesId}
              id={seriesId}
              d={d}
              color={color}
              gradientId={gradientId}
              skipAnimation
            />
          ),
      )}
    </AreaPlotRoot>
  );
}

function useAreaPreviewData(axisId: AxisId, drawingArea: ChartDrawingArea) {
  const store = useStore();

  let xAxes = useSelector(store, selectorChartComputedXAxes, {
    drawingArea,
    zoomMap: undefined,
  }).axis;
  let yAxes = useSelector(store, selectorChartComputedYAxes, {
    drawingArea,
    zoomMap: undefined,
  }).axis;

  /* We only want to show the data represented in this axis. */
  if (axisId in xAxes) {
    xAxes = { [axisId]: xAxes[axisId] };
  } else if (axisId in yAxes) {
    yAxes = { [axisId]: yAxes[axisId] };
  }

  return useAreaPlotData(xAxes, yAxes);
}
